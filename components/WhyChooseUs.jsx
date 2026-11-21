"use client";

import { Flame, ShieldCheck, Award, Users, HeartHandshake, CheckCircle } from "lucide-react";
import { whyChooseUs } from "@/data/restaurantData";

const featureIcons = [
  ShieldCheck,
  Flame,
  Award,
  Users,
  HeartHandshake
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="py-16 sm:py-24 lg:py-32 bg-[#09090b] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight leading-tight">
            {whyChooseUs.title}
          </h2>

          <div className="w-16 h-0.5 bg-[#cba158] mx-auto my-5" />

          <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
            {whyChooseUs.description}
          </p>
        </div>

        {/* 5 Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {whyChooseUs.points.map((item, idx) => {
            const Icon = featureIcons[idx % featureIcons.length];
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#131317] border border-white/5 hover:border-[#cba158]/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#1c1c22] border border-[#cba158]/30 text-[#cba158] flex items-center justify-center mb-4 group-hover:bg-[#cba158] group-hover:text-black transition-all duration-300 shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-[#f4ede4] group-hover:text-[#cba158] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs text-[#cba158]/90">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="text-[11px] uppercase tracking-wider font-semibold">MSH Quality Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
