import { NextResponse } from "next/server";
import crypto from "crypto";
import tls from "tls";
import Razorpay from "razorpay";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeaderText(value, maxLen = 160) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/**
 * Pure Node.js SMTP Delivery over verified TLS (no insecure TLS bypass)
 */
function sendSmtpEmailNode({ host, port, user, pass, to, subject, htmlBody }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      },
      () => {
        let step = 0;
        let buffer = "";
        let settled = false;

        const finish = (err, result) => {
          if (settled) return;
          settled = true;
          if (err) reject(err);
          else resolve(result);
        };

        socket.setEncoding("utf8");

        const send = (cmd) => {
          socket.write(cmd + "\r\n");
        };

        socket.on("data", (chunk) => {
          buffer += chunk;
          const lines = buffer.split("\r\n");
          buffer = lines.pop();

          for (const line of lines) {
            if (!line) continue;
            const code = parseInt(line.substring(0, 3), 10);
            if (line.charAt(3) === "-") continue;

            if (step === 0 && code === 220) {
              step++;
              send("EHLO localhost");
            } else if (step === 1 && code === 250) {
              step++;
              send("AUTH LOGIN");
            } else if (step === 2 && code === 334) {
              step++;
              send(Buffer.from(user).toString("base64"));
            } else if (step === 3 && code === 334) {
              step++;
              send(Buffer.from(pass).toString("base64"));
            } else if (step === 4 && code === 235) {
              step++;
              send(`MAIL FROM:<${user}>`);
            } else if (step === 5 && code === 250) {
              step++;
              send(`RCPT TO:<${to}>`);
            } else if (step === 6 && code === 250) {
              step++;
              send("DATA");
            } else if (step === 7 && code === 354) {
              step++;
              const safeSubject = sanitizeHeaderText(subject, 160);
              const utf8Subject = `=?UTF-8?B?${Buffer.from(safeSubject).toString("base64")}?=`;
              const mime = [
                `From: Mahalakshmi Spice Heritage <${user}>`,
                `To: <${to}>`,
                `Subject: ${utf8Subject}`,
                "MIME-Version: 1.0",
                "Content-Type: text/html; charset=UTF-8",
                "Content-Transfer-Encoding: base64",
                "",
                Buffer.from(htmlBody).toString("base64"),
                ".",
              ].join("\r\n");
              send(mime);
            } else if (step === 8 && code === 250) {
              step++;
              send("QUIT");
              socket.end();
              finish(null, { success: true, method: "smtp-tls" });
            } else if (code >= 400) {
              socket.end();
              finish(new Error(`SMTP Error [${code}]: ${line}`));
            }
          }
        });

        socket.on("error", (err) => {
          finish(err);
        });

        socket.setTimeout(15000, () => {
          socket.destroy();
          finish(new Error("SMTP Connection timed out after 15 seconds"));
        });
      }
    );

    socket.on("error", (err) => {
      reject(err);
    });
  });
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Unsupported Media Type. Expected application/json." },
        { status: 415, headers: NO_STORE_HEADERS }
      );
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const orderId = typeof data?.orderId === "string" ? data.orderId.trim() : "";
    const paymentId = typeof data?.paymentId === "string" ? data.paymentId.trim() : "";
    const signature = typeof data?.signature === "string" ? data.signature.trim() : "";

    // Require all Razorpay verification parameters — never skip verification
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Incomplete payment verification payload. Missing orderId, paymentId, or signature.",
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const key_id = (
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      ""
    ).trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    if (!key_id || !key_secret) {
      console.error("[Razorpay Error]: Missing server RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.");
      return NextResponse.json(
        { success: false, error: "Payment verification gateway is not configured on the server." },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    // 1. Constant-time cryptographic HMAC-SHA256 verification
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const expectedBuf = Buffer.from(expectedSignature, "utf8");
    const receivedBuf = Buffer.from(signature, "utf8");
    const isSignatureValid =
      expectedBuf.length === receivedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, receivedBuf);

    if (!isSignatureValid) {
      console.warn("[Razorpay Security Warning]: Payment signature mismatch.");
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed. Invalid transaction." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Authoritative server-to-server Razorpay payment verification
    const razorpay = new Razorpay({ key_id, key_secret });
    const [payment, order] = await Promise.all([
      razorpay.payments.fetch(paymentId),
      razorpay.orders.fetch(orderId),
    ]);

    const configuredAmount = parseFloat(process.env.RESERVATION_AMOUNT_INR || "100");
    const expectedMinRupees = Number.isFinite(configuredAmount) && configuredAmount >= 1 ? configuredAmount : 100;
    const expectedMinPaise = Math.round(expectedMinRupees * 100);

    if (
      !payment ||
      payment.order_id !== orderId ||
      payment.currency !== "INR" ||
      Number(payment.amount) < expectedMinPaise ||
      !["captured", "authorized"].includes(payment.status)
    ) {
      console.warn("[Razorpay Security Warning]: Payment state/amount check failed.", {
        paymentId,
        orderId,
        status: payment?.status,
        amount: payment?.amount,
      });
      return NextResponse.json(
        { success: false, error: "Payment could not be verified with Razorpay." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Derive verified ref and amount strictly from Razorpay records
    const safeRef = sanitizeHeaderText(
      order?.receipt || data?.bookingRef || `MSH-${Math.floor(100000 + Math.random() * 900000)}`,
      40
    );
    const verifiedAmount = (Number(payment.amount) / 100).toFixed(2);

    // Sanitize and HTML-escape guest fields to prevent email HTML injection
    const safeName = escapeHtml(sanitizeHeaderText(data?.name || "Valued Guest", 100));
    const safePhone = escapeHtml(sanitizeHeaderText(data?.phone || "Not provided", 30));
    const safeEmail = escapeHtml(sanitizeHeaderText(data?.email || "Not provided", 100));
    const safeDate = escapeHtml(sanitizeHeaderText(data?.date || "Today", 20));
    const safeTime = escapeHtml(sanitizeHeaderText(data?.time || "7:30 PM", 20));
    const safeSeats = escapeHtml(sanitizeHeaderText(data?.seats || "Family Table", 50));
    const safeSeating = escapeHtml(sanitizeHeaderText(data?.seating || "Executive Family AC Hall", 50));
    const safeNotes = escapeHtml(String(data?.notes || "None").trim().slice(0, 500));
    const safePaymentId = escapeHtml(paymentId);
    const safeOrderId = escapeHtml(orderId);
    const safeRefHtml = escapeHtml(safeRef);
    const phoneHref = encodeURIComponent(String(data?.phone || "").trim().slice(0, 30));
    const emailHref = encodeURIComponent(String(data?.email || "").trim().slice(0, 100));

    // 3. Dispatch confirmation email via Node.js TLS SMTP
    const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10) || 465;
    const smtpUser = (process.env.SMTP_USER || "").trim();
    const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
    const recipientEmail = (process.env.RECIPIENT_EMAIL || smtpUser).trim();

    let emailSent = false;

    if (smtpUser && smtpPass && recipientEmail) {
      const emailSubject = `Payment Confirmed (₹${verifiedAmount}): Table Reservation Ref #${safeRef}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0c0d; color: #f4ede4; padding: 25px; border-radius: 12px; border: 1px solid #cba158;">
          <h2 style="color: #cba158; border-bottom: 1px solid #cba158; padding-bottom: 10px; margin-top: 0;">
            Mahalakshmi Spice Heritage &mdash; Advance Payment Confirmed
          </h2>
          <p style="font-size: 15px; color: #4ade80;">
            <strong>&#10003; Online Payment Verified via Razorpay</strong>
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px; color: #f4ede4;">
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Booking Ref:</td><td style="padding: 8px 0; font-weight: bold; color: #cba158;">#${safeRefHtml}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Payment ID:</td><td style="padding: 8px 0; font-family: monospace;">${safePaymentId}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Order ID:</td><td style="padding: 8px 0; font-family: monospace;">${safeOrderId}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Amount Paid:</td><td style="padding: 8px 0; font-weight: bold; color: #cba158;">&#8377;${verifiedAmount}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Guest Name:</td><td style="padding: 8px 0;">${safeName}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Phone:</td><td style="padding: 8px 0;"><a href="tel:${phoneHref}" style="color: #cba158; text-decoration: none;">${safePhone}</a></td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${emailHref}" style="color: #cba158; text-decoration: none;">${safeEmail}</a></td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Date:</td><td style="padding: 8px 0;">${safeDate}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Time Slot:</td><td style="padding: 8px 0;">${safeTime}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Seats / Party:</td><td style="padding: 8px 0;">${safeSeats}</td></tr>
            <tr style="border-bottom: 1px solid #2b2b2e;"><td style="padding: 8px 0; color: #a1a1aa;">Seating Area:</td><td style="padding: 8px 0;">${safeSeating}</td></tr>
            <tr><td style="padding: 8px 0; color: #a1a1aa;">Special Notes:</td><td style="padding: 8px 0;">${safeNotes}</td></tr>
          </table>
          <p style="margin-top: 20px; font-size: 13px; color: #a1a1aa;">
            This advance payment guarantees your reservation. Tables are reserved 15 minutes prior to guest arrival.
          </p>
        </div>
      `;

      try {
        await sendSmtpEmailNode({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          to: recipientEmail,
          subject: emailSubject,
          htmlBody: emailBody,
        });
        emailSent = true;
      } catch (mailErr) {
        console.error("[Node SMTP Error]:", mailErr?.message || mailErr);
      }
    } else {
      console.warn("[SMTP Configuration Warning]: SMTP_USER or SMTP_PASS is missing; skipping email notification.");
    }

    return NextResponse.json(
      {
        success: true,
        bookingRef: safeRef,
        paymentId,
        orderId,
        amountPaid: verifiedAmount,
        emailSent,
        message: "Payment verified successfully. Table reservation confirmed!",
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err) {
    console.error("[Razorpay Verification Error]:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Payment verification failed." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed. Please use POST to verify payment." },
    { status: 405, headers: { Allow: "POST", ...NO_STORE_HEADERS } }
  );
}
