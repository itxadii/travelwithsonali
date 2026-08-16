import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Compass, ArrowUpRight } from "lucide-react";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import DestinationClientView from "./DestinationClientView";
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Breadcrumb Bar */}
      <div className="bg-[#F4EFEA] border-b border-[#E8E1D7] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-[#7A746E] flex items-center gap-2">
          <Link href="/destinations" className="hover:text-[#E05328] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Destinations
          </Link>
          <span>/</span>
          <span className="text-[#1C1917] font-medium truncate">{destination.name}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative w-full py-20 sm:py-28 bg-[#181614] text-white overflow-hidden">
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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E05328] text-white text-xs font-semibold uppercase tracking-wider">
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
      <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-3xl font-serif-italic font-bold text-[#1C1917]">
              About {destination.name}
            </h2>
            <p className="text-base sm:text-lg text-[#57524C] leading-relaxed">
              {destination.description}
            </p>
          </div>

          <div className="lg:col-span-4 bg-[#F4EFEA] rounded-3xl p-6 border border-[#E8E1D7] space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-[#1C1917] border-b border-[#E8E1D7] pb-3">
              Destination Highlights
            </h3>
            <ul className="space-y-2.5 text-sm text-[#57524C]">
              {destination.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E05328]" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Available Tours Section */}
      <section className="w-full py-16 bg-[#F4EFEA] border-t border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Upcoming Departures
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
                Tours Available for {destination.name}
              </h2>
            </div>
            <Link
              href="/tours"
              className="mt-4 sm:mt-0 text-sm font-semibold text-[#E05328] hover:underline"
            >
              View All Tours →
            </Link>
          </div>

          {tours.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-[#E8E1D7]">
              <p className="text-[#57524C] text-sm">
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
        <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E8E1D7]">
          <h2 className="text-2xl font-bold text-[#1C1917] mb-8">
            Other Popular Destinations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedDestinations.map((d) => (
              <Link
                key={d.id}
                href={`/destinations/${d.slug}`}
                className="group relative h-64 rounded-3xl overflow-hidden shadow-md border border-[#E8E1D7] block"
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
        </section>
      )}

      <Footer />
    </div>
  );
}
