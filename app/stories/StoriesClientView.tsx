"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmbientCircles from "../components/AmbientCircles";
import { Story } from "../data/storiesData";
import { SquigglyText } from "@/components/ui/squiggly-text";
import { GooeyInput } from "@/components/ui/gooey-input";

interface StoriesClientViewProps {
  initialStories: Story[];
}

export default function StoriesClientView({ initialStories }: StoriesClientViewProps) {
  const [activeCat, setActiveCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = ["All", "Trip Stories", "Travel Guides", "Travel Tips", "Behind the Journey"];

  const filteredStories = initialStories.filter((s) => {
    const matchesCat = activeCat === "All" || s.category === activeCat;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative overflow-hidden w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="2" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Travel Journal & Blog
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Stories From{" "}
            <SquigglyText
              stepDuration={70}
              scale={[4, 7]}
              className="text-[#8EB486] font-serif-italic"
            >
              The Road
            </SquigglyText>
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Read authentic trip accounts, packing guides, and stories behind our group departures.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="relative overflow-hidden w-full py-12 flex-1">
        <AmbientCircles variant="3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8DCD5]">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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

          <div className="flex items-center justify-end w-full md:w-auto">
            <GooeyInput
              placeholder="Search stories & guides..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              collapsedWidth={130}
              expandedWidth={260}
              expandedOffset={48}
              classNames={{
                surface: "bg-[#685752] text-white shadow-md ring-1 ring-[#685752]/20 hover:bg-[#5a4a45]",
              }}
            />
          </div>
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
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
