"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  CalendarCheck, 
  Clock, 
  Users, 
  Gift, 
  Phone, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck,
  CreditCard
} from "lucide-react";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { restaurantInfo } from "@/data/restaurantData";
import { processRazorpayPayment } from "@/lib/razorpay";

export default function ContactPage() {
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
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  const showToast = (message) => {
    setToastMessage(message);
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, 4000);
  };

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
          showToast(`Table reserved! Paid ₹100 (Payment ID: ${paymentInfo.paymentId})`);
          window.scrollTo({ top: 0, behavior: "smooth" });
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
    <main className="min-h-screen bg-[#0c0c0d] text-[#f4ede4] relative overflow-x-hidden selection:bg-[#cba158] selection:text-[#0c0c0d] flex flex-col justify-between">
      
      {/* ===================== TOP MINIMAL HEADER ===================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0d]/95 backdrop-blur-md border-b border-white/10 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#cba158]/90 bg-[#101114] flex-shrink-0 shadow-sm group-hover:border-[#cba158] transition">
              <Image
                src="/logo.png"
                alt="Mahalakshmi Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xs sm:text-sm font-medium tracking-[0.18em] text-[#f4ede4] group-hover:text-[#cba158] transition uppercase leading-none">
                Mahalakshmi
              </span>
              <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-[0.25em] text-[#8e8b86] group-hover:text-neutral-300 transition mt-0.5 leading-none font-medium">
                Family Restaurant
              </span>
            </div>
          </Link>

          {/* Action Link: Return Home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-300 hover:text-[#cba158] transition px-3 py-1.5 rounded-lg border border-white/10 hover:border-[#cba158]/50 bg-black/40 uppercase tracking-wider font-mono active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>

        </div>
      </header>

      {/* ===================== VIEWPORT-CALIBRATED MAIN FORM SECTION ===================== */}
      <div className="pt-20 sm:pt-22 pb-16 sm:pb-24 px-3 sm:px-6 w-full max-w-6xl xl:max-w-7xl mx-auto flex-1 flex flex-col justify-center">
        
        {/* Subtle Ambient Background Warmth */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[850px] h-[300px] sm:h-[450px] bg-[#cba158]/10 rounded-full blur-[140px] pointer-events-none" />

        {!isSubmitted ? (
          /* ===================== VIEW 1: GRAND 2-COLUMN VIEWPORT-FITTED FORM ===================== */
          <div className="relative z-10 bg-[#131211]/95 border border-[#cba158]/35 rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 xl:p-10 pb-8 sm:pb-10 shadow-[0_25px_80px_rgba(0,0,0,0.95)]">
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
                
                {/* LEFT COLUMN: Brand Context, Perk & Special Requests (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#cba158]/40 bg-[#cba158]/10 text-[10px] sm:text-xs uppercase font-mono tracking-widest text-[#cba158] font-bold shadow-sm">
                    <CalendarCheck className="w-3.5 h-3.5 text-[#cba158]" />
                    <span>GUEST CONTACT &amp; TABLE RESERVATIONS</span>
                  </div>

                  {/* Headline & Subtitle */}
                  <div>
                    <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight text-[#f4ede4] font-normal leading-tight">
                      Reserve Your Table
                    </h1>
                    <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                      Pre-book your table for <span className="text-[#cba158] font-medium">The Grand Sunday Heritage Feast &amp; Gala</span> or daily family dining.
                    </p>
                  </div>

                  {/* Complimentary Platter Perk Badge */}
                  <div className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3.5 py-1.5 rounded-xl font-medium shadow-sm">
                    <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Complimentary Royal Platter with Every Pre-Booking</span>
                  </div>

                  {/* Special Requests / Dietary Notes Field */}
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
          /* ===================== VIEW 2: CONFIRMATION RECEIPT WINDOW ===================== */
          <div className="relative z-10 bg-[#131211]/98 border border-[#cba158]/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center max-w-2xl mx-auto">
            
            {/* Success Checkmark */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/15 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                Payment Verified &bull; ₹100.00 Paid
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white uppercase tracking-tight">
              Table Booked Successfully!
            </h2>
            
            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-white">{formData.name}</strong>. Your reservation request has been confirmed and dispatched to <span className="text-[#cba158] font-semibold">{restaurantInfo.name}</span>.
            </p>

            {/* Receipt Summary Card */}
            <div className="mt-6 bg-[#1a1916] p-4 sm:p-6 rounded-2xl text-left border border-white/10 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/10 gap-1.5">
                <span className="text-neutral-400 font-medium text-xs sm:text-sm">Booking Reference ID:</span>
                <span className="font-mono text-base sm:text-lg text-[#cba158] font-bold">#{bookingRef}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs sm:text-sm">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider flex items-center gap-1 mb-0.5">
                    <Users className="w-3.5 h-3.5 text-[#cba158]" /> Seats
                  </span>
                  <span className="font-semibold text-white">{formData.seats}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider flex items-center gap-1 mb-0.5">
                    <CalendarCheck className="w-3.5 h-3.5 text-[#cba158]" /> Date
                  </span>
                  <span className="font-semibold text-white">{formData.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider flex items-center gap-1 mb-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#cba158]" /> Time Slot
                  </span>
                  <span className="font-semibold text-white">{formData.time}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-400">Guest Contact Phone:</span>
                <span className="font-medium text-neutral-200">{formData.phone}</span>
              </div>

              {paymentDetails?.paymentId && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-neutral-400">Razorpay Transaction ID:</span>
                  <span className="font-mono text-emerald-400 font-medium text-xs">{paymentDetails.paymentId}</span>
                </div>
              )}
            </div>

            {/* Notification Notice */}
            <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#cba158]/10 border border-[#cba158]/25 text-left flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#cba158] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed">
                Details sent to (<span className="text-[#cba158] font-medium">mshfamilyrestaurant@gmail.com</span>). Table is reserved 15 mins prior. Immediate changes? Call <a href="tel:+919148278837" className="text-[#cba158] underline font-semibold">+91 91482 78837</a>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="px-6 h-12 bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs sm:text-sm rounded-xl transition duration-200 shadow-md shadow-[#cba158]/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Done &amp; Return to Home</span>
              </Link>
              <button
                type="button"
                onClick={handleBookAnother}
                className="px-5 h-12 rounded-xl border border-white/20 hover:border-[#cba158] text-neutral-300 hover:text-[#cba158] transition flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Book Another Table</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ===================== RESTAURANT FOOTER SECTION ===================== */}
      <Footer onSubscribe={(msg) => showToast(msg)} />

      {/* Toast Alert */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onClose={() => setIsToastVisible(false)}
      />

    </main>
  );
}
