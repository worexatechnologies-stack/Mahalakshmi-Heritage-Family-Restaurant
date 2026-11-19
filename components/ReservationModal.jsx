"use client";

import { useState } from "react";
import Image from "next/image";
import { X, CheckCircle, CalendarCheck } from "lucide-react";
import { restaurantInfo } from "@/data/restaurantData";

export default function ReservationModal({ isOpen, onClose, onBookingSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    time: "19:30",
    guests: "4 Guests (Family)",
    seating: "Main Family Dining Hall",
    notes: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);
      if (onBookingSuccess) {
        onBookingSuccess(`Table reserved at Mahalakshmi Spice Heritage for ${formData.guests} on ${formData.date}!`);
      }
    }, 700);
  };

  const handleReset = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141416] border border-[#2b2b2e] rounded-2xl p-5 sm:p-8 shadow-2xl text-[#f4ede4] max-h-[92vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <>
            <div className="text-center mb-6">
              {/* Official Logo Emblem */}
              <div className="relative w-28 h-24 sm:w-32 sm:h-28 mx-auto mb-3 rounded-xl overflow-hidden border border-[#cba158]/50 shadow-md bg-black">
                <Image
                  src="/logo.jpg"
                  alt="Mahalakshmi Spice Heritage"
                  fill
                  className="object-contain p-1.5"
                />
              </div>

              <span className="text-[11px] uppercase tracking-widest text-[#cba158] font-bold">
                Table & Banquet Reservation
              </span>
              <h3 className="text-xl sm:text-2xl font-serif text-[#f4ede4] mt-0.5">
                {restaurantInfo.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Family Restaurant &bull; Authentic Royal Indian Dining
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-[#cba158]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#cba158]"
                  >
                    <option value="12:30">12:30 PM (Lunch)</option>
                    <option value="13:30">01:30 PM (Lunch)</option>
                    <option value="14:30">02:30 PM (Lunch)</option>
                    <option value="19:00">07:00 PM (Dinner)</option>
                    <option value="19:30">07:30 PM (Dinner)</option>
                    <option value="20:30">08:30 PM (Dinner)</option>
                    <option value="21:30">09:30 PM (Dinner)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Party Size
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#cba158]"
                  >
                    <option value="2 Guests">2 Guests</option>
                    <option value="4 Guests (Family)">4 Guests (Family)</option>
                    <option value="6 Guests (Family)">6 Guests (Family)</option>
                    <option value="8-12 Guests (Large Family)">8-12 Guests (Large Family)</option>
                    <option value="15+ Guests (Banquet)">15+ Guests (Banquet)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Seating Area
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "Main Family Dining Hall",
                    "AC Royal Heritage Suite",
                    "Private Banquet Suite",
                    "Cozy Booth Table"
                  ].map((seat) => (
                    <button
                      type="button"
                      key={seat}
                      onClick={() => setFormData({ ...formData, seating: seat })}
                      className={`py-2 px-3 rounded-lg border text-left transition ${
                        formData.seating === seat
                          ? "bg-[#cba158]/15 border-[#cba158] text-[#cba158] font-medium"
                          : "bg-[#1e1e22] border-[#2e2e32] text-neutral-400 hover:text-white"
                      }`}
                    >
                      {seat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Special Requests (Celebration, Jain/Vegan preferences, etc.)
                </label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Birthday celebration, high chair needed, less spicy..."
                  className="w-full bg-[#1e1e22] border border-[#2e2e32] rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#cba158] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#cba158] to-[#d8b067] hover:from-[#dcb56d] hover:to-[#e4c489] text-[#0c0c0d] font-bold py-3 px-6 rounded-lg transition duration-200 mt-2 flex items-center justify-center gap-2 shadow-lg shadow-[#cba158]/20"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-[#0c0c0d] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CalendarCheck className="w-4 h-4" />
                    <span>Confirm Family Reservation</span>
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#cba158]/20 border border-[#cba158] rounded-full flex items-center justify-center mx-auto mb-4 text-[#cba158]">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-serif text-white">Table Reserved!</h3>
            <p className="text-sm text-neutral-300 mt-2">
              Thank you, <strong className="text-white">{formData.name}</strong>. We look forward to welcoming you and your family to <span className="text-[#cba158]">Mahalakshmi Spice Heritage</span>.
            </p>

            <div className="mt-6 bg-[#1e1e22] p-4 rounded-xl text-left text-xs space-y-2 border border-[#2e2e32]">
              <div className="flex justify-between">
                <span className="text-neutral-400">Date & Slot:</span>
                <span className="font-semibold text-white">{formData.date} at {formData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Party Size:</span>
                <span className="font-semibold text-white">{formData.guests}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Seating Area:</span>
                <span className="font-semibold text-[#cba158]">{formData.seating}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Reservation ID:</span>
                <span className="font-mono text-[#cba158]">#MSH-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="mt-6 w-full bg-[#cba158] text-[#0c0c0d] font-bold py-2.5 rounded-lg hover:bg-[#d8b067] transition"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
