"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

// Production Event Target Timestamp: Sunday, Nov 29, 2026 at 23:59:59 IST (+05:30)
// Once this timestamp is reached, the top announcement bar is permanently removed in production.
const EVENT_TARGET_TIMESTAMP = new Date("2026-11-29T23:59:59+05:30").getTime();

export default function Navbar({ onBookTable }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEventExpired, setIsEventExpired] = useState(false);
  
  // Real-time Countdown timer for Sunday Nov 29 event
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const updateCountdown = () => {
      const now = Date.now();
      const difference = EVENT_TARGET_TIMESTAMP - now;

      // When the countdown completes, mark event as expired to remove only this section
      if (difference <= 0) {
        setIsEventExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return false;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      return true;
    };

    // Initial check
    const isRunning = updateCountdown();
    if (!isRunning) {
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const timer = setInterval(() => {
      const active = updateCountdown();
      if (!active) {
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      
      {/* ===================== TOP ANNOUNCEMENT BAR ===================== */}
      {/* Automatically unmounted and removed from the DOM once the countdown reaches 0 in production */}
      {!isEventExpired && (
        <div className="bg-[#14100b]/95 border-b border-[#3d3221]/70 backdrop-blur-md text-[11px] sm:text-xs text-[#e4c489] py-1.5 px-3 sm:px-6 transition-all duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            {/* Left: Event Title with glowing amber dot */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
              </span>
              <span className="tracking-wide uppercase font-medium truncate text-[10px] sm:text-xs">
                <span className="text-[#cba158] font-bold">THIS SUNDAY (NOV 29):</span> Grand Heritage Feast &amp; Live Music Gala
              </span>
            </div>

            {/* Right: Real-time Countdown Timer & Small Book Table Button */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs text-[#f4ede4] bg-black/40 border border-white/10 px-2 py-0.5 rounded">
                <Clock className="w-3 h-3 text-[#cba158]" />
                <span>{timeLeft.days}d</span>
                <span className="text-[#cba158]">:</span>
                <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                <span className="text-[#cba158]">:</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                <span className="text-[#cba158]">:</span>
                <span>{String(timeLeft.seconds).padStart(2, "0")}s</span>
              </div>

              <button
                onClick={onBookTable}
                className="bg-[#cba158] hover:bg-[#dcb56d] text-[#0c0c0d] font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-3.5 py-1 rounded transition duration-200 flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <span>BOOK TABLE</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================== MAIN NAVBAR ===================== */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-[#0c0c0d]/95 backdrop-blur-md border-b border-white/10 py-2 sm:py-2.5 shadow-2xl"
            : "bg-gradient-to-b from-black/85 via-black/40 to-transparent py-2 sm:py-3 border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Brand Logo & Title */}
            <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-[#cba158]/90 bg-[#101114] flex-shrink-0 shadow-md group-hover:border-[#cba158] transition">
                <Image
                  src="/logo.png"
                  alt="Mahalakshmi Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-serif text-sm sm:text-lg lg:text-xl font-normal tracking-[0.18em] text-[#f4ede4] group-hover:text-[#cba158] transition duration-200 uppercase leading-none">
                  Mahalakshmi
                </span>
                <span className="text-[8px] sm:text-[9.5px] uppercase tracking-[0.25em] text-[#8e8b86] group-hover:text-neutral-300 transition mt-1 leading-none font-medium">
                  Family Restaurant
                </span>
              </div>
            </a>

            {/* Right: Outlined BOOK TABLE Button */}
            <div className="flex items-center flex-shrink-0">
              <button
                onClick={onBookTable}
                className="border border-[#cba158]/80 hover:border-[#cba158] hover:bg-[#cba158] hover:text-[#0c0c0d] text-[#cba158] text-xs uppercase tracking-widest px-4 sm:px-5 py-2 rounded transition duration-200 font-medium whitespace-nowrap active:scale-95 cursor-pointer shadow-sm"
              >
                BOOK TABLE
              </button>
            </div>

          </div>
        </div>
      </nav>

    </header>
  );
}
