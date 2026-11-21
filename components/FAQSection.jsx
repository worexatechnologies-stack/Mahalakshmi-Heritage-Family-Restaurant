"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { faqs } from "@/data/restaurantData";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-16 sm:py-24 lg:py-32 bg-[#0c0c0e] relative overflow-hidden border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#f4ede4] tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="w-16 h-0.5 bg-[#cba158] mx-auto my-4" />

          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto">
            Everything you need to know about dining, specialties, takeaway, and family celebrations at Mahalakshmi Spice Heritage.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#141418] border-[#cba158]/60 shadow-lg shadow-[#cba158]/5"
                    : "bg-[#111114] border-white/5 hover:border-white/15"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#cba158]">
                      0{idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base lg:text-lg font-serif text-[#f4ede4] font-medium">
                      {item.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#cba158] text-black border-[#cba158] rotate-180"
                        : "bg-white/5 text-neutral-400 border-white/10"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-t border-white/5 animate-fade-in pl-11 sm:pl-12">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
