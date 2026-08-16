import React, { use } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DestinationsClientView from "./DestinationsClientView";
import { getDestinations } from "@/lib/sanity/queries";

export default function DestinationsPage() {
  const destinations = use(getDestinations());

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
            Immersive Destinations
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1917] mt-2">
            Where Will You Go Next?
          </h1>
          <p className="text-[#6B645C] text-base sm:text-lg max-w-2xl mt-3">
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
