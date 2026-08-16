import React from "react";
import AdminLayoutClient from "./AdminLayoutClient";
import { getCurrentAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getCurrentAdmin();

  return <AdminLayoutClient admin={admin}>{children}</AdminLayoutClient>;
}
