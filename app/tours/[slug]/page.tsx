"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Clock, 
  Users, 
  MapPin, 
  Bus, 
  Hotel, 
  Utensils, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MessageCircle, 
  Star, 
  ChevronDown, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import EnquireModal from "../../components/EnquireModal";
import LightboxModal from "../../components/LightboxModal";
import { TOURS_DATA } from "../../data/toursData";

export default function TourDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const tour = TOURS_DATA.find((t) => t.slug === resolvedParams.slug);

  const [enquireOpen, setEnquireOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between">
        <Navbar logoName="Travel With Sonali" />
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold text-[#1C1917]">Tour Not Found</h1>
          <p className="text-[#57524C]">The tour package you are looking for does not exist or has been updated.</p>
          <Link href="/tours" className="inline-block px-6 py-3 rounded-full bg-[#E05328] text-white text-sm font-semibold">
            View All Tours
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Travel With Sonali! I want to enquire about ${tour.title} departing on ${tour.departureDate}.`
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans pb-20 md:pb-0">
      <Navbar logoName="Travel With Sonali" />
      <WhatsAppFloat />

      {/* Breadcrumb Bar */}
      <div className="bg-[#F4EFEA] border-b border-[#E8E1D7] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#7A746E] flex items-center gap-2">
          <Link href="/tours" className="hover:text-[#E05328] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Tours
          </Link>
          <span>/</span>
          <span className="text-[#1C1917] font-medium truncate">{tour.title}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative w-full py-16 sm:py-24 bg-[#181614] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image src={tour.image} alt={tour.title} fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#E05328] text-white text-xs font-semibold">
              {tour.destination}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-stone-200 text-xs font-medium backdrop-blur-xs">
              Departure: {tour.departureDate}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            {tour.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-stone-300 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E05328]" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#E05328]" />
              {tour.groupSize}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#E05328]" />
              Starts at {tour.startingPoint}
            </span>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setEnquireOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm shadow-xl cursor-pointer"
            >
              Enquire Now ({tour.price})
            </button>
            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-sm shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Sidebar Grid */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A746E] block font-medium">Duration</span>
                <span className="text-sm font-bold text-[#1C1917]">{tour.duration}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A746E] block font-medium">Starting Point</span>
                <span className="text-sm font-bold text-[#1C1917]">{tour.startingPoint}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A746E] block font-medium">Transport</span>
                <span className="text-sm font-bold text-[#1C1917]">{tour.transport}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#7A746E] block font-medium">Meals</span>
                <span className="text-sm font-bold text-[#1C1917]">{tour.meals}</span>
              </div>
            </div>

            {/* Tour Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Tour Overview</h2>
              <p className="text-base text-[#57524C] leading-relaxed">
                {tour.overview}
              </p>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((item, idx) => {
                  const isOpen = openDayIndex === idx;
                  return (
                    <div key={idx} className="rounded-2xl bg-[#F4EFEA] border border-[#E8E1D7] overflow-hidden">
                      <button
                        onClick={() => setOpenDayIndex(isOpen ? null : idx)}
                        className="w-full px-6 py-4 text-left font-bold text-[#1C1917] flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-[#E05328]/10 text-[#E05328] text-xs font-semibold">
                            {item.day}
                          </span>
                          <span className="text-base font-semibold">{item.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[#E05328] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-sm text-[#57524C] leading-relaxed border-t border-[#E8E1D7]/60 space-y-3">
                          <p>{item.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#7A746E] pt-2">
                            {item.meals && <span className="bg-white px-3 py-1 rounded-full border border-[#D8CFC4]">🍲 Meals: {item.meals}</span>}
                            {item.stay && <span className="bg-white px-3 py-1 rounded-full border border-[#D8CFC4]">🏨 Stay: {item.stay}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions vs Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200 space-y-4">
                <h3 className="text-xl font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Package Inclusions
                </h3>
                <ul className="space-y-2.5 text-sm text-emerald-900">
                  {tour.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-200 space-y-4">
                <h3 className="text-xl font-bold text-rose-950 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Package Exclusions
                </h3>
                <ul className="space-y-2.5 text-sm text-rose-900">
                  {tour.exclusions.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Important Information */}
            {tour.importantInfo && tour.importantInfo.length > 0 && (
              <div className="p-6 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7] space-y-4">
                <h3 className="text-xl font-bold text-[#1C1917] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#E05328]" />
                  Important Information & Things to Carry
                </h3>
                <div className="space-y-4 text-sm text-[#57524C]">
                  {tour.importantInfo.map((info, i) => (
                    <div key={i}>
                      <h4 className="font-semibold text-[#1C1917] mb-1">{info.title}</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {info.details.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tour Gallery */}
            {tour.gallery && tour.gallery.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">Tour Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {tour.gallery.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxSrc(img)}
                      className="relative h-36 rounded-2xl overflow-hidden shadow-xs cursor-pointer group"
                    >
                      <Image src={img} alt="Gallery" fill className="object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sticky Desktop Booking Sidebar */}
          <div className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-8 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7] shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#7A746E] font-medium block">Starting Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold text-[#1C1917]">{tour.price}</span>
                  <span className="text-xs text-[#7A746E]">/ person</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[#57524C] pt-2 border-t border-[#E8E1D7]">
                <div className="flex items-center justify-between">
                  <span>Departure Date:</span>
                  <span className="font-semibold text-[#1C1917]">{tour.departureDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Batch Size:</span>
                  <span className="font-semibold text-[#1C1917]">{tour.groupSize}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Booking Advance:</span>
                  <span className="font-semibold text-emerald-700">₹3,000 to reserve</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setEnquireOpen(true)}
                  className="w-full py-3.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                >
                  Enquire About This Trip
                </button>
                <a
                  href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full border border-[#25D366] text-[#128C7E] bg-[#25D366]/10 hover:bg-[#25D366]/20 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF6F0] border-t border-[#E8E1D7] p-4 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] uppercase text-[#7A746E] block font-medium">Starting From</span>
          <span className="text-xl font-bold text-[#1C1917]">{tour.price}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/919876543210?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-[#25D366] text-white"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            onClick={() => setEnquireOpen(true)}
            className="px-6 py-3 rounded-full bg-[#E05328] text-white font-semibold text-xs shadow-md"
          >
            Enquire Now
          </button>
        </div>
      </div>

      <Footer />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={tour.title}
      />

      <LightboxModal
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
        imageSrc={lightboxSrc || ""}
        title={tour.title}
      />
    </div>
  );
}
