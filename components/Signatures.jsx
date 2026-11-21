"use client";

import { useState } from "react";
import Image from "next/image";
import { signatureDishes, menuSectionInfo } from "@/data/restaurantData";
import { Eye, Utensils } from "lucide-react";
import ThreeDTiltCard from "./ThreeDTiltCard";

export default function Signatures({ onSelectDish }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categoryOptions = [
    { name: "All", description: "Explore all of our signature dishes and chef creations." },
    ...menuSectionInfo.categories
  ];

  const filteredDishes =
    activeCategory === "All"
      ? signatureDishes
      : signatureDishes.filter((d) => d.category === activeCategory);

  const activeCategoryInfo = categoryOptions.find((c) => c.name === activeCategory);

  return (
    <section id="menu" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0d] relative">
      {/* Anchor for backward compatibility */}
      <div id="signatures" className="absolute -top-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight">
            {menuSectionInfo.title}
          </h2>

          <div className="w-16 h-0.5 bg-[#cba158] mx-auto my-4" />

          <p className="text-xs sm:text-sm lg:text-base text-neutral-300 font-light leading-relaxed max-w-2xl mx-auto">
            {menuSectionInfo.description}
          </p>

          {/* Filter Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-3 px-2 -mx-2 mt-6">
            {categoryOptions.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider rounded-full transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.name
                    ? "bg-[#cba158] text-[#0c0c0d] font-bold shadow-lg shadow-[#cba158]/20 scale-105"
                    : "bg-[#161619] text-neutral-400 hover:text-white border border-white/5 hover:border-white/20"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Active Category Description Banner */}
          {activeCategoryInfo && activeCategory !== "All" && (
            <div className="mt-4 p-4 rounded-xl bg-[#141418] border border-[#cba158]/25 text-neutral-300 text-xs sm:text-sm font-light max-w-xl mx-auto italic">
              &ldquo;{activeCategoryInfo.description}&rdquo;
            </div>
          )}
        </div>

        {/* 8 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {filteredDishes.map((dish) => (
            <ThreeDTiltCard
              key={dish.id}
              maxTilt={8}
              scale={1.02}
              onClick={() => onSelectDish(dish)}
              className="group cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-2xl bg-[#141418] border border-white/10 hover:border-[#cba158]/60 transition-all duration-300"
            >
              {/* Dish Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-t-2xl overflow-hidden bg-[#18181b]">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Price pill */}
                <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-sm text-xs font-serif text-[#cba158] px-3 py-1 rounded-md border border-[#cba158]/40 font-bold shadow-md">
                  {dish.price}
                </div>

                {/* Category tag */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-[10px] uppercase tracking-wider text-neutral-300 px-2.5 py-1 rounded-md border border-white/10">
                  {dish.category}
                </div>

                {/* Quick view hover icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                  <span className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold bg-[#cba158] text-[#0c0c0d] px-4 py-2 rounded-xl shadow-xl">
                    <Eye className="w-3.5 h-3.5" /> View Recipe & Details
                  </span>
                </div>
              </div>

              {/* Dish Card Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h4 className="text-base sm:text-lg font-serif font-semibold text-[#f4ede4] group-hover:text-[#cba158] transition-colors truncate">
                    {dish.name}
                  </h4>
                  <p className="text-xs text-neutral-400 font-light line-clamp-2 mt-1 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>
            </ThreeDTiltCard>
          ))}
        </div>

        {/* Button: Explore Full Menu */}
        <div className="mt-12 sm:mt-16 text-center">
          <a
            href="/recipes"
            className="inline-flex items-center gap-2 bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-3.5 rounded-xl transition duration-200 shadow-xl shadow-[#cba158]/20"
          >
            <Utensils className="w-4 h-4" />
            {menuSectionInfo.buttonText}
          </a>
        </div>

      </div>
    </section>
  );
}
