"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout, Field, FormMessage, PasswordField, SubmitButton, textLink } from "../components/AuthLayout";

export default function CustomerSignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
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
        setError(data.error || "Couldn't create your account. Please try again.");
        setLoading(false);
        return;
      }

      // The account is created; it opens once the emailed code is entered
      router.push(`/portal/verify-email?email=${encodeURIComponent(data.email || email)}`);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      description="Keep your bookings, travel documents and payments in one place."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/portal/login" className={textLink}>
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <FormMessage>{error}</FormMessage>}

        <Field
          id="signup-name"
          label="Full name"
          type="text"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Field
          id="signup-phone"
          label="Mobile number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Field
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          hint="We email your password reset codes here."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          id="signup-password"
          label="Password"
          autoComplete="new-password"
          required
          minLength={8}
          hint="At least 8 characters."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <SubmitButton loading={loading} loadingText="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
