"use client";

import Image from "next/image";
import { ArrowRight, Clock, MapPin, Phone, Users, Award } from "lucide-react";
import { restaurantInfo, atmosphereImages } from "@/data/restaurantData";

export default function AboutHours({ onOpenReservation }) {
  const { about } = restaurantInfo;

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0c0c0d] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#cba158] font-semibold">
              {about.subtitle}
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] leading-tight">
              {about.title}
            </h2>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              {about.description}
            </p>

            {/* Mahalakshmi Spice Heritage Hours Box */}
            <div className="mt-8 pt-6 border-t border-neutral-800/80">
              <h3 className="text-lg font-serif text-[#f4ede4] mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#cba158]" />
                Mahalakshmi Spice Heritage Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-[#141416] p-4 rounded-xl border border-white/5 space-y-1">
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

                <div className="bg-[#141416] p-4 rounded-xl border border-white/5 space-y-1">
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
            <div className="pt-4 flex items-center gap-6">
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
          <div className="lg:col-span-5 relative">
            <div className="relative h-[440px] sm:h-[520px] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image
                src={atmosphereImages.diningDiners}
                alt="Dining table with royal feasts at Mahalakshmi Spice Heritage"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Subtle badge overlay */}
              <div className="absolute bottom-5 left-5 right-5 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#cba158] uppercase tracking-wider block font-medium">Stone-Ground Spices & Tandoor</span>
                  <span className="text-sm font-serif text-white">Authentic Royal Indian Cuisine</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#cba158]/20 flex items-center justify-center text-[#cba158]">
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
