import React from "react";
import type { Metadata } from "next";
import { getCurrentCustomer } from "@/lib/portal/auth";
import PortalLayoutClient from "./PortalLayoutClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Trips | Travel With Sonali",
  robots: { index: false, follow: false },
};

export default async function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();

  return <PortalLayoutClient customer={customer}>{children}</PortalLayoutClient>;
}
