"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      console.error("Login fetch error:", err);
      setError(err?.message || "Unable to connect to login server. Please try again.");
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
            <Sparkles className="w-3.5 h-3.5" />
            Travel Operations Control
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
            Travel With Sonali
          </h1>
          <p className="text-xs text-[#7A746E]">
            Welcome Back. Sign in to manage your travel operations.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7A746E]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9A938C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@travelwithsonali.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] text-sm text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328] focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#7A746E]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9A938C]" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] text-sm text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#9A938C] hover:text-[#1C1917] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </button>
        </form>

        <div className="pt-4 border-t border-[#EBE5DF] text-center text-xs text-[#7A746E] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Session • Neon PostgreSQL Protection</span>
        </div>
      </div>
    </div>
  );
}
