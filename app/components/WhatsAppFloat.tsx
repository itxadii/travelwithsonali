"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const whatsappUrl = "https://wa.me/919876543210?text=Hi%20Travel%20With%20Sonali!%20I%20would%20like%20to%20enquire%20about%20a%20trip.";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      {/* Tooltip speech bubble */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1917] text-white text-xs font-medium shadow-lg border border-stone-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
        <span>Talk to Sonali on WhatsApp</span>
      </div>

      {/* Main WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer border-2 border-white"
        aria-label="Chat on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping -z-10" />
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
      </a>
    </div>
  );
}
