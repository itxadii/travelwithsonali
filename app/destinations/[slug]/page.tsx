import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Clock, MapPin, Compass, ArrowUpRight } from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import DestinationClientView from "./DestinationClientView";
import AmbientCircles from "@/app/components/AmbientCircles";
import { getDestinationBySlug, getToursByDestination, getDestinations } from "@/lib/sanity/queries";

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const destination = use(getDestinationBySlug(slug));
  const tours = use(getToursByDestination(slug));
  const allDestinations = use(getDestinations());

  if (!destination) {
    notFound();
  }

  const relatedDestinations = allDestinations.filter((d) => d.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Breadcrumb Bar */}
      <div className="bg-[#F7EFEA] border-b border-[#E8DCD5] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#997C70] flex items-center gap-2">
          <Link href="/destinations" className="hover:text-[#8EB486] flex items-center gap-1">
            <ChevronLeft className="w-3.5 h-3.5" />
            Destinations
          </Link>
          <span>/</span>
          <span className="text-[#685752] font-medium truncate">{destination.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative w-full py-20 sm:py-28 bg-[#4C3E3A] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8EB486] text-white text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Explore Destination
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            {destination.name}
          </h1>
          <p className="text-lg sm:text-xl text-stone-300 max-w-2xl font-serif-italic">
            &ldquo;{destination.tagline}&rdquo;
          </p>
        </div>
      </section>

      {/* Overview & Highlights */}
      <section className="relative overflow-hidden w-full py-16">
        <AmbientCircles variant="1" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-3xl font-serif-italic font-bold text-[#685752]">
                About {destination.name}
              </h2>
              <p className="text-base sm:text-lg text-[#7A6862] leading-relaxed">
                {destination.description}
              </p>
            </div>

            <div className="lg:col-span-4 bg-[#F7EFEA] rounded-3xl p-6 border border-[#E8DCD5] space-y-4 shadow-sm">
              <h3 className="text-lg font-bold text-[#685752] border-b border-[#E8DCD5] pb-3">
                Destination Highlights
              </h3>
              <ul className="space-y-2.5 text-sm text-[#7A6862]">
                {destination.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#8EB486]" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tours Section */}
      <section className="relative overflow-hidden w-full py-16 bg-[#F7EFEA] border-t border-[#E8DCD5]">
        <AmbientCircles variant="3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Upcoming Departures
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#685752] mt-1">
                Tours Available for {destination.name}
              </h2>
            </div>
            <Link
              href="/tours"
              className="mt-4 sm:mt-0 text-sm font-semibold text-[#8EB486] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Tours</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {tours.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-[#E8DCD5]">
              <p className="text-[#7A6862] text-sm">
                No active group tours available for {destination.name} right now. Submit an enquiry to request a custom batch!
              </p>
            </div>
          ) : (
            <DestinationClientView tours={tours} />
          )}
        </div>
      </section>

      {/* Related Destinations */}
      {relatedDestinations.length > 0 && (
        <section className="relative overflow-hidden w-full py-16 border-t border-[#E8DCD5]">
          <AmbientCircles variant="5" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#685752] mb-8">
              Other Popular Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedDestinations.map((d) => (
                <Link
                  key={d.id}
                  href={`/destinations/${d.slug}`}
                  className="group relative h-64 rounded-3xl overflow-hidden shadow-md border border-[#E8DCD5] block"
                >
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">{d.name}</h3>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-1">{d.tagline}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
