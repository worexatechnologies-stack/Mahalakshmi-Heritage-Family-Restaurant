"use client";

import Image from "next/image";
import { UtensilsCrossed, CalendarCheck } from "lucide-react";
import { restaurantInfo, atmosphereImages } from "@/data/restaurantData";

export default function Hero({ onOpenReservation }) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-28 pb-14 sm:pb-20"
    >
      {/* Anchor for backward compatibility */}
      <div id="hero" className="absolute -top-24" />

      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src={atmosphereImages.hero}
          alt="Mahalakshmi Spice Heritage dining room interior"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic dark warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/80 to-[#0c0c0d]/60" />
        <div className="absolute inset-0 bg-black/45" />

        {/* Subtle radial amber glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-[#cba158]/12 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center min-h-[75vh] sm:min-h-[82vh]">
        {/* Center Main Typography */}
        <div className="my-auto py-8 sm:py-12 max-w-4xl">
          {/* Huge Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#f4ede4] leading-[1.05] select-none">
            Mahalakshmi <span className="text-[#cba158] font-light">Spice Heritage</span>
          </h1>

          <p className="font-serif text-lg sm:text-2xl lg:text-3xl text-neutral-200 font-light mt-3 sm:mt-4 italic">
            Experience the Taste of Royal Indian Dining
          </p>

          {/* Description */}
          <p className="mt-4 sm:mt-5 text-xs sm:text-base lg:text-lg text-neutral-300 font-light leading-relaxed max-w-2xl">
            {restaurantInfo.description}
          </p>

          {/* Buttons: Book Your Table & Explore Our Menu */}
          <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-md sm:max-w-none">
            <button
              onClick={onOpenReservation}
              className="bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition duration-200 shadow-xl shadow-[#cba158]/20 text-center flex items-center justify-center gap-2 active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Your Table
            </button>
            <a
              href="/menu"
              className="border border-white/20 hover:border-[#cba158] hover:text-[#cba158] text-neutral-200 text-xs sm:text-sm uppercase tracking-widest px-7 py-4 rounded-xl transition duration-200 backdrop-blur-sm bg-black/40 text-center flex items-center justify-center gap-2 active:scale-95"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#cba158]" />
              Explore Our Menu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
