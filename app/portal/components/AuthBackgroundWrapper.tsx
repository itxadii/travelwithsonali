"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles, MapPin, ShieldCheck } from "lucide-react";

interface AuthBackgroundWrapperProps {
  children: React.ReactNode;
}

export default function AuthBackgroundWrapper({ children }: AuthBackgroundWrapperProps) {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans selection:bg-[#8EB486] selection:text-white">
      {/* Background Scenic Image with Multi-layer Atmospheric Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/images/hero_bg.jpg"
          alt="Travel with Sonali Scenic Background"
          fill
          priority
          className="object-cover object-center scale-105 transform duration-1000 ease-out"
        />
        {/* Deep cinematic gradient overlays for contrast and readability */}
        <div className="absolute inset-0 bg-stone-950/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-stone-950/70" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Top Bar Navigation */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 hover:bg-black/50 text-white/90 hover:text-white backdrop-blur-md border border-white/15 text-xs font-medium transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-xs font-medium">
          <Compass className="w-3.5 h-3.5 text-[#8EB486]" />
          <span>Travel With Sonali Portal</span>
        </div>
      </header>

      {/* Main Centered Content Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Story Panel (Visible on Desktop) */}
          <div className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-6 text-white pr-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#8EB486] text-xs font-semibold tracking-wider uppercase w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handcrafted Expeditions</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight font-serif-italic">
              Journey Beyond the Ordinary with Sonali.
            </h1>

            <p className="text-sm text-stone-200/90 leading-relaxed font-light max-w-md">
              Access your personalized itineraries, booking vouchers, day-by-day guides, and live trip updates all in one seamless portal.
            </p>

            {/* Travel Highlights Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-md">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <MapPin className="w-3.5 h-3.5 text-[#8EB486]" />
                  <span>50+ Destinations</span>
                </div>
                <p className="text-[11px] text-stone-300">Spiti, Kashmir, Meghalaya & more</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8EB486]" />
                  <span>Verified Bookings</span>
                </div>
                <p className="text-[11px] text-stone-300">Instant vouchers & support</p>
              </div>
            </div>
          </div>

          {/* Right Card Panel (Contains Form) */}
          <div className="w-full lg:col-span-6 flex justify-center lg:justify-end">
            {children}
          </div>
        </div>
      </main>

      {/* Footer / Copyright info */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-white/60">
        <p>© {new Date().getFullYear()} Travel With Sonali. All rights reserved. • Curated Journeys</p>
      </footer>
    </div>
  );
}
