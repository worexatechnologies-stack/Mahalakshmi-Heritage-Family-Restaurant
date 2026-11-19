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
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Menu", href: "#signatures" },
    { name: "Recipes", href: "#recipes" },
    { name: "Gallery", href: "#experience" },
    { name: "Contact", href: "#footer" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0c0c0d]/92 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl"
          : "bg-gradient-to-b from-black/85 via-black/40 to-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#cba158]/60 bg-black flex-shrink-0 group-hover:border-[#cba158] transition">
              <Image
                src="/logo.jpg"
                alt="Mahalakshmi Spice Heritage Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-2xl font-normal tracking-wide text-[#f4ede4] group-hover:text-[#cba158] transition duration-200">
                Mahalakshmi <span className="font-serif italic text-[#cba158] font-normal">&</span> Heritage
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition">
                Family Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links matching reference screenshot */}
          <div className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-normal text-neutral-300 hover:text-[#cba158] transition-colors tracking-wide"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Action / Book Table Button matching screenshot */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenReservation}
              className="border border-[#cba158]/70 hover:border-[#cba158] hover:bg-[#cba158] hover:text-[#0c0c0d] text-[#cba158] text-xs uppercase tracking-widest px-5 py-2.5 rounded transition duration-200 font-medium"
            >
              Book Table
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenReservation}
              className="text-xs uppercase tracking-wider border border-[#cba158]/60 text-[#cba158] px-3 py-1.5 rounded"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-300 hover:text-white p-2"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#cba158]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101014] border-b border-white/10 px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base text-neutral-300 hover:text-[#cba158] py-1 border-b border-neutral-800/60"
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
            className="w-full mt-4 bg-[#cba158] text-[#0c0c0d] font-semibold text-sm uppercase tracking-widest py-3 rounded text-center"
          >
            Book Table
          </button>
        </div>
      )}
    </nav>
  );
}
