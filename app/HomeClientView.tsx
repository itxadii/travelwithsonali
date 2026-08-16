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
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-stretch my-auto">
          {/* Left Column: Headlines & Primary CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-10 lg:border-r border-[#E8E1D7] pb-8 lg:pb-0">
            <div className="pt-2 sm:pt-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E05328]/10 text-[#E05328] text-xs font-semibold tracking-wider uppercase mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Curated Experience Journeys
              </span>

              <h1 className="flex flex-col tracking-tight text-[#1C1917]">
                <span className="text-5xl sm:text-7xl lg:text-8xl font-bold leading-[0.98] tracking-tight">
                  Travel More.
                </span>
                <span className="font-serif-italic text-5xl sm:text-7xl lg:text-8xl font-normal leading-[1.05] mt-1 text-[#E05328]">
                  Experience More.
                </span>
              </h1>

              <p className="mt-6 text-[#57524C] text-base sm:text-lg leading-relaxed max-w-md">
                Group journeys, unforgettable destinations, and memories you&apos;ll carry home. Travel with a community of warm, adventurous souls.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2.5 bg-[#E05328] hover:bg-[#C8451D] text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore Tours</span>
                  <ArrowUpRight className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => handleEnquireClick("General Enquiry")}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#D8CFC4] hover:border-[#1C1917] text-[#1C1917] hover:bg-[#1C1917] hover:text-white font-medium text-base transition-all duration-300 cursor-pointer"
                >
                  <span>Talk to Sonali</span>
                </button>
              </div>
            </div>

            {/* Sub-Feature Strip */}
            <div className="mt-12 pt-8 border-t border-[#E8E1D7] flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#1C1917]">4.9 / 5.0</p>
                <p className="text-xs text-[#7A746E] font-medium">Over 2,500+ Happy Travellers</p>
              </div>
              <div className="flex items-center -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
                ].map((img, i) => (
                  <div key={i} className="relative w-10 h-10 rounded-full border-2 border-[#FAF6F0] overflow-hidden">
                    <Image src={img} alt="Traveller" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Cinematic Stadium Image */}
          <div className="lg:col-span-4 flex items-center justify-center px-0 lg:px-6 py-6 lg:py-0">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[600px] rounded-[180px] sm:rounded-[220px] overflow-hidden border-4 border-[#FAF6F0] shadow-2xl group transition-all duration-500 hover:shadow-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80"
                  alt="Travellers in Himalayas sunrise"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating CTA circle button */}
              <button
                onClick={() => handleEnquireClick("Manali & Kasol Group Trip")}
                className="absolute -bottom-2 right-2 sm:bottom-10 sm:-right-4 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E05328] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-[#FAF6F0] cursor-pointer"
                aria-label="Book Manali & Kasol"
              >
                <ArrowUpRight className="w-7 h-7" />
              </button>
            </div>
          </div>

          {/* Right Column: Reviewer, Stats & QR Badge */}
          <div className="lg:col-span-3 flex flex-col justify-between pl-0 lg:pl-8 lg:border-l border-[#E8E1D7] pt-8 lg:pt-0 space-y-8">
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E05328] text-[#E05328]" />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1C1917]">Roberto Carlos</span>
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#D8CFC4]">
                    <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" alt="Roberto Carlos" fill className="object-cover" />
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#4A4540] italic leading-relaxed">
                &ldquo;Travel With Sonali made finding my perfect group trip effortless with detailed listings and personalized recommendations!&rdquo;
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E8E1D7]">
                <div>
                  <div className="text-3xl font-bold tracking-tight text-[#1C1917]">
                    2,500<span className="text-[#E05328]">+</span>
                  </div>
                  <div className="text-xs text-[#7A746E] font-medium mt-0.5">
                    Happy users
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold tracking-tight text-[#1C1917]">
                    50<span className="text-[#E05328]">+</span>
                  </div>
                  <div className="text-xs text-[#7A746E] font-medium mt-0.5">
                    Group Trips
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#E8E1D7] flex items-end justify-between">
              <div className="flex flex-col items-center gap-2 pb-2">
                <a
                  href="#tours"
                  className="p-2.5 rounded-full hover:bg-[#E8E1D7]/50 text-[#1C1917] transition-all hover:translate-y-1"
                  aria-label="Scroll down"
                >
                  <ArrowDown className="w-5 h-5" />
                </a>
              </div>

              <QRCodeBadge label="SCAN TO FOLLOW" qrImageSrc="/qrimage.png" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: UPCOMING TOURS ================= */}
      <section id="tours" className="w-full py-20 border-t border-[#E8E1D7] bg-[#F4EFEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Upcoming Journeys
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917] mt-2">
                Where Are We Going Next?
              </h2>
              <p className="text-[#6B645C] text-base mt-2">
                Choose your next adventure and come travel with us.
              </p>
            </div>

            <Link
              href="/tours"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#E05328] hover:text-[#C8451D] group"
            >
              <span>View All 8+ Upcoming Tours</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.slice(0, 6).map((tour) => (
              <div
                key={tour.id}
                className="group relative bg-[#FAF6F0] rounded-3xl overflow-hidden border border-[#E8E1D7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
                      {tour.destination}
                    </div>
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#E05328] text-white text-xs font-semibold">
                      {tour.departureDate}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#7A746E]">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#E05328]" />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#E05328]" />
                        {tour.groupSize}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#1C1917] group-hover:text-[#E05328] transition-colors line-clamp-2">
                      {tour.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#57524C] line-clamp-2 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-[#E8E1D7]/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#7A746E] uppercase tracking-wider block">Starting From</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#1C1917]">{tour.price}</span>
                      {tour.originalPrice && (
                        <span className="text-xs text-[#8C847B] line-through">{tour.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEnquireClick(tour.title)}
                      className="px-3.5 py-2 rounded-full border border-[#E05328] text-[#E05328] hover:bg-[#E05328] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Enquire
                    </button>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#E05328] text-white text-xs font-semibold transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: WHY TRAVEL WITH SONALI ================= */}
      <section className="w-full py-24 bg-[#FAF6F0] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
              The Personal Touch
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
              Why Travel With Sonali?
            </h2>
            <p className="text-base text-[#57524C]">
              We aren&apos;t a large corporate agency. We are a personal travel company where every detail matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <div key={idx} className="p-8 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7] space-y-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#E05328]/10 text-[#E05328] flex items-center justify-center">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C1917]">{item.title}</h3>
                <p className="text-sm text-[#57524C] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: DESTINATIONS ================= */}
      <section className="w-full py-24 bg-[#F4EFEA] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Handpicked Places
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917] mt-2">
                Explore Top Destinations
              </h2>
            </div>
            <Link href="/destinations" className="mt-4 md:mt-0 text-sm font-semibold text-[#E05328] hover:underline">
              View All Destinations →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-md border border-[#E8E1D7] block"
              >
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E05328] bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs inline-block">
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
      <section className="w-full py-24 bg-[#FAF6F0] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
              Traveller Experiences
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1C1917]">
              Loved By Fellow Souls
            </h2>
            <p className="text-base text-[#57524C]">
              Here&apos;s what our travelers say about their group trips with Sonali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.slice(0, 3).map((item) => (
              <div key={item.id} className="p-8 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7] space-y-6 flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E05328] text-[#E05328]" />
                    ))}
                  </div>
                  <p className="text-sm text-[#4A4540] italic leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E8E1D7]">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D8CFC4]">
                    <Image src={item.avatar} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1C1917]">{item.name}</p>
                    <p className="text-xs text-[#7A746E]">{item.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/testimonials" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E05328] hover:underline">
              <span>Read All Traveller Reviews</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: HOW IT WORKS ================= */}
      <section className="w-full py-24 bg-[#FAF6F0] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
              Simple 4-Step Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1C1917] mt-2">
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
              <div key={idx} className="relative p-6 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7]">
                <span className="text-5xl font-serif-italic font-bold text-[#E05328]/30 block mb-4">
                  {step.num}
                </span>
                <h3 className="text-xl font-bold text-[#1C1917] mb-2">{step.title}</h3>
                <p className="text-sm text-[#57524C]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: INSTAGRAM FEED ================= */}
      <section className="w-full py-24 bg-[#FAF6F0] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
              Social Community
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1C1917] mt-2">
              Follow Our Moments on Instagram
            </h2>
            <p className="text-sm text-[#57524C] mt-2">
              Tag @travelwithsonali to get featured in our stories.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
            ].map((img, idx) => (
              <a
                key={idx}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-48 rounded-2xl overflow-hidden shadow-xs border border-[#E8E1D7]"
              >
                <Image src={img} alt="Instagram Moment" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <InstagramIcon className="w-6 h-6" />
                </div>
              </a>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-[#D8CFC4] hover:bg-[#E05328] hover:text-white hover:border-[#E05328] text-[#1C1917] text-sm font-semibold transition-all shadow-sm"
            >
              <InstagramIcon className="w-4 h-4 fill-current inline" />
              <span>Follow @travelwithsonali</span>
            </a>

            <QRCodeBadge label="SCAN TO FOLLOW" qrImageSrc="/qrimage.png" />
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: STORIES / BLOG ================= */}
      <section className="w-full py-24 bg-[#FAF6F0] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Editorial Journal
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-[#1C1917] mt-2">
                Stories From The Road
              </h2>
            </div>
            <Link href="/stories" className="mt-4 md:mt-0 text-sm font-semibold text-[#E05328] hover:underline">
              Read All Stories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {STORIES_DATA.slice(0, 2).map((story) => (
              <div key={story.id} className="group flex flex-col justify-between bg-[#F4EFEA] rounded-3xl p-6 border border-[#E8E1D7]">
                <div className="space-y-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image src={story.image} alt={story.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                      {story.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1C1917] group-hover:text-[#E05328] transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-[#57524C] leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#E8E1D7] flex items-center justify-between mt-4">
                  <span className="text-xs text-[#7A746E]">{story.date} • {story.readTime}</span>
                  <Link href={`/stories/${story.slug}`} className="text-xs font-semibold text-[#E05328] hover:underline">
                    Read Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 9: ABOUT SONALI ================= */}
      <section className="w-full py-24 bg-[#F4EFEA] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="relative h-[480px] sm:h-[560px] rounded-[100px] overflow-hidden shadow-2xl border-4 border-[#FAF6F0]">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"
                  alt="Sonali Sharma Founder"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Meet Your Host
              </span>
              <h2 className="text-4xl sm:text-5xl font-serif-italic font-bold text-[#1C1917]">
                Meet Sonali
              </h2>
              <p className="text-lg text-[#1C1917] font-medium">
                &ldquo;Behind every journey is someone who cares deeply about the experience.&rdquo;
              </p>
              <p className="text-base text-[#57524C] leading-relaxed">
                Hi, I&apos;m Sonali! I started Travel With Sonali because I was tired of rigid corporate tours that treat travellers like numbers on a manifest. I believe travel is meant to be soulful, personal, comfortable, and full of genuine laughter.
              </p>
              <p className="text-base text-[#57524C] leading-relaxed">
                Whether we&apos;re walking up to Kedarnath in the chilly morning air or sailing on a catamaran in Goa, my promise is simple: you&apos;ll be looked after like family.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm transition-all shadow-md"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FAQ ACCORDIONS ================= */}
      <section className="w-full py-24 bg-[#FAF6F0] border-t border-[#E8E1D7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
              Clear Answers
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#1C1917] mt-2">
              Before You Pack Your Bags...
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS_DATA.slice(0, 6).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl bg-[#F4EFEA] border border-[#E8E1D7] overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-bold text-[#1C1917] flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#E05328] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-sm text-[#57524C] leading-relaxed border-t border-[#E8E1D7]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/faq" className="text-sm font-semibold text-[#E05328] hover:underline">
              Have more questions? Read Full FAQ Page →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= SECTION 11: FINAL CTA ================= */}
      <section className="relative w-full py-32 bg-[#181614] text-white overflow-hidden">
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
          <p className="text-stone-300 text-lg sm:text-xl max-w-xl mx-auto">
            Find your next journey with Travel With Sonali.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tours"
              className="px-8 py-4 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-base shadow-xl transition-all hover:scale-105"
            >
              Explore Upcoming Tours
            </Link>

            <button
              onClick={() => handleEnquireClick("Final CTA")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-stone-100 text-[#1C1917] font-semibold text-base shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Send An Enquiry
            </button>
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
