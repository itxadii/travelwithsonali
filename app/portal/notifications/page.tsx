"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    try {
      const res = await fetch("/api/portal/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/portal/notifications", { method: "PATCH" });
      if (res.ok) {
        fetchNotifs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917] font-serif-italic">
            Notification Center
          </h1>
          <p className="text-xs text-[#7A746E] mt-1">
            Booking confirmations, payment updates, and important trip alerts.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-[#E05328] hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#EBE5DF] shadow-xs space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#7A746E]">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#7A746E]">You&apos;re all caught up! No new notifications.</div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border flex items-start gap-4 transition-colors ${
                  !n.isRead ? "bg-[#FAF6F0] border-[#E05328]/30" : "bg-white border-[#EBE5DF]"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#1C1917] text-sm">{n.title}</h4>
                    <span className="text-[10px] text-[#7A746E]">
                      {new Date(n.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-[#666059] mt-1 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
