"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  Heart,
  MapPin,
  Phone,
  Mail,
  Send,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { SquigglyText } from "@/components/ui/squiggly-text";

interface FooterProps {
  onEnquireClick?: () => void;
}

export default function Footer({ onEnquireClick }: FooterProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3000);
  };

  return (
    <footer className="w-full bg-[#140F0E] relative overflow-hidden">
      {/* ========================================================
          1. THE UPPER LIGHT SHEET (Rounded Bottom Curtain)
          Scrolls naturally over the fixed reveal section beneath
         ======================================================== */}
      <div className="relative z-10 bg-[#FDF7F4] text-[#685752] pt-20 pb-16 px-4 sm:px-6 lg:px-8 rounded-b-[40px] sm:rounded-b-[56px] lg:rounded-b-[64px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] border-b border-[#E8DCD5]/80">
        <div className="max-w-7xl mx-auto">
          {/* Main 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-14 border-b border-[#E8DCD5]">
            
            {/* Col 1: Brand Info */}
            <div className="lg:col-span-2 space-y-5">
              <Link href="/" className="inline-flex items-center gap-3.5 group">
                <div className="relative flex items-center justify-center w-11 h-11 rounded-full overflow-hidden border border-[#E8DCD5] shadow-sm group-hover:scale-105 transition-all bg-white">
                  <Image
                    src="/travelwithsonalilogo.jpg"
                    alt="Travel With Sonali Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-serif-italic font-bold text-[#685752] tracking-tight group-hover:text-[#8EB486] transition-colors">
                    Travel With Sonali
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-[#8EB486] -mt-1">
                    Group Experiences
                  </span>
                </div>
              </Link>

              <p className="text-[#7A6862] text-sm max-w-sm leading-relaxed">
                Handcrafted small-group experiences across India&apos;s most beautiful mountains, sacred shrines, and offbeat riversides. Travel like family.
              </p>

              {/* Social Icon Pills */}
              <div className="flex items-center space-x-3 pt-1">
                <a
                  href="https://www.instagram.com/travel_withsonali"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F7EFEA] hover:bg-[#8EB486] text-[#685752] hover:text-white border border-[#E8DCD5] flex items-center justify-center transition-all shadow-xs active:scale-95"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F7EFEA] hover:bg-[#8EB486] text-[#685752] hover:text-white border border-[#E8DCD5] flex items-center justify-center transition-all shadow-xs active:scale-95"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-[#F7EFEA] hover:bg-[#8EB486] text-[#685752] hover:text-white border border-[#E8DCD5] flex items-center justify-center transition-all shadow-xs active:scale-95"
                  aria-label="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-[#685752] text-xs font-bold tracking-widest uppercase mb-4">
                Explore
              </h4>
              <ul className="space-y-3 text-sm text-[#7A6862]">
                <li>
                  <Link href="/tours" className="hover:text-[#8EB486] transition-colors flex items-center gap-1">
                    <span>Upcoming Tours</span>
                  </Link>
                </li>
                <li>
                  <Link href="/destinations" className="hover:text-[#8EB486] transition-colors">
                    Popular Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-[#8EB486] transition-colors">
                    About Sonali
                  </Link>
                </li>
                <li>
                  <Link href="/gallery" className="hover:text-[#8EB486] transition-colors">
                    Photo Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/stories" className="hover:text-[#8EB486] transition-colors">
                    Travel Stories & Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="hover:text-[#8EB486] transition-colors">
                    Traveller Reviews
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Top Destinations */}
            <div>
              <h4 className="text-[#685752] text-xs font-bold tracking-widest uppercase mb-4">
                Destinations
              </h4>
              <ul className="space-y-3 text-sm text-[#7A6862]">
                <li>
                  <Link href="/destinations/manali" className="hover:text-[#8EB486] transition-colors">
                    Manali & Kasol
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/kedarnath" className="hover:text-[#8EB486] transition-colors">
                    Kedarnath Dham
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/spiti" className="hover:text-[#8EB486] transition-colors">
                    Spiti Valley
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/meghalaya" className="hover:text-[#8EB486] transition-colors">
                    Mystic Meghalaya
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/nepal" className="hover:text-[#8EB486] transition-colors">
                    Nepal & Muktinath
                  </Link>
                </li>
                <li>
                  <Link href="/destinations/tirupati" className="hover:text-[#8EB486] transition-colors">
                    Tirupati Balaji
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact Info */}
            <div>
              <h4 className="text-[#685752] text-xs font-bold tracking-widest uppercase mb-4">
                Get In Touch
              </h4>
              <ul className="space-y-3.5 text-sm text-[#7A6862]">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#8EB486] shrink-0 mt-0.5" />
                  <span>Mumbai / Delhi & Rishikesh, India</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#8EB486] shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-[#8EB486] transition-colors font-medium">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#8EB486] shrink-0" />
                  <a href="mailto:hello@travelwithsonali.com" className="hover:text-[#8EB486] transition-colors">
                    hello@travelwithsonali.com
                  </a>
                </li>
                <li className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#8EB486] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#7A9F73] transition-all shadow-sm active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright & Legal Links */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#997C70]">
            <p className="flex items-center gap-1 text-center md:text-left">
              © {new Date().getFullYear()} Travel With Sonali. Designed with{" "}
              <Heart className="w-3.5 h-3.5 text-[#8EB486] fill-current inline" /> for curious travellers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/privacy-policy" className="hover:text-[#685752] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-[#685752] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/cancellation-policy" className="hover:text-[#685752] transition-colors">
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. THE STICKY REVEAL SECTION (Curtain Effect)
          Revealed as the upper sheet scrolls upward
         ======================================================== */}
      <div
        className="relative h-[520px] sm:h-[480px] lg:h-[440px] w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="fixed bottom-0 left-0 right-0 h-[520px] sm:h-[480px] lg:h-[440px] w-full bg-gradient-to-b from-[#211A18] via-[#1A1412] to-[#120D0C] text-white flex items-center justify-center overflow-hidden z-0">
          {/* Ambient Glowing Orbs */}
          <div className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full bg-[#8EB486]/15 blur-3xl pointer-events-none" />
          <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-[#997C70]/15 blur-3xl pointer-events-none" />

          {/* Mountain Landscape Background Glow */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80"
              alt="Himalayas Scenic Backdrop"
              fill
              className="object-cover mix-blend-luminosity"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#140F0E] via-black/50 to-transparent pointer-events-none" />

          {/* Main Reveal Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
              
              {/* Left Column: Brand Emblem Badge (Stylized like the Jitter sticker) */}
              <div className="hidden md:flex flex-col items-center justify-center shrink-0">
                <div className="relative group cursor-pointer">
                  {/* Outer Pulsing Glow */}
                  <div className="absolute -inset-2 rounded-full bg-[#8EB486]/25 blur-lg group-hover:bg-[#8EB486]/40 transition-all duration-500" />
                  
                  {/* Rotating Gradient Ring */}
                  <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full p-1 bg-gradient-to-tr from-[#8EB486] via-white/40 to-[#997C70] shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#1E1715] p-2 flex items-center justify-center border border-white/20">
                      <Image
                        src="/travelwithsonalilogo.jpg"
                        alt="Travel With Sonali Emblem"
                        width={120}
                        height={120}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                  </div>

                  {/* Little Compass Satellite Badge */}
                  <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#8EB486] text-white flex items-center justify-center shadow-lg border-2 border-[#1E1715]">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                  </div>
                </div>

                <span className="text-[11px] font-mono tracking-widest uppercase text-stone-400 mt-3 font-semibold">
                  EST. 2024 · MUMBAI
                </span>
              </div>

              {/* Right Column: The exact user requested headline & CTAs */}
              <div className="flex-1 text-center lg:text-left space-y-4 max-w-2xl">
                <span className="text-xs uppercase tracking-widest text-[#8EB486] font-bold bg-[#8EB486]/15 px-4 py-1.5 rounded-full border border-[#8EB486]/30 inline-block shadow-xs">
                  Your Next Adventure Awaits
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif-italic font-bold tracking-tight text-white leading-[1.15] drop-shadow-sm">
                  &ldquo;The world is waiting. Where are you{" "}
                  <SquigglyText
                    stepDuration={70}
                    scale={[4, 7]}
                    className="text-[#8EB486]"
                  >
                    going next?
                  </SquigglyText>
                  &rdquo;
                </h2>

                <p className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed">
                  Find your next journey with Travel With Sonali.
                </p>

                {/* The Two Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/tours"
                    className="px-8 py-4 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all active:scale-95 inline-flex items-center gap-2 group cursor-pointer"
                  >
                    <span>Explore Upcoming Tours</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {onEnquireClick ? (
                    <button
                      onClick={onEnquireClick}
                      className="px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send An Enquiry</span>
                    </button>
                  ) : (
                    <Link
                      href="/contact"
                      className="px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send An Enquiry</span>
                    </Link>
                  )}
                </div>

                {/* Newsletter / Trip Updates Input (Stylized like the Jitter subscription box) */}
                <form
                  onSubmit={handleSubscribe}
                  className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 max-w-md mx-auto lg:mx-0"
                >
                  <div className="relative w-full sm:w-72">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Get early batch updates (email)"
                      disabled={subscribed}
                      className="w-full px-4 py-2.5 rounded-full bg-black/40 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-none focus:border-[#8EB486] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subscribed}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white/20 hover:bg-[#8EB486] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {subscribed ? (
                      <span className="flex items-center gap-1 text-[#8EB486]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Joined
                      </span>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </form>

              </div>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
