"use client";

import React, { useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import EnquireModal from "../components/EnquireModal";
import { FAQS_DATA } from "../data/faqsData";

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
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <WhatsAppFloat />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
            Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1917] mt-2">
            Before You Pack Your Bags...
          </h1>
          <p className="text-[#6B645C] text-base sm:text-lg max-w-2xl mt-3">
            Everything you need to know about our group departures, inclusions, booking advance, and travel guidelines.
          </p>
        </div>
      </section>

      {/* Category Pills & FAQ Accordions */}
      <section className="w-full py-12 max-w-4xl mx-auto px-4 sm:px-6 flex-1">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E8E1D7] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#E05328] text-white shadow-sm"
                  : "bg-[#F4EFEA] text-[#57524C] hover:bg-[#E8E1D7]"
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
                className="rounded-2xl bg-[#F4EFEA] border border-[#E8E1D7] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left font-bold text-[#1C1917] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#E05328] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#57524C] leading-relaxed border-t border-[#E8E1D7]/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="mt-16 p-8 rounded-3xl bg-[#F4EFEA] border border-[#E8E1D7] text-center space-y-4">
          <h3 className="text-2xl font-bold text-[#1C1917]">Still Have Questions?</h3>
          <p className="text-sm text-[#57524C] max-w-md mx-auto">
            We are here to help! Chat directly with Sonali and our team on WhatsApp for instant guidance.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/919876543210?text=Hi%20Sonali!%20I%20have%20a%20question%20about%20a%20trip."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-semibold shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              Ask on WhatsApp
            </a>
            <button
              onClick={() => setEnquireOpen(true)}
              className="px-6 py-3 rounded-full bg-[#E05328] text-white text-sm font-semibold cursor-pointer"
            >
              Send Enquiry
            </button>
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
