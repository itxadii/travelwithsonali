"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, ChevronRight } from "lucide-react";
import EnquireModal from "./EnquireModal";

interface NavbarProps {
  logoName?: string;
}

export default function Navbar({ logoName = "Travel With Sonali" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Reset visibility and close mobile menu on route change
  useEffect(() => {
    setIsVisible(true);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    let prevScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(currentScrollY > 20);

          // If mobile menu is open, keep navbar visible
          if (mobileMenuOpen) {
            setIsVisible(true);
            prevScrollY = currentScrollY;
            ticking = false;
            return;
          }

          const scrollDelta = currentScrollY - prevScrollY;

          // Always show navbar near the top of the page (within 80px)
          if (currentScrollY <= 80) {
            setIsVisible(true);
          } else if (scrollDelta > 8) {
            // Scrolling downwards -> hide navbar
            setIsVisible(false);
          } else if (scrollDelta < -8) {
            // Scrolling upwards -> show navbar
            setIsVisible(true);
          }

          prevScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/tours", label: "Tours" },
    { href: "/destinations", label: "Destinations" },
    { href: "/stories", label: "Stories & Blogs" },
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  const isHome = pathname === "/";
  // The dark hero overlay is only present on homepage at the top (!scrolled)
  const isDarkHero = isHome && !scrolled;

  return (
    <>
      <header
        className={`w-full sticky top-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform border-b ${
          isDarkHero
            ? "bg-transparent text-white border-white/20"
            : "bg-[#FDF7F4]/85 backdrop-blur-md text-slate-900 border-stone-300/70 shadow-xs"
        } ${
          isVisible || mobileMenuOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-stretch h-14 sm:h-16 border-x transition-colors duration-300 ${
              isDarkHero ? "border-white/20" : "border-stone-300/70"
            }`}
          >
            {/* 1. Left Logo Cell with Divider */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-3.5 sm:px-5 shrink-0 border-r transition-colors group cursor-pointer ${
                isDarkHero
                  ? "border-white/20 hover:bg-white/5"
                  : "border-stone-300/70 hover:bg-black/5"
              }`}
              aria-label="Travel With Sonali Homepage"
            >
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/40 shadow-sm bg-white shrink-0">
                <Image
                  src="/travelwithsonalilogo.jpg"
                  alt="Travel With Sonali Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-sm sm:text-base font-serif-italic font-semibold tracking-tight transition-colors leading-tight ${
                    isDarkHero
                      ? "text-white group-hover:text-[#8EB486] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      : "text-slate-900 group-hover:text-[#8EB486]"
                  }`}
                >
                  {logoName}
                </span>
                <span
                  className={`text-[8px] sm:text-[9px] tracking-widest uppercase font-medium -mt-0.5 transition-colors ${
                    isDarkHero
                      ? "text-white/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                      : "text-slate-500"
                  }`}
                >
                  Group Experiences
                </span>
              </div>
            </Link>

            {/* 2. Desktop Nav Links in Divided Grid Columns */}
            <nav className="hidden lg:flex items-stretch">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center px-4 xl:px-5 h-full text-xs xl:text-sm font-medium transition-all duration-200 border-r group cursor-pointer ${
                      isDarkHero
                        ? `border-white/20 ${
                            isActive
                              ? "text-[#8EB486] bg-white/10 font-semibold"
                              : "text-white/90 hover:text-white hover:bg-white/10"
                          }`
                        : `border-stone-300/70 ${
                            isActive
                              ? "text-[#8EB486] bg-[#8EB486]/10 font-semibold"
                              : "text-slate-700 hover:text-slate-900 hover:bg-black/5"
                          }`
                    }`}
                  >
                    <span
                      className={`relative z-10 transition-colors ${
                        isDarkHero ? "drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" : ""
                      }`}
                    >
                      {link.label}
                    </span>

                    {/* Active Indicator Underline */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8EB486]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* 3. Flexible Spacer */}
            <div className="flex-1" />

            {/* 4. Secondary Action Cell (Login / Portal) */}
            <div
              className={`hidden sm:flex items-stretch border-l transition-colors duration-300 ${
                isDarkHero ? "border-white/20" : "border-stone-300/70"
              }`}
            >
              <Link
                href="/portal/login"
                className={`flex items-center gap-2 px-4 sm:px-5 h-full text-xs sm:text-sm font-medium transition-colors ${
                  isDarkHero
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-slate-700 hover:text-slate-900 hover:bg-black/5"
                }`}
              >
                <User className="w-3.5 h-3.5 opacity-80" />
                <span>Login</span>
              </Link>
            </div>

            {/* 5. Primary CTA (Explore Tours >) */}
            <button
              onClick={() => setEnquireOpen(true)}
              className={`hidden sm:flex items-center gap-2 px-5 sm:px-6 h-full font-medium text-xs sm:text-sm border-l transition-all cursor-pointer group ${
                isDarkHero
                  ? "bg-transparent hover:bg-white/10 text-white border-white/20"
                  : "bg-transparent hover:bg-black/5 text-slate-900 border-stone-300/70"
              }`}
            >
              <span className="group-hover:text-[#8EB486] transition-colors">Explore Tours</span>
              <ChevronRight
                className={`w-4 h-4 transition-all group-hover:text-[#8EB486] group-hover:translate-x-0.5 ${
                  isDarkHero ? "text-white/70" : "text-slate-500"
                }`}
              />
            </button>

            {/* 6. Mobile Toggle & Login */}
            <div
              className={`flex lg:hidden items-center border-l transition-colors duration-300 ${
                isDarkHero ? "border-white/20" : "border-stone-300/70"
              }`}
            >
              <Link
                href="/portal/login"
                className={`px-3.5 h-full flex items-center justify-center border-r sm:hidden transition-colors ${
                  isDarkHero
                    ? "text-white/90 hover:bg-white/10 border-white/20"
                    : "text-slate-700 hover:bg-black/5 border-stone-300/70"
                }`}
                aria-label="Login to Customer Portal"
              >
                <User className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`px-4 h-full flex items-center justify-center cursor-pointer transition-colors ${
                  isDarkHero ? "text-white/90 hover:bg-white/10" : "text-slate-800 hover:bg-black/5"
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="relative z-20 lg:hidden border-t border-stone-300/70 shadow-2xl animate-fade-in bg-[#FDF7F4] text-slate-900 divide-y divide-stone-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-[#8EB486]/15 text-[#8EB486] font-bold"
                    : "text-slate-800 hover:bg-stone-100"
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}

            <div className="p-4 space-y-2.5 bg-stone-100/60">
              <Link
                href="/portal/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center px-5 py-3 rounded-full font-bold text-xs tracking-wider uppercase bg-white border border-stone-300 text-slate-800 hover:bg-stone-50 transition-colors shadow-xs"
              >
                <User className="w-4 h-4" />
                <span>CUSTOMER LOGIN</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEnquireOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full text-center px-5 py-3 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white font-bold text-xs tracking-wider uppercase shadow-sm cursor-pointer"
              >
                <span>EXPLORE TOURS</span>
                <ChevronRight className="w-4 h-4" />
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
