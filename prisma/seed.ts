// Seed the product catalog from the existing hardcoded data in data/shop.ts.
// dotenv must load before any module that reads env at import time
// (lib/imagekit-url.ts reads NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT on load).
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "../generated/prisma/client";
import { SHOP_PRODUCTS } from "../data/shop";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function buildImages(product: (typeof SHOP_PRODUCTS)[number]): Prisma.ProductImageCreateWithoutProductInput[] {
  const label = `${product.brand} ${product.name}`;
  const images: Prisma.ProductImageCreateWithoutProductInput[] = [];

  images.push({ url: product.image, alt: label, role: "PRIMARY", position: 0 });

  product.gallery?.forEach((url, index) => {
    images.push({ url, alt: `${label} — view ${index + 1}`, role: "GALLERY", position: index });
  });

  if (product.detailImage) {
    images.push({ url: product.detailImage, alt: `${label} — detail`, role: "DETAIL", position: 0 });
  }

  return images;
}

async function main() {
  console.log("Seeding product catalog…");

  // Idempotent: wipe and reinsert. Cascade removes ProductImage rows.
  await prisma.product.deleteMany();

  for (const product of SHOP_PRODUCTS) {
    await prisma.product.create({
      data: {
        slug: product.slug,
        reference: product.reference,
        brand: product.brand,
        name: product.name,
        price: product.price,
        gender: product.gender,
        collection: product.collection,
        condition: product.condition,
        material: product.material,
        dial: product.dial,
        diameter: product.diameter,
        year: product.year ?? null,
        waterResistance: product.waterResistance ?? null,
        movement: product.movement ?? null,
        description: product.description ?? null,
        categoryTags: [...product.categoryTags],
        images: { create: buildImages(product) },
      },
    });
  }

  const count = await prisma.product.count();
  console.log(`Seeded ${count} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
