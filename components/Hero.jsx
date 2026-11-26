"use client";

import Image from "next/image";
import { Beer, Utensils, CalendarCheck, Compass } from "lucide-react";
import { atmosphereImages } from "@/data/restaurantData";

export default function Hero({ onOpenReservation, onOpenHighlights }) {
  const eventCards = [
    {
      icon: Beer,
      label: "1+1 BEER PRIVILEGE",
      value: "Double The Cheers On Tap",
    },
    {
      icon: Utensils,
      label: "UNLIMITED SPREAD",
      value: "Full Royal Feast @ ₹999/-",
    },
  ];

  return (
    <section
      id="home"
      className="relative flex flex-col justify-start sm:justify-center min-h-0 sm:min-h-[100svh] sm:min-h-[100dvh] overflow-hidden pt-[94px] sm:pt-24 lg:pt-28 pb-8 sm:pb-6"
    >
      {/* Anchor for backward compatibility & direct routing */}
      <div id="event" className="absolute -top-28" />
      <div id="hero" className="absolute -top-28" />

      {/* ===================== BACKGROUND IMAGE LAYER ===================== */}
      <div className="absolute inset-0 z-0">
        <Image
          src={atmosphereImages.hero}
          alt="Mahalakshmi Spice Heritage Grand Sunday Feast - 1+1 Beer Offer & Unlimited Food"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Dark cinematic vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/80 to-[#0c0c0d]/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0d]/90 via-[#0c0c0d]/60 to-[#0c0c0d]/40" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Ambient Warm Golden Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[350px] sm:h-[650px] bg-[#cba158]/12 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* ===================== HERO MAIN CONTENT CONTAINER ===================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-start sm:justify-center sm:flex-1">
        
        <div className="max-w-4xl py-1 sm:py-2">
          
          {/* Top Pill Badge: MISSING THAT PERFECT SUNDAY? */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#cba158]/45 bg-[#cba158]/10 backdrop-blur-md mb-2 sm:mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="text-[9.5px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#d4a853] font-semibold">
              MISSING THAT PERFECT SUNDAY? &bull; THIS WEEKEND ONLY
            </span>
          </div>

          {/* Headline (Punchy, tempting, high-end editorial typography) */}
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-[46px] xl:text-[54px] 2xl:text-[60px] font-normal tracking-tight text-[#f4ede4] leading-[1.08] uppercase">
            DOUBLE THE CHEERS.<br />
            UNLIMITED HERITAGE FEAST.<br />
            <span className="text-[#cba158] font-medium">JUST ₹999/- ONLY.</span>
          </h1>

          {/* Subtitle / Brand Signature */}
          <p className="font-serif italic text-[10.5px] sm:text-xs md:text-sm lg:text-base text-[#cba158] tracking-[0.14em] sm:tracking-[0.16em] uppercase font-light mt-1.5 sm:mt-2">
            MAHALAKSHMI SPICE HERITAGE &bull; GOOD FOOD &bull; ROYAL VIBES &bull; ZERO COMPROMISE
          </p>

          {/* Description Paragraph */}
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-neutral-300 font-light leading-snug sm:leading-relaxed max-w-2xl">
            Why settle for ordinary when you can feast like royalty? Immerse yourself in an endless spread of live clay-tandoor delicacies and authentic regional recipes, paired with our signature 1+1 chilled beer privilege and acoustic melodies under the palms. Come hungry, leave happy.
          </p>

          {/* 2 Event Feature Cards: 1+1 BEER & UNLIMITED SPREAD */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mt-3 sm:mt-4 lg:mt-5 max-w-md sm:max-w-lg">
            {eventCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-black/60 backdrop-blur-md border border-white/10 hover:border-[#cba158]/50 rounded-xl p-2.5 sm:p-3 transition duration-200 flex items-center gap-2.5 sm:gap-3 shadow-md group"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#cba158]/15 border border-[#cba158]/30 flex items-center justify-center flex-shrink-0 text-[#cba158] group-hover:bg-[#cba158] group-hover:text-[#0c0c0d] transition duration-200">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[8.5px] sm:text-[9.5px] text-neutral-400 uppercase tracking-widest font-semibold leading-none mb-0.5 sm:mb-1">
                      {card.label}
                    </span>
                    <span className="block text-[11px] sm:text-xs lg:text-sm text-[#f4ede4] font-medium leading-tight truncate">
                      {card.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action CTA Buttons (Side-by-side on all screens for compact height) */}
          <div className="mt-3.5 sm:mt-5 flex flex-row items-center gap-2.5 sm:gap-4 max-w-lg sm:max-w-none">
            
            {/* Primary Button: CLAIM ₹999 OFFER */}
            <button
              onClick={onOpenReservation}
              className="flex-1 sm:flex-initial bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-[11px] sm:text-xs md:text-sm uppercase tracking-wider px-4 sm:px-7 py-2.5 sm:py-3.5 rounded-xl shadow-xl shadow-[#cba158]/20 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0c0c0d] flex-shrink-0" />
              <span>CLAIM ₹999 OFFER &amp; BOOK</span>
            </button>

            {/* Secondary Button: EXPLORE HIGHLIGHTS */}
            <button
              onClick={onOpenHighlights}
              className="flex-1 sm:flex-initial border border-white/20 hover:border-[#cba158] hover:text-[#cba158] text-neutral-200 text-[11px] sm:text-xs md:text-sm uppercase tracking-wider px-3.5 sm:px-6 py-2.5 sm:py-3.5 rounded-xl backdrop-blur-sm bg-black/45 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 transition cursor-pointer whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#cba158] flex-shrink-0" />
              <span>EXPLORE HIGHLIGHTS</span>
            </button>
          </div>

          {/* Bottom Micro-note */}
          <div className="text-[10px] sm:text-xs text-neutral-400 mt-2.5 sm:mt-3.5 flex items-center gap-2 font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span>Exclusive Sunday Privilege &bull; 25 prime tables available &bull; Come hungry, leave happy</span>
          </div>

        </div>

      </div>
    </section>
  );
}
