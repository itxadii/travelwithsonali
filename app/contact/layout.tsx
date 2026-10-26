import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Travel With Sonali",
  description: "Call, email, WhatsApp or send an enquiry to plan your next group tour with Travel With Sonali.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
