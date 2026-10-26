"use client";

import React, { useState, useCallback, memo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Star, Quote, MapPin } from "lucide-react";
import { Testimonial } from "../data/testimonialsData";
import { SquigglyText } from "@/components/ui/squiggly-text";

export interface DestinationBgInfo {
  trip: string;
  locationTag: string;
  image: string;
  alt: string;
}

// Optimized 1280px WebP/JPEG URLs (~150KB each instead of 2.5MB+, 85% bandwidth reduction)
export const TESTIMONIAL_DESTINATIONS: DestinationBgInfo[] = [
  {
    trip: "Kedarnath Yatra",
    locationTag: "Kedarnath Dham • Uttarakhand",
    image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1280&q=75",
    alt: "Kedarnath Himalayan peaks & valley",
  },
  {
    trip: "Kashmir Paradise",
    locationTag: "Dal Lake & Srinagar • Kashmir",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1280&q=75",
    alt: "Kashmir Dal Lake Shikara & snow mountains",
  },
  {
    trip: "Manali & Kasol",
    locationTag: "Parvati Valley & Kasol • Himachal",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1280&q=75",
    alt: "Manali & Kasol Parvati Valley pine forests",
  },
  {
    trip: "Rajasthan Heritage",
    locationTag: "Thar Desert & Jaisalmer • Rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1280&q=75",
    alt: "Rajasthan Thar Golden Sand Dunes",
  },
  {
    trip: "Goa Tropical Escape",
    locationTag: "South Goa & Coastal Trails • Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1280&q=75",
    alt: "Goa Tropical Sunset & Catamaran",
  },
];

interface FannedCardsTestimonialsProps {
  testimonials: Testimonial[];
}

function FannedCardsTestimonialsComponent({ testimonials }: FannedCardsTestimonialsProps) {
  // Use first 5 testimonials for the 5-card fan deck
  const items = testimonials.slice(0, 5);

  // Center card (index 2) is active by default
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  // Lightweight matchMedia subscription via useSyncExternalStore (zero resize jank, no setState in effect)
  const isMobile = React.useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia("(max-width: 639px)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(max-width: 639px)").matches : false),
    () => false
  );

  const activeOrHovered = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const currentDest = TESTIMONIAL_DESTINATIONS[activeOrHovered] || TESTIMONIAL_DESTINATIONS[2];

  const handleCardClick = useCallback((idx: number) => {
    setActiveIndex(idx);
    setHoveredIndex(idx);
  }, []);

  const handleCardHover = useCallback((idx: number) => {
    setHoveredIndex(idx);
  }, []);

  const handleDeckLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <section className="relative w-full py-24 bg-[#1C1614] border-t border-[#E8DCD5]/30 overflow-hidden">
      {/* Dynamic Destination Background Photos - Pure CSS compositor cross-fade */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {TESTIMONIAL_DESTINATIONS.map((dest, idx) => {
          const isCurrent = activeOrHovered === idx;
          return (
            <div
              key={dest.trip}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isCurrent ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={dest.image}
                alt={dest.alt}
                fill
                priority={idx === 2 || idx === 0}
                unoptimized
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          );
        })}

        {/* Clean, high-performance dark contrast scrim - Zero blur filter overhead */}
        <div className="absolute inset-0 bg-black/45 z-2" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 z-2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Traveller Experiences
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md">
            Loved By{" "}
            <SquigglyText
              stepDuration={70}
              scale={[4, 7]}
              className="text-[#8EB486] font-serif-italic"
            >
              Fellow Souls
            </SquigglyText>
          </h2>
          <p className="text-base text-white/90 drop-shadow-sm">
            Here&apos;s what our travelers say about their group trips with Sonali.
          </p>
        </div>

        {/* Fanned Cards Container */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
          {/* Active Destination Indicator Badge */}
          <motion.div
            key={currentDest.locationTag}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#E8DCD5] shadow-xs text-xs font-semibold text-[#685752] mb-4 z-20"
          >
            <MapPin className="w-3.5 h-3.5 text-[#4A7244]" />
            <span>{currentDest.locationTag}</span>
          </motion.div>

          {/* Interactive Deck Area */}
          <motion.div
            className="relative w-full h-[450px] sm:h-[480px] md:h-[510px] flex items-center justify-center select-none"
            onMouseLeave={handleDeckLeave}
            onViewportEnter={() => setHasEnteredView(true)}
            viewport={{ once: true, amount: 0.25 }}
          >
            {items.map((item, idx) => {
              const offset = idx - 2;
              const isSelected = activeOrHovered === idx;

              // Precomputed geometry
              const baseRotate = isMobile ? offset * 7 : offset * 12;
              const baseX = isMobile ? offset * 34 : offset * 115;
              const baseY = Math.abs(offset) * (isMobile ? 8 : 14);

              const rotate = isSelected ? 0 : baseRotate;
              const x = isMobile && isSelected ? 0 : baseX;
              const y = isSelected ? (isMobile ? -22 : -36) : baseY;
              const scale = isSelected ? (isMobile ? 1.05 : 1.08) : isMobile ? 0.94 : 1;
              const zIndex = isSelected ? 40 : 20 - Math.abs(offset);

              return (
                <motion.div
                  key={item.id}
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => handleCardHover(idx)}
                  className="absolute cursor-pointer will-change-transform"
                  initial={{
                    rotate: 0,
                    x: 0,
                    y: 25,
                    opacity: 0,
                    scale: 0.92,
                  }}
                  animate={
                    hasEnteredView
                      ? {
                          rotate,
                          x,
                          y,
                          scale,
                          opacity: 1,
                        }
                      : {
                          rotate: 0,
                          x: 0,
                          y: 25,
                          opacity: 0,
                          scale: 0.92,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 26,
                    mass: 0.7,
                  }}
                  style={{
                    zIndex,
                    transformOrigin: "50% 115%",
                  }}
                >
                  {/* Card Container: Solid Cream/White surfaces (0 backdrop-blur penalty) */}
                  <div
                    className={`relative w-[245px] sm:w-[285px] md:w-[315px] h-[350px] sm:h-[380px] md:h-[400px] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                      isSelected
                        ? "bg-white border-2 border-[#8EB486] ring-4 ring-[#8EB486]/20 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.45)]"
                        : "bg-[#FDF7F4] border border-[#E8DCD5] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.25)] hover:border-[#8EB486]/60"
                    }`}
                  >
                    {/* Top Bar: Stars + Trip Badge & Card Index (01-05) */}
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* Rating Stars */}
                          <div className="flex items-center gap-0.5 text-[#4A7244]">
                            {[...Array(item.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-[#4A7244] text-[#4A7244]" />
                            ))}
                          </div>

                          {/* Trip Tag Badge */}
                          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8EB486]/15 text-[#4A7244] border border-[#8EB486]/30 truncate max-w-[120px]">
                            {item.trip}
                          </span>
                        </div>

                        {/* Card Index in Monospace */}
                        <span className="text-xs font-mono font-bold text-[#7A6862] tracking-wider">
                          0{idx + 1}
                        </span>
                      </div>

                      {/* Watermark Quote Icon */}
                      <div className="pt-0.5">
                        <Quote className="w-5 h-5 text-[#8EB486]/25 fill-[#8EB486]/10" />
                      </div>
                    </div>

                    {/* Card Body: Trip Title (font-serif-italic) & Review Quote */}
                    <div className="relative z-10 my-auto py-2">
                      <h3 className="text-lg sm:text-xl font-bold font-serif-italic text-[#685752] tracking-tight mb-2 line-clamp-1">
                        {item.trip}
                      </h3>
                      <p className="text-xs sm:text-sm font-normal text-[#7A6862] leading-relaxed line-clamp-4 sm:line-clamp-5 italic">
                        &ldquo;{item.quote}&rdquo;
                      </p>
                    </div>

                    {/* Card Footer: Traveller Avatar & Info */}
                    <div className="relative z-10 pt-3 border-t border-[#E8DCD5] flex items-center gap-3">
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#8EB486]/40 shrink-0 shadow-xs">
                        <Image
                          src={item.avatar}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          loading="lazy"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-[#685752] truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#7A6862] truncate">
                          {item.location} • {item.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(FannedCardsTestimonialsComponent);
