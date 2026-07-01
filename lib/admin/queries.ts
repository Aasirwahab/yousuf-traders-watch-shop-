import "server-only";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin/auth";
import type { OrderStatus } from "@/generated/prisma/client";

const REALIZED: OrderStatus[] = ["PAID", "FULFILLED"];

// ---- Orders ---------------------------------------------------------------

export async function listOrders(take = 200) {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: { items: { select: { name: true, quantity: true } } },
  });
  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    customer: o.shipName || o.email,
    email: o.email,
    itemSummary:
      o.items.length === 0
        ? "—"
        : o.items.length === 1
          ? o.items[0].name
          : `${o.items[0].name} +${o.items.length - 1} more`,
    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
    total: o.total,
    date: o.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));
}

export async function getOrderDetail(id: string) {
  await requireAdmin();
  return prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
}

// ---- Products -------------------------------------------------------------

export async function listProducts() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { position: "asc" } },
      _count: { select: { orderItems: true } },
    },
  });
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    brand: p.brand,
    name: p.name,
    reference: p.reference,
    price: p.price,
    stock: p.stock,
    published: p.published,
    image: p.images.find((i) => i.role === "PRIMARY")?.url ?? p.images[0]?.url ?? "",
    imageCount: p.images.length,
    orderCount: p._count.orderItems,
  }));
}

export async function getProduct(id: string) {
  await requireAdmin();
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

// ---- Customers ------------------------------------------------------------

export async function listCustomers() {
  await requireAdmin();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { orders: { select: { total: true, status: true } } },
  });
  return users.map((u) => {
    const paidOrders = u.orders.filter((o) => REALIZED.includes(o.status));
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      orderCount: u.orders.length,
      totalSpent: paidOrders.reduce((sum, o) => sum + o.total, 0),
      createdAt: u.createdAt.toISOString(),
    };
  });
}

// ---- Inventory ------------------------------------------------------------

export async function listInventory() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: [{ stock: "asc" }, { brand: "asc" }],
    select: {
      id: true,
      slug: true,
      brand: true,
      name: true,
      reference: true,
      stock: true,
      published: true,
    },
  });
  return products;
}
