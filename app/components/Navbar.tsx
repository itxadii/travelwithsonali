"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X } from "lucide-react";
import EnquireModal from "./EnquireModal";

interface NavbarProps {
  logoName?: string;
}

export default function Navbar({ logoName = "Travel With Sonali" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const pathname = usePathname();

  // Primary navigation links ONLY
  const navLinks = [
    { href: "/tours", label: "Tours" },
    { href: "/destinations", label: "Destinations" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className="w-full border-b border-[#E8E1D7] bg-[#FAF6F0]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Clickable Brand Logo -> redirects to '/' */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center gap-3 group cursor-pointer"
                aria-label="Travel With Sonali Homepage"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1C1917] text-white group-hover:scale-105 group-hover:bg-[#E05328] transition-all shadow-sm">
                  <Compass className="w-5 h-5 text-[#E05328] group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-serif-italic font-semibold tracking-tight text-[#1C1917] group-hover:text-[#E05328] transition-colors">
                    {logoName}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-medium text-[#8C847B] -mt-1 group-hover:text-[#1C1917] transition-colors">
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
                    className={`text-sm font-medium transition-colors relative py-1 ${
                      isActive
                        ? "text-[#E05328] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#E05328] after:rounded-full"
                        : "text-[#57524C] hover:text-[#1C1917]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Primary EXPLORE TOURS CTA */}
            <div className="hidden lg:flex items-center space-x-3.5">
              <button
                onClick={() => setEnquireOpen(true)}
                className="px-6 py-2.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                EXPLORE TOURS
              </button>
            </div>

            {/* Mobile Navigation Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#1C1917] hover:bg-[#E8E1D7]/50 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#E8E1D7] bg-[#FAF6F0] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                  pathname === link.href
                    ? "bg-[#E05328]/10 text-[#E05328] font-semibold"
                    : "text-[#57524C] hover:bg-[#E8E1D7]/40 hover:text-[#1C1917]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-[#E8E1D7]">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEnquireOpen(true);
                }}
                className="block w-full text-center px-5 py-3 rounded-full bg-[#E05328] text-white font-bold text-xs tracking-wider uppercase shadow-sm"
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
