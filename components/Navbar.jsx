"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar({ onOpenReservation }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Sunday Event", href: "#sunday-event", isSpecial: true },
    { name: "Home", href: "/home" },
    { name: "About", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-9 sm:top-10 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0c0c0d]/95 backdrop-blur-md border-b border-white/10 py-3 sm:py-3.5 shadow-2xl"
          : "bg-gradient-to-b from-black/90 via-black/45 to-transparent py-4 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo */}
          <a href="/home" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#cba158]/70 bg-black flex-shrink-0 group-hover:border-[#cba158] transition">
              <Image
                src="/logo.jpg"
                alt="Mahalakshmi Spice Heritage Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-base sm:text-xl lg:text-2xl font-normal tracking-wide text-[#f4ede4] group-hover:text-[#cba158] transition duration-200 truncate">
                Mahalakshmi
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition truncate">
                Family Restaurant
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-xs lg:text-sm font-normal tracking-wide transition-all ${
                  link.isSpecial
                    ? "px-3 py-1 rounded-full bg-[#cba158]/15 text-[#cba158] border border-[#cba158]/40 font-medium hover:bg-[#cba158] hover:text-[#0c0c0d] shadow-sm shadow-[#cba158]/10"
                    : "text-neutral-300 hover:text-[#cba158]"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action / Book Table Button */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <button
              onClick={onOpenReservation}
              className="border border-[#cba158]/80 hover:border-[#cba158] hover:bg-[#cba158] hover:text-[#0c0c0d] text-[#cba158] text-xs uppercase tracking-widest px-5 py-2.5 rounded transition duration-200 font-medium whitespace-nowrap"
            >
              Book Table
            </button>
          </div>

          {/* Mobile Right Buttons */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={onOpenReservation}
              className="text-[11px] uppercase tracking-wider border border-[#cba158]/70 text-[#cba158] px-2.5 py-1.5 rounded active:bg-[#cba158] active:text-[#0c0c0d] transition font-medium"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-300 hover:text-white p-1.5 rounded-lg active:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#cba158]" /> : <Menu className="w-6 h-6 text-[#cba158]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101013]/98 backdrop-blur-xl border-b border-[#cba158]/25 px-5 py-5 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex flex-col space-y-2.5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm uppercase tracking-wider text-neutral-300 hover:text-[#cba158] py-2 border-b border-neutral-800/60 font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReservation();
            }}
            className="w-full mt-3 bg-[#cba158] text-[#0c0c0d] font-bold text-xs uppercase tracking-widest py-3 rounded text-center active:bg-[#d8b067]"
          >
            Book Family Table
          </button>
        </div>
      )}
    </nav>
  );
}
