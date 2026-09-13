"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ChevronRight } from "lucide-react";
import { Tour } from "../data/toursData";

interface AnimatedTourCardProps {
  tour: Tour;
  index: number;
  onEnquire: (title: string) => void;
}

export default function AnimatedTourCard({
  tour,
  index,
  onEnquire,
}: AnimatedTourCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Stagger entrance on desktop row (0ms, 150ms, 300ms)
  const staggerDelay = (index % 3) * 150;

  return (
    <div
      ref={cardRef}
      style={{
        transitionDelay: isVisible ? `${staggerDelay}ms` : "0ms",
      }}
      className={`group relative bg-[#FDF7F4] rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-sm hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between transform hover:-translate-y-2 will-change-transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-14 scale-[0.95] pointer-events-none"
      }`}
    >
      <div>
        <div className="relative w-full h-64 overflow-hidden">
          <Image
            src={tour.image}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
            {tour.destination}
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#8EB486] text-white text-xs font-semibold">
            {tour.departureDate}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#997C70]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#8EB486]" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Users className="w-3.5 h-3.5 text-[#8EB486]" />
              {tour.groupSize}
            </span>
          </div>

          <h3 className="text-xl font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors line-clamp-2">
            {tour.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#7A6862] line-clamp-2 leading-relaxed">
            {tour.description}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4 border-t border-[#E8DCD5]/60 flex items-center justify-between">
        <div>
          <span className="text-[11px] text-[#997C70] uppercase tracking-wider block">
            Starting From
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#685752]">
              {tour.price}
            </span>
            {tour.originalPrice && (
              <span className="text-xs text-[#997C70] line-through">
                {tour.originalPrice}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEnquire(tour.title)}
            className="px-3.5 py-2 rounded-full border border-[#8EB486] text-[#8EB486] hover:bg-[#8EB486] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Enquire
          </button>
          <Link
            href={`/tours/${tour.slug}`}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#685752] hover:bg-[#8EB486] text-white text-xs font-semibold transition-colors"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
