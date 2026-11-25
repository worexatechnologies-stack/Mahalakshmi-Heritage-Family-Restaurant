"use client";

import Image from "next/image";
import { CalendarCheck, UtensilsCrossed, Sparkles, Clock, MapPin, Gift, Flame } from "lucide-react";
import { atmosphereImages } from "@/data/restaurantData";
import { sundayEvent } from "@/data/eventData";

export default function Hero({ onOpenReservation }) {
  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-28 sm:pt-32 pb-14 sm:pb-20"
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0d] via-[#0c0c0d]/85 to-[#0c0c0d]/65" />
        <div className="absolute inset-0 bg-black/50" />

        {/* Subtle radial amber glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[350px] sm:h-[700px] bg-[#cba158]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center min-h-[75vh] sm:min-h-[82vh]">
        <div className="my-auto py-6 sm:py-10 max-w-4xl">
          
          {/* Top Event Tag / Announcement Pill */}
          <div className="inline-flex items-center gap-2 bg-[#cba158]/15 border border-[#cba158]/40 px-3.5 py-1.5 rounded-full backdrop-blur-md mb-4 sm:mb-5 shadow-lg shadow-[#cba158]/10 animate-fade-in">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cba158] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cba158]" />
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#cba158]">
              {sundayEvent.badge}
            </span>
          </div>

          {/* Main Event Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#f4ede4] leading-[1.08] select-none">
            The Grand Sunday <span className="text-[#cba158] font-light">Heritage Feast</span> &amp; Live Music Gala
          </h1>

          {/* Subtitle / Restaurant Anchor */}
          <p className="font-serif text-base sm:text-xl lg:text-2xl text-neutral-200 font-light mt-3 sm:mt-4 italic">
            Presented by Mahalakshmi Spice Heritage Family Restaurant
          </p>

          {/* Rich Description */}
          <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm lg:text-base text-neutral-300 font-light leading-relaxed max-w-3xl">
            {sundayEvent.heroSubtitle}
          </p>

          {/* Event Metadata Matrix Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mt-6 max-w-3xl">
            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#cba158] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-light">Date</span>
                <span className="text-xs text-[#f4ede4] font-medium truncate block">Sunday, Nov 29</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-[#cba158] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-light">Sessions</span>
                <span className="text-xs text-[#f4ede4] font-medium truncate block">Lunch &amp; Dinner</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-sm">
              <MapPin className="w-4 h-4 text-[#cba158] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-light">Seating</span>
                <span className="text-xs text-[#f4ede4] font-medium truncate block">Cabana &amp; AC Hall</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-black/60 border border-[#cba158]/30 backdrop-blur-sm">
              <Gift className="w-4 h-4 text-[#cba158] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-[#cba158] block font-light">Pre-Book Perk</span>
                <span className="text-xs text-[#f4ede4] font-medium truncate block">Free Royal Platter</span>
              </div>
            </div>
          </div>

          {/* Buttons: Book Event Table & Explore Highlights */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md sm:max-w-none">
            <button
              onClick={onOpenReservation}
              className="bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 sm:py-4 rounded-xl transition duration-200 shadow-xl shadow-[#cba158]/20 text-center flex items-center justify-center gap-2 active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              Book Sunday Event Table
            </button>
            <a
              href="#sunday-event"
              className="border border-white/20 hover:border-[#cba158] hover:text-[#cba158] text-neutral-200 text-xs sm:text-sm uppercase tracking-widest px-7 py-3.5 sm:py-4 rounded-xl transition duration-200 backdrop-blur-sm bg-black/40 text-center flex items-center justify-center gap-2 active:scale-95"
            >
              <Flame className="w-4 h-4 text-[#cba158]" />
              Explore Event Highlights
            </a>
          </div>

          {/* Urgency Callout */}
          <div className="mt-4 flex items-center gap-2 text-[11px] sm:text-xs text-neutral-400 font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cba158]" />
            <span>{sundayEvent.urgencyNotice}</span>
          </div>

        </div>
      </div>
    </section>
  );
}
