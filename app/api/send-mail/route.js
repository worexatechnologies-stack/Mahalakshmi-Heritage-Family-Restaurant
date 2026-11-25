import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import nodemailer from "nodemailer";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Mahalakshmi Spice Heritage Mail API is ready for production.",
    engine: "Dual Engine (PHP 8.x + Serverless SMTP Fallback)",
  });
}

/**
 * Serverless Node.js Mailer Fallback (Used when PHP is not installed on hosting, e.g. Vercel/Netlify)
 */
async function sendViaServerless(body) {
  const recipientEmail = process.env.RECIPIENT_EMAIL || "mshfamilyrestaurant@gmail.com";
  const smtpUser = process.env.SMTP_USER || "mshfamilyrestaurant@gmail.com";
  const smtpPass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

  if (!smtpPass) {
    throw new Error("SMTP_PASS is not configured. Please add SMTP_PASS to your hosting environment variables.");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const type = (body.type || "reservation").toLowerCase();

  if (type === "newsletter") {
    const email = body.email;
    if (!email) throw new Error("Email address is required.");

    await transporter.sendMail({
      from: `"Mahalakshmi Spice Heritage" <${smtpUser}>`,
      to: recipientEmail,
      subject: `New Newsletter Subscription: ${email}`,
      html: `
        <div style="background:#141416;padding:24px;color:#f4ede4;font-family:Arial,sans-serif;">
          <div style="max-width:500px;margin:auto;background:#1e1e22;padding:20px;border-radius:12px;border:1px solid #cba158;">
            <h3 style="color:#cba158;margin-top:0;">New Newsletter Subscriber</h3>
            <p>Email: <a href="mailto:${email}" style="color:#cba158;">${email}</a></p>
            <p style="font-size:12px;color:#999;">Date: ${new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      `,
    });

    return {
      success: true,
      message: "Thank you for subscribing to Mahalakshmi Spice Heritage updates!",
    };
  }

  // Reservation & Banquet
  const { name, phone, email, date, time, guests, seating, notes } = body;
  if (!name || !phone) {
    throw new Error("Full Name and Phone Number are required.");
  }

  const reservationId = `MSH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";

  // 1. Restaurant Owner Alert
  await transporter.sendMail({
    from: `"Mahalakshmi Spice Heritage" <${smtpUser}>`,
    to: recipientEmail,
    replyTo: email || undefined,
    subject: `🔔 NEW RESERVATION ALERT: #${reservationId} - ${name} (${guests})`,
    html: `
      <div style="background-color:#0c0c0d;padding:30px 10px;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:auto;background-color:#141416;border:1px solid #2e2e32;border-radius:16px;overflow:hidden;">
          <div style="background:#221c13;padding:24px 30px;border-bottom:2px solid #cba158;text-align:center;">
            <div style="font-size:11px;letter-spacing:3px;color:#cba158;font-weight:700;">RESTAURANT OWNER ALERT</div>
            <h1 style="color:#f4ede4;font-size:22px;margin:6px 0 0;font-family:Georgia,serif;">Mahalakshmi Spice Heritage</h1>
            <div style="display:inline-block;margin-top:10px;background:#cba158;color:#0c0c0d;font-size:12px;font-weight:700;padding:4px 14px;border-radius:20px;">
              BOOKING #${reservationId}
            </div>
          </div>
          <div style="padding:24px 30px;color:#f4ede4;">
            <table width="100%" cellpadding="8" cellspacing="0" style="background:#1c1c20;border-radius:10px;border:1px solid #2b2b30;">
              <tr><td width="35%" style="color:#999;font-size:13px;">Guest Name:</td><td style="color:#fff;font-weight:700;">${name}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Phone:</td><td style="color:#cba158;font-weight:700;"><a href="tel:${phone}" style="color:#cba158;text-decoration:none;">${phone}</a></td></tr>
              <tr><td style="color:#999;font-size:13px;">Email:</td><td style="color:#fff;">${email || "Not provided"}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Date & Time:</td><td style="color:#fff;font-weight:700;">${date} at ${time}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Party Size:</td><td style="color:#cba158;font-weight:700;">${guests}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Seating:</td><td style="color:#fff;">${seating}</td></tr>
              <tr><td style="color:#999;font-size:13px;">Special Requests:</td><td style="color:#ddd;">${notes || "None"}</td></tr>
            </table>
            <div style="text-align:center;margin-top:24px;">
              <a href="tel:${phone}" style="background:#cba158;color:#0c0c0d;font-weight:700;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;">
                📞 Call Customer Now (${phone})
              </a>
            </div>
          </div>
        </div>
      </div>
    `,
  });

  // 2. Customer Confirmation (sent ONLY to customer, never owner)
  const isOwner = email && email.toLowerCase().trim() === recipientEmail.toLowerCase().trim();
  if (email && !isOwner) {
    try {
      await transporter.sendMail({
        from: `"Mahalakshmi Spice Heritage" <${smtpUser}>`,
        to: email,
        subject: `Reservation Confirmed (#${reservationId}) - Mahalakshmi Spice Heritage`,
        html: `
          <div style="background-color:#0c0c0d;padding:30px 10px;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:auto;background-color:#141416;border:1px solid #2e2e32;border-radius:16px;overflow:hidden;">
              <div style="background:#221c13;padding:24px 30px;border-bottom:2px solid #cba158;text-align:center;">
                <h1 style="color:#f4ede4;font-size:22px;margin:0;font-family:Georgia,serif;">Mahalakshmi Spice Heritage</h1>
              </div>
              <div style="padding:24px 30px;color:#f4ede4;">
                <h2 style="color:#cba158;font-size:18px;margin-top:0;">Namaste, ${name}!</h2>
                <p style="color:#d5cfc7;font-size:14px;line-height:1.6;">
                  Thank you for booking with us. We have received your reservation request and look forward to welcoming you and your family.
                </p>
                <div style="background:#1c1c20;padding:16px;border-radius:10px;margin:18px 0;border:1px solid #2b2b30;">
                  <div style="color:#cba158;font-weight:700;font-size:12px;margin-bottom:6px;">RESERVATION SUMMARY</div>
                  <div style="color:#fff;font-size:13px;margin:3px 0;"><strong>ID:</strong> #${reservationId}</div>
                  <div style="color:#fff;font-size:13px;margin:3px 0;"><strong>Date:</strong> ${date} at ${time}</div>
                  <div style="color:#fff;font-size:13px;margin:3px 0;"><strong>Guests:</strong> ${guests}</div>
                  <div style="color:#fff;font-size:13px;margin:3px 0;"><strong>Seating:</strong> ${seating}</div>
                </div>
                <p style="font-size:13px;color:#999;">Need to change your booking? Call us directly: <a href="tel:+919148278837" style="color:#cba158;font-weight:700;">+91 91482 78837</a>.</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (e) {
      console.warn("Customer confirmation email non-critical error:", e.message);
    }
  }

  return {
    success: true,
    message: `Table reserved successfully for ${name}!`,
    reservationId: `#${reservationId}`,
    data: { name, phone, email, date, time, guests, seating, notes, timestamp },
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    // 1. If an external PHP URL is configured, forward to it
    const externalPhpUrl = process.env.NEXT_PUBLIC_PHP_MAIL_URL;
    if (externalPhpUrl) {
      const response = await fetch(externalPhpUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // 2. Try executing PHP backend script
    const phpScriptPath = path.join(process.cwd(), "backend", "send-mail.php");

    let phpSuccess = false;
    let phpResult = null;

    try {
      phpResult = await new Promise((resolve, reject) => {
        const child = spawn("php", [phpScriptPath]);

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("error", (err) => {
          reject(err);
        });

        child.on("close", (code) => {
          resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
        });

        child.stdin.write(JSON.stringify(body));
        child.stdin.end();
      });

      if (phpResult.stdout) {
        const parsed = JSON.parse(phpResult.stdout);
        phpSuccess = true;
        return NextResponse.json(parsed, {
          status: parsed.success ? 200 : 400,
        });
      }
    } catch {
      // PHP not installed (e.g. Vercel/Netlify serverless environment)
      phpSuccess = false;
    }

    // 3. If PHP failed or is not installed in the serverless environment, use serverless fallback
    if (!phpSuccess) {
      const fallbackResult = await sendViaServerless(body);
      return NextResponse.json(fallbackResult, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process mail request.",
      },
      { status: 500 }
    );
  }
}
