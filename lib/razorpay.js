/**
 * Razorpay Checkout Client Helper
 * Dynamically loads checkout.js and manages standard popup payment flow
 */

import { trackMetaEvent } from "@/lib/metaPixel";

export const RAZORPAY_KEY_ID = (
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
).trim();
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }
    if (typeof document === "undefined") {
      return resolve(false);
    }

    // Check if script is already injected
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]');
    if (existingScript) {
      if (window.Razorpay) return resolve(true);
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      // Fallback timeout
      setTimeout(() => resolve(!!window.Razorpay), 3000);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);

    // Safety timeout in case onload doesn't fire
    setTimeout(() => {
      resolve(typeof window !== "undefined" && !!window.Razorpay);
    }, 4000);
  });
};

export async function processRazorpayPayment({
  formData,
  amountInRupees = 100,
  onSuccess,
  onError,
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    throw new Error(
      "Failed to load Razorpay payment gateway. Please check your internet connection or ad blocker and try again."
    );
  }

  // 1. Create an authoritative order on the backend (required for cryptographic verification)
  const orderRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const orderData = await orderRes.json().catch(() => null);
  if (!orderRes.ok || !orderData?.success || !orderData?.orderId) {
    throw new Error(
      orderData?.error || "Unable to initialize payment order. Please try again."
    );
  }

  const activeKeyId = orderData.keyId || RAZORPAY_KEY_ID;
  if (!activeKeyId) {
    throw new Error("Payment gateway key is not configured.");
  }

  const activeOrderId = orderData.orderId;
  const activeBookingRef = orderData.bookingRef;
  const activeAmount = orderData.amount;
  const activeCurrency = orderData.currency || "INR";

  // Build absolute logo URL
  const logoUrl =
    typeof window !== "undefined" && window.location.origin
      ? `${window.location.origin}/logo.png`
      : "/logo.png";

  // 2. Open Razorpay Checkout modal
  return new Promise((resolve, reject) => {
    const options = {
      key: activeKeyId,
      amount: activeAmount,
      currency: activeCurrency,
      name: "Mahalakshmi Spice Heritage",
      description: `Table Reservation Advance - ₹${(activeAmount / 100).toFixed(0)} (Ref #${activeBookingRef})`,
      image: logoUrl,
      order_id: activeOrderId,
      handler: async function (response) {
        try {
          // Cryptographically verify payment on server & trigger email confirmation
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              bookingRef: activeBookingRef,
              orderId: response.razorpay_order_id || activeOrderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature || "",
            }),
          });

          const verifyData = await verifyRes.json().catch(() => null);
          if (!verifyRes.ok || !verifyData?.success) {
            throw new Error(
              verifyData?.error || "Payment verification failed. Please contact support."
            );
          }

          const paymentResult = {
            bookingRef: verifyData.bookingRef || activeBookingRef,
            paymentId: verifyData.paymentId || response.razorpay_payment_id,
            orderId: verifyData.orderId || response.razorpay_order_id || activeOrderId,
            amount: verifyData.amountPaid || (activeAmount / 100).toFixed(2),
          };

          if (onSuccess) {
            onSuccess(paymentResult);
          }
          trackMetaEvent("Purchase", {
            value: Number(paymentResult.amount),
            currency: "INR",
            content_name: "Table Reservation Advance",
            content_ids: [paymentResult.bookingRef],
          });
          resolve(paymentResult);
        } catch (err) {
          if (onError) onError(err);
          reject(err);
        }
      },
      prefill: {
        name: formData.name || "",
        email: formData.email || "",
        contact: formData.phone || "",
      },
      theme: {
        color: "#cba158",
        backdrop_color: "rgba(12, 12, 13, 0.85)",
      },
      modal: {
        ondismiss: function () {
          const dismissErr = new Error("Payment cancelled by user.");
          dismissErr.cancelled = true;
          if (onError) onError(dismissErr);
          reject(dismissErr);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (failResponse) {
      const failErr = new Error(
        failResponse.error?.description || "Payment failed. Please try again."
      );
      if (onError) onError(failErr);
      reject(failErr);
    });

    trackMetaEvent("InitiateCheckout", {
      value: Number((activeAmount / 100).toFixed(2)),
      currency: activeCurrency,
      content_name: "Table Reservation Advance",
      content_ids: [activeBookingRef],
    });

    rzp.open();
  });
}
