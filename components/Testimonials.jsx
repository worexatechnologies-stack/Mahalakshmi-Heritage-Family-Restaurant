"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews } from "@/data/restaurantData";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 lg:py-32 bg-[#0a0a0c] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Arrows */}
        <div className="flex items-end justify-between mb-8 sm:mb-16 gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4]">
              Spice Heritage Is...
            </h2>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold mt-1.5 block">
              Loved By Families & Guests
            </span>
          </div>

          {/* Carousel Arrows matching screenshot */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={prevSlide}
              aria-label="Previous Review"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-[#cba158] hover:text-[#cba158] text-white flex items-center justify-center transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Review"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 hover:border-[#cba158] hover:text-[#cba158] text-white flex items-center justify-center transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {reviews.map((item, index) => {
            const isHighlighted = index === currentIndex;
            return (
              <div
                key={item.id}
                className={`flex flex-col bg-[#141417] rounded-xl overflow-hidden border transition-all duration-300 ${
                  isHighlighted
                    ? "border-[#cba158]/70 shadow-xl shadow-[#cba158]/5 -translate-y-0.5"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                {/* Dish Photo */}
                <div className="relative aspect-[4/3] sm:aspect-square w-full bg-neutral-900">
                  <Image
                    src={item.image}
                    alt={item.dish}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141417] via-transparent to-transparent" />
                  
                  {/* Rating Stars */}
                  <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1 bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#cba158] text-[#cba158]" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-serif text-white font-semibold">
                      {item.dish}
                    </h4>
                    <p className="text-xs text-neutral-400 italic mt-1.5 line-clamp-3 leading-relaxed">
                      &ldquo;{item.text}&rdquo;
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white block text-[11px] sm:text-xs">{item.author}</span>
                      <span className="text-neutral-500 text-[10px]">{item.role}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-[#cba158] bg-[#cba158]/10 px-2 py-0.5 rounded font-semibold">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
