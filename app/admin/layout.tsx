import React from "react";
import type { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Travel With Sonali",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return <AdminLayoutClient admin={admin}>{children}</AdminLayoutClient>;
}
