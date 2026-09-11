"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import EnquireModal from "./EnquireModal";

interface NavbarProps {
  logoName?: string;
}

export default function Navbar({ logoName = "Travel With Sonali" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/tours", label: "Tours" },
    { href: "/destinations", label: "Destinations" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const isHome = pathname === "/";
  // On homepage, when not scrolled, we use a dark transparent header overlaying the hero background
  const isDarkTop = isHome && !scrolled;

  return (
    <>
      <header className="w-full sticky top-0 z-40 transition-all duration-300 bg-transparent text-white">
        {/* Pure Feathered Backdrop Blur (Zero color overlay, seamless blur fade at bottom) */}
        <div
          className="absolute inset-0 -bottom-8 pointer-events-none backdrop-blur-md"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 32px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black calc(100% - 32px), transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Clickable Brand Logo */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 group cursor-pointer"
                aria-label="Travel With Sonali Homepage"
              >
                <div className="relative flex items-center justify-center w-11 h-11 rounded-full overflow-hidden border border-white/40 shadow-md group-hover:scale-105 transition-all bg-white">
                  <Image
                    src="/travelwithsonalilogo.jpg"
                    alt="Travel With Sonali Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-serif-italic font-semibold tracking-tight transition-colors text-white group-hover:text-[#8EB486] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {logoName}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-medium -mt-1 transition-colors text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    Group Experiences
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition-colors relative py-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${
                      isActive
                        ? "text-[#8EB486] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#8EB486] after:rounded-full"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Primary EXPLORE TOURS & LOGIN CTAs */}
            <div className="hidden lg:flex items-center space-x-3.5">
              <Link
                href="/portal/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm bg-white/20 hover:bg-white/30 border border-white/50 text-white backdrop-blur-sm drop-shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                <span>LOGIN</span>
              </Link>
              <button
                onClick={() => setEnquireOpen(true)}
                className="px-6 py-2.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                EXPLORE TOURS
              </button>
            </div>

            {/* Mobile Navigation Toggle & User Login Icon */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/portal/login"
                className="p-2 rounded-full border border-white/40 bg-white/15 text-white hover:bg-white/25 active:scale-95 transition-all shadow-sm flex items-center justify-center backdrop-blur-xs"
                aria-label="Login to Customer Portal"
              >
                <User className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg focus:outline-none transition-colors text-white hover:bg-white/10"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="relative z-20 lg:hidden border-b border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fade-in bg-[#685752]/95 backdrop-blur-xl text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-base font-semibold rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-[#8EB486]/25 text-[#8EB486] font-bold"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                href="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase shadow-2xs bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>LOGIN</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEnquireOpen(true);
                }}
                className="block w-full text-center px-5 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-bold text-xs tracking-wider uppercase shadow-sm"
              >
                EXPLORE TOURS
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Enquire Modal */}
      <EnquireModal isOpen={enquireOpen} onClose={() => setEnquireOpen(false)} />
    </>
  );
}

