"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserCheck, Search, ArrowUpRight } from "lucide-react";
import { GooeyInput } from "@/components/ui/gooey-input";

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customerList, setCustomerList] = useState<CustomerItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomerList(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#685752] font-serif-italic">
            Customer Directory
          </h1>
          <p className="text-xs text-[#997C70] mt-1">
            Verified customer profiles, travel records, and contact histories.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs flex items-center justify-between">
        <GooeyInput
          placeholder="Search name, phone, email..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          collapsedWidth={130}
          expandedWidth={280}
          expandedOffset={48}
          classNames={{
            surface: "bg-[#685752] text-white shadow-md ring-1 ring-[#685752]/20 hover:bg-[#5a4a45]",
          }}
        />
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#E8DCD5] shadow-xs">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#997C70]">Loading customer records...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#997C70]">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8DCD5] text-[#997C70] uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Customer Name</th>
                  <th className="pb-3 font-semibold">Phone</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Registered</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD5]">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FDF7F4] transition-colors">
                    <td className="py-3.5 font-bold text-[#685752]">{c.name}</td>
                    <td className="py-3.5 text-[#666059]">{c.phone}</td>
                    <td className="py-3.5 text-[#666059]">{c.email || "N/A"}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[#997C70]">
                      {new Date(c.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="px-3 py-1.5 rounded-xl bg-[#FDF7F4] border border-[#E8DCD5] hover:bg-[#8EB486] hover:text-white hover:border-[#8EB486] text-[#685752] text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
