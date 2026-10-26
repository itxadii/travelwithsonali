import React, { use } from "react";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GalleryClientView from "./GalleryClientView";
import AmbientCircles from "../components/AmbientCircles";
import { getGalleryItems } from "@/lib/sanity/queries";

export const metadata: Metadata = pageMetadata({
  title: "Photo Gallery",
  description: "Real photos from our group trips across the Himalayas, Northeast India, Rajasthan and Nepal.",
  path: "/gallery",
});

export default function GalleryPage() {
  const items = use(getGalleryItems());

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative overflow-hidden w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
            Visual Storytelling
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Photo Gallery
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Real moments from our group trips, editable and curated from Sanity CMS. Click any photograph to view in full resolution.
          </p>
        </div>
      </section>

      {/* Category Filter & Masonry Grid */}
      <section className="relative overflow-hidden w-full py-12 flex-1">
        <AmbientCircles variant="1" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryClientView items={items} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
