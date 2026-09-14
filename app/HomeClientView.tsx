"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowDown,
  Star,
  Clock,
  Users,
  ShieldCheck,
  Compass,
  HeartHandshake,
  Sparkles,
  Smile,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EnquireModal from "./components/EnquireModal";
import QRCodeBadge from "./components/QRCodeBadge";
import StackedTourCards from "./components/StackedTourCards";
import InstagramRoundCarousel from "./components/InstagramRoundCarousel";
import AmbientCircles from "./components/AmbientCircles";
import { ParallaxHeroImages } from "@/components/ui/parallax-hero-images";
import { SquigglyText } from "@/components/ui/squiggly-text";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "@/components/ui/draggable-card";
import { cn } from "@/lib/utils";

export const REAL_DESTINATION_IMAGES = [
  "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80", // Manali & Kasol
  "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80", // Kedarnath & Uttarakhand
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80", // Spiti Valley
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", // Mystic Meghalaya
  "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80", // Kashmir
  "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80", // Nepal & Muktinath
  "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80", // Tirupati Balaji
  "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80", // Rajasthan Desert
];

import { Tour } from "./data/toursData";
import { Destination } from "./data/destinationsData";
import { STORIES_DATA } from "./data/storiesData";
import { TESTIMONIALS_DATA } from "./data/testimonialsData";
import { FAQS_DATA } from "./data/faqsData";
import { InstagramSectionData } from "@/lib/sanity/types";

interface HomeClientViewProps {
  tours: Tour[];
  destinations: Destination[];
  instagramData?: InstagramSectionData;
}

export default function HomeClientView({ tours, destinations, instagramData }: HomeClientViewProps) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedTourName, setSelectedTourName] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const destinationImages = React.useMemo(() => {
    if (destinations && destinations.length > 0) {
      const dynamicList = destinations
        .map((d) => d.image)
        .filter((img): img is string => Boolean(img));
      const combined = [...dynamicList, ...REAL_DESTINATION_IMAGES];
      return Array.from(new Set(combined)).slice(0, 8);
    }
    return REAL_DESTINATION_IMAGES;
  }, [destinations]);

  const handleEnquireClick = (tourName?: string) => {
    if (tourName) setSelectedTourName(tourName);
    setEnquireOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans selection:bg-[#8EB486] selection:text-white">
      {/* Global Header Navigation */}
      <Navbar logoName="Travel With Sonali" />

      {/* ================= SECTION 1: HERO SECTION ================= */}
      <section className="relative w-full min-h-screen -mt-20 pt-20 flex flex-col justify-between overflow-hidden bg-stone-950 text-white">
        {/* Ambient Scenic Hero Background with black overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero_bg.jpg"
            alt="Scenic Lake and Mountain Background"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 my-auto flex flex-col justify-between">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-0 items-stretch">
            {/* Left Column: Headlines & Primary CTAs */}
            <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-10 lg:border-r border-white/15 pb-6 lg:pb-0">
              <div className="pt-2 sm:pt-4 lg:pt-6">
                <h1 className="flex flex-col tracking-tight text-white">
                  <span className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.02] tracking-tight">
                    Travel More.
                  </span>
                  <span className="font-serif-italic text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal leading-[1.05] mt-1 text-[#8EB486]">
                    <SquigglyText
                      stepDuration={70}
                      scale={[5, 8]}
                      className="text-[#8EB486]"
                    >
                      Experience More.
                    </SquigglyText>
                  </span>
                </h1>

                <p className="mt-4 sm:mt-6 text-stone-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
                  Group journeys, unforgettable destinations, and memories you&apos;ll carry home. Travel with a community of warm, adventurous souls.
                </p>

                {/* Mobile-only Sonali Image placed just before Explore Tours */}
                <div className="lg:hidden my-6 flex justify-center">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px]">
                    <div className="relative w-full h-[360px] sm:h-[420px] rounded-[140px] sm:rounded-[160px] overflow-hidden border-4 border-white/20 shadow-2xl group transition-all duration-500 hover:shadow-3xl">
                      <Image
                        src="/images/hero.png"
                        alt="Sonali Palekar - Travel With Sonali"
                        fill
                        priority
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>

                    {/* Floating CTA circle button */}
                    <button
                      onClick={() => handleEnquireClick("Manali & Kasol Group Trip")}
                      className="absolute -bottom-2 right-2 sm:bottom-4 sm:-right-2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8EB486] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-3 border-stone-900 cursor-pointer"
                      aria-label="Book Manali & Kasol"
                    >
                      <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <Link
                    href="/tours"
                    className="inline-flex items-center gap-2 bg-[#8EB486] hover:bg-[#7A9F73] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Explore Tours</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <button
                    onClick={() => handleEnquireClick("General Enquiry")}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-white/40 text-white hover:bg-white hover:text-[#685752] font-medium text-sm sm:text-base transition-all duration-300 cursor-pointer backdrop-blur-xs"
                  >
                    <span>Talk to Sonali</span>
                  </button>
                </div>
              </div>

              {/* Sub-Feature Strip */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-white">4.9 / 5.0</p>
                  <p className="text-xs text-stone-300 font-medium">Over 2,500+ Happy Travellers</p>
                </div>
                <div className="flex items-center -space-x-2">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
                  ].map((img, i) => (
                    <div key={i} className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-stone-900 overflow-hidden">
                      <Image src={img} alt="Traveller" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center Column: Cinematic Stadium Image featuring Sonali (Desktop) */}
            <div className="hidden lg:flex lg:col-span-4 items-center justify-center px-0 lg:px-6 py-4 lg:py-0">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[400px]">
                <div className="relative w-full h-[360px] sm:h-[480px] lg:h-[600px] rounded-[140px] sm:rounded-[180px] lg:rounded-[220px] overflow-hidden border-4 border-white/20 shadow-2xl group transition-all duration-500 hover:shadow-3xl">
                  <Image
                    src="/images/hero.png"
                    alt="Sonali Palekar - Travel With Sonali"
                    fill
                    priority
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating CTA circle button */}
                <button
                  onClick={() => handleEnquireClick("Manali & Kasol Group Trip")}
                  className="absolute -bottom-2 right-2 sm:bottom-8 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#8EB486] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-3 sm:border-4 border-stone-900 cursor-pointer"
                  aria-label="Book Manali & Kasol"
                >
                  <ArrowUpRight className="w-5 h-5 sm:w-7 sm:h-7" />
                </button>
              </div>
            </div>

            {/* Right Column: Reviewer, Stats & QR Badge */}
            <div className="lg:col-span-3 flex flex-col justify-between pl-0 lg:pl-8 lg:border-l border-white/15 pt-4 lg:pt-0 space-y-6 lg:space-y-8">
              <div className="bg-white/10 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none rounded-2xl p-5 lg:p-0 border border-white/15 lg:border-none space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#8EB486] text-[#8EB486]" />
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">Roberto Carlos</span>
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/30">
                      <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Roberto Carlos" fill className="object-cover" />
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm lg:text-base text-stone-200 italic leading-relaxed">
                  &ldquo;Travel With Sonali made finding my perfect group trip effortless with detailed listings and personalized recommendations!&rdquo;
                </p>

                <div className="grid grid-cols-2 gap-4 pt-3 sm:pt-4 border-t border-white/15">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      2,500<span className="text-[#8EB486]">+</span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-0.5">
                      Happy users
                    </div>
                  </div>

                  <div>
                    <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      50<span className="text-[#8EB486]">+</span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-0.5">
                      Group Trips
                    </div>
                  </div>
                </div>
              </div>

              {/* Circular QR Badge: Centered in the middle on mobile mode, increased 3x size and without white borders */}
              <div className="pt-6 lg:pt-8 border-t border-white/15 flex flex-col items-center justify-center w-full text-center">
                <QRCodeBadge
                  label="SCAN TO FOLLOW"
                  qrImageSrc="/qrimage.png"
                  href="https://www.instagram.com/travel_withsonali"
                  size="3x"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: INSTAGRAM 3D ROUND CAROUSEL ================= */}
      <InstagramRoundCarousel data={instagramData} />

      {/* ================= SECTION 3: UPCOMING TOURS ================= */}
      <section id="tours" className="relative w-full py-20 border-t border-[#E8DCD5] bg-[#F7EFEA]">
        {/* Background ambient circles clipped within absolute container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AmbientCircles variant="1" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Upcoming Journeys
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#685752] mt-2">
                Where Are We{" "}
                <SquigglyText
                  stepDuration={70}
                  scale={[4, 7]}
                  className="text-[#8EB486] font-serif-italic"
                >
                  Going Next?
                </SquigglyText>
              </h2>
              <p className="text-[#7A6862] text-base mt-2">
                Choose your next adventure and come travel with us.
              </p>
            </div>

            <Link
              href="/tours"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#8EB486] hover:text-[#7A9F73] group"
            >
              <span>View All 8+ Upcoming Tours</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stacking Cards with Dynamic Scroll Scaling */}
          <StackedTourCards
            tours={tours.slice(0, 6)}
            onEnquire={handleEnquireClick}
          />
        </div>
      </section>

      {/* ================= SECTION 3: MEET SONALI & WHY TRAVEL WITH US ================= */}
      <section className="relative w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5] overflow-hidden">
        {/* Parallax Hero Images floating with mouse move */}
        <ParallaxHeroImages images={destinationImages} />
        <AmbientCircles variant="2" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Meet Sonali & The Personal Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#685752]">
              Why Travel With{" "}
              <SquigglyText
                stepDuration={70}
                scale={[4, 7]}
                className="text-[#8EB486] font-serif-italic"
              >
                Sonali?
              </SquigglyText>
            </h2>
            <p className="text-base text-[#7A6862]">
              We aren&apos;t a large corporate agency. We are a personal travel company where every detail matters.
            </p>
          </div>

          {/* Horizontally Moving Core Trip Pillars Marquee */}
          <div className="relative w-full overflow-hidden py-4 group">
            {/* Framed Viewport */}
            <div className="rounded-[36px] sm:rounded-[44px] border border-[#E8DCD5]/80 bg-[#F7EFEA]/60 backdrop-blur-xs p-4 sm:p-6 overflow-hidden relative shadow-inner">
              
              {/* Frame Header Label */}
              <div className="flex items-center justify-between px-2 pb-4 text-xs font-semibold text-[#997C70]">
                <span className="uppercase tracking-widest text-[#8EB486] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Core Trip Pillars
                </span>
                <span className="text-[11px] text-[#997C70]/80">
                  Hover to pause
                </span>
              </div>

              {/* Left Gradient Fade */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F7EFEA] to-transparent pointer-events-none z-10" />

                {/* Horizontally moving marquee track */}
                <div className="animate-marquee-left flex gap-6 items-stretch">
                  {[
                    ...[
                      {
                        num: "01",
                        icon: Smile,
                        title: "Small Friendly Batches",
                        tag: "12–16 Travellers Max",
                        desc: "We cap our groups to 12–16 people so nobody gets left behind and everyone leaves as family.",
                        perk: "Lifelong friendships & zero crowds",
                      },
                      {
                        num: "02",
                        icon: ShieldCheck,
                        title: "Female-Friendly & Safe",
                        tag: "100% Solo Safe",
                        desc: "100% safe for solo female travellers, curated stays, verified transport and dedicated leaders.",
                        perk: "Verified stays & female tour captains",
                      },
                      {
                        num: "03",
                        icon: HeartHandshake,
                        title: "Curated Stays & Vibe",
                        tag: "Boutique & Riverside",
                        desc: "Handpicked boutique hotels, lakeside camps, riverside stays and local culinary experiences.",
                        perk: "Scenic boutique hotels & cozy vibes",
                      },
                      {
                        num: "04",
                        icon: Compass,
                        title: "Offbeat & Personal",
                        tag: "Secret Spots & Leisure",
                        desc: "Carefully planned itineraries balancing must-see sights with secret spots and leisure time.",
                        perk: "Hidden views & relaxed pacing",
                      },
                    ],
                    ...[
                      {
                        num: "01",
                        icon: Smile,
                        title: "Small Friendly Batches",
                        tag: "12–16 Travellers Max",
                        desc: "We cap our groups to 12–16 people so nobody gets left behind and everyone leaves as family.",
                        perk: "Lifelong friendships & zero crowds",
                      },
                      {
                        num: "02",
                        icon: ShieldCheck,
                        title: "Female-Friendly & Safe",
                        tag: "100% Solo Safe",
                        desc: "100% safe for solo female travellers, curated stays, verified transport and dedicated leaders.",
                        perk: "Verified stays & female tour captains",
                      },
                      {
                        num: "03",
                        icon: HeartHandshake,
                        title: "Curated Stays & Vibe",
                        tag: "Boutique & Riverside",
                        desc: "Handpicked boutique hotels, lakeside camps, riverside stays and local culinary experiences.",
                        perk: "Scenic boutique hotels & cozy vibes",
                      },
                      {
                        num: "04",
                        icon: Compass,
                        title: "Offbeat & Personal",
                        tag: "Secret Spots & Leisure",
                        desc: "Carefully planned itineraries balancing must-see sights with secret spots and leisure time.",
                        perk: "Hidden views & relaxed pacing",
                      },
                    ],
                    ...[
                      {
                        num: "01",
                        icon: Smile,
                        title: "Small Friendly Batches",
                        tag: "12–16 Travellers Max",
                        desc: "We cap our groups to 12–16 people so nobody gets left behind and everyone leaves as family.",
                        perk: "Lifelong friendships & zero crowds",
                      },
                      {
                        num: "02",
                        icon: ShieldCheck,
                        title: "Female-Friendly & Safe",
                        tag: "100% Solo Safe",
                        desc: "100% safe for solo female travellers, curated stays, verified transport and dedicated leaders.",
                        perk: "Verified stays & female tour captains",
                      },
                      {
                        num: "03",
                        icon: HeartHandshake,
                        title: "Curated Stays & Vibe",
                        tag: "Boutique & Riverside",
                        desc: "Handpicked boutique hotels, lakeside camps, riverside stays and local culinary experiences.",
                        perk: "Scenic boutique hotels & cozy vibes",
                      },
                      {
                        num: "04",
                        icon: Compass,
                        title: "Offbeat & Personal",
                        tag: "Secret Spots & Leisure",
                        desc: "Carefully planned itineraries balancing must-see sights with secret spots and leisure time.",
                        perk: "Hidden views & relaxed pacing",
                      },
                    ],
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="w-[300px] sm:w-[340px] h-[250px] sm:h-[260px] p-6 rounded-[26px] bg-[#FDF7F4] border border-[#E8DCD5] flex flex-col justify-between shrink-0 shadow-sm hover:shadow-xl hover:border-[#8EB486] transition-all select-none cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-2xl bg-[#8EB486]/15 text-[#8EB486] flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8EB486] bg-[#8EB486]/10 px-3 py-1 rounded-full border border-[#8EB486]/20">
                            {item.tag}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-lg font-bold text-[#685752] line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-[#7A6862] leading-relaxed mt-1 line-clamp-3">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E8DCD5]/70 flex items-center justify-between text-[11px] text-[#997C70]">
                        <span className="truncate">{item.perk}</span>
                        <span className="font-mono text-[#8EB486] font-bold ml-2">{item.num}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Gradient Fade */}
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F7EFEA] to-transparent pointer-events-none z-10" />
              </div>
            </div>
          </div>
        </section>

      {/* ================= SECTION 4: DRAGGABLE DESTINATIONS SHOWCASE ================= */}
      <section className="relative flex min-h-[90vh] lg:min-h-screen w-full items-center justify-center overflow-clip bg-[#F7EFEA] border-t border-[#E8DCD5]">
        <DraggableCardContainer className="relative flex min-h-[90vh] lg:min-h-screen w-full items-center justify-center overflow-clip py-16">
          {/* Centered Hero Heading & Call to Action */}
          <div className="pointer-events-none relative z-0 mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-8 text-center select-none">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#8EB486]/30 shadow-xs">
              Handpicked Places & Sacred Valleys
            </span>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#685752] font-serif-italic drop-shadow-xs">
              Explore Top{" "}
              <SquigglyText
                stepDuration={70}
                scale={[5, 8]}
                className="text-[#8EB486]"
              >
                Destinations
              </SquigglyText>
            </h2>
            
            <p className="max-w-md text-sm sm:text-base text-[#7A6862] leading-relaxed">
              Drag and toss the destination polaroids across the screen to explore our dream mountain escapes, sacred shrines, and serene valleys.
            </p>

            <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>View All Destinations</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#FDF7F4] text-[#685752] border border-[#E8DCD5] text-xs font-bold tracking-wider uppercase shadow-xs hover:shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Explore Tours</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8EB486]" />
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 pt-1 text-[11px] font-semibold text-[#997C70]/70 tracking-widest uppercase">
              <span>✦ Drag any card</span>
              <span>•</span>
              <span>Fling to toss</span>
            </div>
          </div>

          {/* Draggable Destination Polaroid Cards */}
          {[
            {
              title: "Spiti Valley",
              subtitle: "Ancient Monasteries & Moon Lakes",
              tag: "Himachal",
              badge: "1 Batch",
              slug: "spiti",
              image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
              className: "absolute top-8 left-[6%] sm:left-[10%] lg:left-[14%] rotate-[-6deg]",
            },
            {
              title: "Mystic Meghalaya",
              subtitle: "Waterfalls & Living Root Bridges",
              tag: "Northeast",
              badge: "Popular",
              slug: "meghalaya",
              image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
              className: "absolute top-10 right-[6%] sm:right-[10%] lg:right-[14%] rotate-[7deg]",
            },
            {
              title: "Kedarnath Dham",
              subtitle: "12th Jyotirlinga & Garhwal Trek",
              tag: "Uttarakhand",
              badge: "Spiritual",
              slug: "kedarnath",
              image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80",
              className: "absolute bottom-12 left-[5%] sm:left-[8%] lg:left-[12%] rotate-[5deg]",
            },
            {
              title: "Kashmir Valley",
              subtitle: "Paradise on Earth & Dal Lake",
              tag: "J&K",
              badge: "Trending",
              slug: "kashmir",
              image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
              className: "absolute bottom-10 right-[5%] sm:right-[8%] lg:right-[12%] rotate-[-6deg]",
            },
            {
              title: "Manali & Kasol",
              subtitle: "Pine Forests & Parvati Riverside",
              tag: "Himachal",
              badge: "Weekly",
              slug: "manali",
              image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80",
              className: "absolute top-4 left-[34%] sm:left-[38%] rotate-[3deg] hidden md:block",
            },
            {
              title: "Rajasthan Desert",
              subtitle: "Golden Forts & Thar Dunes",
              tag: "Royal Heritage",
              badge: "Winter",
              slug: "rajasthan",
              image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
              className: "absolute bottom-6 left-[34%] sm:left-[37%] rotate-[-4deg] hidden md:block",
            },
            {
              title: "Nepal & Muktinath",
              subtitle: "Annapurna Peaks & Sacred Temples",
              tag: "Himalayas",
              badge: "Cross-Border",
              slug: "nepal",
              image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
              className: "absolute top-36 right-[26%] rotate-[9deg] hidden lg:block",
            },
          ].map((item) => (
            <DraggableCardBody
              key={item.title}
              className={cn(
                "w-72 sm:w-80 min-h-0 p-3.5 sm:p-4 rounded-3xl bg-[#FDF7F4] border border-[#E8DCD5] shadow-[0_20px_45px_-10px_rgba(104,87,82,0.2)] hover:shadow-[0_25px_55px_-8px_rgba(104,87,82,0.28)] z-10 select-none",
                item.className
              )}
            >
              <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-2xl bg-stone-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="pointer-events-none h-full w-full object-cover select-none"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                  {item.tag}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#8EB486] text-white text-[11px] font-bold shadow-xs">
                  {item.badge}
                </div>
              </div>

              <div className="mt-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-serif-italic text-[#685752]">
                    {item.title}
                  </h3>
                  <Link
                    href={`/destinations/${item.slug}`}
                    className="text-xs font-semibold text-[#8EB486] hover:text-[#7A9F73] flex items-center gap-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-[#7A6862] line-clamp-1">
                  {item.subtitle}
                </p>
              </div>
            </DraggableCardBody>
          ))}
        </DraggableCardContainer>
      </section>

      {/* ================= SECTION 5: TESTIMONIALS ================= */}
      <section className="relative w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5] overflow-hidden">
        <AmbientCircles variant="4" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Traveller Experiences
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#685752]">
              Loved By{" "}
              <SquigglyText
                stepDuration={70}
                scale={[4, 7]}
                className="text-[#8EB486] font-serif-italic"
              >
                Fellow Souls
              </SquigglyText>
            </h2>
            <p className="text-base text-[#7A6862]">
              Here&apos;s what our travelers say about their group trips with Sonali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div key={item.id} className="p-8 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] space-y-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#8EB486] text-[#8EB486]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#7A6862] italic leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E8DCD5]">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#E8DCD5]">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#685752]">{item.name}</p>
                    <p className="text-xs text-[#997C70]">{item.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8EB486] hover:underline">
              <span>Read All Traveller Reviews</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: HOW IT WORKS ================= */}
      <section className="relative w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5] overflow-hidden">
        <AmbientCircles variant="5" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Simple 4-Step Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#685752] mt-2">
              How It{" "}
              <SquigglyText
                stepDuration={70}
                scale={[4, 7]}
                className="text-[#8EB486] font-serif-italic"
              >
                Works
              </SquigglyText>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: "01", title: "Choose Your Trip", desc: "Find a destination that excites your soul." },
              { num: "02", title: "Get in Touch", desc: "Connect with us through our website enquiry form." },
              { num: "03", title: "Get Ready", desc: "Receive your trip details, packing list & prep guide." },
              { num: "04", title: "Travel With Us", desc: "Meet the group and enjoy an unforgettable experience." },
            ].map((step, idx) => (
              <div key={idx} className="relative p-6 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5]">
                <span className="text-5xl font-serif-italic font-bold text-[#8EB486]/35 block mb-4">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold text-[#685752] mb-2">{step.title}</h3>
                <p className="text-sm text-[#7A6862]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ================= SECTION 8: STORIES / BLOG ================= */}
      <section className="relative w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5] overflow-hidden">
        <AmbientCircles variant="1" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Editorial Journal
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#685752] mt-2">
                Stories From{" "}
                <SquigglyText
                  stepDuration={70}
                  scale={[4, 7]}
                  className="text-[#8EB486] font-serif-italic"
                >
                  The Road
                </SquigglyText>
              </h2>
            </div>
            <Link href="/stories" className="mt-4 md:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-[#8EB486] hover:underline group">
              <span>Read All Stories</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STORIES_DATA.slice(0, 2).map((story) => (
              <div key={story.id} className="group flex flex-col justify-between bg-[#F7EFEA] rounded-3xl p-6 border border-[#E8DCD5]">
                <div className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-[#7A6862] leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#E8DCD5] flex items-center justify-between mt-4">
                  <span className="text-xs text-[#997C70]">{story.date} • {story.readTime}</span>
                  <Link href={`/stories/${story.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-[#8EB486] hover:underline group">
                    <span>Read Story</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: ABOUT SONALI ================= */}
      <section className="relative w-full py-24 bg-[#F7EFEA] border-t border-[#E8DCD5] overflow-hidden">
        <AmbientCircles variant="2" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative h-[480px] sm:h-[560px] rounded-[100px] overflow-hidden shadow-2xl border-4 border-[#FDF7F4]">
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
                Meet Your Host
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif-italic font-bold text-[#685752]">
                Meet{" "}
                <SquigglyText
                  stepDuration={70}
                  scale={[4, 7]}
                  className="text-[#8EB486]"
                >
                  Sonali
                </SquigglyText>
              </h2>
              <p className="text-lg text-[#685752] font-medium">
                &ldquo;Behind every journey is someone who cares deeply about the experience.&rdquo;
              </p>
              <p className="text-base text-[#7A6862] leading-relaxed">
                Hi, I&apos;m Sonali! I started Travel With Sonali because I was tired of rigid corporate tours that treat travellers like numbers on a manifest. I believe travel is meant to be soulful, personal, comfortable, and full of genuine laughter.
              </p>
              <p className="text-base text-[#7A6862] leading-relaxed">
                Whether we&apos;re walking up to Kedarnath in the chilly morning air or sailing on a catamaran in Goa, my promise is simple: you&apos;ll be looked after like family.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-sm transition-all shadow-md"
                >
                  <span>Read Our Full Story</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FAQ ACCORDIONS ================= */}
      <section className="relative w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5] overflow-hidden">
        <AmbientCircles variant="3" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Clear Answers
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#685752] mt-2">
              Before You Pack{" "}
              <SquigglyText
                stepDuration={70}
                scale={[4, 7]}
                className="text-[#8EB486] font-serif-italic"
              >
                Your Bags...
              </SquigglyText>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS_DATA.slice(0, 6).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl bg-[#F7EFEA] border border-[#E8DCD5] overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-bold text-[#685752] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#8EB486] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-[#7A6862] leading-relaxed border-t border-[#E8DCD5]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/faq" className="inline-flex items-center gap-1 text-sm font-semibold text-[#8EB486] hover:underline group">
              <span>Have more questions? Read Full FAQ Page</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer onEnquireClick={() => handleEnquireClick("Footer Reveal")} />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={selectedTourName}
      />
    </div>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
