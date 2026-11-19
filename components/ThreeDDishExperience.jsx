"use client";

import { useState } from "react";
import Image from "next/image";
import { signatureDishes } from "@/data/restaurantData";
import { Rotate3d, Flame, Eye, Sparkles, Star } from "lucide-react";
import ThreeDTiltCard from "./ThreeDTiltCard";

export default function ThreeDDishExperience({ onSelectDish }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dish = signatureDishes[selectedIdx];

  const showcaseDishes = signatureDishes.slice(0, 4);

  return (
    <section className="py-24 sm:py-32 bg-[#09090b] relative overflow-hidden border-t border-white/5">
      {/* 3D Radial Background Stage Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#cba158]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#cba158]/40 text-[#cba158] text-xs uppercase tracking-widest mb-3 shadow-lg">
            <Rotate3d className="w-3.5 h-3.5" /> 3D Culinary Experience
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#f4ede4]">
            Interactive 3D Tasting Showcase
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-3 font-light">
            Explore our signature delicacies in interactive 3D perspective. Hover and tilt to reveal culinary craftsmanship and ingredients.
          </p>
        </div>

        {/* 3D Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Dish Switcher Tabs (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#cba158] font-semibold block mb-2">
              Select Signature Creation
            </span>

            {showcaseDishes.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${
                  selectedIdx === idx
                    ? "bg-[#18181d] border-[#cba158] shadow-xl shadow-[#cba158]/10 -translate-y-0.5"
                    : "bg-[#111114] border-white/5 hover:border-white/20 text-neutral-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-serif font-medium ${selectedIdx === idx ? "text-white font-bold" : "text-neutral-300"}`}>
                      {item.name}
                    </h4>
                    <span className="text-xs text-[#cba158] block mt-0.5">{item.price} &bull; {item.category}</span>
                  </div>
                </div>

                <div className={`w-2 h-2 rounded-full ${selectedIdx === idx ? "bg-[#cba158] ring-4 ring-[#cba158]/20" : "bg-neutral-700"}`} />
              </button>
            ))}
          </div>

          {/* 3D Interactive Platter Spotlight (8 cols) */}
          <div className="lg:col-span-8">
            <ThreeDTiltCard
              maxTilt={14}
              scale={1.03}
              className="bg-gradient-to-b from-[#16161a] to-[#0f0f12] border-2 border-[#cba158]/50 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-black relative overflow-hidden"
            >
              {/* 3D Decorative Stage Lighting Ring */}
              <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* 3D Floating Dish Plate */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* 3D Floating Pill Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#cba158] block font-bold">Preparation</span>
                      <span className="text-xs text-white font-medium">Clay Tandoor Live Embers</span>
                    </div>
                    <span className="text-sm font-bold font-serif text-[#cba158]">{dish.price}</span>
                  </div>
                </div>

                {/* Dish Information & 3D Layer Details */}
                <div className="space-y-5">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#cba158] font-bold">
                      {dish.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                      {dish.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#cba158] mt-2">
                      <Star className="w-3.5 h-3.5 fill-[#cba158]" />
                      <span className="font-bold">{dish.rating}</span>
                      <span className="text-neutral-400">({dish.reviewsCount} family reviews)</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                    {dish.description}
                  </p>

                  {/* 3D Ingredient Depth Badges */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Nutrition</span>
                      <span className="font-semibold text-white">{dish.calories}</span>
                    </div>
                    <div className="bg-black/50 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] text-neutral-400 block uppercase tracking-wider">Allergens</span>
                      <span className="font-semibold text-white">{dish.allergens.join(", ")}</span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => onSelectDish(dish)}
                      className="w-full bg-[#cba158] hover:bg-[#d8b067] text-[#0c0c0d] font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#cba158]/20"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Inspect Full Recipe Details</span>
                    </button>
                  </div>
                </div>

              </div>

            </ThreeDTiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
