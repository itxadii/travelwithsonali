"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  FileCheck,
  Bell,
  BarChart3,
  Settings,
  Edit3,
  LogOut,
  Menu,
  X,
  Search,
  User,
  Sparkles,
} from "lucide-react";
import { AdminUserSession } from "@/lib/admin/auth";

interface AdminLayoutClientProps {
  admin: AdminUserSession | null;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ admin, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // If on login page, render children directly without admin layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Leads", href: "/admin/leads", icon: Users },
    { label: "Customers", href: "/admin/customers", icon: UserCheck },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
    { label: "Travellers", href: "/admin/travellers", icon: Users },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Documents", href: "/admin/documents", icon: FileCheck },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex font-sans selection:bg-[#E05328] selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#FFFDF9] border-r border-[#EBE5DF] flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 border-b border-[#EBE5DF] flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#EBE5DF] shadow-xs shrink-0">
                <Image
                  src="/travelwithsonalilogo.jpg"
                  alt="Travel With Sonali Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-[#1C1917] leading-tight font-serif-italic">
                  Travel With Sonali
                </span>
                <span className="text-[10px] text-[#7A746E] tracking-wider uppercase font-semibold">
                  Admin Control
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-[#7A746E] hover:text-[#1C1917]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#E05328] text-white shadow-md"
                      : "text-[#666059] hover:bg-[#F2ECE6] hover:text-[#1C1917]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Separator & Link to Sanity Studio */}
            <div className="pt-4 mt-4 border-t border-[#EBE5DF]">
              <span className="px-4 text-[10px] uppercase tracking-widest text-[#9A938C] font-bold block mb-2">
                Content Management
              </span>
              <a
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Edit3 className="w-4 h-4 text-emerald-600" />
                  <span>Manage Website Content</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-800 font-bold">
                  Sanity
                </span>
              </a>
            </div>
          </nav>
        </div>

        {/* User Footer info */}
        <div className="p-4 border-t border-[#EBE5DF] flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#E05328]/10 text-[#E05328] flex items-center justify-center font-bold text-xs shrink-0">
              {admin?.name?.charAt(0) || "A"}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#1C1917] truncate">{admin?.name || "Admin"}</p>
              <p className="text-[10px] text-[#7A746E] truncate">{admin?.email || "admin@example.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl text-[#7A746E] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#FFFDF9] border-b border-[#EBE5DF] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#7A746E] hover:text-[#1C1917] hover:bg-[#F2ECE6]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-base font-bold text-[#1C1917] tracking-tight hidden sm:block">
              Operational Control Center
            </h1>
          </div>

          {/* Global Actions Bar */}
          <div className="flex items-center gap-3">
            {/* Global Quick Search */}
            <div className="relative hidden md:block w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9A938C]" />
              <input
                type="text"
                placeholder="Search lead, booking code, phone..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
              />
            </div>

            {/* Notification Bell */}
            <Link
              href="/admin/notifications"
              className="relative p-2 rounded-full bg-[#FAF6F0] text-[#7A746E] hover:text-[#1C1917] hover:bg-[#EBE5DF] transition-colors border border-[#EBE5DF]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E05328]" />
            </Link>

            {/* Profile Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-[#FAF6F0] border border-[#EBE5DF] hover:border-[#E05328] transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#E05328] text-white flex items-center justify-center text-xs font-bold">
                  {admin?.name?.charAt(0) || "A"}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 border border-[#EBE5DF] shadow-xl space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-[#EBE5DF]">
                    <p className="text-xs font-bold text-[#1C1917]">{admin?.name}</p>
                    <p className="text-[10px] text-[#7A746E] truncate">{admin?.email}</p>
                    <span className="text-[9px] uppercase font-bold text-[#E05328] bg-[#E05328]/10 px-2 py-0.5 rounded-md inline-block mt-1">
                      {admin?.role}
                    </span>
                  </div>

                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#666059] hover:text-[#1C1917] hover:bg-[#FAF6F0]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Account Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page View Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
