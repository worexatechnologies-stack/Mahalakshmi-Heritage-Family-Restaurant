"use client";

import Image from "next/image";
import { ArrowRight, Sparkles, Users, Award, HeartHandshake } from "lucide-react";
import { restaurantInfo, atmosphereImages } from "@/data/restaurantData";

export default function DiningExperience({ onOpenReservation }) {
  const { experience } = restaurantInfo;

  return (
    <section id="experience" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          
          {/* Left Column: Banquet Image (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-[280px] sm:h-[420px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={atmosphereImages.banquetHall}
                alt="Mahalakshmi Spice Heritage family dining hall and banquet suite"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              
              {/* Private Dining Info Tag */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 bg-[#121215]/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#cba158]/20 flex items-center justify-center text-[#cba158] flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] text-[#cba158] uppercase tracking-wider block font-semibold truncate">Family Hall & Banquets</span>
                    <span className="text-xs sm:text-sm font-serif text-white truncate block">Up to 75 Guests Capacity</span>
                  </div>
                </div>
                <button
                  onClick={onOpenReservation}
                  className="text-[11px] sm:text-xs uppercase tracking-wider bg-[#cba158] text-[#0c0c0d] font-bold px-3 py-1.5 rounded hover:bg-[#d8b067] transition flex-shrink-0"
                >
                  Reserve
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Experience Story (6 cols) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 mt-4 lg:mt-0">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold">
              {experience.subtitle}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] leading-tight">
              {experience.title}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-neutral-400 text-xs sm:text-base leading-relaxed">
              {experience.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Highlights bullet grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#cba158] flex-shrink-0" />
                <span className="truncate">Royal Heritage Thalis</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#cba158] flex-shrink-0" />
                <span className="truncate">100% Authentic Spices</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#cba158] flex-shrink-0" />
                <span className="truncate">Family Celebration Suites</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#cba158] flex-shrink-0" />
                <span className="truncate">Attentive Hospitality</span>
              </div>
            </div>

            {/* CTA Link */}
            <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6">
              <a
                href="#footer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#cba158] hover:text-[#e4c489] transition font-semibold group"
              >
                <span>Contact us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </a>

              <button
                onClick={onOpenReservation}
                className="text-xs uppercase tracking-widest border border-white/20 hover:border-[#cba158] text-white px-5 py-2.5 rounded transition"
              >
                Plan Family Gathering
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
