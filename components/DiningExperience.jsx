"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
} from "lucide-react";
import { galleryImages } from "@/data/restaurantData";

export default function DiningExperience({ onOpenReservation }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Touch swipe support
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = galleryImages.length;

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Lightbox handlers
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevLightboxImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Keyboard navigation for carousel and lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === "Escape") closeLightbox();
        else if (e.key === "ArrowRight") nextLightboxImage();
        else if (e.key === "ArrowLeft") prevLightboxImage();
      } else {
        if (e.key === "ArrowRight") handleNext();
        else if (e.key === "ArrowLeft") handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, nextLightboxImage, prevLightboxImage, handleNext, handlePrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [lightboxOpen]);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
  };

  const currentLightbox = galleryImages[lightboxIndex];

  return (
    <section
      id="gallery"
      className="py-18 sm:py-24 lg:py-32 bg-[#08080a] relative overflow-hidden select-none border-t border-white/5"
    >
      {/* Anchor for Navbar link */}
      <div id="experience" className="absolute -top-24" />

      {/* Subtle background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#cba158]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ===================== SECTION HEADER ===================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#f4ede4] tracking-tight leading-tight">
            A Glimpse of <span className="text-[#cba158]">Our World</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm lg:text-base text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
            Explore our reception &amp; dining hall, open-air palm garden walkway, cozy private gazebos, and climate-controlled family dining.
          </p>
        </div>

        {/* ===================== SMOOTH HORIZONTAL FILMSTRIP CAROUSEL ===================== */}
        <div
          className="relative w-full overflow-hidden py-4"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slider Viewport */}
          <div className="relative flex items-center justify-center h-[360px] sm:h-[440px] lg:h-[500px]">
            {galleryImages.map((space, idx) => {
              // Calculate relative position (-2, -1, 0, 1, 2)
              let offset = idx - currentIndex;
              if (offset > 2) offset -= total;
              if (offset < -2) offset += total;

              const isCenter = offset === 0;
              const isLeft = offset === -1;
              const isRight = offset === 1;
              const isFarLeft = offset === -2;
              const isFarRight = offset === 2;

              let translateX = 0;
              let scale = 1;
              let opacity = 0;
              let zIndex = 10;
              let pointerEvents = "pointer-events-none";

              if (isCenter) {
                translateX = 0;
                scale = 1;
                opacity = 1;
                zIndex = 30;
                pointerEvents = "pointer-events-auto";
              } else if (isLeft) {
                translateX = -75;
                scale = 0.88;
                opacity = 0.55;
                zIndex = 20;
                pointerEvents = "pointer-events-auto";
              } else if (isRight) {
                translateX = 75;
                scale = 0.88;
                opacity = 0.55;
                zIndex = 20;
                pointerEvents = "pointer-events-auto";
              } else if (isFarLeft) {
                translateX = -140;
                scale = 0.75;
                opacity = 0;
                zIndex = 10;
              } else if (isFarRight) {
                translateX = 140;
                scale = 0.75;
                opacity = 0;
                zIndex = 10;
              }

              return (
                <div
                  key={space.id}
                  onClick={() => {
                    if (isCenter) {
                      openLightbox(idx);
                    } else {
                      setCurrentIndex(idx);
                    }
                  }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${translateX}%), -50%) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: "all 0.55s cubic-bezier(0.25, 1, 0.4, 1)",
                  }}
                  className={`w-[85vw] sm:w-[580px] lg:w-[680px] h-[340px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl group ${pointerEvents} ${
                    isCenter
                      ? "border-2 border-[#cba158] shadow-[0_15px_50px_rgba(203,161,88,0.22)] ring-1 ring-[#cba158]/40"
                      : "border border-white/10 hover:border-[#cba158]/60 hover:opacity-85 shadow-black/80"
                  }`}
                >
                  {/* Photo */}
                  <Image
                    src={space.src}
                    alt={space.alt}
                    fill
                    priority={isCenter}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 600px, 700px"
                  />

                  {/* Dark gradient overlay */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isCenter
                        ? "bg-gradient-to-t from-black/90 via-black/25 to-black/10"
                        : "bg-black/55 group-hover:bg-black/35"
                    }`}
                  />

                  {/* Card Overlay Content */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 flex items-end justify-between pointer-events-none">
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#cba158] font-bold">
                          0{idx + 1} • {space.tag}
                        </span>
                        <span className="text-white/40 text-xs">•</span>
                        <span className="text-[10px] sm:text-xs text-neutral-300 font-light">
                          {space.capacity}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-2xl lg:text-3xl font-serif text-[#f4ede4] group-hover:text-white transition truncate">
                        {space.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-300 mt-1 line-clamp-1 sm:line-clamp-2 font-light max-w-lg">
                        {space.description}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#cba158] flex items-center justify-center flex-shrink-0 group-hover:bg-[#cba158] group-hover:text-black transition duration-200">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Left & Right Clickable Overlay Zones on Side Cards for Desktop */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 sm:w-20 h-full z-25 cursor-pointer bg-gradient-to-r from-[#08080a]/80 to-transparent flex items-center justify-start pl-2 sm:pl-4 opacity-0 hover:opacity-100 transition-opacity"
            title="Previous Photo"
          >
            <div className="w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-lg">
              <ChevronLeft className="w-5 h-5 text-[#cba158]" />
            </div>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 sm:w-20 h-full z-25 cursor-pointer bg-gradient-to-l from-[#08080a]/80 to-transparent flex items-center justify-end pr-2 sm:pl-4 opacity-0 hover:opacity-100 transition-opacity"
            title="Next Photo"
          >
            <div className="w-10 h-10 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-lg">
              <ChevronRight className="w-5 h-5 text-[#cba158]" />
            </div>
          </button>
        </div>

        {/* ===================== SLIDE NAVIGATION DOTS ===================== */}
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2">
          {galleryImages.map((space, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={space.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 sm:w-10 bg-[#cba158] shadow-md shadow-[#cba158]/30"
                    : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
                title={`Go to ${space.title}`}
              />
            );
          })}
        </div>

      </div>

      {/* ===================== FULLSCREEN LIGHTBOX MODAL ===================== */}
      {lightboxOpen && currentLightbox && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#cba158] font-bold block">
                  {currentLightbox.badge}
                </span>
                <span className="text-xs sm:text-sm font-serif text-white">
                  Photo {lightboxIndex + 1} of {total} • {currentLightbox.title}
                </span>
              </div>
            </div>

            <button
              onClick={closeLightbox}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#cba158] text-white hover:text-black flex items-center justify-center transition border border-white/20"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Image Viewer Stage */}
          <div
            className="relative flex-1 flex items-center justify-center px-4 sm:px-14 py-4 z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Nav Button */}
            <button
              onClick={prevLightboxImage}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/75 hover:bg-[#cba158] text-white hover:text-black border border-white/20 flex items-center justify-center transition shadow-2xl z-20"
              title="Previous Photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image */}
            <div className="relative w-full h-full max-h-[72vh] sm:max-h-[78vh] flex items-center justify-center">
              <Image
                src={currentLightbox.src}
                alt={currentLightbox.alt}
                fill
                priority
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </div>

            {/* Right Nav Button */}
            <button
              onClick={nextLightboxImage}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/75 hover:bg-[#cba158] text-white hover:text-black border border-white/20 flex items-center justify-center transition shadow-2xl z-20"
              title="Next Photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar: Caption + 5 Thumbnail Navigation Strip */}
          <div
            className="px-4 sm:px-8 py-4 bg-[#0c0c0d]/95 backdrop-blur-md border-t border-white/10 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Caption */}
              <div className="text-center md:text-left min-w-0">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#cba158] font-bold">
                    {currentLightbox.tag}
                  </span>
                  <span className="text-neutral-500">•</span>
                  <span className="text-[10px] text-neutral-400">
                    {currentLightbox.capacity}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-serif text-white truncate">
                  {currentLightbox.title}
                </h4>
                <p className="text-xs text-neutral-300 max-w-xl line-clamp-1 sm:line-clamp-2 mt-0.5">
                  {currentLightbox.description}
                </p>
              </div>

              {/* 5 Thumbnail Strip */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {galleryImages.map((img, idx) => {
                  const isCurrent = idx === lightboxIndex;
                  return (
                    <button
                      key={img.id}
                      onClick={() => setLightboxIndex(idx)}
                      className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        isCurrent
                          ? "border-[#cba158] ring-2 ring-[#cba158]/50 scale-105"
                          : "border-white/20 opacity-60 hover:opacity-100"
                      }`}
                      title={img.title}
                    >
                      <Image
                        src={img.src}
                        alt={img.title}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
