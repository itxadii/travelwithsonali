"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, Phone, MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function CustomerHelpPage() {
  const faqs = [
    {
      q: "How do I upload my Aadhaar / Passport document?",
      a: "Go to the Documents section in your portal navigation, click 'Upload Document', select your traveller name and file, and click submit.",
    },
    {
      q: "When will my hotel and transport details be updated?",
      a: "Hotel and transport assignments are finalized 3-5 days before your trip departure and will automatically appear under your trip's Stay & Transport tab.",
    },
    {
      q: "How are my payments updated in the portal?",
      a: "When you pay via UPI, Bank Transfer, or Cash, our accounts team verifies the transfer and updates your payment ledger within 24 hours.",
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          Help & Traveler Support
        </h1>
        <p className="text-xs text-[#997C70] mt-1">
          Have questions about your upcoming trip? We&apos;re here to make your journey seamless.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-emerald-900 text-sm">WhatsApp Us</h3>
          <p className="text-[11px] text-emerald-700">Quick response team</p>
        </a>

        <a
          href="tel:+919876543210"
          className="p-6 rounded-3xl bg-white border border-[#E8DCD5] hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FDF7F4] text-[#685752] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#685752] text-sm">Call Direct</h3>
          <p className="text-[11px] text-[#997C70]">+91 98765 43210</p>
        </a>

        <a
          href="mailto:support@travelwithsonali.com"
          className="p-6 rounded-3xl bg-white border border-[#E8DCD5] hover:shadow-md transition-all text-center space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FDF7F4] text-[#8EB486] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#685752] text-sm">Email Support</h3>
          <p className="text-[11px] text-[#997C70]">support@travelwithsonali.com</p>
        </a>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#685752] font-serif-italic">Frequently Asked Questions</h3>

        <div className="space-y-3 text-xs">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] space-y-1">
              <h4 className="font-bold text-[#685752] text-sm">{faq.q}</h4>
              <p className="text-[#7A6862] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <span className="text-[#997C70]">Looking for tour guidelines?</span>
          <Link href="/faq" className="text-[#8EB486] font-bold hover:underline inline-flex items-center gap-1">
            <span>View Public FAQ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
