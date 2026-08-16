"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Phone, Mail, ShieldCheck } from "lucide-react";

export default function CustomerProfilePage() {
  const [customer, setCustomer] = useState<{ name: string; phone: string; email?: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/portal/dashboard");
        if (res.ok) {
          const json = await res.json();
          setCustomer(json.customer);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/portal/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg({ type: "error", text: json.error || "Failed to update password." });
        setLoading(false);
        return;
      }

      setMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setMsg({ type: "error", text: "An error occurred while updating password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
          My Travel Profile & Account Security
        </h1>
        <p className="text-xs text-[#7A746E] mt-1">
          Manage your contact details and update your portal account password.
        </p>
      </div>

      {/* Profile Card */}
      {customer && (
        <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
          <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
            <User className="w-4 h-4 text-[#E05328]" />
            Personal Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
              <span className="text-[#7A746E] block font-medium">Full Name</span>
              <span className="text-[#1C1917] font-bold text-sm">{customer.name}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF]">
              <span className="text-[#7A746E] block font-medium">Mobile Phone</span>
              <span className="text-[#1C1917] font-bold text-sm">{customer.phone}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EBE5DF] sm:col-span-2">
              <span className="text-[#7A746E] block font-medium">Email Address</span>
              <span className="text-[#1C1917] font-bold text-sm">{customer.email || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Security Form */}
      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-6">
        <h3 className="text-base font-bold text-[#1C1917] flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Update Password
        </h3>

        {msg && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium ${
              msg.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-[#7A746E] font-semibold">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] focus:outline-none focus:border-[#E05328]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[#7A746E] font-semibold">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] focus:outline-none focus:border-[#E05328]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#7A746E] font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#EBE5DF] text-[#1C1917] focus:outline-none focus:border-[#E05328]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-full bg-[#E05328] hover:bg-[#C8451D] text-white font-semibold text-xs cursor-pointer shadow-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
