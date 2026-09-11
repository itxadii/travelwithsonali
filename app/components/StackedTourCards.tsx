"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ArrowRight, Sparkles, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Tour } from "../data/toursData";

interface StackedTourCardsProps {
  tours: Tour[];
  onEnquire: (title: string) => void;
}

export default function StackedTourCards({
  tours,
  onEnquire,
}: StackedTourCardsProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const updateCardScales = () => {
      const windowH = window.innerHeight;
      const cards = cardRefs.current;
      const totalCards = cards.length;

      cards.forEach((card, i) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const stickyTop = 88 + i * 16;

        let scale = 1;
        let brightness = 1;
        let opacity = 1;

        // 1. Check subsequent cards scrolling on top of this card (deck stacking & scaling down)
        for (let j = i + 1; j < totalCards; j++) {
          const nextCard = cards[j];
          if (!nextCard) continue;
          const nextRect = nextCard.getBoundingClientRect();
          const nextStickyTop = 88 + j * 16;

          // As the next card moves from bottom of the screen to its sticky position
          const totalDist = windowH - nextStickyTop;
          if (totalDist > 0) {
            const currentDist = windowH - nextRect.top;
            const progress = Math.max(0, Math.min(1, currentDist / totalDist));

            // Each card that stacks over this card scales it down noticeably (by ~0.06 each)
            scale -= progress * 0.06;
            brightness -= progress * 0.05;
            opacity -= progress * 0.02;
          }
        }

        // 2. Entrance scaling: As this card enters from the bottom of the viewport towards sticky top
        if (rect.top > stickyTop) {
          const enterTotalDist = windowH - stickyTop;
          if (enterTotalDist > 0) {
            const enterProgress = Math.max(0, Math.min(1, (windowH - rect.top) / enterTotalDist));
            // Card scales up from 0.90 to 1.0 as it approaches sticky position
            const enterScale = 0.90 + enterProgress * 0.10;
            scale = Math.min(scale, enterScale);
          }
        }

        // Boundaries to keep cards clean and visible
        scale = Math.max(0.78, Math.min(1.02, scale));
        brightness = Math.max(0.72, Math.min(1, brightness));
        opacity = Math.max(0.85, Math.min(1, opacity));

        // Apply scale, brightness, and smooth top-centered perspective
        card.style.transform = `scale(${scale})`;
        card.style.filter = `brightness(${brightness})`;
        card.style.opacity = `${opacity}`;
        card.style.transformOrigin = "center top";
      });

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateCardScales);
        ticking = true;
      }
    };

    updateCardScales();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tours]);

  // Luxury background palettes for cards
  const cardBgs = [
    "bg-[#FDF7F4]",
    "bg-[#F7EFEA]",
    "bg-[#F4ECE7]",
    "bg-[#FAF0EB]",
    "bg-[#F5EDE8]",
    "bg-[#F8F1EC]",
  ];

  return (
    <div className="relative space-y-12 sm:space-y-16 pb-20 sm:pb-32">
      {tours.map((tour, index) => {
        const cardIndexDisplay = String(index + 1).padStart(2, "0");
        const totalDisplay = String(tours.length).padStart(2, "0");
        const bgClass = cardBgs[index % cardBgs.length];

        return (
          <div
            key={tour.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{
              top: `calc(88px + ${index * 16}px)`,
              zIndex: 10 + index,
            }}
            className={`sticky w-full ${bgClass} rounded-3xl sm:rounded-[36px] overflow-hidden border border-[#E8DCD5] shadow-[0_20px_50px_rgba(104,87,82,0.12)] transition-all duration-150 ease-out will-change-transform`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] sm:min-h-[580px] lg:min-h-[600px] items-stretch">
              
              {/* Left Column: Full-Bleed Hero Image with Badges */}
              <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[300px] lg:min-h-[580px] overflow-hidden group">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  priority={index < 2}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Ambient Image Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden lg:block" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide border border-white/20">
                    <MapPin className="w-3.5 h-3.5 text-[#8EB486]" />
                    {tour.destination}
                  </span>
                </div>

                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#685752] text-xs sm:text-sm font-bold font-mono tracking-wider shadow-md">
                    {cardIndexDisplay} / {totalDisplay}
                  </span>
                </div>

                {/* Bottom Floating Info Pill Badges over Image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center gap-2 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-[#8EB486]" />
                    {tour.departureDate}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#8EB486]" />
                    {tour.duration}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
                    <Users className="w-3.5 h-3.5 text-[#8EB486]" />
                    {tour.groupSize}
                  </span>
                </div>
              </div>

              {/* Right Column: Tour Details, Highlights, Pricing & CTAs */}
              <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  {/* Category Tag & Host Pill */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {tour.category || "Curated Journey"}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[#E8DCD5]">
                        <Image
                          src="/images/sonali.png"
                          alt="Sonali Palekar"
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-[#997C70]">
                        Sonali Palekar Host
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#685752] leading-tight hover:text-[#8EB486] transition-colors">
                    <Link href={`/tours/${tour.slug}`}>
                      {tour.title}
                    </Link>
                  </h3>

                  {/* Description & Overview */}
                  <p className="text-[#7A6862] text-sm sm:text-base leading-relaxed line-clamp-3">
                    {tour.overview || tour.description}
                  </p>

                  {/* Quick Tour Highlights */}
                  <div className="pt-2 space-y-2">
                    {tour.startingPoint && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6862]">
                        <CheckCircle2 className="w-4 h-4 text-[#8EB486] shrink-0" />
                        <span>Departure point: <strong className="text-[#685752]">{tour.startingPoint}</strong></span>
                      </div>
                    )}
                    {tour.accommodation && (
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6862]">
                        <CheckCircle2 className="w-4 h-4 text-[#8EB486] shrink-0" />
                        <span className="line-clamp-1">{tour.accommodation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Call to Actions */}
                <div className="pt-6 border-t border-[#E8DCD5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-[#997C70] uppercase tracking-wider block font-medium">
                      Starting From
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#685752]">
                        {tour.price}
                      </span>
                      {tour.originalPrice && (
                        <span className="text-sm text-[#997C70]/70 line-through font-medium">
                          {tour.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onEnquire(tour.title)}
                      className="px-5 py-3 rounded-full border-2 border-[#8EB486] text-[#8EB486] hover:bg-[#8EB486] hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                    >
                      Enquire
                    </button>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#685752] hover:bg-[#8EB486] text-white text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group/btn"
                    >
                      <span>Explore Tour</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}
