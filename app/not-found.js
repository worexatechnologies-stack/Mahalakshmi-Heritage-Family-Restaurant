import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#f4ede4] flex flex-col items-center justify-center px-4 text-center select-none">
      <div className="w-16 h-16 rounded-full bg-[#1b1610] border border-[#cba158]/40 flex items-center justify-center mb-6 text-[#cba158] shadow-[0_0_30px_rgba(203,161,88,0.2)]">
        <UtensilsCrossed className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-serif text-[#f4ede4] tracking-wide mb-3">
        404 - Page Not Found
      </h1>
      <p className="text-neutral-400 max-w-md text-sm sm:text-base mb-8 font-light">
        The royal feast or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#cba158] to-[#e6ca85] text-[#0c0c0d] font-semibold text-sm hover:brightness-110 transition shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Grand Feast</span>
      </Link>
    </div>
  );
}
