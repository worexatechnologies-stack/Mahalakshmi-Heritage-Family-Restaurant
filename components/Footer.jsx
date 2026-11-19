"use client";

import { useState } from "react";
import Image from "next/image";
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
    <footer id="footer" className="relative pt-16 sm:pt-24 pb-8 sm:pb-12 overflow-hidden bg-[#0a0a0c]">
      
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
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-[#cba158]/60 bg-black flex-shrink-0 shadow-sm">
                  <Image
                    src="/logo.jpg"
                    alt="Mahalakshmi Spice Heritage"
                    fill
                    className="object-contain p-1"
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
                Mahalakshmi Spice Heritage Family Restaurant is deeply dedicated to creating unforgettable culinary moments with authentic clay tandoor cooking and royal stone-ground spices.
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
                <li><a href="#hero" className="hover:text-[#cba158] transition">Home</a></li>
                <li><a href="#about" className="hover:text-[#cba158] transition">About Us</a></li>
                <li><a href="#signatures" className="hover:text-[#cba158] transition">Royal Menu</a></li>
                <li><a href="#recipes" className="hover:text-[#cba158] transition">Kitchen Specials</a></li>
                <li><a href="#experience" className="hover:text-[#cba158] transition">Family Hall</a></li>
                <li><a href="#footer" className="hover:text-[#cba158] transition">Contact</a></li>
              </ul>
            </div>

            {/* Support Column (2 cols) */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-3">
              <h5 className="text-xs uppercase tracking-widest font-bold text-[#1c1a17]">
                Hospitality
              </h5>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-[#5a5650]">
                <li><a href="#experience" className="hover:text-[#cba158] transition">Family Banquets</a></li>
                <li><a href="#about" className="hover:text-[#cba158] transition">Catering Orders</a></li>
                <li><a href="#about" className="hover:text-[#cba158] transition">Takeaway Counter</a></li>
                <li><a href="#footer" className="hover:text-[#cba158] transition">Privacy Policy</a></li>
                <li><a href="#footer" className="hover:text-[#cba158] transition">Terms of Service</a></li>
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
            <p className="hover:text-[#cba158] transition font-medium">contact@mahalakshmispiceheritage.com</p>
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
