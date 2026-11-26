"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Maximize2, Film, Play, Pause } from "lucide-react";

const REELS = [
  {
    id: "01",
    badgeLabel: "DIRECTORIAL MASTER",
    title: "MAHALAKSHMI GRAND GALA PRODUCTION FILM",
    src: "/FINAL-01.mp4",
  },
  {
    id: "02",
    badgeLabel: "CHEF ARTISTRY",
    title: "LIVE CLAY TANDOOR & ROYAL FIRE KITCHEN",
    src: "/1.mp4",
  },
  {
    id: "03",
    badgeLabel: "ROYAL AMBIENCE",
    title: "TWILIGHT CABANAS & PALM PROMENADE",
    src: "/2.mp4",
  },
  {
    id: "04",
    badgeLabel: "FESTIVE MELODIES",
    title: "HERITAGE JOY & LIVE ACOUSTIC STRINGS",
    src: "/3.mp4",
  },
];

/**
 * DedicatedVideoCard - Streamlined Card containing ONLY the video reel player
 * Autoplay is strictly disabled to guarantee buttery-smooth, satisfying 60/120fps scrolling.
 */
function DedicatedVideoCard({ reel, total, activeAudioId, setActiveAudioId }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio state is tied to whether this specific reel is the active audio source
  const isAudioActive = activeAudioId === reel.id;

  // Sync state if video plays/pauses
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // Synchronize audio mute state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isAudioActive;
  }, [isAudioActive]);

  // Safe pause when user scrolls completely past this card
  useEffect(() => {
    const el = cardRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
          setIsPlaying(false);
          if (isAudioActive) {
            setActiveAudioId(null);
          }
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isAudioActive, setActiveAudioId]);

  // Explicit User-Triggered Play / Pause Toggle
  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = !isAudioActive;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {});
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Toggle Mute / Unmute for this card
  const toggleAudio = (e) => {
    e.stopPropagation();
    if (isAudioActive) {
      setActiveAudioId(null);
    } else {
      setActiveAudioId(reel.id);
      const video = videoRef.current;
      if (video && video.paused) {
        video.muted = false;
        video.play().catch(() => {});
      }
    }
  };

  // Toggle Fullscreen for this video
  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      video.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={cardRef}
      style={{ transform: "translate3d(0, 0, 0)" }}
      className="relative bg-[#0e0e11]/95 border border-[#cba158]/35 hover:border-[#cba158]/70 rounded-[24px] sm:rounded-[30px] p-3.5 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.92)] transition-all duration-300 flex flex-col justify-between group"
    >
      {/* Top Status Header Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#cba158]/20">
        <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-[#cba158]/40 font-mono text-[10.5px] sm:text-[11px] text-[#f4ede4] tracking-wider font-semibold">
          REEL {reel.id} / {String(total).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10.5px] sm:text-[11px] text-[#cba158] uppercase tracking-widest font-bold truncate ml-2">
          {reel.badgeLabel}
        </span>
      </div>

      {/* Dedicated Vertical Reel Video Player */}
      <div 
        onClick={togglePlay}
        className="relative w-full aspect-[9/16] bg-black rounded-[18px] sm:rounded-[22px] overflow-hidden border border-[#cba158]/30 shadow-[0_15px_45px_rgba(0,0,0,0.95)] cursor-pointer"
      >
        {/* HTML5 Video Element (Autoplay is completely disabled for frictionless scrolling) */}
        <video
          ref={videoRef}
          src={reel.src}
          loop
          muted={!isAudioActive}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />

        {/* Central Luxury Play Overlay (Visible when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300 z-20 group-hover:bg-black/35">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/75 border-2 border-[#cba158] flex items-center justify-center text-[#cba158] shadow-[0_0_30px_rgba(203,161,88,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#cba158] group-hover:text-[#0c0c0d]">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current ml-1" />
            </div>
            <span className="mt-3 px-3 py-1 rounded-full bg-black/80 border border-[#cba158]/50 text-[#f4ede4] text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold shadow-md">
              Click to Play
            </span>
          </div>
        )}

        {/* Top-Right: Fullscreen Icon Button (↗) */}
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label="Expand fullscreen"
          title="Fullscreen"
          className="absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 hover:bg-black text-[#f4ede4] hover:text-[#cba158] border border-white/20 hover:border-[#cba158] flex items-center justify-center transition-all duration-200 cursor-pointer z-20 backdrop-blur-md shadow-lg"
        >
          <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Bottom Controls Bar (Play/Pause & Mute) */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
          {/* Bottom-Left: Play / Pause Quick Toggle */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            title={isPlaying ? "Pause" : "Play"}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-[#cba158] hover:text-[#0c0c0d] text-white border border-[#cba158]/40 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md pointer-events-auto"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Bottom-Right: Dedicated Mute / Unmute Button */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-label={isAudioActive ? "Mute audio" : "Unmute audio"}
            title={isAudioActive ? "Mute" : "Unmute"}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl backdrop-blur-md pointer-events-auto ${
              isAudioActive
                ? "bg-[#cba158] text-[#0c0c0d] border border-[#cba158] ring-2 ring-[#cba158]/60 shadow-[0_0_18px_rgba(203,161,88,0.5)] scale-105"
                : "bg-black/80 hover:bg-[#cba158] hover:text-[#0c0c0d] text-white border border-[#cba158]/40"
            }`}
          >
            {isAudioActive ? (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>

        {/* Bottom Ambient Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
      </div>

      {/* Reel Title Caption */}
      <div className="pt-3 text-center">
        <h4 className="font-serif text-xs sm:text-sm text-[#f4ede4] font-medium uppercase tracking-tight line-clamp-1 group-hover:text-[#cba158] transition">
          {reel.title}
        </h4>
      </div>
    </div>
  );
}

export default function PromotionalEventVideos({ onOpenReservation }) {
  // Tracks which video reel currently has audio active (only one unmuted at a time)
  const [activeAudioId, setActiveAudioId] = useState(null);

  return (
    <section
      id="videos"
      className="py-14 sm:py-20 lg:py-24 bg-[#0a0a0c] relative overflow-hidden border-t border-[#cba158]/20"
    >
      {/* Background Subtle Ambience Glow - GPU Promoted */}
      <div 
        style={{ transform: "translate3d(0, 0, 0)" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#cba158]/5 blur-[160px] rounded-full pointer-events-none" 
      />
      <div 
        style={{ transform: "translate3d(0, 0, 0)" }}
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[850px] h-[550px] bg-[#cba158]/5 blur-[160px] rounded-full pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#cba158]/40 bg-[#cba158]/10 text-xs uppercase font-mono tracking-widest text-[#cba158] font-bold mb-3 shadow-sm">
            <Film className="w-3.5 h-3.5 text-[#cba158]" />
            <span>PROMOTIONAL EVENT FILM SHOWCASE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#f4ede4] uppercase font-normal tracking-tight">
            A Glimpse Of The Gala In Motion
          </h2>
          <p className="mt-3 text-xs sm:text-base text-neutral-300 font-light max-w-xl mx-auto leading-relaxed">
            Experience the royal atmosphere, authentic clay tandoor counters, acoustic melodies, and festive family dining captured live.
          </p>
        </div>

        {/* ===================== ALL 4 DEDICATED VIDEO CARDS (GRID OF VIDEO-ONLY CARDS) ===================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 max-w-7xl mx-auto">
          {REELS.map((reel) => (
            <DedicatedVideoCard
              key={reel.id}
              reel={reel}
              total={REELS.length}
              activeAudioId={activeAudioId}
              setActiveAudioId={setActiveAudioId}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
