"use client";

import Image from "next/image";
import { ArrowRight, Clock, Award } from "lucide-react";
import { restaurantInfo, atmosphereImages } from "@/data/restaurantData";

export default function AboutHours({ onOpenReservation }) {
  const { about } = restaurantInfo;

  return (
    <section id="about" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold">
              {about.subtitle}
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] leading-tight">
              {about.title}
            </h2>

            <p className="text-neutral-400 text-xs sm:text-base leading-relaxed">
              {about.description}
            </p>

            {/* Mahalakshmi Spice Heritage Hours Box */}
            <div className="mt-6 sm:mt-8 pt-6 border-t border-neutral-800/80">
              <h3 className="text-base sm:text-lg font-serif text-[#f4ede4] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#cba158]" />
                Mahalakshmi Spice Heritage Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-[#141416] p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-neutral-400 block font-medium">Monday - Saturday</span>
                  <div className="flex justify-between items-center text-neutral-200">
                    <span>Lunch Service</span>
                    <span className="font-semibold text-[#cba158]">{about.hours.weekday}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-200 pt-1 border-t border-white/5">
                    <span>Dinner Service</span>
                    <span className="font-semibold text-white">{about.hours.dinner}</span>
                  </div>
                </div>

                <div className="bg-[#141416] p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-1.5">
                  <span className="text-neutral-400 block font-medium">Sunday Family Dining</span>
                  <div className="flex justify-between items-center text-neutral-200">
                    <span>All Day Open</span>
                    <span className="font-semibold text-[#cba158]">{about.hours.sunday}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-200 pt-1 border-t border-white/5">
                    <span>Grand Family Feast</span>
                    <span className="font-semibold text-white">{about.hours.happyHour}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Link */}
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
                className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition"
              >
                Reserve Family Table &rarr;
              </button>
            </div>
          </div>

          {/* Right Image Column (5 cols) */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative h-[300px] sm:h-[440px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={atmosphereImages.diningDiners}
                alt="Dining table with royal feasts at Mahalakshmi Spice Heritage"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Subtle badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-[#cba158] uppercase tracking-wider block font-semibold">Stone-Ground Spices & Tandoor</span>
                  <span className="text-xs sm:text-sm font-serif text-white">Authentic Royal Indian Cuisine</span>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#cba158]/20 flex items-center justify-center text-[#cba158] flex-shrink-0">
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
