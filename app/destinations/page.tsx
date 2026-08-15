"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import EnquireModal from "../components/EnquireModal";
import { DESTINATIONS_DATA } from "../data/destinationsData";

export default function DestinationsPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <WhatsAppFloat />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
            Immersive Destinations
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1917] mt-2">
            Where Will You Go Next?
          </h1>
          <p className="text-[#6B645C] text-base sm:text-lg max-w-2xl mt-3">
            From holy Himalayan peaks to secret tropical bays, explore handpicked destinations crafted for authentic group travel.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS_DATA.map((dest) => (
            <div
              key={dest.id}
              className="group bg-[#F4EFEA] rounded-3xl overflow-hidden border border-[#E8E1D7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                    {dest.toursCount} Active Batches
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#E05328] text-white text-xs font-semibold">
                    Best: {dest.bestTimeToVisit}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-serif-italic font-bold text-[#1C1917] group-hover:text-[#E05328] transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-[#E05328] font-semibold italic">
                    &ldquo;{dest.tagline}&rdquo;
                  </p>
                  <p className="text-xs sm:text-sm text-[#57524C] leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {dest.highlights.map((h, i) => (
                      <span key={i} className="text-[10px] font-medium bg-white px-2.5 py-1 rounded-full border border-[#D8CFC4] text-[#57524C]">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#E8E1D7]/60 flex items-center justify-between">
                <button
                  onClick={() => setEnquireOpen(true)}
                  className="text-xs font-semibold text-[#57524C] hover:text-[#E05328] cursor-pointer"
                >
                  Enquire Trip
                </button>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-1 px-5 py-2.5 rounded-full bg-[#1C1917] hover:bg-[#E05328] text-white text-xs font-semibold transition-colors"
                >
                  <span>Explore Tours</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName="Destination Enquiry"
      />
    </div>
  );
}
