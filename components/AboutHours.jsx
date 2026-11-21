"use client";

import Image from "next/image";
import { Award } from "lucide-react";
import { restaurantInfo, atmosphereImages } from "@/data/restaurantData";

export default function AboutHours() {
  const { about } = restaurantInfo;

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight leading-tight">
              {about.title}
            </h2>

            <p className="text-lg sm:text-xl font-serif text-[#cba158] font-light">
              {about.subtitle}
            </p>

            {/* 3 Authentic Paragraphs verbatim */}
            <div className="space-y-4 text-neutral-300 text-xs sm:text-sm lg:text-base leading-relaxed font-light">
              {about.paragraphs.map((p, idx) => (
                <p key={idx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Right Image Column (5 cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative h-[320px] sm:h-[460px] lg:h-[520px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={atmosphereImages.diningDiners}
                alt="Authentic traditional feast at Mahalakshmi Spice Heritage"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Subtle badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-[#cba158] uppercase tracking-wider block font-semibold">
                    Traditional Indian Cuisine
                  </span>
                  <span className="text-xs sm:text-sm font-serif text-white">
                    Authentic Recipes & Warm Hospitality
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#cba158]/20 flex items-center justify-center text-[#cba158] flex-shrink-0">
                  <Award className="w-4 h-4 text-[#cba158]" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
