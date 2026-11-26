"use client";

export default function PromotionalBanner({ onOpenReservation }) {
  const handleSectionClick = () => {
    // Only trigger modal if user is not selecting/copying text
    if (typeof window !== "undefined" && window.getSelection() && window.getSelection().toString().trim().length > 0) {
      return;
    }
    onOpenReservation();
  };

  // A clean, editorial luxury promotional block with creative original copy (all text fully copyable)
  const promoBlock = (
    <div className="flex items-center space-x-6 sm:space-x-10 lg:space-x-12 px-6 sm:px-10 lg:px-12 whitespace-nowrap">
      
      {/* Category / Sub-label */}
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#a69e92] font-medium selection:bg-[#cba158] selection:text-[#0c0c0d]">
        MISSING THAT WEEKEND BUZZ?
      </span>

      <span className="text-[#cba158]/50 text-xs">✦</span>

      {/* Main Core Offer */}
      <div className="flex items-center gap-2 text-xs sm:text-sm lg:text-base tracking-[0.18em] uppercase text-[#f4ede4] selection:bg-[#cba158] selection:text-[#0c0c0d]">
        <span className="font-semibold text-white">1+1 BEER ON TAP</span>
        <span className="text-[#cba158] font-serif italic font-normal px-0.5">&amp;</span>
        <span className="font-semibold text-white">UNLIMITED HERITAGE SPREAD</span>
      </div>

      <span className="text-[#cba158]/50 text-xs">✦</span>

      {/* Price Highlight */}
      <div className="flex items-baseline gap-1.5 tracking-[0.15em] uppercase selection:bg-[#cba158] selection:text-[#0c0c0d]">
        <span className="text-[10.5px] sm:text-xs text-neutral-400 font-light">AT</span>
        <span className="font-serif font-bold text-sm sm:text-base lg:text-lg text-[#cba158]">
          ₹999/-
        </span>
        <span className="text-[10.5px] sm:text-xs text-neutral-400 font-light">ALL-INCLUSIVE</span>
      </div>

      <span className="text-[#cba158]/50 text-xs">✦</span>

      {/* Slogan from creative interpretation */}
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#e0baa2] font-serif italic selection:bg-[#cba158] selection:text-[#0c0c0d]">
        COME HUNGRY, LEAVE HAPPY!
      </span>

      <span className="text-[#cba158]/50 text-xs">✦</span>

      {/* Understated Minimal Action Link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenReservation();
        }}
        className="group inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#f4ede4] hover:text-[#cba158] transition-colors duration-200 cursor-pointer underline underline-offset-8 decoration-[#cba158]/50 hover:decoration-[#cba158] font-medium"
      >
        <span>CLAIM OFFER</span>
        <span className="text-[#cba158] transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
      </button>

      <span className="text-[#cba158]/30 text-xs">✦</span>

    </div>
  );

  return (
    <section
      onClick={handleSectionClick}
      className="relative w-full bg-[#0e0e10] border-y border-[#cba158]/20 py-3.5 sm:py-4 overflow-hidden cursor-pointer transition-colors duration-300 hover:bg-[#121215]"
      title="Click to reserve table or select text to copy"
    >
      {/* Subtle Dark Vignette Fades at Edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0c0c0d] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0c0c0d] to-transparent z-10" />

      {/* Continuous Right-to-Left Sliding Marquee Track */}
      <div className="animate-slide-left flex items-center">
        {promoBlock}
        {promoBlock}
        {promoBlock}
        {promoBlock}
        {promoBlock}
        {promoBlock}
      </div>
    </section>
  );
}
