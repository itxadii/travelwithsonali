import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmbientCircles from "../components/AmbientCircles";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <div className="relative overflow-hidden w-full flex-1">
        <AmbientCircles variant="minimal" />
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 space-y-6 text-[#7A6862] leading-relaxed text-sm sm:text-base">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#685752]">Terms & Conditions</h1>
        <p className="text-xs text-[#997C70]">Last updated: June 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">1. Trip Confirmation</h2>
          <p>A seat in any group trip is confirmed only upon receipt of the designated booking advance (typically ₹3,000 to ₹5,000 per person). Remaining payment must be cleared prior to departure.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">2. Code of Conduct</h2>
          <p>Travel With Sonali promotes an inclusive, respectful environment. Misbehavior, harassment, or unlawful conduct towards fellow travelers or local staff will lead to immediate removal from the trip without refund.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">3. Force Majeure & Unforeseen Events</h2>
          <p>In case of landslides, extreme weather, road blockages, or government directives in high altitude areas, alternative arrangements will be made prioritizing traveler safety.</p>
        </section>
      </main>
      </div>
      <Footer />
    </div>
  );
}
