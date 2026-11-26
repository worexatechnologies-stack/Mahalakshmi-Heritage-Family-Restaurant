import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import tls from "tls";

/**
 * Execute PHP script via CLI
 */
function sendWithPhp(phpScriptPath, payloadJson) {
  return new Promise((resolve, reject) => {
    // Pass payload as argument and stdin
    execFile(
      "php",
      [phpScriptPath, payloadJson],
      { timeout: 15000 },
      (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }
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

/**
 * Pure Node.js SMTP Delivery over TLS (Zero external packages required)
 * Connects directly to smtp.gmail.com:465 with 16-digit App Password
 */
function sendSmtpEmailNode({ user, pass, to, subject, htmlBody }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: "smtp.gmail.com",
        port: 465,
        servername: "smtp.gmail.com",
        minVersion: "TLSv1.2",
        rejectUnauthorized: false, // fallback permissive for restrictive cloud proxies
      },
      () => {
        let step = 0;
        let buffer = "";

        socket.setEncoding("utf8");

        const send = (cmd) => {
          socket.write(cmd + "\r\n");
        };

        socket.on("data", (chunk) => {
          buffer += chunk;
          const lines = buffer.split("\r\n");
          buffer = lines.pop(); // keep last incomplete line

          for (const line of lines) {
            const code = parseInt(line.substring(0, 3), 10);
            if (line.charAt(3) === "-") continue; // multiline response

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
              const utf8Subject = `=?UTF-8?B?${Buffer.from(subject).toString("base64")}?=`;
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
              resolve({ success: true, method: "smtp-tls" });
            } else if (code >= 400) {
              socket.end();
              reject(new Error(`SMTP Error [${code}]: ${line}`));
            }
          }
        });

        socket.on("error", (err) => {
          reject(err);
        });

        socket.setTimeout(15000, () => {
          socket.destroy();
          reject(new Error("SMTP Connection timed out after 15 seconds"));
        });
      }
    );
  });
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

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed. Please use POST to submit reservations." },
    { status: 405, headers: { Allow: "POST, OPTIONS" } }
  );
}

export async function POST(request) {
  try {
    // 1. Enforce Expected Content-Type (HTTP 415)
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Unsupported Media Type. Content-Type must be application/json." },
        { status: 415 }
      );
    }

    const data = await request.json();

    // 2. Server-Side Input Validation (HTTP 400 Bad Request)
    const rawName = typeof data.name === "string" ? data.name.trim() : "";
    const rawPhone = typeof data.phone === "string" ? data.phone.trim() : "";
    const rawEmail = typeof data.email === "string" ? data.email.trim() : "";
    const rawDate = typeof data.date === "string" ? data.date.trim() : "";
    const rawTime = typeof data.time === "string" ? data.time.trim() : "";
    const rawSeats = typeof data.seats === "string" ? data.seats.trim() : (typeof data.guests === "string" ? data.guests.trim() : "");

    const errors = [];
    if (!rawName || rawName.length < 2) {
      errors.push("Full Name is required (minimum 2 characters).");
    }
    const phoneDigits = rawPhone.replace(/\D/g, "");
    if (!rawPhone || phoneDigits.length < 8 || phoneDigits.length > 15) {
      errors.push("A valid contact Phone Number (8-15 digits) is required.");
    }
    if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      errors.push("Invalid Email Address format.");
    }
    if (!rawDate) {
      errors.push("Reservation Date is required.");
    }
    if (!rawTime) {
      errors.push("Reservation Time Slot is required.");
    }
    if (!rawSeats) {
      errors.push("Number of Seats is required.");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(" "), validationErrors: errors },
        { status: 400 }
      );
    }

    // Sanitized values
    const name = rawName.slice(0, 100);
    const phone = rawPhone.slice(0, 30);
    const email = rawEmail.slice(0, 100) || "Not Provided";
    const date = rawDate.slice(0, 20);
    const time = rawTime.slice(0, 20);
    const seats = rawSeats.slice(0, 50);
    const seating = typeof data.seating === "string" ? data.seating.slice(0, 50) : "Executive Family AC Hall";
    const notes = typeof data.notes === "string" ? data.notes.slice(0, 500) : "None";
    const bookingRef = data.bookingRef || `MSH-${Math.floor(100000 + Math.random() * 900000)}`;

    const smtpUser = process.env.SMTP_USER || "mshfamilyrestaurant@gmail.com";
    const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");
    const recipient = process.env.RECIPIENT_EMAIL || "mshfamilyrestaurant@gmail.com";

    if (!smtpPass) {
      console.error("[MSH Reservation Error] SMTP_PASS is not configured in environment variables.");
    }

    const payloadJson = JSON.stringify({
      name,
      phone,
      email,
      date,
      time,
      seats,
      seating,
      notes,
      bookingRef,
    });

    // 1. Try PHP Execution First (User requirement: "use php for this")
    const phpScriptPath = path.join(process.cwd(), "send-mail.php");
    try {
      const phpResult = await sendWithPhp(phpScriptPath, payloadJson);
      if (phpResult && phpResult.success) {
        return NextResponse.json({
          success: true,
          method: "php",
          bookingRef,
          message: `Reservation email delivered to ${recipient} via PHP`,
        });
      }
    } catch (phpErr) {
      console.log("[Info] PHP execution fell back to direct SMTP:", phpErr.message);
    }

    // 2. Direct SMTP over TLS Fallback
    const subject = `New Table Reservation - ${name} (${date} at ${time})`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; background: #0c0c0d; color: #f4ede4; padding: 25px; max-width: 600px; margin: 0 auto; border: 1px solid #cba158; border-radius: 12px;">
        <div style="text-align: center; border-bottom: 2px solid #cba158; padding-bottom: 20px;">
          <h2 style="color: #f4ede4; margin: 0; font-family: Georgia, serif; text-transform: uppercase;">Mahalakshmi Spice Heritage</h2>
          <p style="color: #cba158; font-size: 12px; margin: 5px 0 0; text-transform: uppercase; letter-spacing: 1px;">Family Restaurant &bull; New Table Reservation</p>
        </div>

        <div style="padding: 20px 0;">
          <p style="font-size: 15px;">Hello Team,</p>
          <p>A new guest has booked a seat / table through the website. Here are the reservation details:</p>
          
          <table style="width: 100%; border-collapse: collapse; background: #18181b; border-radius: 8px; margin: 15px 0;">
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px; width: 35%;">Guest Name</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #fff; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px;">Phone</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a;"><a href="tel:${phone}" style="color: #cba158; text-decoration: none; font-weight: bold;">${phone}</a></td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px;">Email</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a;"><a href="mailto:${email}" style="color: #cba158; text-decoration: none;">${email}</a></td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px;">Date</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #fff;">${date}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px;">Time Slot</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #fff;">${time}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px;">Party / Seats</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #cba158; font-weight: bold;">${seats}</td></tr>
            <tr><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #a1a1aa; font-size: 12px;">Seating Area</td><td style="padding: 10px 14px; border-bottom: 1px solid #27272a; color: #fff;">${seating}</td></tr>
            <tr><td style="padding: 10px 14px; color: #a1a1aa; font-size: 12px;">Special Notes</td><td style="padding: 10px 14px; color: #fff; font-style: italic;">${notes}</td></tr>
          </table>

          <div style="text-align: center; margin: 25px 0 10px;">
            <a href="tel:${phone}" style="background: #cba158; color: #0c0c0d; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-transform: uppercase; font-size: 12px; display: inline-block;">Call Guest: ${phone}</a>
          </div>
        </div>

        <div style="border-top: 1px solid #27272a; padding-top: 15px; font-size: 11px; color: #71717a; text-align: center;">
          Sent to ${recipient} via Mahalakshmi Spice Heritage Automated Dispatcher.
        </div>
      </div>
    `;

    await sendSmtpEmailNode({
      user: smtpUser,
      pass: smtpPass,
      to: recipient,
      subject,
      htmlBody,
    });

    return NextResponse.json({
      success: true,
      method: "smtp-direct",
      bookingRef,
      message: `Reservation email delivered to ${recipient} successfully.`,
    });
  } catch (error) {
    console.error("[Email Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to send email",
      },
      { status: 500 }
    );
  }
}
