"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnquireModal from "../components/EnquireModal";
import AmbientCircles from "../components/AmbientCircles";
import { TESTIMONIALS_DATA } from "../data/testimonialsData";

export default function TestimonialsPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative overflow-hidden w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="4" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Verified Customer Reviews
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Real People. Real Journeys.
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Read stories and feedback from travellers who joined our group departures.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="relative overflow-hidden w-full py-16 flex-1">
        <AmbientCircles variant="2" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#8EB486] text-[#8EB486]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-[#8EB486]/40" />
                  </div>
                  <p className="text-base text-[#7A6862] italic leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E8DCD5]">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E8DCD5]">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-[#685752]">{item.name}</p>
                    <p className="text-xs text-[#997C70]">{item.trip} • {item.date}</p>
                    <p className="text-[11px] text-[#8EB486] font-medium">{item.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
      />
    </div>
  );
}
