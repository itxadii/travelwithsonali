"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, ArrowUpRight } from "lucide-react";
import { Tour } from "@/app/data/toursData";
import EnquireModal from "@/app/components/EnquireModal";

export default function DestinationClientView({ tours }: { tours: Tour[] }) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState("");

  const handleEnquire = (tourTitle: string) => {
    setSelectedTour(tourTitle);
    setEnquireOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="group flex flex-col justify-between bg-[#FDF7F4] rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div>
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#8EB486] text-white text-xs font-semibold">
                  {tour.destination}
                </span>
                <span className="absolute bottom-4 left-4 text-xs font-semibold text-white/90">
                  {tour.duration}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <Link href={`/tours/${tour.slug}`}>
                  <h3 className="text-xl font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors line-clamp-2">
                    {tour.title}
                  </h3>
                </Link>
                <p className="text-xs text-[#7A6862] line-clamp-2 leading-relaxed">
                  {tour.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#997C70]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#8EB486]" />
                    {tour.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8EB486]" />
                    {tour.startingPoint}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-2 border-t border-[#E8DCD5] flex items-center justify-between mt-auto">
              <div>
                <span className="text-[10px] uppercase text-[#997C70] block font-medium">
                  Starting From
                </span>
                <span className="text-xl font-bold text-[#685752]">{tour.price}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEnquire(tour.title)}
                  className="px-4 py-2 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Enquire
                </button>
                <Link
                  href={`/tours/${tour.slug}`}
                  className="p-2 rounded-full border border-[#E8DCD5] hover:border-[#8EB486] text-[#685752] hover:text-[#8EB486] transition-all"
                  aria-label="View details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={selectedTour}
      />
    </>
  );
}
