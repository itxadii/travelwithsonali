import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmbientCircles from "../components/AmbientCircles";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <div className="relative overflow-hidden w-full flex-1">
        <AmbientCircles variant="minimal" />
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 space-y-6 text-[#7A6862] leading-relaxed text-sm sm:text-base">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#685752]">Privacy Policy</h1>
        <p className="text-xs text-[#997C70]">Last updated: June 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">1. Information We Collect</h2>
          <p>When you fill out an enquiry form on our website, we collect basic contact information including your name, mobile number, email address, and travel preferences.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">2. How We Use Your Information</h2>
          <p>Your details are strictly used to coordinate your trip booking, share itinerary PDFs, send WhatsApp updates, and provide customer support. We do not sell or share your data with third-party advertisers.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">3. Data Security</h2>
          <p>We implement industry-standard safeguards to protect your personal contact information from unauthorized access.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">4. Contact Us</h2>
          <p>If you have any questions regarding our Privacy Policy, contact us at hello@travelwithsonali.com.</p>
        </section>
      </main>
      </div>
      <Footer />
    </div>
  );
}
