"use client";

import { Leaf, UtensilsCrossed, Clock, ShoppingBag } from "lucide-react";
import { features } from "@/data/restaurantData";

const iconMap = {
  Leaf: Leaf,
  UtensilsCrossed: UtensilsCrossed,
  Clock: Clock,
  ShoppingBag: ShoppingBag,
};

export default function FeatureBar() {
  return (
    <section className="py-10 sm:py-14 bg-[#101012] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <div
                key={item.id}
                className="flex items-start gap-3.5 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-white/[0.02] transition duration-200 group bg-[#131316]/40 sm:bg-transparent border border-white/5 sm:border-transparent"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#18181c] border border-[#cba158]/30 flex items-center justify-center flex-shrink-0 text-[#cba158] group-hover:border-[#cba158] group-hover:scale-105 transition-all duration-300">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-[#f4ede4] group-hover:text-[#cba158] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed">
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
