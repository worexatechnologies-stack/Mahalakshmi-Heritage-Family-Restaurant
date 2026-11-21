"use client";

import { Leaf, Flame, Heart, ShoppingBag } from "lucide-react";
import { features, restaurantHighlights } from "@/data/restaurantData";

const iconMap = {
  Leaf: Leaf,
  UtensilsCrossed: Flame,
  Heart: Heart,
  ShoppingBag: ShoppingBag,
};

export default function FeatureBar() {
  return (
    <section className="py-14 sm:py-20 bg-[#101012] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight">
            {restaurantHighlights.title}
          </h2>

          <p className="text-sm sm:text-base font-serif text-[#cba158] mt-2 font-light">
            {restaurantHighlights.subtitle}
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <div
                key={item.id}
                className="flex flex-col items-start gap-3.5 p-5 sm:p-6 rounded-2xl bg-[#141418] border border-white/5 hover:border-[#cba158]/40 transition duration-300 group hover:-translate-y-1 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1c1c22] border border-[#cba158]/30 flex items-center justify-center flex-shrink-0 text-[#cba158] group-hover:border-[#cba158] group-hover:bg-[#cba158] group-hover:text-black transition-all duration-300 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-serif font-semibold text-[#f4ede4] group-hover:text-[#cba158] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
