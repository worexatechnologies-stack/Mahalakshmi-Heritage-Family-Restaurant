"use client";

import { Users, Cake, Heart, UtensilsCrossed, CalendarCheck, CheckCircle2 } from "lucide-react";
import { celebrationsCatering } from "@/data/restaurantData";

const serviceIcons = [
  Users,
  Cake,
  Heart,
  UtensilsCrossed,
  CalendarCheck
];

export default function CelebrationsCatering({ onOpenReservation }) {
  return (
    <section id="celebrations" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0f] relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#cba158]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#cba158] uppercase block mb-2">
            {celebrationsCatering.subtitle}
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight leading-tight">
            {celebrationsCatering.title}
          </h2>

          <div className="w-16 h-0.5 bg-[#cba158] mx-auto my-5" />

          {/* 3 Paragraphs */}
          <div className="space-y-3 text-xs sm:text-sm lg:text-base text-neutral-300 font-light leading-relaxed">
            {celebrationsCatering.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {celebrationsCatering.services.map((service, idx) => {
            const Icon = serviceIcons[idx % serviceIcons.length];
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-2xl bg-[#141418] border border-white/5 hover:border-[#cba158]/50 transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3 group hover:-translate-y-1 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1c1c22] border border-[#cba158]/30 text-[#cba158] flex items-center justify-center group-hover:bg-[#cba158] group-hover:text-black transition-all duration-300 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm sm:text-base font-serif font-semibold text-[#f4ede4] group-hover:text-[#cba158] transition-colors">
                  {service}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-light">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#cba158]" />
                  <span>Custom Packages</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA: Enquire About Catering */}
        <div className="text-center">
          <button
            onClick={onOpenReservation}
            className="bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition duration-200 shadow-xl shadow-[#cba158]/20 inline-flex items-center gap-2 active:scale-95"
          >
            <CalendarCheck className="w-4 h-4" />
            {celebrationsCatering.cta}
          </button>
        </div>

      </div>
    </section>
  );
}
