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
    <section className="py-14 bg-[#101012] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item) => {
            const Icon = iconMap[item.icon] || Leaf;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition duration-200 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#18181c] border border-[#cba158]/30 flex items-center justify-center flex-shrink-0 text-[#cba158] group-hover:border-[#cba158] group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#f4ede4] group-hover:text-[#cba158] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
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
