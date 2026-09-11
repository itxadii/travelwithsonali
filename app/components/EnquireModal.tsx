"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
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
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#FDF7F4] rounded-3xl border border-[#E8DCD5] shadow-2xl p-6 sm:p-8 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#7A6862] hover:text-[#685752] hover:bg-[#E8DCD5]/50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif-italic font-bold text-[#685752]">
              Enquiry Received!
            </h3>
            <p className="text-sm text-[#7A6862] max-w-xs mx-auto leading-relaxed">
              Thank you {formData.name || 'friend'}! Sonali and our team have received your website enquiry and will get in touch with you shortly.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-sm font-semibold shadow-md cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold">
                Start Your Journey
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#685752] mt-1">
                Website Enquiry Form
              </h3>
              <p className="text-xs sm:text-sm text-[#997C70] mt-1">
                Fill this short enquiry form and our team will connect with you directly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#685752] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#685752] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#685752] mb-1">
                    Select Tour
                  </label>
                  <select
                    value={formData.tour}
                    onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]"
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
                  <label className="block text-xs font-semibold text-[#685752] mb-1">
                    Number of Travellers
                  </label>
                  <select
                    value={formData.travellers}
                    onChange={(e) => setFormData({ ...formData, travellers: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  >
                    <option>1 Solo Traveller</option>
                    <option>2 Travellers</option>
                    <option>3 - 5 Group</option>
                    <option>6+ Custom Group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#685752] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#685752] mb-1">
                  Message / Special Request
                </label>
                <textarea
                  rows={2}
                  placeholder="Tell us any preferred dates or questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8DCD5] bg-white text-sm text-[#685752] focus:outline-none focus:border-[#8EB486]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Website Enquiry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
