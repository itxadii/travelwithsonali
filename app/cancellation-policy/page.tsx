import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <main className="max-w-4xl mx-auto px-4 py-16 space-y-6 flex-1 text-[#57524C] leading-relaxed text-sm sm:text-base">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1C1917]">Cancellation & Refund Policy</h1>
        <p className="text-xs text-[#7A746E]">Last updated: June 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1C1917]">1. Standard Cancellation Terms</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>30+ Days Prior to Departure:</strong> 90% refund or 100% trip voucher valid for 12 months.</li>
            <li><strong>15 - 29 Days Prior to Departure:</strong> 50% refund or 60% trip voucher.</li>
            <li><strong>Less than 15 Days Prior to Departure:</strong> Non-refundable due to non-cancellable hotel and vehicle pre-bookings.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1C1917]">2. Seat Transfer Option</h2>
          <p>If you cannot travel, you may transfer your seat to a friend or family member at no additional cost up to 7 days before departure.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#1C1917]">3. Refund Process</h2>
          <p>Approved refunds are processed via UPI or bank transfer within 5 to 7 business days.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
