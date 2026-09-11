"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  MapPin,
  Users,
  FileCheck,
  CreditCard,
  Bell,
  User,
  HelpCircle,
  LogOut,
  MessageCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { CustomerSession } from "@/lib/portal/auth";

interface PortalLayoutClientProps {
  customer: CustomerSession | null;
  children: React.ReactNode;
}

export default function PortalLayoutClient({ customer, children }: PortalLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    if (pathname === "/portal/login" || pathname === "/portal/signup" || !customer) return;

    async function fetchNotifs() {
      try {
        const res = await fetch("/api/portal/notifications");
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchNotifs();
  }, [pathname, customer]);

  if (pathname === "/portal/login" || pathname === "/portal/signup" || !customer) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/auth/logout", { method: "POST" });
      router.push("/portal/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { label: "Home", href: "/portal", icon: Compass },
    { label: "My Trips", href: "/portal/trips", icon: MapPin },
    { label: "Travellers", href: "/portal/travellers", icon: Users },
    { label: "Documents", href: "/portal/documents", icon: FileCheck },
    { label: "Payments", href: "/portal/payments", icon: CreditCard },
    { label: "Notifications", href: "/portal/notifications", icon: Bell, badge: unreadCount },
    { label: "Profile", href: "/portal/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex flex-col font-sans selection:bg-[#8EB486] selection:text-white pb-16 lg:pb-0">
      
      {/* Desktop Top Navigation Bar */}
      <header className="h-20 bg-[#FFFDF9] border-b border-[#E8DCD5] sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E8DCD5] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/travelwithsonalilogo.jpg"
                alt="Travel With Sonali Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#685752] font-serif-italic leading-none">
                Travel With Sonali
              </span>
              <span className="text-[10px] text-[#8EB486] tracking-widest uppercase font-semibold mt-0.5">
                My Travel Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Header Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive =
              item.href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#8EB486] text-white shadow-sm"
                    : "text-[#7A6862] hover:bg-[#FDF7F4] hover:text-[#685752]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                      isActive ? "bg-white text-[#8EB486]" : "bg-[#8EB486] text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Controls: Notification + Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/portal/notifications"
            className="relative p-2.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] text-[#7A6862] hover:text-[#685752] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#8EB486] ring-2 ring-white animate-pulse" />
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] hover:border-[#8EB486]/40 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#8EB486] text-white font-bold flex items-center justify-center text-xs">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#685752] max-w-[120px] truncate">
                {customer.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#997C70]" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 border border-[#E8DCD5] shadow-xl z-50 space-y-1 text-xs">
                <div className="px-3 py-2 border-b border-[#E8DCD5]">
                  <p className="font-bold text-[#685752]">{customer.name}</p>
                  <p className="text-[11px] text-[#997C70] truncate">{customer.email || customer.phone}</p>
                </div>
                <Link
                  href="/portal/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#685752] hover:bg-[#FDF7F4] transition-colors"
                >
                  <User className="w-4 h-4 text-[#997C70]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/portal/help"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#685752] hover:bg-[#FDF7F4] transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-[#997C70]" />
                  <span>Help & Support</span>
                </Link>
                <div className="border-t border-[#E8DCD5] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FFFDF9] border-t border-[#E8DCD5] z-50 flex items-center justify-around px-2 shadow-lg">
        {[
          { label: "Home", href: "/portal", icon: Compass },
          { label: "Trips", href: "/portal/trips", icon: MapPin },
          { label: "Docs", href: "/portal/documents", icon: FileCheck },
          { label: "Payments", href: "/portal/payments", icon: CreditCard },
          { label: "Profile", href: "/portal/profile", icon: User },
        ].map((item) => {
          const isActive =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl text-[10px] font-medium transition-colors ${
                isActive ? "text-[#8EB486] font-bold" : "text-[#997C70] hover:text-[#685752]"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Floating WhatsApp Quick Contact Action Button */}
      <a
        href="https://wa.me/919876543210?text=Hi%20Travel%20With%20Sonali,%20I%20need%20help%20with%20my%20booking"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 z-40 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        title="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
