import React, { use } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DestinationsClientView from "./DestinationsClientView";
import { getDestinations } from "@/lib/sanity/queries";

export default function DestinationsPage() {
  const destinations = use(getDestinations());

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Immersive Destinations
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Where Will You Go Next?
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            From holy Himalayan peaks to secret tropical bays, explore handpicked destinations crafted for authentic group travel.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="w-full py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <DestinationsClientView destinations={destinations} />
      </section>

      <Footer />
    </div>
  );
}
