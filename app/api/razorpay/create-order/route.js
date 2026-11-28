import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

const cleanEnv = (val) => String(val || "").trim().replace(/^['"]|['"]$/g, "");

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

    const key_id = cleanEnv(
      process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    );
    const key_secret = cleanEnv(process.env.RAZORPAY_KEY_SECRET);

    if (!key_id || !key_secret) {
      console.error("[Razorpay Error]: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in server environment.");
      return NextResponse.json(
        { success: false, error: "Razorpay payment gateway is not configured on the server." },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }

    // Strict input validation
    const rawName = typeof data?.name === "string" ? data.name.trim() : "";
    const rawPhone = typeof data?.phone === "string" ? data.phone.trim() : "";
    const rawEmail = typeof data?.email === "string" ? data.email.trim() : "";

    if (rawName.length < 2 || rawName.length > 100) {
      return NextResponse.json(
        { success: false, error: "Full Name is required (2-100 characters)." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const phoneDigits = rawPhone.replace(/\D/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      return NextResponse.json(
        { success: false, error: "Valid contact phone number (8-15 digits) is required." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    if (rawEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid Email Address format." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    // Enforce reservation fee strictly on the server (never trust client-supplied amount)
    const configuredAmount = parseFloat(process.env.RESERVATION_AMOUNT_INR || "100");
    const amountInRupees = Number.isFinite(configuredAmount) && configuredAmount >= 1 ? configuredAmount : 100;
    const amountInPaise = Math.round(amountInRupees * 100);

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const bookingRef = `MSH-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderOptions = {
      amount: amountInPaise,
      currency: "INR",
      receipt: bookingRef,
      notes: {
        bookingRef,
        guestName: rawName.slice(0, 50),
        phone: rawPhone.slice(0, 20),
        date: typeof data?.date === "string" ? data.date.trim().slice(0, 20) : "",
        time: typeof data?.time === "string" ? data.time.trim().slice(0, 20) : "",
        seats: typeof data?.seats === "string" ? data.seats.trim().slice(0, 30) : "",
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id,
        bookingRef,
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch (err) {
    console.error("[Razorpay Order Creation Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err?.error?.description || err?.message || "Failed to create payment order.",
      },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed. Please use POST to create payment order." },
    { status: 405, headers: { Allow: "POST", ...NO_STORE_HEADERS } }
  );
}
