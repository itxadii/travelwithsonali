"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Compass, ShieldCheck, Users, Smile, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnquireModal from "../components/EnquireModal";

export default function AboutPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
            Travel With Sonali
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-italic font-bold tracking-tight text-[#1C1917]">
            &ldquo;It started with a love for travel.&rdquo;
          </h1>
          <p className="text-[#6B645C] text-base sm:text-lg max-w-2xl">
            We are not a corporate travel agency. We are a community of real people building genuine memories across mountains, rivers, and oceans.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="w-full py-20 border-b border-[#E8E1D7] bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="relative h-[480px] rounded-[100px] overflow-hidden shadow-2xl border-4 border-[#FAF6F0]">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                  alt="Sonali Sharma Founder"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Meet Sonali
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#1C1917]">
                Why Travel With Sonali Exists
              </h2>
              <p className="text-base text-[#57524C] leading-relaxed">
                A few years ago, after joining multiple rigid tour packages, I realized something was broken in how people travel. Most tours were rushed, crowded, and treated travelers like checkboxes on a route map.
              </p>
              <p className="text-base text-[#57524C] leading-relaxed">
                I wanted to create an experience where people travel together as friends, stay in comfortable & charming locations, eat great food, and carry home stories they&apos;ll cherish for decades.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setEnquireOpen(true)}
                  className="px-7 py-3 rounded-full bg-[#E05328] text-white font-semibold text-sm cursor-pointer"
                >
                  Come Travel With Us
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="w-full py-20 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917]">
              Our Core Philosophy
            </h2>
            <p className="text-sm text-[#6B645C] mt-2">What guides every trip we design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FAF6F0] border border-[#E8E1D7] space-y-3">
              <Compass className="w-8 h-8 text-[#E05328]" />
              <h3 className="text-xl font-bold text-[#1C1917]">Experience First</h3>
              <p className="text-sm text-[#57524C]">We prioritize quality time at destinations over cramming 10 locations in a single day.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FAF6F0] border border-[#E8E1D7] space-y-3">
              <Users className="w-8 h-8 text-[#E05328]" />
              <h3 className="text-xl font-bold text-[#1C1917]">Inclusive Community</h3>
              <p className="text-sm text-[#57524C]">Every traveler is treated with warmth, safety, and respect regardless of background.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FAF6F0] border border-[#E8E1D7] space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#E05328]" />
              <h3 className="text-xl font-bold text-[#1C1917]">Total Transparency</h3>
              <p className="text-sm text-[#57524C]">Honest pricing, clear inclusions, and zero hidden charges at any point.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName="About Page Enquiry"
      />
    </div>
  );
}
