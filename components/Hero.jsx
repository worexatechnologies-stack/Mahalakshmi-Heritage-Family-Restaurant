"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { restaurantInfo, atmosphereImages } from "@/data/restaurantData";

export default function Hero({ onOpenReservation }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      
      {/* Background Image Layer matching reference screenshot */}
      <div className="absolute inset-0 z-0">
        <Image
          src={atmosphereImages.hero}
          alt="Mahalakshmi Spice Heritage dining room interior"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic dark warm overlay matching the screenshot */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/70 to-[#0c0c0d]/50" />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Subtle radial amber glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#cba158]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 sm:py-24 flex flex-col justify-between min-h-[85vh]">
        
        {/* Top/Right quote block matching screenshot */}
        <div className="flex justify-end pt-8 sm:pt-4">
          <div className="max-w-md text-right text-neutral-300 text-xs sm:text-sm font-light leading-relaxed border-r-2 border-[#cba158]/60 pr-4">
            <p className="text-[#f4ede4]/90 italic font-serif text-sm sm:text-base">
              &ldquo;{restaurantInfo.headline}&rdquo;
            </p>
          </div>
        </div>

        {/* Center Main Typography matching reference screenshot */}
        <div className="my-auto py-12">
          {/* Huge Stacked Editorial Serif Typography */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#f4ede4] leading-[0.92] select-none">
            MAHALAKSHMI <br />
            <span className="text-[#cba158] font-light">SPICE HERITAGE</span>
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenReservation}
              className="bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-semibold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded transition duration-200 shadow-lg shadow-[#cba158]/20"
            >
              Book a Table
            </button>
            <a
              href="#signatures"
              className="border border-white/20 hover:border-[#cba158] hover:text-[#cba158] text-neutral-300 text-xs sm:text-sm uppercase tracking-widest px-7 py-3.5 rounded transition duration-200 backdrop-blur-sm bg-black/30"
            >
              Explore Menu
            </a>
          </div>
        </div>

        {/* Bottom Bar: Sub-headline left + scroll down matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-8 border-t border-white/10">
          <p className="max-w-md text-[11px] sm:text-xs tracking-widest uppercase font-medium text-neutral-400">
            {restaurantInfo.subHeadline}
          </p>

          <a
            href="#about"
            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-[#cba158] transition uppercase tracking-widest group"
          >
            <span>Scroll Down</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition duration-200 text-[#cba158]" />
          </a>
        </div>

      </div>
    </section>
  );
}
