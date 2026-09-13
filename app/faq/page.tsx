"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnquireModal from "../components/EnquireModal";
import AmbientCircles from "../components/AmbientCircles";
import { FAQS_DATA } from "../data/faqsData";
import { SquigglyText } from "@/components/ui/squiggly-text";

export default function FAQPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [enquireOpen, setEnquireOpen] = useState(false);

  const categories = [
    "All",
    "General",
    "Tours",
    "Bookings",
    "Payments",
    "Documents",
    "Accommodation",
    "Transportation",
    "Cancellation"
  ];

  const filteredFaqs = FAQS_DATA.filter(
    (item) => selectedCat === "All" || item.category === selectedCat
  );

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />

      {/* Hero */}
      <section className="relative overflow-hidden w-full py-16 sm:py-24 bg-[#F7EFEA] border-b border-[#E8DCD5]">
        <AmbientCircles variant="3" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
            Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#685752] mt-2">
            Before You Pack{" "}
            <SquigglyText
              stepDuration={70}
              scale={[4, 7]}
              className="text-[#8EB486] font-serif-italic"
            >
              Your Bags...
            </SquigglyText>
          </h1>
          <p className="text-[#7A6862] text-base sm:text-lg max-w-2xl mt-3">
            Everything you need to know about our group departures, inclusions, booking advance, and travel guidelines.
          </p>
        </div>
      </section>

      {/* Category Pills & FAQ Accordions */}
      <section className="relative overflow-hidden w-full py-12 flex-1">
        <AmbientCircles variant="5" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E8DCD5] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#8EB486] text-white shadow-sm"
                  : "bg-[#F7EFEA] text-[#7A6862] hover:bg-[#E8DCD5]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#F7EFEA] border border-[#E8DCD5] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left font-bold text-[#685752] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#8EB486] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#7A6862] leading-relaxed border-t border-[#E8DCD5]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-16 p-8 rounded-3xl bg-[#F7EFEA] border border-[#E8DCD5] text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#685752]">Still Have Questions?</h3>
          <p className="text-sm text-[#7A6862] max-w-md mx-auto">
            We are here to help! Send an enquiry and our team will get back to you with all details.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setEnquireOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-sm font-semibold cursor-pointer shadow-md transition-colors"
            >
              Send Website Enquiry
            </button>
          </div>
        </div>
        </div>
      </section>

      <Footer />

      <EnquireModal
        isOpen={enquireOpen}
        onClose={() => setEnquireOpen(false)}
      />
    </div>
  );
}
