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
  User,
  PanelLeftClose,
} from "lucide-react";
import { AdminUserSession } from "@/lib/admin/auth";
import { GooeyInput } from "@/components/ui/gooey-input";

interface AdminLayoutClientProps {
  admin: AdminUserSession | null;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ admin, children }: AdminLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
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
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex font-sans selection:bg-[#8EB486] selection:text-white relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Left Sidebar (Sticky on Desktop, Slide-out Drawer on Mobile) */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 bg-[#FFFDF9] border-r border-[#E8DCD5]
          transition-all duration-300 ease-in-out shrink-0
          lg:sticky lg:top-0 lg:h-screen lg:z-30
          ${
            sidebarOpen
              ? "translate-x-0 shadow-2xl w-64"
              : "-translate-x-full lg:translate-x-0"
          }
          ${
            isCollapsed
              ? "lg:w-20"
              : "lg:w-64"
          }
        `}
      >
        <div className="w-full h-full flex flex-col justify-between relative overflow-x-hidden">
          <div>
            {/* Header: Expanded vs Collapsed */}
            {isCollapsed ? (
              /* Collapsed Header: Centered Logo which expands sidebar on click */
              <div className="h-16 border-b border-[#E8DCD5] flex items-center justify-center px-2">
                <button
                  type="button"
                  onClick={() => setIsCollapsed(false)}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#8EB486]/40 hover:border-[#8EB486] shadow-xs bg-white hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center group relative"
                  title="Click logo to expand sidebar"
                >
                  <Image
                    src="/travelwithsonalilogo.jpg"
                    alt="Travel With Sonali Logo - Click to Expand"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#8EB486]/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </button>
              </div>
            ) : (
              /* Expanded Header: Logo Brand + Single Close Button Side of Logo */
              <div className="h-16 px-4 border-b border-[#E8DCD5] flex items-center justify-between">
                <Link href="/admin" className="flex items-center gap-2.5 min-w-0 group">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8DCD5] shadow-xs shrink-0 bg-white group-hover:scale-105 transition-transform">
                    <Image
                      src="/travelwithsonalilogo.jpg"
                      alt="Travel With Sonali Logo"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold tracking-tight text-[#685752] leading-tight font-serif-italic truncate">
                      Travel With Sonali
                    </span>
                    <span className="text-[10px] text-[#997C70] tracking-wider uppercase font-semibold">
                      Admin Control
                    </span>
                  </div>
                </Link>

                {/* The ONLY collapse button: side of logo */}
                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
                      setIsCollapsed(true);
                    } else {
                      setSidebarOpen(false);
                    }
                  }}
                  className="p-1.5 rounded-xl text-[#997C70] hover:text-[#685752] hover:bg-[#F7EFEA] transition-colors cursor-pointer"
                  title="Collapse sidebar"
                >
                  <PanelLeftClose className="w-5 h-5 hidden lg:block" />
                  <X className="w-5 h-5 lg:hidden" />
                </button>
              </div>
            )}

            {/* Navigation Items */}
            <nav className={`p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)] ${isCollapsed ? "flex flex-col items-center" : ""}`}>
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
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center rounded-2xl text-xs font-semibold transition-all group ${
                      isCollapsed
                        ? "justify-center w-11 h-11 p-0"
                        : "gap-3 px-3.5 py-2.5 w-full"
                    } ${
                      isActive
                        ? "bg-[#8EB486] text-white shadow-md shadow-[#8EB486]/20"
                        : "text-[#7A6862] hover:bg-[#F7EFEA] hover:text-[#685752]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}

              {/* Separator & Link to Sanity Studio */}
              <div className={`pt-3 mt-3 border-t border-[#E8DCD5] w-full ${isCollapsed ? "flex flex-col items-center" : ""}`}>
                {!isCollapsed && (
                  <span className="px-3.5 text-[10px] uppercase tracking-widest text-[#997C70] font-bold block mb-1.5">
                    Content Management
                  </span>
                )}
                <a
                  href="/studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={isCollapsed ? "Manage Website (Sanity Studio)" : undefined}
                  className={`flex items-center rounded-2xl text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-all group ${
                    isCollapsed
                      ? "justify-center w-11 h-11 p-0"
                      : "justify-between px-3.5 py-2.5 w-full"
                  }`}
                >
                  <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-2.5 min-w-0"}`}>
                    <Edit3 className="w-4 h-4 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                    {!isCollapsed && <span className="truncate">Manage Website</span>}
                  </div>
                  {!isCollapsed && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-800 font-bold shrink-0">
                      Sanity
                    </span>
                  )}
                </a>
              </div>
            </nav>
          </div>

          {/* User Footer Info */}
          <div className={`border-t border-[#E8DCD5] shrink-0 ${isCollapsed ? "p-3 flex flex-col items-center gap-2" : "p-4 flex items-center justify-between"}`}>
            {isCollapsed ? (
              <>
                <div
                  className="w-9 h-9 rounded-full bg-[#8EB486]/15 text-[#8EB486] flex items-center justify-center font-bold text-xs shrink-0 cursor-default"
                  title={`${admin?.name || "Admin"} (${admin?.email || ""})`}
                >
                  {admin?.name?.charAt(0) || "A"}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-[#997C70] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-[#8EB486]/15 text-[#8EB486] flex items-center justify-center font-bold text-xs shrink-0">
                    {admin?.name?.charAt(0) || "A"}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-[#685752] truncate">{admin?.name || "Admin"}</p>
                    <p className="text-[10px] text-[#997C70] truncate">{admin?.email || "admin@example.com"}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-[#997C70] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out">
        {/* Top Header (Sticky) */}
        <header className="h-16 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#E8DCD5] px-4 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#997C70] hover:text-[#685752] hover:bg-[#F7EFEA] transition-colors cursor-pointer"
              title="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h1 className="text-base font-bold text-[#685752] tracking-tight font-serif-italic">
              Operational Control Center
            </h1>
          </div>

          {/* Global Actions Bar */}
          <div className="flex items-center gap-3">
            {/* Global Quick Search */}
            <div className="hidden md:flex items-center">
              <GooeyInput
                placeholder="Search lead, booking, phone..."
                collapsedWidth={120}
                expandedWidth={250}
                expandedOffset={48}
                classNames={{
                  surface: "bg-[#685752] text-white shadow-sm ring-1 ring-[#685752]/20 hover:bg-[#5a4a45]",
                }}
              />
            </div>

            {/* Notification Bell */}
            <Link
              href="/admin/notifications"
              className="relative p-2 rounded-full bg-[#FDF7F4] text-[#997C70] hover:text-[#685752] hover:bg-[#E8DCD5] transition-colors border border-[#E8DCD5]"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#8EB486]" />
            </Link>

            {/* Profile Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full bg-[#FDF7F4] border border-[#E8DCD5] hover:border-[#8EB486] transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#8EB486] text-white flex items-center justify-center text-xs font-bold">
                  {admin?.name?.charAt(0) || "A"}
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl p-2 border border-[#E8DCD5] shadow-xl space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-[#E8DCD5]">
                    <p className="text-xs font-bold text-[#685752]">{admin?.name}</p>
                    <p className="text-[10px] text-[#997C70] truncate">{admin?.email}</p>
                    <span className="text-[9px] uppercase font-bold text-[#8EB486] bg-[#8EB486]/15 px-2 py-0.5 rounded-md inline-block mt-1">
                      {admin?.role}
                    </span>
                  </div>

                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#7A6862] hover:text-[#685752] hover:bg-[#FDF7F4]"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Account Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page View Body (Scrolls naturally while sidebar & header remain sticky) */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
