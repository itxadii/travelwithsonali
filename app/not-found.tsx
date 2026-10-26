"use client";

import React from "react";
import Link from "next/link";
import { Home, Compass } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-20 text-center">
        <div className="max-w-md w-full space-y-6">
          {/* Big clean serif 404 */}
          <div className="text-8xl sm:text-9xl font-serif-italic font-bold tracking-tight text-[#685752]/85 select-none">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#685752] tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm sm:text-base text-[#7A6862] leading-relaxed">
              The page you are looking for doesn’t exist or may have been moved. Let’s get you back on track.
            </p>
          </div>

          {/* Simple, clean action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold shadow-sm transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#F7EFEA] text-[#685752] border border-[#E8DCD5] text-sm font-semibold shadow-2xs transition-all"
            >
              <Compass className="w-4 h-4 text-[#4A7244]" />
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
