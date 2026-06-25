import "server-only";

import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const CART_COOKIE = "ovalen_cart_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CartLine = {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  reference: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  lineTotal: number;
};

export type CartView = {
  items: CartLine[];
  count: number;
  subtotal: number;
};

const EMPTY_CART: CartView = { items: [], count: 0, subtotal: 0 };

/**
 * Move a guest cart's items into the user's cart, summing quantities, then
 * delete the guest cart and clear its cookie.
 */
async function mergeGuestCart(guestCartId: string, userCartId: string) {
  if (guestCartId === userCartId) return;

  const guest = await prisma.cart.findUnique({
    where: { id: guestCartId },
    include: { items: true },
  });

  const cookieStore = await cookies();
  if (!guest) {
    cookieStore.delete(CART_COOKIE);
    return;
  }

  for (const item of guest.items) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: userCartId, productId: item.productId } },
      update: { quantity: { increment: item.quantity } },
      create: { cartId: userCartId, productId: item.productId, quantity: item.quantity },
    });
  }

  await prisma.cart.delete({ where: { id: guest.id } });
  cookieStore.delete(CART_COOKIE);
}

/**
 * Resolve the active cart id. For signed-in users this is their user cart
 * (merging any guest cookie cart first). For guests it is the cookie cart.
 * When `create` is false, returns null instead of creating a cart.
 */
async function resolveCartId(create: boolean): Promise<string | null> {
  const { userId: clerkId } = await auth();
  const cookieStore = await cookies();
  const guestCartId = cookieStore.get(CART_COOKIE)?.value ?? null;

  if (clerkId) {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: { clerkId },
    });

    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      if (!create && !guestCartId) return null;
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    if (guestCartId) await mergeGuestCart(guestCartId, cart.id);
    return cart.id;
  }

  // Guest
  if (guestCartId) {
    const cart = await prisma.cart.findUnique({ where: { id: guestCartId } });
    if (cart) return cart.id;
  }

  if (!create) return null;

  const cart = await prisma.cart.create({ data: {} });
  cookieStore.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return cart.id;
}

async function buildView(cartId: string | null): Promise<CartView> {
  if (!cartId) return EMPTY_CART;

  const items = await prisma.cartItem.findMany({
    where: { cartId },
    orderBy: { createdAt: "asc" },
    include: { product: { include: { images: true } } },
  });

  const lines: CartLine[] = items.map((item) => {
    const primary = item.product.images.find((image) => image.role === "PRIMARY");
    return {
      productId: item.productId,
      slug: item.product.slug,
      brand: item.product.brand,
      name: item.product.name,
      reference: item.product.reference,
      price: item.product.price,
      image: primary?.url ?? item.product.images[0]?.url ?? "",
      quantity: item.quantity,
      stock: item.product.stock,
      lineTotal: item.product.price * item.quantity,
    };
  });

  return {
    items: lines,
    count: lines.reduce((total, line) => total + line.quantity, 0),
    subtotal: lines.reduce((total, line) => total + line.lineTotal, 0),
  };
}

export async function getCartView(): Promise<CartView> {
  return buildView(await resolveCartId(false));
}

export async function addToCartBySlug(slug: string): Promise<CartView> {
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product || !product.published) {
    return getCartView();
  }

  const cartId = await resolveCartId(true);
  if (!cartId) return EMPTY_CART;

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId, productId: product.id } },
  });

  const nextQuantity = Math.min((existing?.quantity ?? 0) + 1, product.stock);

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId: product.id } },
    update: { quantity: nextQuantity },
    create: { cartId, productId: product.id, quantity: nextQuantity },
  });

  return buildView(cartId);
}

export async function setQuantity(productId: string, quantity: number): Promise<CartView> {
  const cartId = await resolveCartId(false);
  if (!cartId) return EMPTY_CART;

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { cartId, productId } });
    return buildView(cartId);
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  const capped = product ? Math.min(quantity, product.stock) : quantity;

  await prisma.cartItem.updateMany({
    where: { cartId, productId },
    data: { quantity: capped },
  });

  return buildView(cartId);
}

export async function removeFromCart(productId: string): Promise<CartView> {
  const cartId = await resolveCartId(false);
  if (!cartId) return EMPTY_CART;

  await prisma.cartItem.deleteMany({ where: { cartId, productId } });
  return buildView(cartId);
}
