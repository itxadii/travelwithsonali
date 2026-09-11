"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ArrowRight, Sparkles, MapPin, Calendar, CheckCircle2 } from "lucide-react";
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
      style={{
        top: `calc(88px + ${index * 16}px)`,
        zIndex: 10 + index,
      }}
      className={`sticky w-full ${bgClass} rounded-3xl sm:rounded-[36px] overflow-hidden border border-[#E8DCD5] shadow-[0_20px_50px_rgba(104,87,82,0.12)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(104,87,82,0.18)]`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px] sm:min-h-[580px] lg:min-h-[600px] items-stretch">
        
        {/* Left Column: Full-Bleed Hero Image with Metadata Badges */}
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#8EB486]" />
              {tour.departureDate}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#8EB486]" />
              {tour.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold">
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
}
