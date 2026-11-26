"use client";

import { useState } from "react";
import Image from "next/image";
import { X, CheckCircle2, CalendarCheck, Clock, Users, Gift, Phone, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";
import { restaurantInfo } from "@/data/restaurantData";
import { processRazorpayPayment } from "@/lib/razorpay";

export default function ReservationModal({ isOpen, onClose, onBookingSuccess }) {
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

  const [bookingRef, setBookingRef] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await processRazorpayPayment({
        formData,
        amountInRupees: 100,
        onSuccess: (paymentInfo) => {
          setBookingRef(paymentInfo.bookingRef);
          setPaymentDetails(paymentInfo);
          setIsSubmitting(false);
          setIsSubmitted(true);
          if (onBookingSuccess) {
            onBookingSuccess(`Table reserved! Paid ₹100 (Ref #${paymentInfo.bookingRef})`);
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

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden">
      
      {/* ===================== VIEW 1: COMPACT, NON-SCROLLING VIEWPORT-FITTED RESERVATION FORM ===================== */}
      {!isSubmitted ? (
        <div className="relative w-full max-w-lg lg:max-w-2xl bg-[#141416]/98 border border-[#cba158]/35 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-[#f4ede4] my-auto overflow-hidden">
          
          {/* Subtle Royal Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#cba158]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cba158]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Top Bar: Brand Logo, Pill & Close Button */}
          <div className="relative z-10 flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#cba158]/80 bg-[#101114] flex-shrink-0 shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Mahalakshmi Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#cba158] font-bold">
                  <CalendarCheck className="w-3.5 h-3.5 text-[#cba158]" />
                  <span>SUNDAY EVENT TABLE</span>
                </div>
                <h3 className="font-serif text-base sm:text-xl text-[#f4ede4] uppercase tracking-wide leading-tight">
                  Reserve Your Table
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full font-medium">
                <Gift className="w-3.5 h-3.5 text-emerald-400" />
                <span>Free Royal Platter</span>
              </div>
              <button
                onClick={handleReset}
                className="text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800/80 transition cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subtitle & Mobile Platter Badge */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-300 pt-2 pb-1">
            <p className="truncate text-neutral-300 font-light">
              The Grand Sunday Heritage Feast &amp; Gala
            </p>
            <span className="sm:hidden text-emerald-400 text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
              Free Royal Platter
            </span>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 mt-2 space-y-2 sm:space-y-2.5">
            {/* Row 1: Full Name & Phone Number */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Full Name <span className="text-[#cba158]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ramesh Patel"
                  className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2.5 sm:px-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Phone Number <span className="text-[#cba158]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 91482 78837"
                  className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2.5 sm:px-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
                />
              </div>
            </div>

            {/* Row 2: Date & Time Slot */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Date <span className="text-[#cba158]">*</span>
                </label>
                <input
                  type="date"
                  required
                  suppressHydrationWarning
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2 sm:px-3 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Time Slot <span className="text-[#cba158]">*</span>
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2 sm:px-3 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition shadow-inner"
                >
                  <option value="12:00">12:00 PM (Lunch)</option>
                  <option value="13:00">01:00 PM (Lunch)</option>
                  <option value="14:00">02:00 PM (Lunch)</option>
                  <option value="19:00">07:00 PM (Dinner)</option>
                  <option value="19:30">07:30 PM (Dinner)</option>
                  <option value="20:00">08:00 PM (Dinner)</option>
                  <option value="20:30">08:30 PM (Dinner)</option>
                  <option value="21:00">09:00 PM (Dinner)</option>
                </select>
              </div>
            </div>

            {/* Row 3: Number of Seats & Email Address */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  No. of Seats <span className="text-[#cba158]">*</span>
                </label>
                <select
                  value={formData.seats}
                  onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                  className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2 sm:px-3 text-xs sm:text-sm text-white focus:outline-none cursor-pointer transition shadow-inner"
                >
                  <option value="1 Seat">1 Seat (Solo)</option>
                  <option value="2 Seats (Couple Table)">2 Seats (Couple)</option>
                  <option value="3 Seats">3 Seats</option>
                  <option value="4 Seats (Family Table)">4 Seats (Family)</option>
                  <option value="6 Seats (Large Family)">6 Seats (Large)</option>
                  <option value="8+ Seats (Private Dining)">8+ Seats (Banquet)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                  Email <span className="text-neutral-500 text-[9px] normal-case">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2.5 sm:px-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
                />
              </div>
            </div>

            {/* Row 4: Special Requests / Occasion Notes */}
            <div>
              <label className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1">
                Special Requests / Notes <span className="text-neutral-500 text-[9px] normal-case">(Optional)</span>
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Celebration, high chair needed, dietary restrictions, less spicy..."
                className="w-full h-9 sm:h-10 bg-[#1c1c20] border border-white/15 focus:border-[#cba158] rounded-xl px-2.5 sm:px-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition shadow-inner"
              />
            </div>

            {/* Priority Seating Guarantee Notice */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-neutral-400 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#cba158] animate-ping flex-shrink-0" />
              <span>Tables are prepared 15 mins prior with priority seating for pre-bookings.</span>
            </div>

            {/* Submit Action */}
            <div className="pt-1.5 sm:pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 bg-gradient-to-r from-[#cba158] via-[#e2c17c] to-[#cba158] hover:brightness-110 text-[#0c0c0d] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(203,161,88,0.3)] cursor-pointer active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0c0c0d] border-t-transparent rounded-full animate-spin" />
                    <span>Connecting to Razorpay...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#0c0c0d]" />
                    <span>Pay ₹100 &amp; Book My Seats</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 mt-2 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#cba158] flex-shrink-0" />
                <span>Secured by Razorpay &bull; UPI, Cards, NetBanking</span>
              </div>
            </div>

          </form>

        </div>
      ) : (
        /* ===================== VIEW 2: COMPACT SUBMITTED CONFIRMATION WINDOW ===================== */
        <div className="relative w-full max-w-lg bg-[#141416]/98 border border-[#cba158]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-[#f4ede4] my-auto animate-fade-in text-center overflow-hidden">
          
          {/* Subtle Royal Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#cba158]/10 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

          {/* Close Button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-neutral-400 hover:text-white p-1.5 rounded-full hover:bg-neutral-800/80 transition cursor-pointer z-20"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Checkmark Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500/15 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2.5 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10.5px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
              Payment Verified &bull; ₹100.00 Paid
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-serif text-white uppercase tracking-tight">
            Table Booked Successfully!
          </h3>
          
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-md mx-auto leading-relaxed">
            Thank you, <strong className="text-white">{formData.name}</strong>. Your reservation request has been dispatched to <span className="text-[#cba158] font-semibold">{restaurantInfo.name}</span>.
          </p>

          {/* Compact Receipt Card */}
          <div className="mt-4 bg-[#1a1a1e] p-3.5 sm:p-4 rounded-xl text-left border border-white/10 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
              <span className="text-neutral-400 text-xs font-medium">Booking Ref ID:</span>
              <span className="font-mono text-base text-[#cba158] font-bold">#{bookingRef}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Seats</span>
                <span className="font-semibold text-white truncate block">{formData.seats}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Date</span>
                <span className="font-semibold text-white truncate block">{formData.date}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-0.5">Time</span>
                <span className="font-semibold text-white truncate block">{formData.time}</span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Phone:</span>
              <span className="font-medium text-neutral-200">{formData.phone}</span>
            </div>

            {paymentDetails?.paymentId && (
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Razorpay ID:</span>
                <span className="font-mono text-[#cba158] font-bold text-[11px] truncate max-w-[200px]">
                  {paymentDetails.paymentId}
                </span>
              </div>
            )}
          </div>

          {/* Notification Notice */}
          <div className="mt-3 p-2.5 rounded-xl bg-[#cba158]/10 border border-[#cba158]/25 text-left flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#cba158] flex-shrink-0 mt-0.5" />
            <p className="text-[10.5px] sm:text-xs text-neutral-300 leading-normal">
              Confirmation sent to (<span className="text-[#cba158] font-medium">mshfamilyrestaurant@gmail.com</span>). Table is reserved 15 mins prior. Changes? Call <a href="tel:+919148278837" className="text-[#cba158] underline font-semibold">+91 91482 78837</a>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2.5 sm:gap-3">
            <button
              onClick={handleReset}
              className="flex-1 h-10 sm:h-11 bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-md shadow-[#cba158]/20 cursor-pointer active:scale-98 flex items-center justify-center"
            >
              Done
            </button>
            <button
              onClick={handleBookAnother}
              className="px-4 h-10 sm:h-11 rounded-xl border border-white/20 hover:border-[#cba158] text-neutral-300 hover:text-[#cba158] transition flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Book Another</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
