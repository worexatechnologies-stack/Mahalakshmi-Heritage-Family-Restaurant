"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Clock, ChefHat, Flame, ChevronRight, Eye, X } from "lucide-react";
import { recipesList, kitchenSecrets } from "@/data/restaurantData";

export default function RecipesSpecials({ onSelectDish }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(recipesList[0]);

  const filteredRecipes = recipesList.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.flavorProfile && recipe.flavorProfile.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // If the active selected recipe is filtered out, fall back to first filtered item
  const activeDish = filteredRecipes.find((r) => r.id === selectedRecipe?.id) || filteredRecipes[0] || recipesList[0];

  return (
    <section id="recipes" className="py-10 sm:py-14 lg:py-16 bg-[#0a0a0c] relative border-t border-white/5">
      {/* Anchor for backward compatibility */}
      <div id="kitchen-secrets" className="absolute -top-20" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Compact & Centered) */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#cba158] font-semibold bg-[#cba158]/10 px-3 py-1 rounded-full border border-[#cba158]/20 mb-2.5">
            <Flame className="w-3 h-3 text-[#cba158]" />
            Heritage Kitchen Secrets
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f4ede4] tracking-tight">
            {kitchenSecrets.title}
          </h2>
          <div className="w-12 h-0.5 bg-[#cba158] mx-auto my-2.5" />
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Time-honoured techniques, authentic clay-tandoor embers, and aromatic spice craft behind Mahalakshmi&apos;s most celebrated recipes.
          </p>
        </div>

        {/* Master Console: Zero-Waste Unified Grid */}
        <div className="bg-[#121215] border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
            
            {/* Left Column: Interactive Recipe Index (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div>
                {/* Search Bar with Quick Reset */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search recipes (Tandoor, Paneer, Wok)..."
                    className="w-full bg-[#16161a] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-[#f4ede4] placeholder-neutral-500 focus:outline-none focus:border-[#cba158] transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Recipe Selection List */}
                <div className="space-y-2">
                  {filteredRecipes.length > 0 ? (
                    filteredRecipes.map((item) => {
                      const isSelected = activeDish.id === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedRecipe(item)}
                          className={`group flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "bg-[#1c1c22] border-[#cba158]/80 shadow-md shadow-[#cba158]/10"
                              : "bg-[#161619] border-white/5 hover:border-white/20 hover:bg-[#18181d]"
                          }`}
                        >
                          {/* Mini Thumbnail */}
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="56px"
                            />
                          </div>

                          {/* Info Column */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-[#cba158] truncate">
                                {item.category}
                              </span>
                              <span className="text-[10px] text-neutral-400 flex items-center gap-1 font-light flex-shrink-0">
                                <Clock className="w-2.5 h-2.5 text-[#cba158]/70" />
                                {item.prepTime}
                              </span>
                            </div>

                            <h3 className="text-xs sm:text-sm font-serif font-medium text-[#f4ede4] truncate group-hover:text-white">
                              {item.name}
                            </h3>

                            <p className="text-[11px] text-neutral-400 truncate font-light mt-0.5">
                              {item.flavorProfile || item.secret}
                            </p>
                          </div>

                          {/* Right Arrow / Active Indicator */}
                          <div className="flex-shrink-0">
                            <ChevronRight
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isSelected ? "text-[#cba158] translate-x-0.5" : "text-neutral-600 group-hover:text-neutral-400"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 bg-[#161619] rounded-xl border border-white/5 text-neutral-400 text-xs">
                      <p>No dishes found matching &quot;{searchQuery}&quot;</p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="mt-2 text-[#cba158] text-[11px] underline underline-offset-4"
                      >
                        Reset search
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Authentic Cooking Note */}
              <div className="pt-2">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-[11px] text-neutral-400 font-light">
                  <ChefHat className="w-3.5 h-3.5 text-[#cba158] flex-shrink-0" />
                  <span className="truncate">
                    Prepared live using authentic clay tandoors and slow embers.
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Recipe Spotlight & Detailed Profile (7 cols) */}
            <div className="lg:col-span-7 bg-[#16161b] border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
              
              {/* Dish Visual Header with Badges */}
              <div 
                className="relative aspect-[16/9] w-full rounded-xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer"
                onClick={() => onSelectDish && onSelectDish(activeDish)}
                title="Click to view detailed dish profile"
              >
                <Image
                  src={activeDish.image}
                  alt={activeDish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 650px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                
                {/* Floating Category Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-semibold text-[#cba158] uppercase tracking-wider border border-[#cba158]/30">
                  {activeDish.category}
                </div>

                {/* Floating Specs Badges */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  <span className="bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-neutral-300 font-light border border-white/10 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5 text-[#cba158]" />
                    {activeDish.prepTime}
                  </span>
                  <span className="bg-[#cba158]/90 text-black px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {activeDish.difficulty}
                  </span>
                </div>

                {/* Hover to inspect prompt */}
                <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-[#f4ede4] border border-white/20 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-[#cba158]" />
                  <span>Inspect Dish</span>
                </div>
              </div>

              {/* Recipe Information Body */}
              <div className="space-y-3">
                {/* Title & Flavor Profile */}
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <h3 className="text-lg sm:text-xl font-serif text-[#f4ede4] font-semibold">
                    {activeDish.name}
                  </h3>
                  {activeDish.flavorProfile && (
                    <span className="text-[11px] text-[#cba158] font-light">
                      Taste: {activeDish.flavorProfile}
                    </span>
                  )}
                </div>

                {/* Short Story */}
                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {activeDish.shortDesc}
                </p>

                {/* 3-Pill Quick Specs Matrix */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-light">Prep Time</span>
                    <span className="text-xs text-[#f4ede4] font-medium">{activeDish.prepTime}</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-light">Mastery Tier</span>
                    <span className="text-xs text-[#cba158] font-medium">{activeDish.difficulty}</span>
                  </div>
                  <div className="bg-black/40 border border-white/5 rounded-lg p-2 text-center">
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-light">Style</span>
                    <span className="text-xs text-[#f4ede4] font-medium">{activeDish.category.split(" ")[0]}</span>
                  </div>
                </div>

                {/* Heritage Secret Callout Box */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-[#1c1a14] to-[#141418] border border-[#cba158]/35 flex items-start gap-2.5">
                  <ChefHat className="w-4 h-4 text-[#cba158] flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#cba158] font-bold block mb-0.5">
                      Heritage Preparation Secret
                    </span>
                    <p className="text-xs text-neutral-200 font-light leading-relaxed">
                      {activeDish.secret}
                    </p>
                  </div>
                </div>

                {/* Key Ingredients Chips */}
                {activeDish.ingredients && activeDish.ingredients.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider mr-1 font-light">
                      Key Notes:
                    </span>
                    {activeDish.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/5 font-light"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => onSelectDish && onSelectDish(activeDish)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#cba158] text-[#0a0a0c] text-xs font-semibold hover:bg-[#d8b068] transition shadow-md shadow-[#cba158]/20"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Explore Dish Details</span>
                </button>
                <a
                  href="#reservations"
                  className="inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-[#f4ede4] text-xs font-medium border border-white/10 transition"
                >
                  Book Table
                </a>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
