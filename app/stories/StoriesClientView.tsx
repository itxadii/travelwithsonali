"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Story } from "../data/storiesData";

interface StoriesClientViewProps {
  initialStories: Story[];
}

export default function StoriesClientView({ initialStories }: StoriesClientViewProps) {
  const [activeCat, setActiveCat] = useState("All");
  const categories = ["All", "Trip Stories", "Travel Guides", "Travel Tips", "Behind the Journey"];

  const filteredStories = initialStories.filter(
    (s) => activeCat === "All" || s.category === activeCat
  );

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Travel Journal & Blog
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Stories From The Road
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Read authentic trip accounts, packing guides, and stories behind our group departures.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-10 border-b border-[#E8DCD5] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCat === cat
                  ? "bg-[#8EB486] text-white shadow-sm"
                  : "bg-[#F7EFEA] text-[#7A6862] hover:bg-[#E8DCD5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group bg-[#F7EFEA] rounded-3xl overflow-hidden border border-[#E8DCD5] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                    {story.category}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors">
                  {story.title}
                </h3>

                <p className="text-sm text-[#7A6862] leading-relaxed line-clamp-3">
                  {story.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-[#E8DCD5] flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#E8DCD5]">
                    <Image src={story.authorAvatar} alt={story.author} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-medium text-[#685752]">{story.author}</span>
                </div>

                <Link
                  href={`/stories/${story.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#8EB486] hover:underline"
                >
                  <span>Read Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </section>

      <Footer />
    </div>
  );
}
