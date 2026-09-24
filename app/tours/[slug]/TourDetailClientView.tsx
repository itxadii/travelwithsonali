"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  XCircle,
  ChevronDown,
  AlertCircle,
  ChevronLeft,
  Star,
} from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import EnquireModal from "@/app/components/EnquireModal";
import LightboxModal from "@/app/components/LightboxModal";
import AmbientCircles from "@/app/components/AmbientCircles";
import WhatsAppFloatingButton from "@/app/components/WhatsAppFloatingButton";
import TourReviewsSection from "@/app/components/TourReviewsSection";
import { Tour } from "@/app/data/toursData";

export default function TourDetailClientView({ tour }: { tour: Tour }) {
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans pb-20 md:pb-0">
      <Navbar logoName="Travel With Sonali" />

      {/* Breadcrumb Bar */}
      <div className="bg-[#F7EFEA] border-b border-[#E8DCD5] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#997C70] flex items-center gap-2">
          <Link href="/tours" className="hover:text-[#8EB486] flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            Tours
          </Link>
          <span>/</span>
          <span className="text-[#685752] font-medium truncate">{tour.title}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative w-full py-16 sm:py-24 bg-[#4C3E3A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={typeof tour.image === "string" && tour.image ? tour.image : "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"}
            alt={tour.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 rounded-full bg-[#8EB486] text-white text-xs font-semibold">
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
              <Clock className="w-4 h-4 text-[#8EB486]" />
              {tour.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#8EB486]" />
              {tour.groupSize}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#8EB486]" />
              Starts at {tour.startingPoint}
            </span>
            <a
              href="#reviews-section"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Reviews & Stories</span>
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => setEnquireOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-sm shadow-xl cursor-pointer"
            >
              Enquire Now ({tour.price})
            </button>
          </div>
        </div>
      </section>

      {/* Main Content & Sticky Sidebar Grid */}
      <section className="relative w-full py-12 flex-1">
        <AmbientCircles variant="2" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Quick Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#997C70] block font-medium">Duration</span>
                <span className="text-sm font-bold text-[#685752]">{tour.duration}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#997C70] block font-medium">Starting Point</span>
                <span className="text-sm font-bold text-[#685752]">{tour.startingPoint}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#997C70] block font-medium">Transport</span>
                <span className="text-sm font-bold text-[#685752]">{tour.transport}</span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#997C70] block font-medium">Meals</span>
                <span className="text-sm font-bold text-[#685752]">{tour.meals}</span>
              </div>
            </div>

            {/* Tour Overview */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#685752]">Tour Overview</h2>
              <p className="text-base text-[#7A6862] leading-relaxed">
                {tour.overview}
              </p>
            </div>

            {/* Day-by-Day Itinerary */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#685752]">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((item, idx) => {
                  const isOpen = openDayIndex === idx;
                  return (
                    <div key={idx} className="rounded-2xl bg-[#F7EFEA] border border-[#E8DCD5] overflow-hidden">
                      <button
                        onClick={() => setOpenDayIndex(isOpen ? null : idx)}
                        className="w-full px-6 py-4 text-left font-bold text-[#685752] flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-full bg-[#8EB486]/15 text-[#8EB486] text-xs font-semibold">
                            {item.day}
                          </span>
                          <span className="text-base font-semibold">{item.title}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-[#8EB486] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-sm text-[#7A6862] leading-relaxed border-t border-[#E8DCD5]/60 space-y-3">
                          <p>{item.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#997C70] pt-2">
                            {item.meals && <span className="bg-white px-3 py-1 rounded-full border border-[#E8DCD5]">🍲 Meals: {item.meals}</span>}
                            {item.stay && <span className="bg-white px-3 py-1 rounded-full border border-[#E8DCD5]">🏨 Stay: {item.stay}</span>}
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
              <div className="p-6 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] space-y-4">
                <h3 className="text-xl font-bold text-[#685752] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#8EB486]" />
                  Important Information & Things to Carry
                </h3>
                <div className="space-y-4 text-sm text-[#7A6862]">
                  {tour.importantInfo.map((info, i) => (
                    <div key={i}>
                      <h4 className="font-semibold text-[#685752] mb-1">{info.title}</h4>
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
                <h2 className="text-2xl sm:text-3xl font-bold text-[#685752]">Tour Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {tour.gallery.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setLightboxSrc(img)}
                      className="relative h-36 rounded-2xl overflow-hidden shadow-xs cursor-pointer group"
                    >
                      <Image
                        src={typeof img === "string" && img ? img : "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80"}
                        alt="Gallery"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tour Reviews & Experiences Section */}
            <TourReviewsSection tourSlug={tour.slug} tourTitle={tour.title} />

          </div>

          {/* Sticky Desktop Booking Sidebar Column */}
          <div className="hidden lg:block lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">
              <div className="p-8 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] shadow-xl space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-[#997C70] font-medium block">Starting Price</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-[#685752]">{tour.price}</span>
                    <span className="text-xs text-[#997C70]">/ person</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-[#7A6862] pt-2 border-t border-[#E8DCD5]">
                  <div className="flex items-center justify-between">
                    <span>Departure Date:</span>
                    <span className="font-semibold text-[#685752]">{tour.departureDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Batch Size:</span>
                    <span className="font-semibold text-[#685752]">{tour.groupSize}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Booking Advance:</span>
                    <span className="font-semibold text-[#8EB486]">₹3,000 to reserve</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setEnquireOpen(true)}
                    className="w-full py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Enquire About This Trip
                  </button>

                  <a
                    href={`https://wa.me/919152975552?text=${encodeURIComponent(`Hi Sonali! I am interested in the ${tour.title} tour (${tour.price}). Could you please share booking details?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full border border-[#25D366]/40 bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-900 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
                  >
                    <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Quick Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </section>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FDF7F4] border-t border-[#E8DCD5] p-3 px-4 flex items-center justify-between shadow-2xl gap-3">
        <div>
          <span className="text-[10px] uppercase text-[#997C70] block font-medium">Starting From</span>
          <span className="text-xl font-bold text-[#685752]">{tour.price}</span>
        </div>
        <button
          onClick={() => setEnquireOpen(true)}
          className="px-6 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-xs shadow-md transition-colors cursor-pointer"
        >
          Enquire About This Trip
        </button>
      </div>

      {/* Floating WhatsApp Action Button in Right Corner */}
      <WhatsAppFloatingButton tourName={tour.title} />

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
