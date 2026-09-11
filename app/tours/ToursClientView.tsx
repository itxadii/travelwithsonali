"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ArrowRight, Search } from "lucide-react";
import { Tour } from "../data/toursData";
import EnquireModal from "../components/EnquireModal";

export default function ToursClientView({ tours }: { tours: Tour[] }) {
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState("");

  const categories = ["All", "Mountains", "Spiritual", "Beaches", "Road Trips", "Cultural"];

  const filteredTours = tours.filter((tour) => {
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
    <>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#E8DCD5]">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-[#997C70] uppercase tracking-wider hidden sm:inline mr-2">
            Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#8EB486] text-white shadow-sm"
                  : "bg-[#F7EFEA] text-[#685752] hover:bg-[#E8DCD5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#997C70]" />
          <input
            type="text"
            placeholder="Search destination or trip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-[#E8DCD5] bg-white text-xs text-[#685752] focus:outline-none focus:border-[#8EB486]"
          />
        </div>
      </div>

      {/* Tour Cards Grid */}
      {filteredTours.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <div
              key={tour.id}
              className="group bg-[#F7EFEA] rounded-3xl overflow-hidden border border-[#E8DCD5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
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
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#8EB486] text-white text-xs font-semibold">
                    {tour.departureDate}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#997C70]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#8EB486]" />
                      {tour.duration}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#8EB486]" />
                      {tour.groupSize}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#685752] group-hover:text-[#8EB486] transition-colors">
                    {tour.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#7A6862] line-clamp-2 leading-relaxed">
                    {tour.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-[#E8DCD5]/60 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#997C70] uppercase tracking-wider block">Starting From</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#685752]">{tour.price}</span>
                    {tour.originalPrice && (
                      <span className="text-xs text-[#997C70]/70 line-through">{tour.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEnquire(tour.title)}
                    className="px-3.5 py-2 rounded-full border border-[#8EB486] text-[#8EB486] hover:bg-[#8EB486] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Enquire
                  </button>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#685752] hover:bg-[#8EB486] text-white text-xs font-semibold transition-colors"
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
          <p className="text-lg text-[#7A6862]">No tours found matching your search criteria.</p>
          <button
            onClick={() => {
              setCategoryFilter("All");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-sm font-medium cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
        defaultTourName={selectedTour}
      />
    </>
  );
}
