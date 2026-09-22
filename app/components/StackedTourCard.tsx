"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChevronRight, Sparkles, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { Tour } from "../data/toursData";

interface StackedTourCardProps {
  tour: Tour;
  index: number;
  total: number;
  onEnquire: (title: string) => void;
}

export default function StackedTourCard({
  tour,
  index,
  total,
  onEnquire,
}: StackedTourCardProps) {
  const cardIndexDisplay = String(index + 1).padStart(2, "0");
  const totalDisplay = String(total).padStart(2, "0");

  // Subtle luxury background variations for each stacked card
  const cardBgs = [
    "bg-[#FDF7F4]",
    "bg-[#F7EFEA]",
    "bg-[#F4ECE7]",
    "bg-[#FAF0EB]",
    "bg-[#F5EDE8]",
    "bg-[#F8F1EC]",
  ];
  const bgClass = cardBgs[index % cardBgs.length];

  return (
    <div
      style={
        {
          "--mobile-top": `calc(60px + ${index * 6}px)`,
          "--desktop-top": `calc(76px + ${index * 14}px)`,
          zIndex: 10 + index,
        } as React.CSSProperties
      }
      className={`sticky top-[var(--mobile-top)] sm:top-[var(--desktop-top)] w-full ${bgClass} rounded-2xl sm:rounded-3xl lg:rounded-[36px] overflow-hidden border border-[#E8DCD5] shadow-[0_15px_40px_rgba(104,87,82,0.10)] sm:shadow-[0_20px_50px_rgba(104,87,82,0.12)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(104,87,82,0.18)]`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[580px] items-stretch">
        
        {/* Left Column: Full-Bleed Hero Image with Metadata Badges */}
        <div className="lg:col-span-7 relative h-44 sm:h-64 lg:h-full min-h-[175px] sm:min-h-[250px] lg:min-h-[580px] overflow-hidden group">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            priority={index < 2}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Ambient Image Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden lg:block" />

          {/* Top Floating Badges */}
          <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex items-center gap-2 z-10">
            <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-sm font-semibold tracking-wide border border-white/20">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8EB486]" />
              {tour.destination}
            </span>
          </div>

          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10">
            <span className="inline-flex items-center px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#685752] text-[11px] sm:text-sm font-bold font-mono tracking-wider shadow-md">
              {cardIndexDisplay} / {totalDisplay}
            </span>
          </div>

          {/* Bottom Floating Info Pill Badges over Image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center gap-1.5 sm:gap-2 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-xs font-semibold">
              <Calendar className="w-3 h-3 text-[#8EB486]" />
              {tour.departureDate}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3.5 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-xs font-semibold">
              <Clock className="w-3 h-3 text-[#8EB486]" />
              {tour.duration}
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-[#8EB486]" />
              {tour.groupSize}
            </span>
          </div>
        </div>

        {/* Right Column: Tour Details, Highlights, Pricing & CTAs */}
        <div className="lg:col-span-5 p-4 sm:p-7 lg:p-9 flex flex-col justify-between space-y-3 sm:space-y-5">
          
          <div className="space-y-2 sm:space-y-3.5">
            {/* Category Tag & Host Pill */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#8EB486] font-bold flex items-center gap-1 sm:gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {tour.category || "Curated Journey"}
              </span>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 rounded-full overflow-hidden border border-[#E8DCD5]">
                  <Image
                    src="/images/sonali.png"
                    alt="Sonali Palekar"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-[#997C70]">
                  Sonali Palekar Host
                </span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#685752] leading-snug hover:text-[#8EB486] transition-colors line-clamp-1 sm:line-clamp-2">
              <Link href={`/tours/${tour.slug}`}>
                {tour.title}
              </Link>
            </h3>

            {/* Description & Overview */}
            <p className="text-[#7A6862] text-xs sm:text-sm lg:text-base leading-relaxed line-clamp-2 sm:line-clamp-3">
              {tour.overview || tour.description}
            </p>

            {/* Quick Tour Highlights */}
            <div className="hidden sm:block pt-1 space-y-1.5">
              {tour.startingPoint && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6862]">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8EB486] shrink-0" />
                  <span>Departure: <strong className="text-[#685752]">{tour.startingPoint}</strong></span>
                </div>
              )}
              {tour.accommodation && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#7A6862]">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8EB486] shrink-0" />
                  <span className="line-clamp-1">{tour.accommodation}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Call to Actions */}
          <div className="pt-3 sm:pt-5 border-t border-[#E8DCD5] flex items-center justify-between gap-2 sm:gap-4">
            {/* Price Block */}
            <div className="shrink-0">
              <span className="text-[10px] sm:text-[11px] text-[#997C70] uppercase tracking-wider block font-medium">
                Starting From
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#685752]">
                  {tour.price}
                </span>
                {tour.originalPrice && (
                  <span className="text-[11px] sm:text-sm text-[#997C70]/70 line-through font-medium hidden xs:inline">
                    {tour.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons: Both Enquire and Explore Tour ALWAYS visible side-by-side */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onEnquire(tour.title)}
                className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-full border-2 border-[#8EB486] text-[#8EB486] hover:bg-[#8EB486] hover:text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer shadow-xs whitespace-nowrap"
              >
                Enquire
              </button>
              <Link
                href={`/tours/${tour.slug}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-6 sm:py-3 rounded-full bg-[#685752] hover:bg-[#8EB486] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group/btn whitespace-nowrap"
              >
                <span>Explore</span>
                <span className="hidden sm:inline">Tour</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
