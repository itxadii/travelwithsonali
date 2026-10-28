"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, Field, FormMessage, PasswordField, SubmitButton, textLink } from "../components/AuthLayout";

export default function CustomerLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/portal";

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
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

      if (res.status === 403 && data.reason === "unverified") {
        router.push(`/portal/verify-email?email=${encodeURIComponent(data.email)}&resent=1`);
        return;
      }

      if (!res.ok) {
        setError(data.error || "That email, mobile number or password is incorrect.");
        setLoading(false);
        return;
      }

      router.push(fromPath);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in"
      description="See your bookings, documents, payments and trip updates."
      footer={
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
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {searchParams.get("expired") === "1" && (
          <FormMessage tone="info">Your session expired. Sign in again to continue.</FormMessage>
        )}
        {error && <FormMessage>{error}</FormMessage>}

        <Field
          id="login-identifier"
          label="Email or mobile number"
          type="text"
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
          Sign in
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
