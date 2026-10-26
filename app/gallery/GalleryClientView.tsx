"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Camera } from "lucide-react";
import LightboxModal from "../components/LightboxModal";
import { GalleryItem } from "../data/galleryData";

interface GalleryClientViewProps {
  items: GalleryItem[];
}

export default function GalleryClientView({ items }: GalleryClientViewProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Derive available categories dynamically from the loaded items
  const uniqueCategories = Array.from(new Set(items.map((item) => item.category)));
  const categories = ["All", ...uniqueCategories];

  const filteredItems = items.filter((item) => {
    return activeCategory === "All" || item.category === activeCategory;
  });

  return (
    <>
      {/* Category Pills & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E8DCD5]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#4A7244] text-white shadow-xs"
                  : "bg-[#F7EFEA] text-[#7A6862] hover:bg-[#E8DCD5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-semibold text-[#7A6862] whitespace-nowrap">
          Showing {filteredItems.length} photograph{filteredItems.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] max-w-lg mx-auto">
          <Camera className="w-10 h-10 text-[#4A7244] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-[#685752]">No photos found</h3>
          <p className="text-xs text-[#7A6862] mt-1">
            No photographs available under this category. Switch to &quot;All&quot; to see full gallery.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`View photo: ${item.title}`}
              onClick={() => setActiveItem(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveItem(item);
                }
              }}
              className="group relative h-80 rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4A7244]/60"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white z-10 space-y-1.5 transition-transform duration-300 sm:translate-y-2 group-hover:translate-y-0">
                <span className="text-xs font-semibold uppercase tracking-wider bg-[#4A7244] text-white px-2.5 py-0.5 rounded-full inline-block">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold leading-snug">{item.title}</h3>
                <p className="text-xs text-stone-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8EB486]" />
                  <span>{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        imageSrc={activeItem?.image || ""}
        title={activeItem?.title}
        location={activeItem?.location}
      />
    </>
  );
}
