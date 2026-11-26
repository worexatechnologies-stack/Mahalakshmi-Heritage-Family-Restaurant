"use client";

import { useState } from "react";
import { 
  CalendarCheck, 
  Gift, 
  CheckCircle2, 
  ShieldCheck,
  RotateCcw,
  CreditCard
} from "lucide-react";
import { processRazorpayPayment } from "@/lib/razorpay";

export default function EventBookingSection({ onBookingSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:30",
    seats: "4 Seats (Family Table)",
    seating: "Executive Family AC Hall",
    notes: ""
  });

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await processRazorpayPayment({
        formData,
        amountInRupees: 100,
        onSuccess: (paymentInfo) => {
          setPaymentDetails(paymentInfo);
          setIsSubmitting(false);
          setIsSubmitted(true);
          if (onBookingSuccess) {
            onBookingSuccess(`Table reserved! Paid ₹100 (Payment ID: ${paymentInfo.paymentId})`);
          }
        },
        onError: (err) => {
          setIsSubmitting(false);
          if (!err.cancelled) {
            alert(err.message || "Payment could not be completed. Please try again.");
          }
        },
      });
    } catch (err) {
      setIsSubmitting(false);
      if (!err.cancelled) {
        console.warn("Payment error:", err);
      }
    }
  };

  const handleBookAnother = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: new Date().toISOString().split("T")[0],
      time: "19:30",
      seats: "4 Seats (Family Table)",
      seating: "Executive Family AC Hall",
      notes: ""
    });
    setIsSubmitted(false);
  };

  return (
    <section 
      id="booking" 
      className="pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-28 bg-[#0a0a0c] relative overflow-hidden border-t border-white/5"
    >
      {/* Additional navigation anchors for backward compatibility */}
      <div id="reserve" className="absolute -top-24" />
      <div id="reservation" className="absolute -top-24" />

      {/* Ambient Warm Golden Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] sm:h-[500px] bg-[#cba158]/8 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {!isSubmitted ? (
          /* ===================== 2-COLUMN VIEWPORT-FITTED RESERVATION FORM ===================== */
          <div className="bg-[#131211]/95 border border-[#cba158]/35 rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 xl:p-10 pb-8 sm:pb-10 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
                
                {/* LEFT COLUMN: Brand Context, Perk & Special Requests (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#cba158]/40 bg-[#cba158]/10 text-[10px] sm:text-xs uppercase font-mono tracking-widest text-[#cba158] font-bold shadow-sm">
                    <CalendarCheck className="w-3.5 h-3.5 text-[#cba158]" />
                    <span>SUNDAY GALA &amp; TABLE RESERVATIONS</span>
                  </div>

                  {/* Headline & Subtitle */}
                  <div>
                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-[#f4ede4] font-normal leading-tight">
                      Reserve Your Table
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed select-text">
                      Pre-book your table for <span className="text-[#cba158] font-medium">The Grand Sunday Heritage Feast &amp; Gala</span> or daily family dining.
                    </p>
                  </div>

                  {/* Complimentary Platter Perk Badge */}
                  <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-xl font-medium shadow-sm">
                    <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Complimentary Royal Platter with Every Pre-Booking</span>
                  </div>

                  {/* Special Requests / Occasion Notes Field */}
                  <div className="pt-1">
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                      Special Requests / Occasion Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Mention celebrations (Birthday / Anniversary), high chair needed, dietary preferences (Jain / Less Spicy), or preferred seating area..."
                      className="w-full bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner resize-none leading-relaxed"
                    />
                  </div>

                  {/* Priority Guarantee Note */}
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2.5 text-[11px] text-neutral-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#cba158] animate-ping flex-shrink-0" />
                    <span>Tables are prepared 15 mins prior with priority seating for pre-bookings.</span>
                  </div>

                </div>

                {/* RIGHT COLUMN: Contact Details, Timings, Seats & Submit (7 cols) */}
                <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 lg:border-l lg:border-white/10 lg:pl-8 xl:pl-10">
                  
                  {/* Row 1: Full Name & Phone Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-1">
                        Full Name <span className="text-[#cba158]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Patel"
                        className="w-full h-11 sm:h-12 bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl px-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-1">
                        Phone Number <span className="text-[#cba158]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 91482 78837"
                        className="w-full h-11 sm:h-12 bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl px-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email Address (Optional) */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-1">
                      Email Address <span className="text-neutral-500 text-[10px] font-normal font-sans">(Optional &mdash; for instant voucher)</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="w-full h-11 sm:h-12 bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl px-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
                    />
                  </div>

                  {/* Row 3: Date, Time Slot, and Number of Seats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Date */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-1">
                        Date <span className="text-[#cba158]">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        suppressHydrationWarning
                        min={new Date().toISOString().split("T")[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full h-11 sm:h-12 bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl px-3 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition shadow-inner"
                      />
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-1">
                        Time Slot <span className="text-[#cba158]">*</span>
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full h-11 sm:h-12 bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl px-2.5 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition shadow-inner"
                      >
                        <optgroup label="Lunch Sessions">
                          <option value="12:00">12:00 PM (Lunch)</option>
                          <option value="13:00">01:00 PM (Lunch)</option>
                          <option value="14:00">02:00 PM (Lunch)</option>
                        </optgroup>
                        <optgroup label="Dinner Sessions">
                          <option value="19:00">07:00 PM (Dinner)</option>
                          <option value="19:30">07:30 PM (Dinner)</option>
                          <option value="20:00">08:00 PM (Dinner)</option>
                          <option value="20:30">08:30 PM (Dinner)</option>
                          <option value="21:00">09:00 PM (Dinner)</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* No. of Seats */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-200 mb-1">
                        No. of Seats <span className="text-[#cba158]">*</span>
                      </label>
                      <select
                        value={formData.seats}
                        onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                        className="w-full h-11 sm:h-12 bg-[#1a1916] border border-white/15 focus:border-[#cba158] rounded-xl px-2.5 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition shadow-inner"
                      >
                        <option value="1 Seat">1 Seat (Solo)</option>
                        <option value="2 Seats (Couple Table)">2 Seats (Couple)</option>
                        <option value="3 Seats">3 Seats</option>
                        <option value="4 Seats (Family Table)">4 Seats (Family)</option>
                        <option value="6 Seats (Large Family)">6 Seats (Large)</option>
                        <option value="8+ Seats (Private Dining)">8+ Seats (Banquet)</option>
                      </select>
                    </div>

                  </div>

                  {/* Row 4: Submit Button */}
                  <div className="pt-3 sm:pt-4 pb-2 sm:pb-0">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 sm:h-15 bg-gradient-to-r from-[#cba158] via-[#e2c17c] to-[#cba158] hover:brightness-110 text-[#0c0c0d] font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-xl transition duration-200 flex items-center justify-center gap-2.5 shadow-[0_6px_25px_rgba(203,161,88,0.35)] cursor-pointer active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-5 h-5 border-2 border-[#0c0c0d] border-t-transparent rounded-full animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </div>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 text-[#0c0c0d]" />
                          <span>Pay ₹100 &amp; Book My Seats</span>
                        </>
                      )}
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-neutral-300 mt-3.5 mb-2 text-center leading-relaxed px-1">
                      <ShieldCheck className="w-4 h-4 text-[#cba158] flex-shrink-0" />
                      <span>Secured by Razorpay &bull; UPI, Cards, NetBanking &bull; Instant Confirmation</span>
                    </div>
                  </div>

                </div>

              </div>
            </form>
          </div>
        ) : (
          /* ===================== CONFIRMATION RECEIPT WINDOW ===================== */
          <div className="bg-[#131211]/98 border border-[#cba158]/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/15 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs uppercase font-mono tracking-wider font-semibold mb-3">
              <span>Payment Verified &bull; ₹100.00 Paid</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif text-[#f4ede4] uppercase">
              Table Reserved for {formData.name}
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
              We look forward to welcoming you for a royal dining experience. Our hospitality desk is preparing your priority seating.
            </p>

            <div className="bg-[#1a1916] border border-white/10 rounded-2xl p-4 sm:p-5 my-6 text-left space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400 font-medium">Guest Name:</span>
                <span className="text-white font-bold">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400 font-medium">Date &amp; Time:</span>
                <span className="text-[#cba158] font-bold">{formData.date} &bull; {formData.time}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400 font-medium">Seats:</span>
                <span className="text-white font-medium">{formData.seats}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-neutral-400 font-medium">Contact Phone:</span>
                <span className="text-white font-medium">{formData.phone}</span>
              </div>
              {paymentDetails?.bookingRef && (
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-neutral-400 font-medium">Booking Ref:</span>
                  <span className="text-[#cba158] font-bold font-mono">#{paymentDetails.bookingRef}</span>
                </div>
              )}
              {paymentDetails?.paymentId && (
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-medium">Razorpay ID:</span>
                  <span className="text-emerald-400 font-medium font-mono text-xs">{paymentDetails.paymentId}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleBookAnother}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#cba158] to-[#e4c489] text-black font-semibold text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Book Another Table</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
