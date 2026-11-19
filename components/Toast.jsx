"use client";

import { CheckCircle2, X } from "lucide-react";

export default function Toast({ message, isVisible, onClose }) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1e1e22] text-[#f4ede4] border border-[#cba158]/40 px-5 py-4 rounded-xl shadow-2xl animate-fade-in backdrop-blur-md">
      <CheckCircle2 className="w-5 h-5 text-[#cba158] flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-neutral-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
