import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCartView, clearCart } from "@/lib/cart";
import { SHIPPING_METHODS, getShippingMethod, type ShippingMethodId } from "@/lib/shipping";

// Order ids a guest session is allowed to view. Set when an order is placed so
// the confirmation page can be shown without exposing every order publicly.
const ORDERS_COOKIE = "ovalen_orders";
const ORDERS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const MAX_REMEMBERED_ORDERS = 20;

async function rememberOrder(orderId: string) {
  const store = await cookies();
  const existing = store.get(ORDERS_COOKIE)?.value?.split(",").filter(Boolean) ?? [];
  if (!existing.includes(orderId)) existing.push(orderId);

  store.set(ORDERS_COOKIE, existing.slice(-MAX_REMEMBERED_ORDERS).join(","), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ORDERS_COOKIE_MAX_AGE,
  });
}

export const checkoutSchema = z.object({
  email: z.email().max(200),
  shipName: z.string().trim().min(1, "Full name is required").max(120),
  shipPhone: z.string().trim().max(40).optional(),
  shipLine1: z.string().trim().min(1, "Address is required").max(200),
  shipLine2: z.string().trim().max(200).optional(),
  shipCity: z.string().trim().min(1, "City is required").max(120),
  shipState: z.string().trim().max(120).optional(),
  shipPostal: z.string().trim().min(1, "Postal code is required").max(40),
  shipCountry: z.string().trim().min(1, "Country is required").max(120),
  shippingMethod: z.enum(
    SHIPPING_METHODS.map((method) => method.id) as [ShippingMethodId, ...ShippingMethodId[]],
  ),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

function generateOrderNumber() {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `OVL-${time}-${rand}`;
}

export type CreateOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

/** Thrown when a line can no longer be reserved, so the transaction rolls back. */
class OutOfStockError extends Error {
  constructor(public itemName: string) {
    super(`Out of stock: ${itemName}`);
    this.name = "OutOfStockError";
  }
}

/**
 * Create a PENDING order from the user's current cart. Totals are recomputed
 * server-side from the cart (never trusted from the client). Stock is reserved
 * (decremented) atomically in the same transaction as the order: the
 * conditional decrement only succeeds while enough stock remains, so two
 * shoppers can never both claim the last unit of a single-piece listing. If any
 * line can't be reserved the whole transaction rolls back and nothing is taken.
 */
export async function createOrderFromCart(input: CheckoutInput): Promise<CreateOrderResult> {
  const cart = await getCartView();
  // Ignore any zero-quantity lines (e.g. left behind when stock ran out) so we
  // never build a $0 order — payment providers reject those.
  const purchasable = cart.items.filter((line) => line.quantity > 0);
  if (purchasable.length === 0) {
    return { ok: false, error: "Your bag is empty." };
  }

  const method = getShippingMethod(input.shippingMethod);
  if (!method) {
    return { ok: false, error: "Please choose a delivery method." };
  }

  const subtotal = purchasable.reduce((sum, line) => sum + line.lineTotal, 0);
  const shippingCost = method.cost;
  const total = subtotal + shippingCost;

  const { userId: clerkId } = await auth();
  let userId: string | null = null;
  if (clerkId) {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId, email: input.email },
    });
    userId = user.id;
  }

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      for (const line of purchasable) {
        const reserved = await tx.product.updateMany({
          where: { id: line.productId, stock: { gte: line.quantity } },
          data: { stock: { decrement: line.quantity } },
        });
        if (reserved.count !== 1) {
          throw new OutOfStockError(line.name);
        }
      }

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          status: "PENDING",
          userId,
          email: input.email,
          shipName: input.shipName,
          shipPhone: input.shipPhone || null,
          shipLine1: input.shipLine1,
          shipLine2: input.shipLine2 || null,
          shipCity: input.shipCity,
          shipState: input.shipState || null,
          shipPostal: input.shipPostal,
          shipCountry: input.shipCountry,
          shippingMethod: method.label,
          subtotal,
          shippingCost,
          total,
          items: {
            create: purchasable.map((line) => ({
              productId: line.productId,
              slug: line.slug,
              brand: line.brand,
              name: line.name,
              reference: line.reference,
              image: line.image,
              unitPrice: line.price,
              quantity: line.quantity,
              lineTotal: line.lineTotal,
            })),
          },
        },
      });
    });
  } catch (err) {
    if (err instanceof OutOfStockError) {
      return { ok: false, error: `${err.itemName} just sold out. Please review your bag.` };
    }
    // Log internally; never surface DB internals to the shopper.
    console.error("createOrderFromCart failed", err);
    return { ok: false, error: "We couldn't place your order. Please try again." };
  }

  // Order is placed and stock reserved — empty the cart so it can't be
  // re-submitted, then record the id for guest confirmation access.
  await clearCart();
  await rememberOrder(order.id);
  return { ok: true, orderId: order.id };
}

/**
 * Fetch an order only if the current session is allowed to see it: either it
 * belongs to the signed-in user, or it was placed by this browser (recorded in
 * the httpOnly `ovalen_orders` cookie). Returns null otherwise so callers can
 * 404 rather than leak another customer's details.
 */
export async function getViewableOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) return null;

  const { userId: clerkId } = await auth();
  if (clerkId && order.userId) {
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (user && user.id === order.userId) return order;
  }

  const store = await cookies();
  const allowed = store.get(ORDERS_COOKIE)?.value?.split(",") ?? [];
  if (allowed.includes(order.id)) return order;

  return null;
}

/**
 * Mark a PENDING order PAID after a captured payment. The `status: "PENDING"`
 * guard makes this idempotent — a replayed capture leaves an already-paid order
 * untouched. Returns true when this call is the one that flipped it to PAID.
 */
export async function markOrderPaid(orderId: string, paymentRef: string): Promise<boolean> {
  const { count } = await prisma.order.updateMany({
    where: { id: orderId, status: "PENDING" },
    data: {
      status: "PAID",
      paymentProvider: "paypal",
      paymentRef,
      paidAt: new Date(),
    },
  });
  return count === 1;
}

/** Orders belonging to the signed-in user, newest first. */
export async function getUserOrders() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return [];

  return prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}
