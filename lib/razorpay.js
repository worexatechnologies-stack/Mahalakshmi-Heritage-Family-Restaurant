/**
 * Razorpay Checkout Client Helper
 * Dynamically loads checkout.js and manages standard popup payment flow
 */

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
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
      "Failed to load Razorpay payment gateway. Please check your internet connection and try again."
    );
  }

  // 1. Create order on the backend
  const orderRes = await fetch("/api/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...formData,
      amount: amountInRupees,
    }),
  });

  const orderData = await orderRes.json();
  if (!orderRes.ok || !orderData.success) {
    throw new Error(orderData.error || "Failed to create Razorpay payment order.");
  }

  const { orderId, amount, currency, keyId, bookingRef } = orderData;

  // 2. Open Razorpay Checkout modal
  return new Promise((resolve, reject) => {
    const options = {
      key: keyId,
      amount: amount,
      currency: currency || "INR",
      name: "Mahalakshmi Spice Heritage",
      description: `Table Reservation Advance (Ref #${bookingRef})`,
      image: "/logo.png",
      order_id: orderId,
      handler: async function (response) {
        try {
          // 3. Cryptographically verify payment on server
          const verifyRes = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              bookingRef,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amountPaid: (amount / 100).toFixed(2),
            }),
          });

          const verifyData = await verifyRes.json();
          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.error || "Payment verification failed on server.");
          }

          const paymentResult = {
            bookingRef,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: (amount / 100).toFixed(2),
          };

          if (onSuccess) {
            onSuccess(paymentResult);
          }
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

    rzp.open();
  });
}
