"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ArrowRight, Filter, Search } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnquireModal from "../components/EnquireModal";
import { TOURS_DATA, Tour } from "../data/toursData";

export default function ToursPage() {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState("");

  const categories = ["All", "Mountains", "Spiritual", "Beaches", "Road Trips", "Cultural"];

  const filteredTours = TOURS_DATA.filter((tour) => {
    const matchesCategory = categoryFilter === "All" || tour.category === categoryFilter;
    const matchesSearch = 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnquire = (tourTitle: string) => {
    setSelectedTour(tourTitle);
    setEnquireOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero Banner */}
      <section className="w-full py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
            Curated Group Packages
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1917] mt-2">
            Find Your Next Journey
          </h1>
          <p className="text-[#6B645C] text-base sm:text-lg max-w-2xl mt-3">
            Explore our upcoming group tours and start planning your next adventure with Travel With Sonali.
          </p>
        </div>
      </section>

      {/* Filters & Content Section */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8E1D7]">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-[#8C847B] uppercase tracking-wider hidden sm:inline mr-2">
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-[#E05328] text-white shadow-sm"
                    : "bg-[#F4EFEA] text-[#57524C] hover:bg-[#E8E1D7]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#8C847B]" />
            <input
              type="text"
              placeholder="Search destination or trip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#D8CFC4] bg-white text-xs text-[#1C1917] focus:outline-none focus:border-[#E05328]"
            />
          </div>
        </div>

        {/* Tour Cards Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="group bg-[#F4EFEA] rounded-3xl overflow-hidden border border-[#E8E1D7] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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

                    <h3 className="text-xl font-bold text-[#1C1917] group-hover:text-[#E05328] transition-colors">
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
                      onClick={() => handleEnquire(tour.title)}
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
        ) : (
          <div className="py-16 text-center space-y-4">
            <p className="text-lg text-[#57524C]">No tours found matching your search criteria.</p>
            <button
              onClick={() => {
                setCategoryFilter("All");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-[#E05328] text-white text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

      </section>

      <Footer />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={selectedTour}
      />
    </div>
  );
}
