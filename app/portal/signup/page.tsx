"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, Eye, EyeOff, Sparkles, Compass } from "lucide-react";

export default function CustomerSignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      router.push("/portal");
      router.refresh();
    } catch {
      setError("Unable to connect to portal registration server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1C1917] flex items-center justify-center p-4 font-sans selection:bg-[#E05328] selection:text-white my-8">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#EBE5DF] shadow-xl space-y-6">
        
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
            Join Travel With Sonali
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
            Create Your Account
          </h1>
          <p className="text-xs text-[#7A746E]">
            Start your travel journey, manage bookings & view trip details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7A746E]">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Verma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7A746E]">Phone Number *</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7A746E]">Email Address (Optional)</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul.verma@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#7A746E]">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#7A746E]">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-xs text-[#1C1917] placeholder-[#9A938C] focus:outline-none focus:border-[#E05328]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create My Account →"}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#EBE5DF] text-xs text-[#7A746E]">
          Already have an account?{" "}
          <Link href="/portal/login" className="text-[#E05328] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
