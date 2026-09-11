import React, { use } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ToursClientView from "./ToursClientView";
import { getActiveTours } from "@/lib/sanity/queries";

export default function ToursPage() {
  const tours = use(getActiveTours());

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero Banner */}
      <section className="w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Curated Group Packages
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Find Your Next Journey
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Explore our upcoming group tours and start planning your next adventure with Travel With Sonali.
          </p>
        </div>
      </section>

      {/* Filters & Content Section */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <ToursClientView tours={tours} />
      </section>

      <Footer />
    </div>
  );
}
