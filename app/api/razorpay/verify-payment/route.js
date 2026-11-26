import { NextResponse } from "next/server";
import crypto from "crypto";
import { execFile } from "child_process";
import path from "path";

function sendWithPhp(phpScriptPath, payloadJson) {
  return new Promise((resolve, reject) => {
    execFile(
      "php",
      [phpScriptPath, payloadJson],
      { timeout: 15000 },
      (error, stdout, stderr) => {
        if (error) return reject(error);
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(parsed);
        } catch (err) {
          if (stdout && stdout.includes('"success":true')) {
            resolve({ success: true, method: "php-stdout" });
          } else {
            reject(new Error(`PHP Output Error: ${stdout || stderr}`));
          }
        }
      }
    );
  });
}

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Unsupported Media Type. Expected application/json." },
        { status: 415 }
      );
    }

    const data = await request.json();
    const {
      orderId,
      paymentId,
      signature,
      bookingRef,
      name,
      phone,
      email,
      date,
      time,
      seats,
      seating,
      notes,
      amountPaid,
    } = data;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { success: false, error: "Incomplete payment data. Missing orderId, paymentId, or signature." },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error("[Razorpay Error]: Missing RAZORPAY_KEY_SECRET in environment.");
      return NextResponse.json(
        { success: false, error: "Payment verification configuration error." },
        { status: 500 }
      );
    }

    // Cryptographic HMAC-SHA256 verification
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error(`[Razorpay Signature Mismatch]: Expected ${expectedSignature}, received ${signature}`);
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed. Invalid transaction." },
        { status: 400 }
      );
    }

    // Payment is verified! Dispatch confirmation email via PHP SMTP mailer
    const payloadJson = JSON.stringify({
      name: name || "Valued Guest",
      phone: phone || "",
      email: email || "Not Provided",
      date: date || "",
      time: time || "",
      seats: seats || "2 Seats",
      seating: seating || "Executive Family AC Hall",
      notes: notes || "None",
      bookingRef: bookingRef || `MSH-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentId,
      orderId,
      amountPaid: amountPaid || "100.00",
    });

    const phpScriptPath = path.join(process.cwd(), "send-mail.php");
    try {
      await sendWithPhp(phpScriptPath, payloadJson);
      console.log(`[Razorpay Success]: Email dispatched for verified payment ${paymentId} (Ref: ${bookingRef})`);
    } catch (mailErr) {
      console.warn("[Payment Verification Mail Warning]:", mailErr.message);
    }

    return NextResponse.json({
      success: true,
      bookingRef,
      paymentId,
      orderId,
      amountPaid: amountPaid || "100.00",
      message: "Payment verified successfully. Table reservation confirmed!",
    });
  } catch (err) {
    console.error("[Razorpay Verification Error]:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed. Please use POST to verify payment." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
