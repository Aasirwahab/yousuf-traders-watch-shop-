"use server";

import {
  addToCartBySlug,
  getCartView,
  removeFromCart,
  setQuantity,
  type CartView,
} from "@/lib/cart";
import { checkRateLimit } from "@/lib/rate-limit";

// Defensive bounds on client-supplied identifiers/quantities before they reach
// the database. Prisma already prevents injection; these caps prevent oversized
// payloads and absurd quantities from abusive callers.
const MAX_ID_LENGTH = 64;
const MAX_SLUG_LENGTH = 200;
const MAX_QUANTITY = 99;

export async function getCartAction(): Promise<CartView> {
  return getCartView();
}

export async function addToCartAction(slug: string): Promise<CartView> {
  if (typeof slug !== "string" || slug.length > MAX_SLUG_LENGTH) return getCartView();
  if (!(await checkRateLimit("cart"))) return getCartView();
  return addToCartBySlug(slug);
}

export async function setQuantityAction(productId: string, quantity: number): Promise<CartView> {
  if (typeof productId !== "string" || productId.length > MAX_ID_LENGTH) return getCartView();
  if (!(await checkRateLimit("cart"))) return getCartView();
  const safeQuantity = Number.isInteger(quantity)
    ? Math.max(0, Math.min(quantity, MAX_QUANTITY))
    : 0;
  return setQuantity(productId, safeQuantity);
}

export async function removeFromCartAction(productId: string): Promise<CartView> {
  if (typeof productId !== "string" || productId.length > MAX_ID_LENGTH) return getCartView();
  if (!(await checkRateLimit("cart"))) return getCartView();
  return removeFromCart(productId);
}
