"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import { Destination } from "@/app/data/destinationsData";
import { SquigglyText } from "@/components/ui/squiggly-text";

export const REAL_DESTINATIONS_IMAGES = [
  "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", // Manali & Kasol
  "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80", // Kedarnath & Uttarakhand
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80", // Spiti Valley
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Mystic Meghalaya
  "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80", // Kashmir
  "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80", // Nepal & Muktinath
  "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80", // Tirupati Balaji
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80", // Rajasthan Desert
];

interface ParallaxHeroImagesDemoProps {
  destinations?: Destination[];
  images?: string[];
}

export function ParallaxHeroImagesDemo({ destinations, images }: ParallaxHeroImagesDemoProps) {
  // Use real destination images passed via props or fallback list
  const activeImages = React.useMemo(() => {
    if (images && images.length > 0) return images;
    if (destinations && destinations.length > 0) {
      const dynamicList = destinations
        .map((d) => d.image)
        .filter((img): img is string => Boolean(img));
      const combined = [...dynamicList, ...REAL_DESTINATIONS_IMAGES];
      return Array.from(new Set(combined)).slice(0, 8);
    }
    return REAL_DESTINATIONS_IMAGES;
  }, [destinations, images]);

  return (
    <div className="relative flex min-h-[85vh] lg:min-h-screen w-full items-center justify-center overflow-hidden bg-[#F7EFEA] border-t border-[#E8DCD5]">
      <ParallaxHeroImages images={activeImages} />
      
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 text-center">
        <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold bg-white/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#8EB486]/30 shadow-xs">
          Handpicked Places & Sacred Trails
        </span>
        
        <h2 className="text-4xl font-bold tracking-tight text-[#685752] drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] md:text-6xl font-serif-italic">
          Explore Top{" "}
          <SquigglyText
            stepDuration={70}
            scale={[5, 8]}
            className="text-[#8EB486]"
          >
            Destinations
          </SquigglyText>
        </h2>
        
        <p className="max-w-lg text-sm sm:text-base text-[#7A6862] drop-shadow-[0_0_10px_rgba(255,255,255,0.6)] leading-relaxed">
          Move your mouse to see the parallax effect. Images at different depths
          move at different speeds as you discover our dream mountain escapes and serene valleys.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>View All Destinations</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 hover:bg-white text-[#685752] border border-[#E8DCD5] text-xs font-bold tracking-wider uppercase shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>Explore Tours</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8EB486]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
