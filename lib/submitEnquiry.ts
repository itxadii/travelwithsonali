export interface EnquiryPayload {
  name: string;
  mobile: string;
  email: string;
  tour: string;
  travellers: string;
  message: string;
}

/** Sends a website enquiry to the admin Leads inbox. Resolves to an error message, or null on success. */
export async function submitEnquiry(data: EnquiryPayload): Promise<string | null> {
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) return null;
    const json = await res.json().catch(() => null);
    return json?.error || "Sorry, we couldn't send your enquiry. Please try again.";
  } catch {
    return "Network error. Please check your connection, or call / WhatsApp us instead.";
  }
}
