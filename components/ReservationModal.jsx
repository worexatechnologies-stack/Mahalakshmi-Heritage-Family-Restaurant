"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle,
  CalendarCheck,
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { restaurantInfo } from "@/data/restaurantData";

export default function ReservationModal({ isOpen, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:30",
    guests: "4 Guests (Family)",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedId, setConfirmedId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Lock background body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const endpoint = process.env.NEXT_PUBLIC_PHP_MAIL_URL || "/api/send-mail";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "reservation",
          ...formData,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to submit reservation. Please try again or call us directly.");
      }

      const resId = result.reservationId || `#MSH-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedId(resId);
      setIsConfirmed(true);
      if (onBookingSuccess) {
        onBookingSuccess(`Table reserved at Mahalakshmi Spice Heritage for ${formData.guests} on ${formData.date}!`);
      }
    } catch (err) {
      console.error("Reservation submission error:", err);
      setErrorMessage(err.message || "Failed to submit reservation. Please check your connection or call +91 91482 78837.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-hidden select-none">
      <div className="relative w-full max-w-[560px] bg-gradient-to-b from-[#18181d]/98 via-[#131317]/98 to-[#0e0e11] border border-[#cba158]/35 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95),0_0_50px_rgba(203,161,88,0.14)] text-[#f4ede4] my-auto overflow-hidden">
        
        {/* Subtle Ambient Top Accent Glow Line */}
        <div className="absolute top-0 left-12 right-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#cba158]/70 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800/70 border border-transparent hover:border-white/10 transition-all z-10 active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!isConfirmed ? (
          <>
            {/* Header: Royal & Compact */}
            <div className="text-center mb-3">
              <div className="relative w-11 h-11 mx-auto mb-1.5 rounded-xl overflow-hidden border border-[#cba158]/60 shadow-[0_0_15px_rgba(203,161,88,0.25)] bg-black/90 p-0.5">
                <Image
                  src="/logo.jpg"
                  alt="Mahalakshmi Spice Heritage"
                  fill
                  className="object-contain p-0.5"
                />
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#cba158]/10 border border-[#cba158]/30 mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#cba158] animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-[#cba158] font-bold">
                  Table & Banquet Reservation
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-serif text-[#f4ede4] leading-tight">
                {restaurantInfo.name}
              </h3>
            </div>

            {/* Non-scrolling Satisfying Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 select-text">
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="group">
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                    Full Name <span className="text-[#cba158]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                    Phone Number <span className="text-[#cba158]">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 91482 78837"
                      className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Party Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="group">
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                    Email Address <span className="text-neutral-500 font-normal text-[10px]">(For receipt)</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@example.com"
                      className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                    Party Size
                  </label>
                  <div className="relative flex items-center">
                    <Users className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                    <select
                      value={formData.guests}
                      onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                      className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="2 Guests">2 Guests</option>
                      <option value="4 Guests (Family)">4 Guests (Family)</option>
                      <option value="6 Guests (Family)">6 Guests (Family)</option>
                      <option value="8-12 Guests (Large Family)">8-12 Guests (Large Family)</option>
                      <option value="15+ Guests (Banquet)">15+ Guests (Banquet)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 text-neutral-400 pointer-events-none group-focus-within:text-[#cba158] transition-colors" />
                  </div>
                </div>
              </div>

              {/* Row 3: Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="group">
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                    Date of Visit
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                    Time Slot
                  </label>
                  <div className="relative flex items-center">
                    <Clock className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="12:30">12:30 PM (Lunch)</option>
                      <option value="13:30">01:30 PM (Lunch)</option>
                      <option value="14:30">02:30 PM (Lunch)</option>
                      <option value="19:00">07:00 PM (Dinner)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:30">08:30 PM (Dinner)</option>
                      <option value="21:30">09:30 PM (Dinner)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 text-neutral-400 pointer-events-none group-focus-within:text-[#cba158] transition-colors" />
                  </div>
                </div>
              </div>

              {/* Row 4: Special Requests */}
              <div className="group">
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1 tracking-wide">
                  Special Requests <span className="text-neutral-500 font-normal text-[10px]">(Celebration, Jain/Vegan, baby chair, etc.)</span>
                </label>
                <div className="relative flex items-center">
                  <MessageSquare className="w-4 h-4 absolute left-3 text-neutral-400 group-focus-within:text-[#cba158] transition-colors pointer-events-none" />
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Birthday anniversary, high chair, less spicy food..."
                    className="w-full bg-[#1b1b20] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] focus:ring-1 focus:ring-[#cba158]/40 hover:border-white/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Error Alert (if any) */}
              {errorMessage && (
                <div className="p-2.5 bg-red-950/70 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-start gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-red-300">{errorMessage}</p>
                    <p className="text-red-400/90 text-[11px]">
                      Call directly at <a href="tel:+919148278837" className="underline font-bold text-white">+91 91482 78837</a>.
                    </p>
                  </div>
                </div>
              )}

              {/* Row 5: Premium CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#dfba63] via-[#cba158] to-[#b88c3b] hover:from-[#e8c775] hover:via-[#dcb56d] hover:to-[#c69a47] text-[#0c0c0d] font-bold py-2.5 sm:py-3 px-5 rounded-xl transition-all duration-200 mt-2 flex items-center justify-center gap-2 shadow-[0_6px_22px_rgba(203,161,88,0.3)] hover:shadow-[0_8px_28px_rgba(203,161,88,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0c0c0d] border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Table Booking...</span>
                  </div>
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4 text-[#0c0c0d]" />
                    <span>Confirm Family Reservation</span>
                  </>
                )}
              </button>

              {/* Trust Subtext */}
              <div className="flex items-center justify-center gap-2.5 text-[10px] text-neutral-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Direct Booking
                </span>
                <span>&bull;</span>
                <span>No Advance Fee</span>
                <span>&bull;</span>
                <span>Instant Confirmation</span>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4 select-text">
            <div className="w-12 h-12 bg-[#cba158]/20 border border-[#cba158] rounded-full flex items-center justify-center mx-auto mb-2 text-[#cba158] shadow-[0_0_20px_rgba(203,161,88,0.3)]">
              <CheckCircle className="w-6 h-6 text-[#cba158]" />
            </div>
            
            <span className="text-[10px] uppercase tracking-widest text-[#cba158] font-bold block mb-0.5">
              Reservation Dispatched
            </span>
            <h3 className="text-xl font-serif text-white">Table Reserved!</h3>
            
            <p className="text-xs text-neutral-300 mt-1 max-w-sm mx-auto">
              Thank you, <strong className="text-white">{formData.name}</strong>. Your reservation request has been dispatched to our restaurant team at <span className="text-[#cba158]">Mahalakshmi Spice Heritage</span>.
            </p>

            <div className="mt-3.5 bg-[#1a1a20] p-3 rounded-xl text-left text-xs space-y-1.5 border border-[#2e2e34] shadow-inner">
              <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                <span className="text-neutral-400">Date & Slot:</span>
                <span className="font-semibold text-white">{formData.date} at {formData.time}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-white/5">
                <span className="text-neutral-400">Party Size:</span>
                <span className="font-semibold text-white">{formData.guests}</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-neutral-400">Reservation ID:</span>
                <span className="font-mono font-bold text-[#cba158]">{confirmedId || "#MSH-RESERVED"}</span>
              </div>
            </div>

            {formData.email && (
              <p className="text-[11px] text-neutral-400 mt-2 text-center">
                A confirmation copy has been dispatched to <span className="text-neutral-200 font-medium">{formData.email}</span>.
              </p>
            )}

            <button
              onClick={handleReset}
              className="mt-3.5 w-full bg-[#cba158] hover:bg-[#d8b067] text-[#0c0c0d] font-bold py-2 rounded-xl transition duration-200 text-xs sm:text-sm active:scale-95 shadow-md shadow-[#cba158]/20"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
