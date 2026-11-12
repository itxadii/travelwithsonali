"use client";

import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ShieldCheck, Eye, EyeOff, ArrowLeft } from "lucide-react";

const RESEND_COOLDOWN_SECONDS = 30;

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  // Only return to admin pages, never to an arbitrary URL from the query string
  const destination = from && from.startsWith("/admin") && !from.startsWith("/admin/login") ? from : "/admin";

  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Already signed in: skip the form
  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.authenticated) router.replace(destination);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [destination, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }

      setEmailHint(data.emailHint || "");
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err: unknown) {
      console.error("Login fetch error:", err);
      setError("Unable to connect to login server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/admin/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "That code didn't work.");
        if (data.expired) {
          setStep("credentials");
          setCode("");
        }
        return;
      }

      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      console.error("Verify fetch error:", err);
      setError("Unable to connect to login server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/admin/auth/resend-code", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't send a new code.");
        if (data.expired) setStep("credentials");
        return;
      }
      setNotice("We've sent a new code. Only the latest code works.");
      setCode("");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Unable to connect to login server. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] text-sm text-[#685752] placeholder-[#9A938C] focus:outline-none focus:border-[#8EB486] focus:bg-white transition-all";

  return (
    <div className="min-h-screen bg-[#FDF7F4] text-[#685752] flex items-center justify-center p-4 font-sans selection:bg-[#4A7244] selection:text-white">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E8DCD5] shadow-xl space-y-8">
        {/* Brand Banner */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#8EB486]/30 shadow-md mb-1">
            <Image src="/travelwithsonalilogo.jpg" alt="Travel With Sonali Logo" width={64} height={64} className="w-full h-full object-cover" priority />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8EB486]/10 text-[#4A7244] text-xs font-semibold tracking-wider uppercase">
            Travel Operations Control
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">Travel With Sonali</h1>
          <p className="text-xs text-[#7A6862]">
            {step === "credentials" ? (
              "Welcome back. Sign in to manage your travel operations."
            ) : (
              <>
                We emailed a 6-digit code to <span className="font-semibold text-[#685752]">{emailHint}</span>. It expires in 10 minutes.
              </>
            )}
          </p>
        </div>

        {step === "credentials" ? (
          <form onSubmit={handleCredentials} className="space-y-5">
            {error && (
              <div role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-[#7A6862]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9A938C]" aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-[#7A6862]">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9A938C]" aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`${inputClass} pr-10`}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#9A938C] hover:text-[#685752] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking…" : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCode} noValidate className="space-y-5">
            {error && (
              <div role="alert" className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                {error}
              </div>
            )}
            {notice && !error && (
              <div role="status" className="p-4 rounded-2xl bg-[#EEF4EC] border border-[#C9DCC4] text-[#2F4A2B] text-xs font-medium text-center">
                {notice}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-code" className="text-xs font-semibold uppercase tracking-wider text-[#7A6862]">
                6-digit code
              </label>
              <input
                id="admin-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full py-3 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] text-center text-2xl font-semibold tracking-[0.5em] tabular-nums text-[#685752] focus:outline-none focus:border-[#8EB486] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#4A7244] hover:bg-[#3F6339] text-white font-semibold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying…" : "Sign In to Admin Panel"}
            </button>

            <div className="flex items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setCode("");
                  setError("");
                  setNotice("");
                }}
                className="inline-flex items-center gap-1 min-h-11 font-semibold text-[#7A6862] hover:text-[#685752] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="min-h-11 font-semibold text-[#4A7244] hover:underline disabled:text-[#7A6862] disabled:no-underline disabled:cursor-not-allowed cursor-pointer"
              >
                {resending ? "Sending…" : cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
              </button>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-[#E8DCD5] text-center text-xs text-[#7A6862] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          Protected by password and an emailed sign-in code
        </div>
      </div>
    </div>
  );
}
