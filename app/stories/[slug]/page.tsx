"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import EnquireModal from "../../components/EnquireModal";
import { STORIES_DATA } from "../../data/storiesData";

export default function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const story = STORIES_DATA.find((s) => s.slug === resolvedParams.slug);

  const [enquireOpen, setEnquireOpen] = useState(false);

  if (!story) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
        <Navbar logoName="Travel With Sonali" />
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold text-[#1C1917]">Story Not Found</h1>
          <Link href="/stories" className="inline-block px-6 py-3 rounded-full bg-[#E05328] text-white text-sm font-semibold">
            View All Stories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <WhatsAppFloat />

      {/* Breadcrumb */}
      <div className="bg-[#F4EFEA] border-b border-[#E8E1D7] py-3">
        <div className="max-w-4xl mx-auto px-4 text-xs text-[#7A746E] flex items-center gap-2">
          <Link href="/stories" className="hover:text-[#E05328] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Stories
          </Link>
          <span>/</span>
          <span className="text-[#1C1917] font-medium truncate">{story.title}</span>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8 flex-1">
        
        <div className="space-y-4 text-center">
          <span className="px-3.5 py-1 rounded-full bg-[#E05328]/10 text-[#E05328] text-xs font-semibold uppercase tracking-wider">
            {story.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-italic font-bold tracking-tight text-[#1C1917] leading-tight">
            {story.title}
          </h1>

          <div className="flex items-center justify-center gap-6 pt-4 text-xs text-[#7A746E]">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#D8CFC4]">
                <Image src={story.authorAvatar} alt={story.author} fill className="object-cover" />
              </div>
              <span className="font-semibold text-[#1C1917]">{story.author}</span>
            </div>
            <span>•</span>
            <span>{story.date}</span>
            <span>•</span>
            <span>{story.readTime}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden shadow-xl border border-[#E8E1D7]">
          <Image src={story.image} alt={story.title} fill className="object-cover" priority />
        </div>

        {/* Article Body */}
        <div className="space-y-6 text-base sm:text-lg text-[#57524C] leading-relaxed max-w-3xl mx-auto pt-4">
          {story.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          {/* Pull Quote */}
          <div className="p-8 rounded-3xl bg-[#F4EFEA] border-l-4 border-[#E05328] my-8 font-serif-italic text-2xl text-[#1C1917] italic">
            &ldquo;Travel is the only thing you buy that makes you richer in stories, perspective, and friendships.&rdquo;
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#181614] text-white text-center space-y-4 mt-12">
          <h3 className="text-2xl sm:text-3xl font-serif-italic font-bold">
            Ready to experience it yourself?
          </h3>
          <p className="text-stone-300 text-sm max-w-md mx-auto">
            Browse our upcoming departures and join our next travel family.
          </p>
          <div className="pt-2">
            <Link
              href="/tours"
              className="inline-block px-8 py-3.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm shadow-md"
            >
              Explore Tours Now
            </Link>
          </div>
        </div>

      </article>

      <Footer />
    </div>
  );
}
