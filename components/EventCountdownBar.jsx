"use client";

import { useState, useEffect } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { sundayEvent } from "@/data/eventData";

export default function EventCountdownBar({ onOpenReservation }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isReady: false
  });

  useEffect(() => {
    const target = new Date(sundayEvent.targetDateISO).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isReady: true });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!sundayEvent.active) return null;

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <aside 
      aria-label="Upcoming restaurant event announcement"
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-[#17130b] via-[#211a0d] to-[#17130b] border-b border-[#cba158]/35 text-[#f4ede4] shadow-lg shadow-black/60 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-9 sm:h-10 flex items-center justify-between gap-2 text-xs">
        
        {/* Left: Event Highlight Pulse & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cba158] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e5b967]" />
          </span>

          <span className="inline-flex items-center gap-1 font-semibold text-[10px] sm:text-xs text-[#cba158] uppercase tracking-wider whitespace-nowrap">
            This Sunday (Nov 29):
          </span>

          <span className="text-[11px] sm:text-xs text-neutral-200 font-light truncate hidden sm:inline">
            Grand Heritage Feast & Live Music Gala
          </span>
        </div>

        {/* Center / Right: Countdown Timer & CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Live Countdown Clock */}
          {timeLeft.isReady && (
            <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#f4ede4] bg-black/60 border border-[#cba158]/30 px-2 sm:px-2.5 py-0.5 rounded-full shadow-inner">
              <Calendar className="w-2.5 h-2.5 text-[#cba158]" />
              <span>{timeLeft.days}d</span>
              <span className="text-[#cba158]">:</span>
              <span>{pad(timeLeft.hours)}h</span>
              <span className="text-[#cba158]">:</span>
              <span>{pad(timeLeft.minutes)}m</span>
              <span className="text-[#cba158]">:</span>
              <span className="text-[#cba158] font-bold">{pad(timeLeft.seconds)}s</span>
            </div>
          )}

          {/* Quick Reserve Button */}
          <button
            onClick={onOpenReservation}
            className="inline-flex items-center gap-1 bg-[#cba158] hover:bg-[#d8b068] text-[#0c0c0d] font-bold text-[10px] sm:text-[11px] uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-md transition shadow-md shadow-[#cba158]/20 flex-shrink-0 whitespace-nowrap active:scale-95"
          >
            <span>Book Table</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </aside>
  );
}
