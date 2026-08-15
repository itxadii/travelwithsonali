"use client";

import React, { useState } from "react";
import { MessageCircle, Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { TOURS_DATA } from "../data/toursData";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    tour: "Kedarnath Yatra",
    travellers: "2 Travellers",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappMsg = encodeURIComponent(
    `Hi Travel With Sonali! I want to enquire about ${formData.tour}.\nName: ${formData.name || 'Friend'}\nMobile: ${formData.mobile}\nTravellers: ${formData.travellers}`
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex flex-col font-sans">
      <Navbar logoName="Travel With Sonali" />
      <WhatsAppFloat />

      {/* Hero */}
      <section className="w-full py-16 sm:py-24 bg-[#F4EFEA] border-b border-[#E8E1D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1C1917] mt-2">
            Let&apos;s Plan Your Next Journey.
          </h1>
          <p className="text-[#6B645C] text-base sm:text-lg max-w-2xl mt-3">
            Have questions about a trip or want to book? Connect with us via WhatsApp, call, or send an enquiry.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="w-full py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1C1917]">Contact Information</h2>
              <p className="text-sm text-[#57524C] mt-1">We usually respond within 30 minutes.</p>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Card */}
              <a
                href={`https://wa.me/919876543210?text=Hi%20Sonali!%20I%20want%20to%20enquire%20about%20trips.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 flex items-center gap-4 hover:bg-[#25D366]/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#128C7E]">Chat on WhatsApp</h4>
                  <p className="text-xs text-[#128C7E]">Fastest response • +91 98765 43210</p>
                </div>
              </a>

              {/* Phone Card */}
              <a
                href="tel:+919876543210"
                className="p-5 rounded-2xl bg-[#F4EFEA] border border-[#E8E1D7] flex items-center gap-4 hover:border-[#1C1917] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#E05328]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1C1917]">Call Support</h4>
                  <p className="text-xs text-[#7A746E]">Mon - Sat (10:00 AM - 8:00 PM)</p>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:hello@travelwithsonali.com"
                className="p-5 rounded-2xl bg-[#F4EFEA] border border-[#E8E1D7] flex items-center gap-4 hover:border-[#1C1917] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#E05328]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1C1917]">Email Us</h4>
                  <p className="text-xs text-[#7A746E]">hello@travelwithsonali.com</p>
                </div>
              </a>

              {/* Instagram Card */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#F4EFEA] border border-[#E8E1D7] flex items-center gap-4 hover:border-[#1C1917] transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#1C1917] text-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-current text-[#E05328]" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#1C1917]">Instagram DM</h4>
                  <p className="text-xs text-[#7A746E]">@travelwithsonali</p>
                </div>
              </a>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#F4EFEA] rounded-3xl p-8 border border-[#E8E1D7] shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-serif-italic font-bold text-[#1C1917]">
                  Enquiry Received!
                </h3>
                <p className="text-sm text-[#57524C] max-w-sm mx-auto">
                  Thank you {formData.name}! Sonali and our team will get in touch with you on WhatsApp shortly.
                </p>
                <div className="pt-4">
                  <a
                    href={`https://wa.me/919876543210?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on WhatsApp Now
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif-italic font-bold text-[#1C1917]">
                    Send An Enquiry
                  </h3>
                  <p className="text-xs text-[#7A746E] mt-1">
                    Fill out the form below to receive itinerary details and seat confirmation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8CFC4] bg-white text-sm focus:outline-none focus:border-[#E05328]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8CFC4] bg-white text-sm focus:outline-none focus:border-[#E05328]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Interested Tour
                    </label>
                    <select
                      value={formData.tour}
                      onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8CFC4] bg-white text-sm focus:outline-none focus:border-[#E05328]"
                    >
                      {TOURS_DATA.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                      Number of Travellers
                    </label>
                    <select
                      value={formData.travellers}
                      onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#D8CFC4] bg-white text-sm focus:outline-none focus:border-[#E05328]"
                    >
                      <option>1 Solo Traveller</option>
                      <option>2 Travellers</option>
                      <option>3 - 5 Group</option>
                      <option>6+ Custom Group</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D8CFC4] bg-white text-sm focus:outline-none focus:border-[#E05328]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Message / Special Requirements
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us any preferred month or custom queries..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D8CFC4] bg-white text-sm focus:outline-none focus:border-[#E05328]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Send Enquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
