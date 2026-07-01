"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { formatUsd } from "@/lib/format";
import type { OrderStatus } from "@/generated/prisma/client";
import { updateOrderStatus } from "../actions";

type Row = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customer: string;
  email: string;
  itemSummary: string;
  itemCount: number;
  total: number;
  date: string;
};

const STATUS_STYLES: Record<OrderStatus, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "bg-[#faeadf] text-[#9a4e27]" },
  PAID: { label: "Paid", cls: "bg-[#e5f3ef] text-[#0f766e]" },
  FULFILLED: { label: "Fulfilled", cls: "bg-[#e8eef6] text-[#355c89]" },
  CANCELLED: { label: "Cancelled", cls: "bg-[#f1f3f2] text-[#6b7671]" },
  REFUNDED: { label: "Refunded", cls: "bg-[#f7e9e5] text-[#a14632]" },
};

const tabs: { id: OrderStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "PAID", label: "Paid" },
  { id: "FULFILLED", label: "Fulfilled" },
  { id: "CANCELLED", label: "Cancelled" },
  { id: "REFUNDED", label: "Refunded" },
];

export function OrdersTable({ orders }: { orders: Row[] }) {
  const [tab, setTab] = useState<OrderStatus | "ALL">("ALL");
  const [pending, startTransition] = useTransition();

  const filtered = useMemo(
    () => (tab === "ALL" ? orders : orders.filter((o) => o.status === tab)),
    [tab, orders],
  );

  function handleStatus(id: string, value: string) {
    if (!value) return;
    startTransition(async () => {
      await updateOrderStatus(id, value);
    });
  }

  return (
    <div className="mt-5 rounded-lg border border-[#d9dfdd] bg-white shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
      <div className="flex flex-wrap gap-2 border-b border-[#e1e6e4] p-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`h-9 rounded-lg px-3 text-sm font-medium ${
              tab === t.id ? "bg-[#101719] text-white" : "bg-[#f2f5f4] text-[#59646a] hover:text-[#101719]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-[#f7f9f8] text-xs uppercase tracking-[0.14em] text-[#7a8589]">
            <tr>
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold">Items</th>
              <th className="px-5 py-3 font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-[#e5eae8] ${pending ? "opacity-60" : ""}`}>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#7a8589]">
                  No orders in this view.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="hover:bg-[#f8faf9]">
                  <td className="px-5 py-4 font-semibold text-[#101719]">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[#485357]">{o.customer}</p>
                    <p className="text-xs text-[#8b969a]">{o.email}</p>
                  </td>
                  <td className="px-5 py-4 text-[#485357]">{o.itemSummary}</td>
                  <td className="px-5 py-4 font-semibold">{formatUsd(o.total)}</td>
                  <td className="px-5 py-4 text-[#59646a]">{o.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status].cls}`}>
                      {STATUS_STYLES[o.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      aria-label={`Update ${o.orderNumber}`}
                      defaultValue=""
                      disabled={pending}
                      onChange={(e) => {
                        handleStatus(o.id, e.target.value);
                        e.target.value = "";
                      }}
                      className="h-9 rounded-lg border border-[#d5dcda] bg-white px-2 text-xs font-medium text-[#394246] outline-none"
                    >
                      <option value="" disabled>
                        Update…
                      </option>
                      <option value="FULFILLED">Mark fulfilled</option>
                      <option value="CANCELLED">Cancel</option>
                      <option value="REFUNDED">Refund</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
