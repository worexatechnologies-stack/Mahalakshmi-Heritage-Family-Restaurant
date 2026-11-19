"use client";

import { useState } from "react";
import Image from "next/image";
import { signatureDishes } from "@/data/restaurantData";
import { Eye } from "lucide-react";
import ThreeDTiltCard from "./ThreeDTiltCard";

export default function Signatures({ onSelectDish }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Tandoor Specials", "Starters", "Chef Specials"];

  const filteredDishes =
    activeCategory === "All"
      ? signatureDishes
      : signatureDishes.filter((d) => d.category === activeCategory);

  return (
    <section id="signatures" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold">
            Dishes Crafted With Heritage & Care
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] mt-1.5 mb-3">
            Spice Heritage Signatures
          </h2>
          <div className="w-14 sm:w-16 h-0.5 bg-[#cba158] mx-auto mb-6" />

          {/* Filter Pills - Swipeable on mobile without scrollbar */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1 px-2 -mx-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#cba158] text-[#0c0c0d] font-bold shadow-md shadow-[#cba158]/20"
                    : "bg-[#161619] text-neutral-400 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Card Grid - 1 col on mobile, 2 on sm/md, 4 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {filteredDishes.map((dish) => (
            <ThreeDTiltCard
              key={dish.id}
              maxTilt={8}
              scale={1.02}
              onClick={() => onSelectDish(dish)}
              className="group cursor-pointer flex flex-col rounded-xl overflow-hidden shadow-xl"
            >
              {/* Dish Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-t-xl overflow-hidden bg-[#18181b] border-t border-x border-[#2c2c30]">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Price pill */}
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-sm text-xs font-serif text-[#cba158] px-2.5 py-1 rounded-md border border-[#cba158]/40 font-bold shadow-md">
                  {dish.price}
                </div>

                {/* Quick view hover icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[2px]">
                  <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold bg-[#cba158] text-[#0c0c0d] px-3.5 py-2 rounded-lg shadow-xl">
                    <Eye className="w-3.5 h-3.5" /> View Delicacy
                  </span>
                </div>
              </div>

              {/* Dish Name Label (Cream banner matching screenshot) */}
              <div className="bg-[#e4cdb4] text-[#1a1714] px-3.5 py-3 rounded-b-xl text-center border-b border-x border-[#d1b79c] group-hover:bg-[#f0dfcc] transition-colors duration-200">
                <h4 className="text-xs sm:text-sm font-serif font-semibold tracking-wide truncate">
                  {dish.name}
                </h4>
              </div>
            </ThreeDTiltCard>
          ))}
        </div>

        {/* Bottom Menu Callout */}
        <div className="mt-10 sm:mt-14 text-center px-4">
          <p className="text-xs text-neutral-400 mb-2.5">
            All our tandoori delicacies and curries are crafted using cold-pressed oils and stone-ground heritage masalas.
          </p>
          <a
            href="#recipes"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#cba158] hover:text-[#e4c489] transition font-semibold"
          >
            Explore Kitchen Secrets & Recipes &rarr;
          </a>
        </div>

      </div>
    </section>
  );
}
