"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Maximize2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LightboxModal from "../components/LightboxModal";
import AmbientCircles from "../components/AmbientCircles";
import { GALLERY_DATA, GalleryItem } from "../data/galleryData";

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ["All", "Mountains", "Spiritual", "Beaches", "Group Trips", "Road Trips"];

  const filteredItems = GALLERY_DATA.filter((item) => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative overflow-hidden w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Visual Storytelling
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Photo Gallery
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Real moments from our group trips. Click any photograph to view in full resolution.
          </p>
        </div>
      </section>

      {/* Category Filter & Masonry Grid */}
      <section className="relative overflow-hidden w-full py-12 flex-1">
        <AmbientCircles variant="1" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 border-b border-[#E8DCD5] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#8EB486] text-white shadow-sm"
                  : "bg-[#F7EFEA] text-[#7A6862] hover:bg-[#E8DCD5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-80 rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-sm cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white" />
              <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#8EB486] px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-xs text-stone-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8EB486]" />
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      <Footer />

      <LightboxModal
        isOpen={!!activeItem}
        onClose={() => setActiveItem(null)}
        imageSrc={activeItem?.image || ""}
        title={activeItem?.title}
        location={activeItem?.location}
      />
    </div>
  );
}
