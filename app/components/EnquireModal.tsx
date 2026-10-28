"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2 } from "lucide-react";
import { useTourOptions } from "@/lib/useTourOptions";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { useEscapeKey } from "@/lib/useEscapeKey";

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTourName?: string;
}

export default function EnquireModal({ isOpen, onClose, defaultTourName = "" }: EnquireModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const tours = useTourOptions();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    tour: defaultTourName,
    travellers: "2 Travellers",
    message: ""
  });

  // The modal stays mounted between openings: pick up the tour it was opened for
  const [openedFor, setOpenedFor] = useState<string | null>(isOpen ? defaultTourName : null);
  const openKey = isOpen ? defaultTourName : null;
  if (openKey !== openedFor) {
    setOpenedFor(openKey);
    if (openKey !== null) setFormData((f) => ({ ...f, tour: openKey }));
  }

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    const error = await submitEnquiry(formData);
    setSending(false);
    if (error) {
      setSendError(error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#FDF7F4] rounded-3xl border border-[#E8DCD5] shadow-2xl p-6 sm:p-8 overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Start your journey"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
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
              Thank you {formData.name || 'friend'}! Sonali and our team have received your enquiry and will get in touch with you shortly.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="px-8 py-3 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white text-sm font-semibold shadow-md cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 pr-10">
              <h3 className="text-2xl sm:text-3xl font-serif-italic font-bold text-[#685752]">
                Start Your Journey
              </h3>
              <p className="text-xs sm:text-sm text-[#7A6862] mt-1">
                Share a few details and our team will connect with you directly.
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
                    <option value="">Not sure yet</option>
                    {/* Keep a tour passed in from a tour page selectable even if the list hasn't loaded it */}
                    {formData.tour && !tours.some((t) => t.title === formData.tour) && (
                      <option value={formData.tour}>{formData.tour}</option>
                    )}
                    {tours.map((t) => (
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
                {sendError && (
                  <p role="alert" className="mb-3 text-xs font-semibold text-rose-700">
                    {sendError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Sending..." : "Send Enquiry"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
