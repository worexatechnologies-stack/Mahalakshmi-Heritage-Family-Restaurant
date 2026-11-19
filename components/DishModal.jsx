"use client";

import { X, Star, Flame, ShieldAlert, Heart, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function DishModal({ dish, isOpen, onClose, onOrderDish }) {
  const [ordered, setOrdered] = useState(false);

  if (!isOpen || !dish) return null;

  const handleOrder = () => {
    setOrdered(true);
    if (onOrderDish) {
      onOrderDish(`Added "${dish.name}" to your tasting selection!`);
    }
    setTimeout(() => {
      setOrdered(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#151518] border border-[#2b2b2f] rounded-2xl overflow-hidden shadow-2xl text-[#f4ede4] max-h-[92vh] overflow-y-auto my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Dish Image */}
        <div className="relative h-48 sm:h-64 w-full bg-neutral-900">
          <Image
            src={dish.image}
            alt={dish.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151518] via-transparent to-black/30" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold px-2.5 py-1 bg-[#cba158]/90 text-[#0c0c0d] rounded-md font-sans">
              {dish.category}
            </span>
            <span className="text-xl font-bold text-white font-serif bg-black/60 px-3 py-1 rounded-lg border border-white/10">
              {dish.price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif text-white">{dish.name}</h3>
            <div className="flex items-center gap-1 text-[#cba158] text-sm">
              <Star className="w-4 h-4 fill-[#cba158]" />
              <span className="font-semibold">{dish.rating}</span>
              <span className="text-neutral-500 text-xs">({dish.reviewsCount})</span>
            </div>
          </div>

          <p className="mt-3 text-neutral-300 text-sm leading-relaxed">
            {dish.description}
          </p>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-[#252528] text-xs">
            <div className="flex items-center gap-2 bg-[#1d1d21] p-2.5 rounded-lg border border-[#2b2b2f]">
              <Flame className="w-4 h-4 text-[#cba158]" />
              <div>
                <span className="text-neutral-400 block">Energy</span>
                <span className="font-semibold text-white">{dish.calories || "520 kcal"}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#1d1d21] p-2.5 rounded-lg border border-[#2b2b2f]">
              <ShieldAlert className="w-4 h-4 text-[#cba158]" />
              <div>
                <span className="text-neutral-400 block">Allergens</span>
                <span className="font-semibold text-white">
                  {dish.allergens ? dish.allergens.join(", ") : "None specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleOrder}
              disabled={ordered}
              className={`flex-1 py-3 px-5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                ordered
                  ? "bg-emerald-600 text-white"
                  : "bg-[#cba158] hover:bg-[#d8b067] text-[#0c0c0d]"
              }`}
            >
              {ordered ? (
                <>
                  <Check className="w-4 h-4" /> Added to Tasting!
                </>
              ) : (
                <>Select for Dining Table</>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 text-sm transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
