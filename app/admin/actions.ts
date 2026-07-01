"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin/auth";

export type ActionResult = { ok: true } | { ok: false; error: string };

// Statuses an admin may set manually from the order queue. PAID is intentionally
// excluded — payment state is owned by the PayPal capture/webhook flow, not a
// manual toggle, so it can't be faked here.
const statusSchema = z.enum(["FULFILLED", "CANCELLED", "REFUNDED"]);
const orderIdSchema = z.string().min(1).max(64);

/**
 * Update an order's status from the admin queue. Re-checks the admin role
 * server-side (never trust that the caller reached here through the gated UI)
 * and validates the id/status before touching the database.
 */
export async function updateOrderStatus(orderId: string, status: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const id = orderIdSchema.safeParse(orderId);
  const next = statusSchema.safeParse(status);
  if (!id.success || !next.success) return { ok: false, error: "Invalid request." };

  try {
    await prisma.order.update({ where: { id: id.data }, data: { status: next.data } });
  } catch (err) {
    console.error("updateOrderStatus failed", err);
    return { ok: false, error: "Could not update the order." };
  }

  revalidatePath("/admin");
  return { ok: true };
}
