"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: "notif-1",
      title: "Booking Confirmed",
      message: "Booking TWS-2026-881 for Manali & Kasol Group Trip confirmed for Rahul Verma.",
      type: "success",
      date: "16 Aug 2026",
    },
    {
      id: "notif-2",
      title: "Payment Received",
      message: "₹10,000 payment recorded via UPI for Booking TWS-2026-881.",
      type: "info",
      date: "16 Aug 2026",
    },
    {
      id: "notif-3",
      title: "Document Verified",
      message: "Aadhaar document for Rahul Verma verified by Sonali Sharma.",
      type: "success",
      date: "16 Aug 2026",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
          Notifications Center
        </h1>
        <p className="text-xs text-[#997C70] mt-1">
          Operational alerts, booking confirmations, and payment activity.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs space-y-4">
        <div className="space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-4 rounded-2xl bg-[#FDF7F4] border border-[#E8DCD5] flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#685752] text-sm">{n.title}</h4>
                  <span className="text-[10px] text-[#997C70]">{n.date}</span>
                </div>
                <p className="text-[#666059] mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
