import "server-only";

import { prisma } from "@/lib/prisma";
import type { ShopProduct, ShopCategory } from "@/data/shop";
import type { Product, ProductImage } from "@/generated/prisma/client";

type ProductWithImages = Product & { images: ProductImage[] };

/**
 * Map a database product (with its image rows) back into the ShopProduct
 * shape the storefront components already expect.
 */
function toShopProduct(p: ProductWithImages): ShopProduct {
  const primary = p.images.find((image) => image.role === "PRIMARY");
  const gallery = p.images
    .filter((image) => image.role === "GALLERY")
    .sort((a, b) => a.position - b.position)
    .map((image) => image.url);
  const detail = p.images.find((image) => image.role === "DETAIL");

  return {
    slug: p.slug,
    brand: p.brand,
    name: p.name,
    reference: p.reference,
    price: p.price,
    image: primary?.url ?? p.images[0]?.url ?? "",
    gender: p.gender as ShopProduct["gender"],
    collection: p.collection as ShopProduct["collection"],
    condition: p.condition as ShopProduct["condition"],
    material: p.material as ShopProduct["material"],
    dial: p.dial as ShopProduct["dial"],
    diameter: p.diameter,
    categoryTags: p.categoryTags as ShopCategory[],
    gallery: gallery.length ? gallery : undefined,
    detailImage: detail?.url,
    year: p.year ?? undefined,
    waterResistance: p.waterResistance ?? undefined,
    movement: p.movement ?? undefined,
    description: p.description ?? undefined,
  };
}

export async function getAllProducts(): Promise<ShopProduct[]> {
  const rows = await prisma.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
    include: { images: true },
  });
  return rows.map(toShopProduct);
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: { images: true },
  });
  return row ? toShopProduct(row) : null;
}

export async function getRelatedProducts(excludeSlug: string, take = 4): Promise<ShopProduct[]> {
  const rows = await prisma.product.findMany({
    where: { published: true, slug: { not: excludeSlug } },
    orderBy: { createdAt: "asc" },
    take,
    include: { images: true },
  });
  return rows.map(toShopProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return rows.map((row) => row.slug);
}
