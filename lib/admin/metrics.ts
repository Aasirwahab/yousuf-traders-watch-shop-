import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import { RANGES, type RangeId } from "@/lib/admin/ranges";
import type { OrderStatus } from "@/generated/prisma/client";

// Products at or below this unit count are flagged as low-stock risk. Luxury
// pieces are frequently single-unit, so the reorder line is intentionally low.
const LOW_STOCK_THRESHOLD = 3;

// Orders in these states count as realised revenue. PENDING (unpaid) and
// CANCELLED/REFUNDED are excluded from revenue totals.
const REALIZED: OrderStatus[] = ["PAID", "FULFILLED"];

type Kpi = { value: number; deltaPct: number | null };

export type AdminOrderRow = {
  id: string;
  orderNumber: string;
  customer: string;
  item: string;
  total: number;
  status: OrderStatus;
  age: string;
};

export type AdminDashboardData = {
  range: RangeId;
  kpis: {
    revenue: Kpi;
    orders: Kpi;
    avgOrder: Kpi;
    lowStock: { value: number; outOfStock: number };
  };
  chart: { label: string; value: number }[];
  recentOrders: AdminOrderRow[];
  topProducts: { name: string; reference: string; image: string; sold: number; stock: number }[];
  inventory: { inStock: number; lowStock: number; outOfStock: number; unpublished: number };
  activity: { title: string; detail: string; time: string }[];
  fulfillment: { pending: number; paid: number; fulfilled: number };
};

/** Percentage change from `prev` to `cur`; null when there's no prior baseline. */
function deltaPct(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}

/** Compact "just now / 12m / 5h / 3d" age label for a past timestamp. */
function formatAge(date: Date): string {
  const mins = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

const dayKey = (date: Date) => date.toISOString().slice(0, 10);

/**
 * Everything the /admin overview renders, computed live from the database for
 * the selected time range. Admin-gated: refuses to return data to non-admins.
 */
export async function getAdminDashboardData(range: RangeId): Promise<AdminDashboardData> {
  await requireAdmin();

  const days = RANGES[range].days;
  const now = new Date();

  // Current window = the last `days` calendar days (UTC), aligned to midnight so
  // the daily chart buckets line up. Previous window = the `days` before that,
  // used only for the KPI deltas.
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  const prevStart = new Date(start);
  prevStart.setUTCDate(prevStart.getUTCDate() - days);

  // One pass over every order since the previous window covers all three KPIs
  // and the daily chart, instead of several aggregate round-trips.
  const windowOrders = await prisma.order.findMany({
    where: { createdAt: { gte: prevStart } },
    select: { total: true, status: true, createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    buckets.set(dayKey(d), 0);
  }

  let curRevenue = 0;
  let curOrders = 0;
  let prevRevenue = 0;
  let prevOrders = 0;
  for (const o of windowOrders) {
    const inCurrent = o.createdAt >= start;
    const realized = REALIZED.includes(o.status);
    if (inCurrent) {
      curOrders += 1;
      if (realized) {
        curRevenue += o.total;
        const key = dayKey(o.createdAt);
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + o.total);
      }
    } else {
      prevOrders += 1;
      if (realized) prevRevenue += o.total;
    }
  }

  const curAvg = curOrders ? curRevenue / curOrders : 0;
  const prevAvg = prevOrders ? prevRevenue / prevOrders : 0;

  const chart = Array.from(buckets.entries()).map(([key, value]) => ({
    label: String(Number(key.slice(8, 10))), // day-of-month
    value,
  }));

  // Inventory buckets, fulfillment queue depth, and low-stock risk — current
  // operational state, not time-windowed.
  const [inStock, lowStock, outOfStock, unpublished, pending, paid, fulfilled] =
    await prisma.$transaction([
      prisma.product.count({ where: { published: true, stock: { gt: LOW_STOCK_THRESHOLD } } }),
      prisma.product.count({ where: { published: true, stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } } }),
      prisma.product.count({ where: { published: true, stock: 0 } }),
      prisma.product.count({ where: { published: false } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.order.count({ where: { status: "FULFILLED" } }),
    ]);

  // Latest orders for the queue + activity rail.
  const recent = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { items: { take: 1, select: { name: true } } },
  });

  const recentOrders: AdminOrderRow[] = recent.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer: o.shipName || o.email,
    item: o.items[0]?.name ?? "—",
    total: o.total,
    status: o.status,
    age: formatAge(o.createdAt),
  }));

  const activity = recent.slice(0, 4).map((o) => {
    const isPaid = REALIZED.includes(o.status);
    return {
      title: isPaid ? "Payment captured" : "Order placed",
      detail: `${o.orderNumber} · ${o.items[0]?.name ?? "order"}`,
      time: formatAge(o.paidAt ?? o.createdAt),
    };
  });

  // Top sellers by units sold across all time.
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    where: { productId: { not: null } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 3,
  });
  const ids = grouped.map((g) => g.productId).filter((id): id is string => Boolean(id));
  const productRows = ids.length
    ? await prisma.product.findMany({
        where: { id: { in: ids } },
        include: { images: { orderBy: { position: "asc" } } },
      })
    : [];
  const topProducts = grouped
    .map((g) => {
      const p = productRows.find((row) => row.id === g.productId);
      if (!p) return null;
      const image = p.images.find((i) => i.role === "PRIMARY")?.url ?? p.images[0]?.url ?? "";
      return {
        name: `${p.brand} ${p.name}`.trim(),
        reference: p.reference,
        image,
        sold: g._sum.quantity ?? 0,
        stock: p.stock,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  return {
    range,
    kpis: {
      revenue: { value: curRevenue, deltaPct: deltaPct(curRevenue, prevRevenue) },
      orders: { value: curOrders, deltaPct: deltaPct(curOrders, prevOrders) },
      avgOrder: { value: Math.round(curAvg), deltaPct: deltaPct(curAvg, prevAvg) },
      lowStock: { value: lowStock, outOfStock },
    },
    chart,
    recentOrders,
    topProducts,
    inventory: { inStock, lowStock, outOfStock, unpublished },
    activity,
    fulfillment: { pending, paid, fulfilled },
  };
}
