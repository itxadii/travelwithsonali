"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Compass, ShieldCheck, Users, Smile, Sparkles } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnquireModal from "../components/EnquireModal";
import AmbientCircles from "../components/AmbientCircles";

export default function AboutPage() {
  const [enquireOpen, setEnquireOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative overflow-hidden w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="1" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Travel With Sonali
          </span>
          <h1 className="text-4xl sm:text-6xl font-serif-italic font-bold tracking-tight text-[#685752]">
            &ldquo;It started with a love for travel.&rdquo;
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl">
            We are not a corporate travel agency. We are a community of real people building genuine memories across mountains, rivers, and oceans.
          </p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="relative overflow-hidden w-full py-20 border-b border-[#E8DCD5] bg-[#FDF7F4]">
        <AmbientCircles variant="2" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="relative h-[480px] rounded-[100px] overflow-hidden shadow-2xl border-4 border-[#FDF7F4]">
                <Image
                  src="/images/sonali.png"
                  alt="Sonali Palekar Founder"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Meet Sonali
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-[#685752]">
                Why Travel With Sonali Exists
              </h2>
              <p className="text-base text-[#7A6862] leading-relaxed">
                A few years ago, after joining multiple rigid tour packages, I realized something was broken in how people travel. Most tours were rushed, crowded, and treated travelers like checkboxes on a route map.
              </p>
              <p className="text-base text-[#7A6862] leading-relaxed">
                I wanted to create an experience where people travel together as friends, stay in comfortable & charming locations, eat great food, and carry home stories they&apos;ll cherish for decades.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setEnquireOpen(true)}
                  className="px-7 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-sm cursor-pointer transition-colors shadow-sm"
                >
                  Come Travel With Us
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="relative overflow-hidden w-full py-20 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#685752]">
              Our Core Philosophy
            </h2>
            <p className="text-sm text-[#7A6862] mt-2">What guides every trip we design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-3 shadow-xs">
              <Compass className="w-8 h-8 text-[#8EB486]" />
              <h3 className="text-xl font-bold text-[#685752]">Experience First</h3>
              <p className="text-sm text-[#7A6862]">We prioritize quality time at destinations over cramming 10 locations in a single day.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-3 shadow-xs">
              <Users className="w-8 h-8 text-[#8EB486]" />
              <h3 className="text-xl font-bold text-[#685752]">Inclusive Community</h3>
              <p className="text-sm text-[#7A6862]">Every traveler is treated with warmth, safety, and respect regardless of background.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-3 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#8EB486]" />
              <h3 className="text-xl font-bold text-[#685752]">Total Transparency</h3>
              <p className="text-sm text-[#7A6862]">Honest pricing, clear inclusions, and zero hidden charges at any point.</p>
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
