import { NextResponse } from "next/server";
import Razorpay from "razorpay";

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
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error("[Razorpay Error]: Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in environment.");
      return NextResponse.json(
        { success: false, error: "Razorpay payment gateway is not configured on the server." },
        { status: 500 }
      );
    }

    // Validation
    const rawName = typeof data.name === "string" ? data.name.trim() : "";
    const rawPhone = typeof data.phone === "string" ? data.phone.trim() : "";
    if (rawName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Full Name is required (minimum 2 characters)." },
        { status: 400 }
      );
    }
    const phoneDigits = rawPhone.replace(/\D/g, "");
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
      return NextResponse.json(
        { success: false, error: "Valid contact phone number (8-15 digits) is required." },
        { status: 400 }
      );
    }

    // Set amount in paise (1 INR = 100 paise; e.g. Rs 100 = 10000 paise)
    const amountInRupees = parseFloat(process.env.RESERVATION_AMOUNT_INR || data.amount || 100);
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
        date: typeof data.date === "string" ? data.date.slice(0, 20) : "",
        time: typeof data.time === "string" ? data.time.slice(0, 20) : "",
        seats: typeof data.seats === "string" ? data.seats.slice(0, 30) : "",
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || key_id,
      bookingRef,
    });
  } catch (err) {
    console.error("[Razorpay Order Creation Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.error?.description || err.message || "Failed to create payment order.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Method Not Allowed. Please use POST to create payment order." },
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
