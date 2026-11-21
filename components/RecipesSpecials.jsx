"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Clock, ChefHat } from "lucide-react";
import { recipesList, kitchenSecrets } from "@/data/restaurantData";

export default function RecipesSpecials({ onSelectDish }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(recipesList[0]);

  const filteredRecipes = recipesList.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="recipes" className="py-16 sm:py-24 lg:py-32 bg-[#0e0e11] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Search & Recipe List (6 cols) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight">
                {kitchenSecrets.title}
              </h2>

              <div className="space-y-3 mt-4 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                {kitchenSecrets.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Recipes (Tandoori, Paneer, Chicken, Wok)..."
                className="w-full bg-[#161619] border border-[#2b2b2f] rounded-xl pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm text-[#f4ede4] placeholder-neutral-500 focus:outline-none focus:border-[#cba158] transition"
              />
            </div>

            {/* Recipe List */}
            <div className="space-y-3 sm:space-y-4 pt-1">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((item) => {
                  const isSelected = selectedRecipe?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedRecipe(item)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-[#18181c] border-[#cba158]/70 shadow-lg shadow-[#cba158]/10"
                          : "bg-[#131315] border-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-[#cba158]">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-light">
                          <Clock className="w-3 h-3" /> {item.prepTime}
                        </span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-serif text-[#f4ede4]">
                        {item.name}
                      </h3>
                      
                      <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed font-light">
                        {item.shortDesc}
                      </p>

                      {isSelected && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-neutral-300 bg-black/40 p-3 rounded-lg flex items-center gap-2 text-[#e4c489]">
                          <ChefHat className="w-4 h-4 flex-shrink-0 text-[#cba158]" />
                          <span>Heritage Technique: {item.secret}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-neutral-500 text-xs sm:text-sm">
                  No recipes found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Recipe Showcase Card (6 cols) */}
          <div className="lg:col-span-6 sticky top-28">
            <div className="bg-[#141417] border border-[#cba158]/40 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5">
                <Image
                  src={selectedRecipe.image}
                  alt={selectedRecipe.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 rounded-md text-xs font-semibold text-[#cba158] uppercase tracking-wider border border-[#cba158]/30">
                  {selectedRecipe.category}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-serif text-white font-semibold">
                    {selectedRecipe.name}
                  </h3>
                  <span className="text-xs text-[#cba158] uppercase tracking-wider font-bold px-2.5 py-1 bg-[#cba158]/10 rounded-full border border-[#cba158]/30">
                    {selectedRecipe.difficulty}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  {selectedRecipe.shortDesc}
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 mt-3 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-[#cba158] font-bold block">
                    Culinary Preparation Method
                  </span>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {selectedRecipe.secret}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
