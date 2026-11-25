"use client";

import { useState } from "react";
import Image from "next/image";
import { atmosphereImages } from "@/data/restaurantData";
import { CheckCircle2 } from "lucide-react";

export default function Footer({ onSubscribe }) {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const endpoint = process.env.NEXT_PUBLIC_PHP_MAIL_URL || "/api/send-mail";
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          email: email,
        }),
      });
    } catch (err) {
      console.warn("Newsletter delivery note:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubscribed(true);
      if (onSubscribe) {
        onSubscribe(`Thank you for subscribing to Mahalakshmi Spice Heritage updates!`);
      }
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3500);
    }
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
        
        {/* Floating White / Light Card Container matching screenshot */}
        <div className="bg-[#f7f4ee] text-[#1c1a17] rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-14 shadow-2xl border border-white/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Brand & Socials (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#cba158]/70 ring-1 ring-[#cba158]/30 bg-[#0e0e11] flex-shrink-0 shadow-md">
                  <Image
                    src="/logo-centered.png"
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

              {/* Social Icons */}
              <div className="flex items-center space-x-2.5 pt-1">
                {["Instagram", "Facebook", "YouTube", "WhatsApp"].map((social) => (
                  <a
                    key={social}
                    href={`#${social.toLowerCase()}`}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ebe5db] hover:bg-[#cba158] hover:text-white text-[#2a2825] flex items-center justify-center text-xs font-semibold transition"
                    title={social}
                  >
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links Column (2 cols) */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-[#1c1a17]">
                Quick Links
              </h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#5a5650]">
                <li><a href="/home" className="hover:text-[#cba158] transition">Home</a></li>
                <li><a href="/about" className="hover:text-[#cba158] transition">About Us</a></li>
                <li><a href="/menu" className="hover:text-[#cba158] transition">Signature Menu</a></li>
                <li><a href="/recipes" className="hover:text-[#cba158] transition">Kitchen Secrets</a></li>
                <li><a href="/gallery" className="hover:text-[#cba158] transition">Gallery</a></li>
                <li><a href="/celebrations" className="hover:text-[#cba158] transition">Catering & Events</a></li>
              </ul>
            </div>

            {/* Support / Discover Column (2 cols) */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-[#1c1a17]">
                Discover
              </h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#5a5650]">
                <li><a href="/why-us" className="hover:text-[#cba158] transition">Why Choose Us</a></li>
                <li><a href="/faq" className="hover:text-[#cba158] transition">FAQs</a></li>
                <li><a href="/gallery" className="hover:text-[#cba158] transition">Dining Spaces</a></li>
                <li><a href="/menu" className="hover:text-[#cba158] transition">Tandoor Specialities</a></li>
                <li><a href="/contact" className="hover:text-[#cba158] transition">Contact</a></li>
              </ul>
            </div>

            {/* Newsletter Column (3 cols) */}
            <div className="lg:col-span-3 space-y-2 sm:space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-[#1c1a17]">
                Stay Connected
              </h5>
              <p className="text-xs text-[#5a5650] leading-relaxed">
                Subscribe for weekend family banquet offers, festive menus, and special discounts.
              </p>

              <form onSubmit={handleSubscribe} className="pt-1.5">
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

          {/* Sub-bar inside card */}
          <div className="mt-8 pt-5 border-t border-[#e2dcd1] flex flex-col sm:flex-row items-center justify-between text-[11px] sm:text-xs text-[#6e6860] gap-2.5 text-center sm:text-left">
            <p>© 2026 Mahalakshmi Spice Heritage Family Restaurant. All Rights Reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <p className="hover:text-[#cba158] transition font-medium">
                <a href="tel:+919148278837">+91 91482 78837</a>
              </p>
              <p className="hover:text-[#cba158] transition font-medium">
                <a href="mailto:mshfamilyrestaurant@gmail.com">mshfamilyrestaurant@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Big Bold Bottom Typography Etched Watermark */}
        <div className="mt-10 sm:mt-14 select-none text-center overflow-hidden">
          <h2 className="font-serif text-3xl sm:text-6xl md:text-8xl lg:text-[9vw] font-bold tracking-tight text-white/[0.06] uppercase leading-none truncate max-w-full">
            MAHALAKSHMI SPICE HERITAGE
          </h2>
        </div>

      </div>
    </footer>
  );
}
