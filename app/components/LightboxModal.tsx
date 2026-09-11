"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin } from "lucide-react";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title?: string;
  location?: string;
}

export default function LightboxModal({
  isOpen,
  onClose,
  imageSrc,
  title,
  location,
}: LightboxModalProps) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer z-50"
        aria-label="Close photo"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={imageSrc}
            alt={title || "Full size photo"}
            fill
            className="object-contain"
          />
        </div>

        {(title || location) && (
          <div className="mt-4 text-center text-white space-y-1">
            {title && <h3 className="text-xl font-serif-italic font-semibold">{title}</h3>}
            {location && (
              <p className="text-xs text-stone-300 flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#8EB486]" />
                {location}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
