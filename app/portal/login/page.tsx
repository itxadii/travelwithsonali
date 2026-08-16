"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Sparkles, Phone, Compass } from "lucide-react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/portal";

  const [loginIdentifier, setLoginIdentifier] = useState("rahul.verma@example.com");
  const [password, setPassword] = useState("Customer123!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginIdentifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        setLoading(false);
        return;
      }

      router.push(fromPath);
      router.refresh();
    } catch {
      setError("Unable to connect to portal authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex items-center justify-center p-4 font-sans selection:bg-[#E05328] selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EBE5DF] shadow-xl space-y-8">
        
        {/* Brand Banner */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#E05328]/30 shadow-md mb-1">
            <Image
              src="/travelwithsonalilogo.jpg"
              alt="Travel With Sonali Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E05328]/10 text-[#E05328] text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5" />
            My Travel With Sonali
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
            Welcome Back
          </h1>
          <p className="text-xs text-[#7A746E]">
            Your journeys, bookings and travel details — all in one place.
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs space-y-1 text-[#7A746E]">
          <div className="flex items-center justify-between font-semibold text-[#1C1917]">
            <span>Customer Portal Access</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Live Demo</span>
          </div>
          <p>Email / Mobile: <strong className="text-[#1C1917]">rahul.verma@example.com</strong></p>
          <p>Password: <strong className="text-[#1C1917]">Customer123!</strong></p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#7A746E]">
              Email or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
              <input
                type="text"
                required
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                placeholder="rahul.verma@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#7A746E]">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Please contact Travel With Sonali support to reset your portal password."); }} className="text-[11px] text-[#E05328] hover:underline font-semibold">
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#9A938C] hover:text-[#1C1917]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#EBE5DF] text-[11px] text-[#7A746E]">
          Need help accessing your booking?{" "}
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-[#E05328] font-semibold hover:underline">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
