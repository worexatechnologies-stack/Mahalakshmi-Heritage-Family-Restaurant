"use client";

import { Clock, Calendar, CheckCircle, ArrowRight, Users, Award } from "lucide-react";
import { sundayEvent } from "@/data/eventData";

export default function EventSchedule({ onOpenReservation }) {
  return (
    <section id="event-schedule" className="py-12 sm:py-16 lg:py-20 bg-[#0a0a0c] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#cba158] font-semibold bg-[#cba158]/10 px-3 py-1 rounded-full border border-[#cba158]/20 mb-3">
            <Clock className="w-3 h-3 text-[#cba158]" />
            Sunday Timeline &amp; Table Options
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight">
            Curated Sunday Experience Program
          </h2>
          <div className="w-14 h-0.5 bg-[#cba158] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
            Choose your preferred session and reserve your table in advance to enjoy complimentary welcome treats and guaranteed seating.
          </p>
        </div>

        {/* 3-Part Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {sundayEvent.schedule.map((slot, index) => (
            <div
              key={index}
              className="relative p-5 sm:p-6 rounded-2xl bg-[#121216] border border-white/10 hover:border-[#cba158]/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Session Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#cba158] bg-[#cba158]/10 px-2.5 py-1 rounded-full border border-[#cba158]/30">
                    {slot.tag}
                  </span>
                  <span className="text-xs font-mono text-neutral-300 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#cba158]" />
                    {slot.time.split("–")[0]}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-serif text-[#f4ede4] mb-3">
                  {slot.title}
                </h3>

                {/* Items list */}
                <ul className="space-y-2 mb-5">
                  {slot.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light leading-relaxed">
                      <CheckCircle className="w-3.5 h-3.5 text-[#cba158] flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <button
                onClick={onOpenReservation}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#cba158] text-[#f4ede4] hover:text-[#0a0a0c] text-xs font-semibold border border-white/10 hover:border-[#cba158] transition duration-200"
              >
                <span>Book This Session</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Table Tiers & Packages */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="text-xl sm:text-2xl font-serif text-[#f4ede4]">
            Select Your Table Arrangement
          </h3>
          <p className="text-xs text-neutral-400 font-light mt-1">
            Complimentary Chef Welcome Platter included for all pre-booked tables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {sundayEvent.tableTiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                tier.id === "family"
                  ? "bg-gradient-to-b from-[#1c1a14] to-[#121216] border-2 border-[#cba158]/80 shadow-2xl shadow-[#cba158]/10 scale-[1.02]"
                  : "bg-[#121216] border border-white/10 hover:border-white/20 shadow-xl"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#cba158]">
                    {tier.badge}
                  </span>
                  <span className="text-xs text-neutral-400 flex items-center gap-1 font-light">
                    <Users className="w-3 h-3 text-[#cba158]" />
                    {tier.capacity}
                  </span>
                </div>

                <h4 className="text-base sm:text-lg font-serif text-[#f4ede4] mb-3">
                  {tier.name}
                </h4>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-300 font-light">
                      <CheckCircle className="w-3 h-3 text-[#cba158] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={onOpenReservation}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition active:scale-95 ${
                  tier.id === "family"
                    ? "bg-[#cba158] hover:bg-[#d8b068] text-[#0a0a0c] shadow-lg shadow-[#cba158]/20"
                    : "bg-white/10 hover:bg-white/20 text-[#f4ede4] border border-white/10"
                }`}
              >
                {tier.ctaText}
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
