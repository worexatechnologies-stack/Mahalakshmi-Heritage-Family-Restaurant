"use client";

import { useState } from "react";
import Image from "next/image";
import { signatureDishes } from "@/data/restaurantData";
import { Eye, Star } from "lucide-react";
import ThreeDTiltCard from "./ThreeDTiltCard";

export default function ThreeDDishExperience({ onSelectDish }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const dish = signatureDishes[selectedIdx];

  const showcaseDishes = signatureDishes.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-[#09090b] relative overflow-hidden border-t border-white/5">
      {/* 3D Radial Background Stage Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[800px] h-[350px] sm:h-[600px] bg-[#cba158]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4]">
            Interactive 3D Tasting Showcase
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 sm:mt-3 font-light">
            Explore our signature delicacies in interactive 3D perspective. Hover and tilt to reveal culinary craftsmanship and ingredients.
          </p>
        </div>

        {/* 3D Main Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Dish Switcher Tabs - Horizontal swipe on mobile, vertical stack on desktop */}
          <div className="lg:col-span-4">
            <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#cba158] font-semibold block mb-2 sm:mb-3">
              Select Signature Creation
            </span>

            <div className="flex lg:flex-col overflow-x-auto no-scrollbar gap-2.5 sm:gap-3 pb-2 lg:pb-0 -mx-1 px-1">
              {showcaseDishes.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex-shrink-0 lg:w-full text-left p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 group ${
                    selectedIdx === idx
                      ? "bg-[#18181d] border-[#cba158] shadow-xl shadow-[#cba158]/10"
                      : "bg-[#111114] border-white/5 hover:border-white/20 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="whitespace-nowrap lg:whitespace-normal">
                      <h4 className={`text-xs sm:text-sm font-serif ${selectedIdx === idx ? "text-white font-bold" : "text-neutral-300"}`}>
                        {item.name}
                      </h4>
                      <span className="text-[10px] sm:text-xs text-[#cba158] block mt-0.5">{item.price} &bull; {item.category}</span>
                    </div>
                  </div>

                  <div className={`hidden lg:block w-2 h-2 rounded-full ${selectedIdx === idx ? "bg-[#cba158] ring-4 ring-[#cba158]/20" : "bg-neutral-700"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* 3D Interactive Platter Spotlight (8 cols) */}
          <div className="lg:col-span-8">
            <ThreeDTiltCard
              maxTilt={8}
              scale={1.01}
              className="bg-gradient-to-b from-[#16161a] to-[#0f0f12] border border-[#cba158]/50 sm:border-2 rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl shadow-black relative overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
                
                {/* 3D Floating Dish Plate */}
                <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  {/* Floating Pill Badge */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-black/80 backdrop-blur-md p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-white/15 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#cba158] block font-bold">Preparation</span>
                      <span className="text-[11px] sm:text-xs text-white font-medium">Clay Tandoor Live Embers</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold font-serif text-[#cba158]">{dish.price}</span>
                  </div>
                </div>

                {/* Dish Information */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold">
                      {dish.category}
                    </span>
                    <h3 className="text-xl sm:text-3xl font-serif text-white mt-1">
                      {dish.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#cba158] mt-1.5">
                      <Star className="w-3.5 h-3.5 fill-[#cba158]" />
                      <span className="font-bold">{dish.rating}</span>
                      <span className="text-neutral-400">({dish.reviewsCount} family reviews)</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                    {dish.description}
                  </p>

                  {/* 3D Ingredient Depth Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-black/50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/10">
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 block uppercase tracking-wider">Nutrition</span>
                      <span className="font-semibold text-white text-[11px] sm:text-xs">{dish.calories}</span>
                    </div>
                    <div className="bg-black/50 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-white/10">
                      <span className="text-[9px] sm:text-[10px] text-neutral-400 block uppercase tracking-wider">Allergens</span>
                      <span className="font-semibold text-white text-[11px] sm:text-xs truncate block">{dish.allergens.join(", ")}</span>
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="pt-1 sm:pt-2">
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
