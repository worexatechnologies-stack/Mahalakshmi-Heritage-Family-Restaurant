"use client";

import Image from "next/image";
import { X, CalendarCheck, Utensils, Music, Gift, Compass, Check } from "lucide-react";

export default function EventHighlightsModal({ isOpen, onClose, onBookTable }) {
  if (!isOpen) return null;

  const highlights = [
    {
      icon: Utensils,
      title: "Live Clay Tandoor Stations",
      description: "Watch master chefs roast succulent Royal Tandoori Murgh, Malai Paneer Tikka, and herb-spiced kebabs over glowing earthen embers.",
      badge: "Live Counters",
    },
    {
      icon: Music,
      title: "Live Acoustic & Classical Melodies",
      description: "Immerse your family in soothing acoustic sitar and ambient melodies during our afternoon (1:00 PM) and evening (8:00 PM) sessions.",
      badge: "Live Music",
    },
    {
      icon: Gift,
      title: "Complimentary Royal Platter",
      description: "All guests who pre-book a table receive an assorted chef's tandoor platter and welcome saffron cooler on the house.",
      badge: "Pre-Book Perk",
    },
    {
      icon: Compass,
      title: "Atmospheric Dining Spaces",
      description: "Dine under fairy-lit tropical palms in our garden walkways, reserve an intimate thatched cabana, or enjoy our executive AC hall.",
      badge: "Royal Ambience",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#141416] border border-[#2b2b2e] rounded-2xl p-5 sm:p-8 shadow-2xl text-[#f4ede4] max-h-[92vh] overflow-y-auto my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-neutral-800/60 transition cursor-pointer"
          aria-label="Close highlights"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cba158]/15 border border-[#cba158]/35 mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-[#cba158]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold">
              Sunday Gala Highlights
            </span>
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-serif text-[#f4ede4] uppercase">
            The Grand Sunday Heritage Feast
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-lg mx-auto">
            Everything planned for this one-day royal culinary celebration at Mahalakshmi Spice Heritage.
          </p>
        </div>

        {/* 4 Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#1a1a1d] border border-white/10 hover:border-[#cba158]/40 rounded-xl p-4 transition shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#cba158]/15 text-[#cba158] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[9.5px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-white/5 text-[#cba158] border border-[#cba158]/20">
                      {item.badge}
                    </span>
                  </div>
                  <h4 className="font-serif text-base text-white font-medium mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-300 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Schedule & Info Bar */}
        <div className="bg-[#1f1f24] border border-[#2e2e34] rounded-xl p-3.5 sm:p-4 my-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-neutral-400 block text-[11px]">Event Date &amp; Sessions:</span>
            <span className="text-white font-medium">Sunday, Nov 29 &bull; Lunch (12:30 PM) &amp; Dinner (07:00 PM)</span>
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-medium text-xs">
            <Check className="w-4 h-4" />
            <span>Complimentary Platter Included</span>
          </div>
        </div>

        {/* Action Button: Book Sunday Event Table */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onBookTable();
            }}
            className="flex-1 bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition duration-200 shadow-xl shadow-[#cba158]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Sunday Event Table</span>
          </button>
          <button
            onClick={onClose}
            className="sm:w-auto px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 text-neutral-300 text-xs font-semibold cursor-pointer transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
