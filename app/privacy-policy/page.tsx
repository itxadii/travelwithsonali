import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AmbientCircles from "../components/AmbientCircles";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import CookieSettingsButton from "../components/consent/CookieSettingsButton";
import { DPB_COMPLAINT_URL } from "@/lib/consent/config";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Travel With Sonali collects, uses and protects your personal data, our cookie choices, and your rights under India’s DPDP Act.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <div className="relative overflow-hidden w-full flex-1">
        <AmbientCircles variant="minimal" />
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 space-y-6 text-[#7A6862] leading-relaxed text-sm sm:text-base">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#685752]">Privacy Policy</h1>
        <p className="text-xs text-[#7A6862]">Last updated: October 2026</p>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">1. Information We Collect</h2>
          <p>When you fill out an enquiry form on our website, we collect basic contact information including your name, mobile number, email address, and travel preferences.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">2. How We Use Your Information</h2>
          <p>Your details are strictly used to coordinate your trip booking, share itinerary PDFs, send WhatsApp updates, and provide customer support. We do not sell or share your data with third-party advertisers.</p>
        </section>

        <section id="cookies" className="space-y-3 scroll-mt-24">
          <h2 className="text-xl font-bold text-[#685752]">3. Cookies & Website Analytics</h2>
          <p>
            On your first visit we ask for your consent before using any cookie that is not strictly needed to run the website. Optional
            cookies stay off until you choose, and you can accept, reject, or choose per purpose.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-[#E8DCD5] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F7EFEA] text-[#685752]">
                <tr>
                  <th className="p-3 font-semibold">Cookie</th>
                  <th className="p-3 font-semibold">Purpose</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                <tr>
                  <td className="p-3 font-mono text-xs">tws_consent</td>
                  <td className="p-3">Remembers your cookie choice and a random consent ID.</td>
                  <td className="p-3">Essential</td>
                  <td className="p-3">12 months</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">customer_session</td>
                  <td className="p-3">Keeps you signed in to the customer portal.</td>
                  <td className="p-3">Essential</td>
                  <td className="p-3">Until logout or expiry</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">tws_vid</td>
                  <td className="p-3">Random visitor ID used to count visits and popular pages.</td>
                  <td className="p-3">Analytics (consent)</td>
                  <td className="p-3">12 months</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            With analytics consent we record the pages you visit, the website or campaign link that brought you here, your device type,
            browser and operating system, and your approximate country. This is stored on our own database, kept for 12 months, and deleted
            immediately if you withdraw consent. We do not store your IP address in our analytics.
          </p>
          <p>
            You can change or withdraw your consent at any time, as easily as you gave it:{" "}
            <CookieSettingsButton className="font-semibold text-[#4A7244] underline cursor-pointer" />, or use &quot;Cookie Settings&quot; at
            the bottom of any page.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">4. Data Security</h2>
          <p>We implement industry-standard safeguards to protect your personal contact information from unauthorized access.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">5. Your Rights</h2>
          <p>
            Under the Digital Personal Data Protection Act, 2023 you can ask to access a summary of your personal data, have it corrected or
            erased, withdraw consent, and nominate someone to exercise these rights for you in case of death or incapacity. This website is
            meant for adults; if you are under 18, please do not accept optional cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-[#685752]">6. Grievances & Contact Us</h2>
          <p>
            For any question, request, or grievance about your personal data, email us at travelwithsonaliinfo@gmail.com. If you are not
            satisfied with our response, you may complain to the{" "}
            <a href={DPB_COMPLAINT_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#4A7244] underline">
              Data Protection Board of India
            </a>
            .
          </p>
        </section>
      </main>
      </div>
      <Footer />
    </div>
  );
}
