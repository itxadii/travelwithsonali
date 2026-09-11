"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Destination } from "../data/destinationsData";
import EnquireModal from "../components/EnquireModal";

export default function DestinationsClientView({ destinations }: { destinations: Destination[] }) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedDest, setSelectedDest] = useState("");

  const handleEnquire = (destName: string) => {
    setSelectedDest(destName);
    setEnquireOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="group bg-[#F7EFEA] rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <Link href={`/destinations/${dest.slug}`} className="block relative w-full h-64 overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                  {dest.toursCount} Active Batches
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#8EB486] text-white text-xs font-semibold">
                  Best: {dest.bestTimeToVisit}
                </div>
              </Link>

              <div className="p-6 space-y-3">
                <Link href={`/destinations/${dest.slug}`}>
                  <h3 className="text-2xl font-serif-italic font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors">
                    {dest.name}
                  </h3>
                </Link>
                <p className="text-xs text-[#8EB486] font-semibold italic">
                  &ldquo;{dest.tagline}&rdquo;
                </p>
                <p className="text-xs sm:text-sm text-[#7A6862] leading-relaxed line-clamp-3">
                  {dest.description}
                </p>

                {/* Highlights */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {dest.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] font-medium bg-white px-2.5 py-1 rounded-full border border-[#E8DCD5] text-[#7A6862]">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 border-t border-[#E8DCD5]/60 flex items-center justify-between">
              <button
                onClick={() => handleEnquire(dest.name)}
                className="text-xs font-semibold text-[#7A6862] hover:text-[#8EB486] cursor-pointer"
              >
                Enquire Trip
              </button>
              <Link
                href={`/destinations/${dest.slug}`}
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#685752] hover:bg-[#8EB486] text-white text-xs font-semibold transition-colors"
              >
                <span>Explore Destination</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={selectedDest ? `${selectedDest} Tour` : "Destination Enquiry"}
      />
    </>
  );
}
