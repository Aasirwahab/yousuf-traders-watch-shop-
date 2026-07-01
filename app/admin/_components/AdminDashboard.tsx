"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  MessageSquareText,
  PackageCheck,
  Search,
} from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { formatUsd } from "@/lib/format";
import type { OrderStatus } from "@/generated/prisma/client";
import type { AdminDashboardData } from "@/lib/admin/metrics";
import { RANGES } from "@/lib/admin/ranges";
import { updateOrderStatus } from "../actions";

const rangeIds = Object.keys(RANGES) as (keyof typeof RANGES)[];

const orderTabs: { id: OrderStatus | "ALL"; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "PAID", label: "Paid" },
  { id: "FULFILLED", label: "Fulfilled" },
];

const STATUS_STYLES: Record<OrderStatus, { label: string; cls: string }> = {
  PENDING: { label: "Pending", cls: "bg-[#faeadf] text-[#9a4e27]" },
  PAID: { label: "Paid", cls: "bg-[#e5f3ef] text-[#0f766e]" },
  FULFILLED: { label: "Fulfilled", cls: "bg-[#e8eef6] text-[#355c89]" },
  CANCELLED: { label: "Cancelled", cls: "bg-[#f1f3f2] text-[#6b7671]" },
  REFUNDED: { label: "Refunded", cls: "bg-[#f7e9e5] text-[#a14632]" },
};

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return null;
  const up = pct >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${
        up ? "bg-[#e5f3ef] text-[#0f766e]" : "bg-[#f7e9e5] text-[#a14632]"
      }`}
    >
      {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
      {`${up ? "+" : ""}${pct.toFixed(1)}%`}
    </span>
  );
}

export function AdminDashboard({
  data,
  todayLabel,
}: {
  data: AdminDashboardData;
  todayLabel: string;
}) {
  const [orderTab, setOrderTab] = useState<OrderStatus | "ALL">("ALL");
  const [isPending, startTransition] = useTransition();

  const { kpis, chart, recentOrders, topProducts, inventory, activity, fulfillment } = data;

  const filteredOrders = useMemo(
    () => (orderTab === "ALL" ? recentOrders : recentOrders.filter((o) => o.status === orderTab)),
    [orderTab, recentOrders],
  );

  const chartMax = Math.max(1, ...chart.map((b) => b.value));

  const inventoryTotal =
    inventory.inStock + inventory.lowStock + inventory.outOfStock + inventory.unpublished || 1;

  const inventoryBars = [
    { label: "In stock", value: inventory.inStock, color: "bg-[#0f766e]" },
    { label: "Low stock", value: inventory.lowStock, color: "bg-[#d7942f]" },
    { label: "Out of stock", value: inventory.outOfStock, color: "bg-[#9f2f3f]" },
    { label: "Unpublished", value: inventory.unpublished, color: "bg-[#59646a]" },
  ];

  const kpiCards = [
    { label: "Net revenue", value: formatUsd(kpis.revenue.value), delta: kpis.revenue.deltaPct, note: "vs. previous period" },
    { label: "Orders", value: String(kpis.orders.value), delta: kpis.orders.deltaPct, note: `${fulfillment.paid} awaiting fulfillment` },
    { label: "Avg. order value", value: formatUsd(kpis.avgOrder.value), delta: kpis.avgOrder.deltaPct, note: "per realised order" },
    { label: "Low-stock risk", value: String(kpis.lowStock.value), delta: null, note: `${kpis.lowStock.outOfStock} out of stock` },
  ];

  function handleStatus(id: string, value: string) {
    if (!value) return;
    startTransition(async () => {
      await updateOrderStatus(id, value);
    });
  }

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-[#d9dfdd] pb-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#647176]">{todayLabel}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#101719] sm:text-4xl">Commerce control room</h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg border border-[#d5dcda] bg-white px-3 text-sm text-[#59646a] sm:w-[300px]">
            <Search size={17} />
            <input className="w-full bg-transparent text-sm outline-none placeholder:text-[#889398]" placeholder="Search orders, watches, customers" />
          </label>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#d5dcda] bg-white px-3 text-sm font-medium text-[#394246]">
            <CalendarDays size={17} />
            {RANGES[data.range].label}
            <ChevronDown size={15} />
          </button>
          <button className="grid size-11 place-items-center rounded-lg border border-[#d5dcda] bg-white text-[#394246]" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#101719] px-4 text-sm font-semibold text-white">
            <Download size={17} />
            Export
          </button>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {rangeIds.map((id) => (
          <Link
            key={id}
            href={`/admin?range=${id}`}
            className={`h-9 rounded-lg px-3 text-sm font-medium leading-9 transition ${
              data.range === id
                ? "bg-[#dbe9e6] text-[#0f5f59]"
                : "border border-[#d8dfdd] bg-white text-[#59646a] hover:text-[#101719]"
            }`}
          >
            {RANGES[id].label}
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {kpiCards.map((kpi) => (
          <article key={kpi.label} className="rounded-lg border border-[#d9dfdd] bg-white p-4 shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#667176]">{kpi.label}</p>
              <DeltaBadge pct={kpi.delta} />
            </div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{kpi.value}</p>
            <p className="mt-1 text-xs text-[#7a8589]">{kpi.note}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_372px]">
        <div className="min-w-0 space-y-5">
          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5 shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Revenue movement</h2>
                <p className="mt-1 text-sm text-[#667176]">Realised daily revenue across the selected range.</p>
              </div>
              <div className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#f2f5f4] px-3 text-sm font-medium text-[#3f4a4e]">
                <BarChart3 size={16} />
                Net revenue
              </div>
            </div>
            <div className="mt-7 flex h-[260px] items-end gap-1.5 border-b border-l border-[#dfe5e3] px-2 pb-3">
              {chart.map((bar, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative flex h-[220px] w-full items-end" title={formatUsd(bar.value)}>
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-[#0f766e] to-[#8ebbb5]"
                      style={{ height: `${(bar.value / chartMax) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-medium text-[#7a8589]">{bar.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="min-w-0 rounded-lg border border-[#d9dfdd] bg-white shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
            <div className="flex flex-col gap-4 border-b border-[#e1e6e4] p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Order queue</h2>
                <p className="mt-1 text-sm text-[#667176]">Latest orders — set fulfillment status inline.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {orderTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderTab(tab.id)}
                    className={`h-9 rounded-lg px-3 text-sm font-medium ${
                      orderTab === tab.id ? "bg-[#101719] text-white" : "bg-[#f2f5f4] text-[#59646a] hover:text-[#101719]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-[#f7f9f8] text-xs uppercase tracking-[0.14em] text-[#7a8589]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Order</th>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Watch</th>
                    <th className="px-5 py-3 font-semibold">Value</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Age</th>
                    <th className="px-5 py-3 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-[#e5eae8] ${isPending ? "opacity-60" : ""}`}>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#7a8589]">
                        No orders in this view yet.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#f8faf9]">
                        <td className="px-5 py-4 font-semibold text-[#101719]">
                          <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-[#485357]">{order.customer}</td>
                        <td className="px-5 py-4 text-[#485357]">{order.item}</td>
                        <td className="px-5 py-4 font-semibold">{formatUsd(order.total)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status].cls}`}>
                            {STATUS_STYLES[order.status].label}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#59646a]">{order.age}</td>
                        <td className="px-5 py-4">
                          <select
                            aria-label={`Update ${order.orderNumber}`}
                            defaultValue=""
                            disabled={isPending}
                            onChange={(e) => {
                              handleStatus(order.id, e.target.value);
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
          </section>
        </div>

        <aside className="min-w-0 space-y-5">
          <section className="rounded-lg border border-[#d9dfdd] bg-[#101719] p-5 text-white shadow-[0_16px_40px_rgba(17,23,25,0.16)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Inventory health</h2>
              <PackageCheck size={19} className="text-[#9fcac4]" />
            </div>
            <div className="mt-5 space-y-4">
              {inventoryBars.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-[#cbd4d2]">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.value / inventoryTotal) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5 shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
            <h2 className="text-lg font-semibold tracking-tight">Product performance</h2>
            <div className="mt-4 space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-sm text-[#7a8589]">No sales recorded yet.</p>
              ) : (
                topProducts.map((product) => (
                  <article key={product.reference} className="flex items-center gap-3 rounded-lg border border-[#e1e6e4] p-2.5">
                    <div className="relative size-14 overflow-hidden rounded-md bg-[#eef2f1]">
                      {product.image ? <Image src={product.image} alt="" fill sizes="56px" className="object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#101719]">{product.name}</p>
                      <p className="mt-1 text-xs text-[#7a8589]">{product.reference} / {product.sold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#0f766e]">{product.sold}</p>
                      <p className={`text-xs ${product.stock <= 2 ? "text-[#9f2f3f]" : "text-[#7a8589]"}`}>{product.stock} left</p>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5 shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Activity rail</h2>
              <MessageSquareText size={18} className="text-[#667176]" />
            </div>
            <div className="mt-5 space-y-4">
              {activity.length === 0 ? (
                <p className="text-sm text-[#7a8589]">No recent activity.</p>
              ) : (
                activity.map((item, index) => (
                  <div key={index} className="grid grid-cols-[22px_1fr] gap-3">
                    <div className="flex flex-col items-center">
                      <span className="mt-1 size-2.5 rounded-full bg-[#0f766e]" />
                      {index < activity.length - 1 ? <span className="mt-2 h-full w-px bg-[#dfe5e3]" /> : null}
                    </div>
                    <div className="pb-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-[#101719]">{item.title}</p>
                        <span className="shrink-0 text-xs text-[#8b969a]">{item.time}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[#667176]">{item.detail}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-[#d9dfdd] bg-white p-5 shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
          <h2 className="text-lg font-semibold tracking-tight">Fulfillment timeline</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Clock3, title: "Awaiting payment", detail: `${fulfillment.pending} pending`, tone: "text-[#d7942f]" },
              { icon: CheckCircle2, title: "Paid", detail: `${fulfillment.paid} to fulfil`, tone: "text-[#0f766e]" },
              { icon: PackageCheck, title: "Fulfilled", detail: `${fulfillment.fulfilled} shipped`, tone: "text-[#355c89]" },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-lg bg-[#f7f9f8] p-4">
                  <Icon size={20} className={step.tone} />
                  <p className="mt-4 text-sm font-semibold">{step.title}</p>
                  <p className="mt-1 text-xs text-[#667176]">{step.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-[#d9dfdd] bg-white p-5 shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#faeadf] text-[#9a4e27]">
              <AlertTriangle size={19} />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Attention needed</h2>
              <p className="mt-1 text-sm leading-6 text-[#667176]">
                {fulfillment.paid} paid {fulfillment.paid === 1 ? "order is" : "orders are"} awaiting fulfillment, and{" "}
                {kpis.lowStock.value} {kpis.lowStock.value === 1 ? "listing is" : "listings are"} at low-stock risk
                ({kpis.lowStock.outOfStock} out of stock).
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
