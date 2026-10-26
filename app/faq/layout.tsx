import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs | Travel With Sonali",
  description: "Answers to common questions about bookings, payments, packing, safety and our group tours.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
