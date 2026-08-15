"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, MessageCircle } from "lucide-react";
import { TOURS_DATA } from "../data/toursData";

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTourName?: string;
}

export default function EnquireModal({ isOpen, onClose, defaultTourName = "" }: EnquireModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    tour: defaultTourName || "Kedarnath Yatra",
    travellers: "2 Travellers",
    message: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 3s
    }, 3000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Travel With Sonali! I want to enquire about ${formData.tour}.\nName: ${formData.name || 'Traveler'}\nTravellers: ${formData.travellers}\nMobile: ${formData.mobile}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FAF6F0] rounded-3xl border border-[#E8E1D7] shadow-2xl p-6 sm:p-8 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-[#E8E1D7]/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif-italic font-bold text-[#1C1917]">
              Enquiry Received!
            </h3>
            <p className="text-sm text-[#57524C] max-w-xs mx-auto">
              Thank you {formData.name || 'friend'}! Sonali and our team will get in touch with you on WhatsApp within 30 minutes.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-sm shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Directly on WhatsApp
              </a>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-6 py-3 rounded-full border border-[#D8CFC4] text-[#57524C] text-sm font-medium hover:bg-[#E8E1D7]/30"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#E05328] font-bold">
                Start Your Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#1C1917] mt-1">
                Plan Your Trip
              </h3>
              <p className="text-xs sm:text-sm text-[#7A746E] mt-1">
                Fill this short enquiry form or instant chat on WhatsApp.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFC4] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#E05328]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFC4] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#E05328]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Select Tour
                  </label>
                  <select
                    value={formData.tour}
                    onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFC4] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#E05328]"
                  >
                    {TOURS_DATA.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Number of Travellers
                  </label>
                  <select
                    value={formData.travellers}
                    onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFC4] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#E05328]"
                  >
                    <option>1 Solo Traveller</option>
                    <option>2 Travellers</option>
                    <option>3 - 5 Group</option>
                    <option>6+ Custom Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFC4] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#E05328]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1917] mb-1">
                  Message / Special Request
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us any preferred dates or questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8CFC4] bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#E05328]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Enquiry
                </button>
                <a
                  href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-full border border-[#25D366] bg-[#25D366]/10 text-[#128C7E] font-semibold text-sm hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Chat on WhatsApp
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
