import React from "react";
import Link from "next/link";
import { Compass, Heart, MapPin, Phone, Mail, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#4C3E3A] text-[#FDF7F4] pt-16 pb-12 border-t border-[#5E4D48] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#5E4D48]">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#8EB486] text-white flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif-italic font-bold text-white tracking-tight">
                Travel With Sonali
              </span>
            </Link>
            <p className="text-[#DFD3CE] text-sm max-w-sm leading-relaxed">
              Travel experience. We curate personal, authentic, and unforgettable group trips across India&apos;s most beautiful landscapes.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#3D322E] hover:bg-[#8EB486] text-[#DFD3CE] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#3D322E] hover:bg-[#8EB486] text-[#DFD3CE] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#3D322E] hover:bg-[#8EB486] text-[#DFD3CE] hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DFD3CE]">
              <li>
                <Link href="/tours" className="hover:text-[#8EB486] transition-colors">
                  Upcoming Tours
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
                  Travel Stories
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
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Destinations
            </h4>
            <ul className="space-y-2.5 text-sm text-[#DFD3CE]">
              <li>
                <Link href="/tours/kedarnath-yatra" className="hover:text-[#8EB486] transition-colors">
                  Kedarnath Yatra
                </Link>
              </li>
              <li>
                <Link href="/tours/kashmir-paradise" className="hover:text-[#8EB486] transition-colors">
                  Kashmir Paradise
                </Link>
              </li>
              <li>
                <Link href="/tours/manali-solang-kasol" className="hover:text-[#8EB486] transition-colors">
                  Manali & Kasol
                </Link>
              </li>
              <li>
                <Link href="/tours/goa-tropical-escape" className="hover:text-[#8EB486] transition-colors">
                  Goa Tropical Escape
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[#8EB486] transition-colors">
                  Rajasthan Royals
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-[#8EB486] transition-colors">
                  Spiti Valley
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Contact & Help */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Get in Touch
            </h4>
            <ul className="space-y-3 text-sm text-[#DFD3CE]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#8EB486] shrink-0 mt-0.5" />
                <span>Mumbai / Delhi & Rishikesh, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8EB486] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8EB486] shrink-0" />
                <a href="mailto:hello@travelwithsonali.com" className="hover:text-white transition-colors">
                  hello@travelwithsonali.com
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8EB486] text-white text-xs font-semibold hover:bg-[#7A9F73] transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  Website Enquiry
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#C2B5AF]">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} Travel With Sonali. Designed with <Heart className="w-3.5 h-3.5 text-[#8EB486] fill-current inline" /> for travellers.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/cancellation-policy" className="hover:text-white transition-colors">
              Cancellation Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
