"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { atmosphereImages } from "@/data/restaurantData";
import { CheckCircle2 } from "lucide-react";

export default function Footer({ onSubscribe }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    if (onSubscribe) {
      onSubscribe(`Thank you for subscribing to Mahalakshmi Spice Heritage updates!`);
    }
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <footer id="contact" className="relative pt-16 sm:pt-24 pb-8 sm:pb-12 overflow-hidden bg-[#0a0a0c]">
      {/* Anchor for backward compatibility */}
      <div id="footer" className="absolute -top-24" />
      
      {/* Background Ambience Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src={atmosphereImages.footerBackground}
          alt="Mahalakshmi Spice Heritage ambient background"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Floating White / Light Card Container */}
        <div className="bg-[#f7f4ee] text-[#1c1a17] rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-14 shadow-2xl border border-white/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Brand & Socials (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#cba158]/80 bg-[#101114] flex-shrink-0 shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Mahalakshmi Spice Heritage"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-serif text-base sm:text-xl font-bold tracking-wide text-[#1c1a17] block leading-tight">
                    Mahalakshmi <span className="font-serif italic text-[#cba158]">Spice Heritage</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-[#8b857b] uppercase tracking-widest block">
                    Family Restaurant
                  </span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#4a4742] leading-relaxed max-w-sm">
                Mahalakshmi Spice Heritage is a family restaurant dedicated to celebrating the richness of traditional Indian cuisine with authentic recipes, clay tandoor specialities, and warm hospitality.
              </p>

              {/* Contact Button */}
              <div className="pt-2">
                <Link
                  href="/contact"
                  data-page="true"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1a17] hover:bg-[#cba158] text-[#f4ede4] hover:text-[#0c0c0d] font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 group/btn"
                >
                  <span>Contact Us</span>
                  <span className="text-[#cba158] group-hover/btn:text-[#0c0c0d] group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Quick Links Column (3 cols) */}
            <div className="lg:col-span-3 space-y-2 sm:space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-[#1c1a17]">
                Quick Links
              </h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#5a5650]">
                <li><a href="#home" className="hover:text-[#cba158] transition">Home</a></li>
                <li><a href="#event" className="hover:text-[#cba158] transition font-medium text-[#cba158]">Sunday Gala Event</a></li>
                <li><a href="#gallery" className="hover:text-[#cba158] transition">A Glimpse of Our World</a></li>
                <li><a href="#videos" className="hover:text-[#cba158] transition">Event Reels &amp; Videos</a></li>
                <li>
                  <Link
                    href="/contact"
                    data-page="true"
                    className="hover:text-[#cba158] transition flex items-center justify-between group/link font-medium text-[#1c1a17]"
                  >
                    <span>Contact Page</span>
                    <span className="text-[9px] bg-[#cba158]/20 group-hover/link:bg-[#cba158] group-hover/link:text-[#0c0c0d] text-[#cba158] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider">
                      PAGE
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Discover Dining Spaces Column (4 cols) */}
            <div className="lg:col-span-4 space-y-2 sm:space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-[#1c1a17]">
                Dining Spaces
              </h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#5a5650]">
                <li><a href="#gallery" className="hover:text-[#cba158] transition">Executive AC Dining Hall</a></li>
                <li><a href="#gallery" className="hover:text-[#cba158] transition">Palm Grove Promenade &amp; Walkway</a></li>
                <li><a href="#gallery" className="hover:text-[#cba158] transition">Private Gazebos &amp; Cabanas</a></li>
                <li><a href="#gallery" className="hover:text-[#cba158] transition">Iconic Highway Landmark</a></li>
              </ul>

              {/* Quick newsletter subscribe */}
              <div className="pt-2">
                <form onSubmit={handleSubscribe}>
                  <div className="flex items-center rounded-xl bg-white border border-[#dfd9ce] p-1.5 focus-within:border-[#cba158] transition shadow-inner">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-[#1c1a17] placeholder-[#9a958e] focus:outline-none min-w-0"
                    />
                    <button
                      type="submit"
                      className="bg-[#1c1a17] hover:bg-[#cba158] text-white hover:text-[#0c0c0d] font-semibold text-[11px] sm:text-xs uppercase tracking-wider px-3 sm:px-3.5 py-2 rounded-lg transition flex-shrink-0"
                    >
                      {isSubscribed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : "Join"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* Sub-bar inside card */}
          <div className="mt-8 pt-5 border-t border-[#e2dcd1] flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#6e6860] gap-2.5 text-center sm:text-left">
            <p>© 2026 Mahalakshmi Spice Heritage Family Restaurant. All Rights Reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <Link
                href="/contact"
                data-page="true"
                className="hover:text-[#cba158] transition font-medium text-[#1c1a17] underline underline-offset-4 decoration-[#cba158]/40"
              >
                Contact &amp; Location
              </Link>
              <span className="text-neutral-400">&bull;</span>
              <p className="hover:text-[#cba158] transition font-medium">
                <a href="tel:+919148278837">+91 91482 78837</a>
              </p>
              <span className="text-neutral-400">&bull;</span>
              <p className="hover:text-[#cba158] transition font-medium">
                <a href="mailto:mshfamilyrestaurant@gmail.com">mshfamilyrestaurant@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Big Bold Bottom Typography Etched Watermark (Static Location + Ambient Gold Shimmer Animation) */}
        <div className="mt-8 sm:mt-12 w-full text-center overflow-visible select-none pointer-events-auto group">
          <h2 className="sr-only">MAHALAKSHMI SPICE HERITAGE</h2>
          <svg
            viewBox="0 0 1480 100"
            className="w-full h-auto max-w-full mx-auto block overflow-visible transition-all duration-700 ease-out group-hover:scale-[1.01]"
            aria-hidden="true"
          >
            <defs>
              {/* Continuous Golden Shimmer Sheen Wave Animation */}
              <linearGradient id="footerHeritageShimmer" x1="-100%" y1="0%" x2="200%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="48%" stopColor="#cba158" stopOpacity="0.65" />
                <stop offset="52%" stopColor="#fdf0cd" stopOpacity="0.85" />
                <stop offset="56%" stopColor="#cba158" stopOpacity="0.65" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                <animate
                  attributeName="x1"
                  from="-100%"
                  to="100%"
                  dur="6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="x2"
                  from="0%"
                  to="200%"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </linearGradient>

              {/* Subtle Gold Ambient Glow Filter */}
              <filter id="goldGleam" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <text
              x="50%"
              y="68%"
              textAnchor="middle"
              fill="url(#footerHeritageShimmer)"
              filter="url(#goldGleam)"
              className="font-serif font-black uppercase tracking-[0.08em] transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(203,161,88,0.35)]"
              style={{
                fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif",
                fontSize: "72px",
                fontWeight: 900,
              }}
            >
              MAHALAKSHMI SPICE HERITAGE
            </text>
          </svg>
        </div>

      </div>
    </footer>
  );
}
