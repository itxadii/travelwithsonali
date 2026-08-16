import React from "react";
import { getCurrentCustomer } from "@/lib/portal/auth";
import PortalLayoutClient from "./PortalLayoutClient";

export const dynamic = "force-dynamic";

export default async function CustomerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();

  return <PortalLayoutClient customer={customer}>{children}</PortalLayoutClient>;
}
