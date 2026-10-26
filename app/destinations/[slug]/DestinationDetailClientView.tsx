"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Compass,
  Calendar,
  Thermometer,
  Mountain,
  Plane,
  Wifi,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ArrowUpRight,
  Camera,
  MessageCircle,
} from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import AmbientCircles from "@/app/components/AmbientCircles";
import EnquireModal from "@/app/components/EnquireModal";
import LightboxModal from "@/app/components/LightboxModal";
import WhatsAppFloatingButton from "@/app/components/WhatsAppFloatingButton";
import { Destination } from "@/app/data/destinationsData";
import { Tour } from "@/app/data/toursData";

interface DestinationDetailClientViewProps {
  destination: Destination;
  tours: Tour[];
  relatedDestinations: Destination[];
}

export default function DestinationDetailClientView({
  destination,
  tours,
  relatedDestinations,
}: DestinationDetailClientViewProps) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState(`${destination.name} Tour`);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleOpenEnquire = (subject: string) => {
    setEnquirySubject(subject);
    setEnquireOpen(true);
  };

  const handleOpenLightbox = (src: string, title: string) => {
    setLightboxSrc(src);
    setLightboxTitle(title);
  };

  const galleryImages = destination.gallery && destination.gallery.length > 0
    ? destination.gallery
    : [destination.image];

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans selection:bg-[#8EB486]/30">
      <Navbar logoName="Travel With Sonali" />

      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="bg-[#F7EFEA] border-b border-[#E8DCD5] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#7A6862] flex items-center gap-2">
          <Link href="/" className="hover:text-[#4A7244] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/destinations" className="hover:text-[#4A7244] flex items-center gap-1 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
            Destinations
          </Link>
          <span>/</span>
          <span className="text-[#685752] font-semibold truncate">{destination.name}</span>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="relative w-full py-20 sm:py-28 bg-[#4C3E3A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Badges Ribbon */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A7244] text-white text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              {destination.tripVibe || "Soulful Adventure"}
            </span>

            <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/20 text-stone-200 text-xs font-medium backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5 text-[#4A7244]" />
              Best Season: {destination.bestTimeToVisit}
            </span>

            <span className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-medium backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {tours.length > 0 ? `${tours.length} Active Tours` : "Custom Departures"}
            </span>
          </div>

          {/* Destination Name & Poetic Tagline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-tight">
              {destination.name}
            </h1>
            <p className="text-xl sm:text-2xl text-stone-300 max-w-3xl font-serif-italic">
              &ldquo;{destination.tagline}&rdquo;
            </p>
            {destination.heroSubtitle && (
              <p className="text-sm sm:text-base text-stone-300/90 max-w-2xl pt-1">
                {destination.heroSubtitle}
              </p>
            )}
          </div>

          {/* Quick CTA Actions */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#tours-section"
              className="px-7 py-3.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-sm shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>View Available Tours</span>
              <ChevronDown className="w-4 h-4" />
            </a>

            <button
              onClick={() => handleOpenEnquire(`${destination.name} Custom Inquiry`)}
              className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/30 backdrop-blur-xs transition-all cursor-pointer"
            >
              Enquire Custom Trip
            </button>

            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Sonali, I want to inquire about upcoming trips to ${destination.name}!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-medium text-xs backdrop-blur-xs transition-all inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Travel Essentials Ribbon / Quick Facts */}
      <section className="bg-[#F7EFEA] border-b border-[#E8DCD5] py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-white border border-[#E8DCD5] text-[#4A7244] shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#7A6862] font-semibold block">
                  Ideal Duration
                </span>
                <p className="text-sm sm:text-base font-bold text-[#685752]">
                  {destination.idealDuration || "5 - 7 Days"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-white border border-[#E8DCD5] text-[#4A7244] shadow-xs">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#7A6862] font-semibold block">
                  Elevation / Altitude
                </span>
                <p className="text-sm sm:text-base font-bold text-[#685752] truncate">
                  {destination.altitude || "Varies by Valley"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-white border border-[#E8DCD5] text-[#4A7244] shadow-xs">
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#7A6862] font-semibold block">
                  Nearest Travel Hub
                </span>
                <p className="text-sm sm:text-base font-bold text-[#685752] line-clamp-1">
                  {destination.nearestAirport || "Major Airport"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-2xl bg-white border border-[#E8DCD5] text-[#4A7244] shadow-xs">
                <Wifi className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-[#7A6862] font-semibold block">
                  Network Connectivity
                </span>
                <p className="text-sm sm:text-base font-bold text-[#685752] truncate">
                  {destination.networkConnectivity ? "4G / Partial Off-Grid" : "Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Soul of the Destination & Curator's Note */}
        <section className="relative overflow-hidden w-full py-16 sm:py-20">
          <AmbientCircles variant="1" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: About & Narrative */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                    Destination Overview
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-serif-italic font-bold text-[#685752] mt-1">
                    The Soul of <span className="text-[#4A7244]">{destination.name}</span>
                  </h2>
                </div>

                <p className="text-base sm:text-lg text-[#7A6862] leading-relaxed">
                  {destination.description}
                </p>

                {/* Highlights Pills */}
                <div className="pt-4 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-[#7A6862] font-bold">
                    Signature Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {destination.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7EFEA] border border-[#E8DCD5] text-xs font-medium text-[#685752]"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#4A7244]" />
                        <span>{h}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Sonali's Personal Note */}
              <div className="lg:col-span-5">
                <div className="bg-[#F7EFEA] rounded-3xl p-6 sm:p-8 border border-[#E8DCD5] shadow-sm relative overflow-hidden space-y-5">
                  <div className="flex items-center gap-4 border-b border-[#E8DCD5] pb-5">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#8EB486] shrink-0">
                      <Image
                        src="/images/sonali.jpg"
                        alt="Sonali Palekar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#685752]">
                        Sonali Palekar
                      </h4>
                      <p className="text-xs text-[#4A7244] font-medium">
                        Founder & Lead Explorer
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-[#7A6862] mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#4A7244]" />
                        Personally Scouted Destination
                      </span>
                    </div>
                  </div>

                  <blockquote className="text-sm sm:text-base text-[#7A6862] italic font-serif-italic leading-relaxed">
                    &ldquo;{destination.curatorNote?.quote || `Exploring ${destination.name} with a group of curious minds is transformative. We take care of every road hurdle and stay detail so you can immerse fully in the magic of the journey.`}&rdquo;
                  </blockquote>

                  <div className="pt-2 flex items-center justify-between text-xs text-[#7A6862] border-t border-[#E8DCD5]/60">
                    <span>Curated Group Departures</span>
                    <button
                      onClick={() => handleOpenEnquire(`Personal Query: ${destination.name}`)}
                      className="text-[#4A7244] font-bold hover:underline cursor-pointer"
                    >
                      Talk to Sonali →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Experiences & Bucket-List Moments */}
        {destination.experiences && destination.experiences.length > 0 && (
          <section className="relative overflow-hidden w-full py-16 bg-[#F7EFEA]/60 border-t border-[#E8DCD5]">
            <AmbientCircles variant="2" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                  Curated Itinerary Moments
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#685752] mt-1">
                  Bucket-List Experiences in {destination.name}
                </h2>
                <p className="text-sm text-[#7A6862] mt-2">
                  Handpicked moments designed to immerse you deeply in the region’s natural splendour and living culture.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {destination.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs hover:shadow-md transition-all duration-300 space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#F7EFEA] border border-[#E8DCD5] text-xs font-semibold text-[#4A7244]">
                        {exp.badge || `Highlight 0${index + 1}`}
                      </span>
                      <Sparkles className="w-4 h-4 text-[#8EB486]/60 group-hover:text-[#4A7244] transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-[#685752] group-hover:text-[#4A7244] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-[#7A6862] leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Visual Atmosphere Gallery */}
        <section className="relative overflow-hidden w-full py-16 border-t border-[#E8DCD5]">
          <AmbientCircles variant="3" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                  Atmospheric Photography
                </span>
                <h2 className="text-3xl font-bold text-[#685752] mt-1">
                  Snapshots of {destination.name}
                </h2>
              </div>
              <span className="text-xs text-[#7A6862] flex items-center gap-1.5 mt-2 sm:mt-0">
                <Camera className="w-3.5 h-3.5 text-[#4A7244]" />
                Click any photo to enlarge
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${destination.name} photo ${i + 1}`}
                  onClick={() => handleOpenLightbox(img, `${destination.name} - View ${i + 1}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOpenLightbox(img, `${destination.name} - View ${i + 1}`);
                    }
                  }}
                  className="group relative h-48 sm:h-64 rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#4A7244]/60"
                >
                  <Image
                    src={img}
                    alt={`${destination.name} photo ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      View
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* When To Visit: Seasonal Guide */}
        {destination.seasons && destination.seasons.length > 0 && (
          <section className="relative overflow-hidden w-full py-16 bg-[#F7EFEA] border-t border-[#E8DCD5]">
            <AmbientCircles variant="4" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                  Weather & Seasons
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#685752] mt-1">
                  Best Time to Visit {destination.name}
                </h2>
                <p className="text-sm text-[#7A6862] mt-2">
                  Each season brings its own personality. Choose the climate that matches your travel dreams.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destination.seasons.map((season, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          season.tag === "Peak Season"
                            ? "bg-[#4A7244] text-white"
                            : season.tag === "Winter Snow"
                            ? "bg-sky-700 text-white"
                            : "bg-[#685752] text-white"
                        }`}>
                          {season.tag}
                        </span>

                        <span className="text-xs font-semibold text-[#4A7244] flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5" />
                          {season.temperature}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#685752]">
                        {season.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#7A6862]">
                        {season.months}
                      </p>

                      <p className="text-xs sm:text-sm text-[#7A6862] leading-relaxed">
                        {season.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8DCD5]/60 text-xs text-[#7A6862] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#4A7244]" />
                      <span>Departures scheduled during this window</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Available Tours Section */}
        <section id="tours-section" className="relative overflow-hidden w-full py-16 border-t border-[#E8DCD5]">
          <AmbientCircles variant="5" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                  Upcoming Group Batches
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#685752] mt-1">
                  Tours Available for {destination.name}
                </h2>
                <p className="text-sm text-[#7A6862] mt-1">
                  Join a small, friendly group of travelers with fixed departures and verified stays.
                </p>
              </div>

              <Link
                href="/tours"
                className="mt-4 sm:mt-0 text-sm font-semibold text-[#4A7244] hover:underline inline-flex items-center gap-1"
              >
                <span>View All Tours</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {tours.length === 0 ? (
              <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] space-y-4 max-w-3xl mx-auto">
                <Compass className="w-10 h-10 text-[#4A7244] mx-auto" />
                <h3 className="text-xl font-bold text-[#685752]">
                  Custom Group Departures for {destination.name}
                </h3>
                <p className="text-sm text-[#7A6862] max-w-xl mx-auto leading-relaxed">
                  We are currently finalizing dates for the upcoming batch to {destination.name}. If you have a private group of friends, family, or colleagues, Sonali can curate an exclusive departure for your dates.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleOpenEnquire(`${destination.name} Custom Group Departure`)}
                    className="px-6 py-3 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    Request Custom Batch Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="group flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-xs hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      <div className="relative h-60 w-full overflow-hidden">
                        <Image
                          src={tour.image}
                          alt={tour.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#4A7244] text-white text-xs font-semibold shadow-xs">
                          {tour.destination}
                        </span>
                        <span className="absolute bottom-4 left-4 text-xs font-semibold text-white/95">
                          {tour.duration}
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <Link href={`/tours/${tour.slug}`}>
                          <h3 className="text-xl font-bold text-[#685752] group-hover:text-[#4A7244] transition-colors line-clamp-2">
                            {tour.title}
                          </h3>
                        </Link>
                        <p className="text-xs text-[#7A6862] line-clamp-2 leading-relaxed">
                          {tour.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#7A6862]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#4A7244]" />
                            {tour.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#4A7244]" />
                            Starts: {tour.startingPoint}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-[#E8DCD5]/70 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-xs uppercase text-[#7A6862] block font-semibold">
                          Starting From
                        </span>
                        <span className="text-xl font-bold text-[#685752]">{tour.price}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEnquire(tour.title)}
                          className="px-4 py-2 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                          Enquire
                        </button>
                        <Link
                          href={`/tours/${tour.slug}`}
                          className="p-2 rounded-full border border-[#E8DCD5] hover:border-[#4A7244] text-[#685752] hover:text-[#4A7244] transition-all"
                          aria-label={`View details of ${tour.title}`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Packing Essentials & Travel Tips */}
        {(destination.packingEssentials || destination.travelTips) && (
          <section className="relative overflow-hidden w-full py-16 bg-[#F7EFEA] border-t border-[#E8DCD5]">
            <AmbientCircles variant="1" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Packing List */}
                {destination.packingEssentials && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCD5] shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-[#E8DCD5] pb-4">
                      <div className="p-2 rounded-xl bg-[#F7EFEA] text-[#4A7244]">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#685752]">
                          What to Pack
                        </h3>
                        <p className="text-xs text-[#7A6862]">Essential gear for this destination</p>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-2">
                      {destination.packingEssentials.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#7A6862]">
                          <span className="w-5 h-5 rounded-full bg-[#8EB486]/15 text-[#4A7244] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            ✓
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Travel Tips */}
                {destination.travelTips && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DCD5] shadow-xs space-y-4">
                    <div className="flex items-center gap-3 border-b border-[#E8DCD5] pb-4">
                      <div className="p-2 rounded-xl bg-[#F7EFEA] text-[#4A7244]">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#685752]">
                          Local Etiquette & Pro Tips
                        </h3>
                        <p className="text-xs text-[#7A6862]">Travel smoothly & respectfully</p>
                      </div>
                    </div>

                    <ul className="space-y-3 pt-2">
                      {destination.travelTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-[#7A6862]">
                          <span className="w-5 h-5 rounded-full bg-[#685752]/10 text-[#685752] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            i
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Frequently Asked Questions */}
        {destination.faqs && destination.faqs.length > 0 && (
          <section className="relative overflow-hidden w-full py-16 border-t border-[#E8DCD5]">
            <AmbientCircles variant="2" />
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                  Helpful Information
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#685752]">
                  Frequently Asked Questions
                </h2>
                <p className="text-sm text-[#7A6862]">
                  Everything you need to know before packing your bags for {destination.name}.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {destination.faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-[#F7EFEA] border border-[#E8DCD5] overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#685752] hover:text-[#4A7244] transition-colors cursor-pointer"
                        aria-expanded={isOpen}
                      >
                        <span className="flex items-center gap-2.5">
                          <HelpCircle className="w-4 h-4 text-[#4A7244] shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#7A6862] transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180 text-[#4A7244]" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-sm text-[#7A6862] leading-relaxed border-t border-[#E8DCD5]/60">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Custom Group Enquiry CTA Section */}
        <section className="relative overflow-hidden w-full py-16 bg-[#685752] text-white">
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#8EB486] text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Tailored Travel
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif-italic font-bold tracking-tight">
              Ready to Explore {destination.name} with Your Tribe?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Whether you want to join an upcoming open batch or organise a private family or college group departure, let us craft an unforgettable itinerary tailored to your pace.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => handleOpenEnquire(`${destination.name} Custom Group`)}
                className="px-8 py-3.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-sm shadow-xl transition-all cursor-pointer"
              >
                Plan a Custom Itinerary
              </button>
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Related Destinations */}
        {relatedDestinations.length > 0 && (
          <section className="relative overflow-hidden w-full py-16 border-t border-[#E8DCD5]">
            <AmbientCircles variant="5" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#4A7244] font-bold">
                    Continue The Journey
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#685752] mt-1">
                    Other Destinations You May Love
                  </h2>
                </div>
                <Link
                  href="/destinations"
                  className="mt-3 sm:mt-0 text-sm font-semibold text-[#4A7244] hover:underline inline-flex items-center gap-1"
                >
                  <span>View All Destinations</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedDestinations.map((d) => (
                  <Link
                    key={d.id}
                    href={`/destinations/${d.slug}`}
                    className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-[#E8DCD5] block transition-all"
                  >
                    <Image
                      src={d.image}
                      alt={d.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#4A7244] text-white text-xs font-semibold">
                        Best: {d.bestTimeToVisit}
                      </span>
                    </div>
                    <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                      <h3 className="text-xl font-bold group-hover:text-[#8EB486] transition-colors">
                        {d.name}
                      </h3>
                      <p className="text-xs text-stone-300 line-clamp-1">
                        &ldquo;{d.tagline}&rdquo;
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Interactive Lightbox Modal */}
      <LightboxModal
        isOpen={Boolean(lightboxSrc)}
        onClose={() => setLightboxSrc(null)}
        imageSrc={lightboxSrc || ""}
        title={lightboxTitle}
        location={destination.name}
      />

      {/* Enquiry Modal */}
      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={enquirySubject}
      />

      {/* Floating WhatsApp Action Button */}
      <WhatsAppFloatingButton />
    </div>
  );
}
