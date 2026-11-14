"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, CodeField, Field, FormMessage, PasswordField, SubmitButton, focusRing, textLink } from "../components/AuthLayout";

const RESEND_COOLDOWN_SECONDS = 30;

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  // Only return to portal pages, never to an address from the query string
  const fromPath = from && from.startsWith("/portal") && !from.startsWith("//") ? from : "/portal";

  const [step, setStep] = useState<"password" | "code">("password");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const finish = () => {
    router.push(fromPath);
    router.refresh();
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginIdentifier, password }),
      });
      const data = await res.json();

      if (res.status === 403 && data.reason === "unverified") {
        router.push(`/portal/verify-email?email=${encodeURIComponent(data.email)}&resent=${data.codeSent === false ? "0" : "1"}`);
        return;
      }
      if (!res.ok) {
        setError(data.error || "That email, mobile number or password is incorrect.");
        return;
      }
      if (data.requiresCode) {
        setEmailHint(data.emailHint || "your email");
        setCode("");
        setStep("code");
        setCooldown(RESEND_COOLDOWN_SECONDS);
        return;
      }
      finish();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/portal/auth/verify-login-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "That code didn't work.");
        if (data.expired) {
          setStep("password");
          setCode("");
        }
        return;
      }
      finish();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setResending(true);
    try {
      const res = await fetch("/api/portal/auth/resend-login-code", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Couldn't send a new code.");
        if (data.expired) setStep("password");
        return;
      }
      setNotice("We've sent a new code. Only the latest code works.");
      setCode("");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setResending(false);
    }
  };

  const footer = (
    <>
      <p>
        New here?{" "}
        <Link href="/portal/signup" className={textLink}>
          Create an account
        </Link>
      </p>
      <p>
        Trouble signing in?{" "}
        <a href="https://wa.me/919152975552" target="_blank" rel="noopener noreferrer" className={textLink}>
          Message us on WhatsApp
        </a>
      </p>
    </>
  );

  if (step === "code") {
    return (
      <AuthLayout
        title="Check your email"
        description={
          <>
            We sent a 6-digit code to <span className="font-semibold text-[#685752] break-all">{emailHint}</span>. It expires in 10 minutes.
          </>
        }
        footer={<p>Not in your inbox after a minute? Check your spam folder.</p>}
      >
        <form onSubmit={handleCode} noValidate className="space-y-5">
          {error && <FormMessage>{error}</FormMessage>}
          {notice && !error && <FormMessage tone="success">{notice}</FormMessage>}

          <CodeField id="login-code" value={code} onChange={setCode} />

          <SubmitButton loading={loading} loadingText="Checking…">
            Sign in
          </SubmitButton>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                setStep("password");
                setError("");
                setNotice("");
              }}
              className={`min-h-11 text-sm font-semibold text-[#7A6862] hover:text-[#685752] rounded cursor-pointer ${focusRing}`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || cooldown > 0}
              className={`min-h-11 text-sm font-semibold text-[#4A7244] hover:underline disabled:text-[#7A6862] disabled:no-underline disabled:cursor-not-allowed rounded cursor-pointer ${focusRing}`}
            >
              {resending ? "Sending…" : cooldown > 0 ? `Send a new code in ${cooldown}s` : "Send a new code"}
            </button>
          </div>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Sign in" description="See your bookings, documents, payments and trip updates." footer={footer}>
      <form onSubmit={handlePassword} className="space-y-5">
        {searchParams.get("expired") === "1" && <FormMessage tone="info">Your session expired. Sign in again to continue.</FormMessage>}
        {error && <FormMessage>{error}</FormMessage>}

        <Field
          id="login-identifier"
          label="Email"
          hint="No email on your account? Use your mobile number."
          type="text"
          inputMode="email"
          autoComplete="username"
          required
          value={loginIdentifier}
          onChange={(e) => setLoginIdentifier(e.target.value)}
        />

        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aside={
            <Link href="/portal/forgot-password" className={`text-sm ${textLink}`}>
              Forgot password?
            </Link>
          }
        />

        <SubmitButton loading={loading} loadingText="Signing in…">
          Continue
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
