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
  ArrowRight,
} from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EnquireModal from "./components/EnquireModal";
import QRCodeBadge from "./components/QRCodeBadge";
import StackedTourCards from "./components/StackedTourCards";
import InstagramRoundCarousel from "./components/InstagramRoundCarousel";

import { Tour } from "./data/toursData";
import { Destination } from "./data/destinationsData";
import { STORIES_DATA } from "./data/storiesData";
import { TESTIMONIALS_DATA } from "./data/testimonialsData";
import { FAQS_DATA } from "./data/faqsData";

interface HomeClientViewProps {
  tours: Tour[];
  destinations: Destination[];
}

export default function HomeClientView({ tours, destinations }: HomeClientViewProps) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedTourName, setSelectedTourName] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleEnquireClick = (tourName?: string) => {
    if (tourName) setSelectedTourName(tourName);
    setEnquireOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans selection:bg-[#E05328] selection:text-white">
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
                    Experience More.
                  </span>
                </h1>

                <p className="mt-4 sm:mt-6 text-stone-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">
                  Group journeys, unforgettable destinations, and memories you&apos;ll carry home. Travel with a community of warm, adventurous souls.
                </p>

                <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href="/tours"
                    className="inline-flex items-center gap-2 bg-[#8EB486] hover:bg-[#7A9F73] text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Explore Tours</span>
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
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

            {/* Center Column: Cinematic Stadium Image featuring Sonali */}
            <div className="lg:col-span-4 flex items-center justify-center px-0 lg:px-6 py-4 lg:py-0">
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

              <div className="pt-4 lg:pt-8 border-t border-white/15 flex items-center justify-between">
                <div className="flex flex-col items-start gap-2">
                </div>

                {/* QR Badge: Full on tablet/desktop, sleek pill link on mobile */}
                <div className="hidden sm:block">
                  <QRCodeBadge label="SCAN TO FOLLOW" qrImageSrc="/qrimage.png" size="md" />
                </div>
                <div className="sm:hidden">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold tracking-wider uppercase transition-all backdrop-blur-xs"
                  >
                    Follow Sonali
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: INSTAGRAM 3D ROUND CAROUSEL ================= */}
      <InstagramRoundCarousel />

      {/* ================= SECTION 3: UPCOMING TOURS ================= */}
      <section id="tours" className="w-full py-20 border-t border-[#E8DCD5] bg-[#F7EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Upcoming Journeys
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#685752] mt-2">
                Where Are We Going Next?
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
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
      <section className="w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Meet Sonali & The Personal Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#685752]">
              Why Travel With Sonali?
            </h2>
            <p className="text-base text-[#7A6862]">
              We aren&apos;t a large corporate agency. We are a personal travel company where every detail matters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Sonali Founder Card */}
            <div className="lg:col-span-5 relative group">
              <div className="relative h-[460px] sm:h-[520px] rounded-[60px] overflow-hidden shadow-xl border-4 border-[#F7EFEA]">
                <Image
                  src="/images/sonali.png"
                  alt="Meet Sonali Palekar - Founder & Host"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#8EB486] text-xs font-semibold uppercase tracking-wider">
                    Founder & Tour Leader
                  </span>
                  <h3 className="text-2xl font-bold font-serif-italic">Sonali Palekar</h3>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    &ldquo;Every trip is personal. I travel with you as a friend, ensuring every memory is authentic, safe, and unforgettable.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Key Highlights */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Smile,
                  title: "Small Friendly Batches",
                  desc: "We cap our groups to 12-16 people so nobody gets left behind and everyone leaves as family.",
                },
                {
                  icon: ShieldCheck,
                  title: "Female-Friendly & Safe",
                  desc: "100% safe for solo female travellers, curated stays, verified transport and dedicated leaders.",
                },
                {
                  icon: HeartHandshake,
                  title: "Curated Stays & Vibe",
                  desc: "Handpicked boutique hotels, lakeside camps, riverside stays and local culinary experiences.",
                },
                {
                  icon: Compass,
                  title: "Offbeat & Personal",
                  desc: "Carefully planned itineraries balancing must-see sights with secret spots and leisure time.",
                },
              ].map((item, idx) => (
                <div key={idx} className="p-7 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] space-y-3.5 hover:shadow-md transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[#8EB486]/15 text-[#8EB486] flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-[#685752]">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-[#7A6862] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: DESTINATIONS ================= */}
      <section className="w-full py-24 bg-[#F7EFEA] border-t border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Handpicked Places
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#685752] mt-2">
                Explore Top Destinations
              </h2>
            </div>
            <Link href="/destinations" className="mt-4 md:mt-0 text-sm font-semibold text-[#8EB486] hover:underline">
              View All Destinations →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-md border border-[#E8DCD5] block"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8EB486] bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs inline-block">
                    {dest.bestTimeToVisit}
                  </span>
                  <h3 className="text-2xl font-bold font-serif-italic">{dest.name}</h3>
                  <p className="text-xs text-stone-300 line-clamp-1 italic">&ldquo;{dest.tagline}&rdquo;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: TESTIMONIALS ================= */}
      <section className="w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Traveller Experiences
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#685752]">
              Loved By Fellow Souls
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
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: HOW IT WORKS ================= */}
      <section className="w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Simple 4-Step Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#685752] mt-2">
              How It Works
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
      <section className="w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Editorial Journal
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#685752] mt-2">
                Stories From The Road
              </h2>
            </div>
            <Link href="/stories" className="mt-4 md:mt-0 text-sm font-semibold text-[#8EB486] hover:underline">
              Read All Stories →
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
                  <Link href={`/stories/${story.slug}`} className="text-xs font-semibold text-[#8EB486] hover:underline">
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: ABOUT SONALI ================= */}
      <section className="w-full py-24 bg-[#F7EFEA] border-t border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Meet Sonali
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
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FINAL CTA ================= */}
      <section className="relative w-full py-32 bg-[#4C3E3A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80"
            alt="Himalayas landscape"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-5xl sm:text-7xl font-serif-italic font-bold tracking-tight leading-none">
            &ldquo;The world is waiting. Where are you going next?&rdquo;
          </h2>
          <p className="text-[#DFD3CE] text-lg sm:text-xl max-w-xl mx-auto">
            Find your next journey with Travel With Sonali.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tours"
              className="px-8 py-4 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-base shadow-xl transition-all hover:scale-105"
            >
              Explore Upcoming Tours
            </Link>

            <button
              onClick={() => handleEnquireClick("Final CTA")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-stone-100 text-[#685752] font-semibold text-base shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Send An Enquiry
            </button>
          </div>
        </div>
      </section>

      {/* ================= SECTION 11: FAQ ACCORDIONS ================= */}
      <section className="w-full py-24 bg-[#FDF7F4] border-t border-[#E8DCD5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
              Clear Answers
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#685752] mt-2">
              Before You Pack Your Bags...
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
            <Link href="/faq" className="text-sm font-semibold text-[#8EB486] hover:underline">
              Have more questions? Read Full FAQ Page →
            </Link>
          </div>
        </div>
      </section>

      <Footer />

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
