"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Clock, ChefHat } from "lucide-react";
import { recipesList, atmosphereImages } from "@/data/restaurantData";

export default function RecipesSpecials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(recipesList[0]);

  const filteredRecipes = recipesList.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="recipes" className="py-24 sm:py-32 bg-[#0e0e11] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Search & Recipe List (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#cba158] font-semibold">
                Mahalakshmi Kitchen Secrets
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] mt-2">
                Heritage Recipes & Specials
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                Discover the culinary heritage and artisanal techniques behind our celebrated clay-tandoor recipes and dum biryanis.
              </p>
            </div>

            {/* Search Input Bar matching screenshot */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Recipes (Biryani, Tandoor, Curries, Naan)..."
                className="w-full bg-[#161619] border border-[#2b2b2f] rounded-xl pl-11 pr-4 py-3 text-sm text-[#f4ede4] placeholder-neutral-500 focus:outline-none focus:border-[#cba158] transition"
              />
            </div>

            {/* Recipe List */}
            <div className="space-y-4 pt-2">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((item) => {
                  const isSelected = selectedRecipe?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedRecipe(item)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "bg-[#18181c] border-[#cba158]/60 shadow-lg shadow-[#cba158]/5"
                          : "bg-[#131315] border-white/5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs uppercase tracking-wider font-semibold text-[#cba158]">
                          {item.category}
                        </span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {item.prepTime}
                        </span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg font-serif text-[#f4ede4]">
                        {item.name}
                      </h3>
                      
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {item.shortDesc}
                      </p>

                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-neutral-300 flex items-center justify-between bg-black/30 p-2.5 rounded-lg">
                          <div className="flex items-center gap-1.5 text-[#e4c489]">
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>Heritage Secret: {item.secret}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  No recipes found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Culinary Photo Collage / Grid matching screenshot (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Photo */}
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-white/10 group">
              <Image
                src={selectedRecipe ? selectedRecipe.image : atmosphereImages.kitchenMosaic[0]}
                alt="Mahalakshmi culinary specialty"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#cba158] font-semibold">
                    Master Specialty
                  </span>
                  <h4 className="text-xl font-serif text-white">
                    {selectedRecipe ? selectedRecipe.name : "Authentic Dum Traditions"}
                  </h4>
                </div>
                <div className="px-3 py-1 rounded bg-[#cba158] text-[#0c0c0d] text-xs font-semibold uppercase tracking-wider">
                  Signature
                </div>
              </div>
            </div>

            {/* Bottom 2 Mosaic Photos */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-white/10 group">
                <Image
                  src={atmosphereImages.kitchenMosaic[1]}
                  alt="Tandoori chicken specialty"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90">
                  Clay Tandoor Charcoal
                </div>
              </div>

              <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-white/10 group">
                <Image
                  src={atmosphereImages.kitchenMosaic[2]}
                  alt="Slow simmered rich royal curry"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="300px"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white/90">
                  Slow-Simmered Dal & Curries
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
