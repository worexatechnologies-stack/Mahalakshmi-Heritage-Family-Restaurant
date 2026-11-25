"use client";

import Image from "next/image";
import { Flame, Utensils, Music, Sparkles, ArrowRight, ShieldCheck, Clock, Users } from "lucide-react";
import { sundayEvent } from "@/data/eventData";

const iconMap = {
  Flame: Flame,
  Utensils: Utensils,
  Music: Music,
  Sparkles: Sparkles
};

export default function EventHighlights({ onOpenReservation }) {
  return (
    <section id="sunday-event" className="py-12 sm:py-16 lg:py-20 bg-[#0c0c0e] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#cba158] font-semibold bg-[#cba158]/10 px-3 py-1 rounded-full border border-[#cba158]/20 mb-3">
            <Sparkles className="w-3 h-3 text-[#cba158]" />
            What to Expect This Sunday
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight">
            An Unforgettable Royal Sunday at Mahalakshmi
          </h2>
          <div className="w-14 h-0.5 bg-[#cba158] mx-auto my-3" />
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
            Step into an immersive celebration of authentic flavours, live flame roasting, and soulful melodies crafted for families, couples, and food connoisseurs.
          </p>
        </div>

        {/* 4 Bento Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-14">
          {sundayEvent.highlights.map((item) => {
            const IconComponent = iconMap[item.icon] || Sparkles;
            return (
              <div
                key={item.id}
                className="group relative bg-[#131317] border border-white/10 hover:border-[#cba158]/60 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#cba158]/10 flex flex-col justify-between"
              >
                {/* Visual Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131317] via-black/30 to-black/20" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] sm:text-xs font-semibold text-[#cba158] uppercase tracking-wider border border-[#cba158]/30 flex items-center gap-1.5">
                    <IconComponent className="w-3 h-3 text-[#cba158]" />
                    <span>{item.badge}</span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 sm:p-6 space-y-2.5">
                  <h3 className="text-lg sm:text-xl font-serif text-[#f4ede4] group-hover:text-[#cba158] transition duration-200">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Quick Stat Pills */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl bg-[#141419] border border-white/10 shadow-lg">
          {sundayEvent.stats.map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="font-serif text-xl sm:text-3xl text-[#cba158] font-bold block mb-0.5">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-wider font-light">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
