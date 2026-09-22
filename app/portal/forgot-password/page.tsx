"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Compass, ArrowLeft, KeyRound, CheckCircle2, ChevronRight } from "lucide-react";
import AuthBackgroundWrapper from "../components/AuthBackgroundWrapper";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetData, setResetData] = useState<{
    code?: string;
    token?: string;
    directLink?: string;
    message?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unable to find your account.");
        setLoading(false);
        return;
      }

      setResetData(data);
    } catch {
      setError("Unable to connect to authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackgroundWrapper>
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-8 border border-white/80 shadow-2xl shadow-stone-950/30 space-y-6 text-[#685752]">
        
        {/* Brand Banner */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#8EB486]/40 shadow-md mb-1 bg-white">
            <Image
              src="/travelwithsonalilogo.jpg"
              alt="Travel With Sonali Logo"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8EB486]/10 text-[#8EB486] text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5" />
            <span>Account Recovery</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Forgot Password?
          </h1>
          <p className="text-xs text-[#997C70] max-w-xs">
            Enter your registered email or mobile number to receive a verification reset code.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {!resetData ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#997C70]">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#9A938C]" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile number"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] text-xs text-[#685752] placeholder-[#9A938C] focus:outline-none focus:border-[#8EB486]"
                />
              </div>
              <p className="text-[11px] text-[#997C70]">
                We will generate an instant verification reset code for this account.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#8EB486]/30 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>{loading ? "Verifying..." : "Send Reset Code"}</span>
              {!loading && (
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verification Code Generated!</span>
              </div>
              <p className="text-emerald-700 leading-relaxed">
                Your 6-digit password recovery code has been generated:
              </p>
              <div className="py-2.5 px-4 rounded-xl bg-white border border-emerald-300 text-center font-mono text-xl font-bold tracking-widest text-emerald-900 select-all">
                {resetData.code}
              </div>
              <p className="text-[11px] text-emerald-600">
                Enter this code on the next screen to set your new password.
              </p>
            </div>

            <div className="space-y-2">
              <Link
                href={`/portal/reset-password?token=${resetData.token}&identifier=${encodeURIComponent(identifier)}`}
                className="w-full py-3.5 rounded-full bg-[#8EB486] hover:bg-[#7A9F73] text-white text-xs font-bold tracking-wider uppercase shadow-lg shadow-[#8EB486]/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Set New Password</span>
                <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                onClick={() => setResetData(null)}
                className="w-full py-2.5 rounded-full text-xs font-semibold text-[#997C70] hover:text-[#685752] transition-colors"
              >
                Enter a different number or email
              </button>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-[#E8DCD5] text-xs text-[#997C70]">
          <Link
            href="/portal/login"
            className="inline-flex items-center gap-1.5 text-[#8EB486] font-bold hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </AuthBackgroundWrapper>
  );
}
