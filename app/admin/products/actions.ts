"use server";

import { z } from "zod";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin/auth";
import { uploadToImageKit } from "@/lib/imagekit";
import {
  GENDERS,
  COLLECTIONS,
  CONDITIONS,
  MATERIALS,
  DIALS,
  CATEGORY_TAGS,
} from "@/lib/admin/product-options";

export type ActionResult = { ok: true } | { ok: false; error: string };

// Storefront product reads are cached under this tag (see lib/products.ts);
// every admin write busts it so the shop reflects changes immediately.
const PRODUCTS_TAG = "products";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB per image
const MAX_IMAGES = 12;

const inList = (list: readonly string[]) => (v: string) => list.includes(v);

const productSchema = z.object({
  brand: z.string().trim().min(1, "Brand is required").max(120),
  name: z.string().trim().min(1, "Name is required").max(160),
  reference: z.string().trim().min(1, "Reference is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens"),
  price: z.coerce.number().int("Price must be a whole number").min(0).max(100_000_000),
  gender: z.string().refine(inList(GENDERS), "Invalid gender"),
  collection: z.string().refine(inList(COLLECTIONS), "Invalid collection"),
  condition: z.string().refine(inList(CONDITIONS), "Invalid condition"),
  material: z.string().refine(inList(MATERIALS), "Invalid material"),
  dial: z.string().refine(inList(DIALS), "Invalid dial"),
  diameter: z.coerce.number().int().min(10).max(100),
  stock: z.coerce.number().int().min(0).max(100_000),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  waterResistance: z.string().trim().max(60).optional(),
  movement: z.string().trim().max(80).optional(),
  description: z.string().trim().max(6000).optional(),
  published: z.boolean(),
  categoryTags: z.array(z.string().refine(inList(CATEGORY_TAGS))),
});

function parseProduct(fd: FormData) {
  return productSchema.safeParse({
    brand: fd.get("brand"),
    name: fd.get("name"),
    reference: fd.get("reference"),
    slug: fd.get("slug"),
    price: fd.get("price"),
    gender: fd.get("gender"),
    collection: fd.get("collection"),
    condition: fd.get("condition"),
    material: fd.get("material"),
    dial: fd.get("dial"),
    diameter: fd.get("diameter"),
    stock: fd.get("stock"),
    year: fd.get("year") || undefined,
    waterResistance: fd.get("waterResistance") || undefined,
    movement: fd.get("movement") || undefined,
    description: fd.get("description") || undefined,
    published: fd.get("published") === "on" || fd.get("published") === "true",
    categoryTags: fd.getAll("categoryTags").map(String),
  });
}

/** Real image files from a multi-file input (empty inputs yield 0-byte files). */
function imageFiles(fd: FormData): File[] {
  return fd
    .getAll("images")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_IMAGES);
}

/**
 * Upload one file to ImageKit and return its CDN URL. The binary lives on
 * ImageKit; only the returned URL is ever persisted to the database.
 */
async function uploadProductImage(file: File, slug: string, index: number): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Not an image");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image too large");

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const fileName = `${slug}-${Date.now()}-${index}.${ext}`;
  const res = await uploadToImageKit(base64, fileName, `/ovalen/products/${slug}`);
  if (!res.url) throw new Error("ImageKit upload returned no URL");
  return res.url;
}

// ---- Create ---------------------------------------------------------------

export async function createProduct(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const parsed = parseProduct(fd);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product details." };
  }
  const data = parsed.data;

  let urls: string[];
  try {
    const files = imageFiles(fd);
    urls = await Promise.all(files.map((file, i) => uploadProductImage(file, data.slug, i)));
  } catch (err) {
    console.error("createProduct image upload failed", err);
    return { ok: false, error: "Image upload failed. Check file type/size and try again." };
  }

  try {
    await prisma.product.create({
      data: {
        brand: data.brand,
        name: data.name,
        reference: data.reference,
        slug: data.slug,
        price: data.price,
        gender: data.gender,
        collection: data.collection,
        condition: data.condition,
        material: data.material,
        dial: data.dial,
        diameter: data.diameter,
        stock: data.stock,
        published: data.published,
        year: data.year ?? null,
        waterResistance: data.waterResistance ?? null,
        movement: data.movement ?? null,
        description: data.description ?? null,
        categoryTags: data.categoryTags,
        images: {
          create: urls.map((url, i) => ({
            url,
            alt: `${data.brand} ${data.name}`.trim(),
            role: i === 0 ? "PRIMARY" : "GALLERY",
            position: i,
          })),
        },
      },
    });
  } catch (err) {
    console.error("createProduct failed", err);
    return { ok: false, error: "A product with that slug or reference already exists." };
  }

  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ---- Update (fields only; images managed separately) ----------------------

export async function updateProduct(
  id: string,
  _prev: ActionResult | null,
  fd: FormData,
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const parsed = parseProduct(fd);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid product details." };
  }
  const data = parsed.data;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        brand: data.brand,
        name: data.name,
        reference: data.reference,
        slug: data.slug,
        price: data.price,
        gender: data.gender,
        collection: data.collection,
        condition: data.condition,
        material: data.material,
        dial: data.dial,
        diameter: data.diameter,
        stock: data.stock,
        published: data.published,
        year: data.year ?? null,
        waterResistance: data.waterResistance ?? null,
        movement: data.movement ?? null,
        description: data.description ?? null,
        categoryTags: data.categoryTags,
      },
    });
  } catch (err) {
    console.error("updateProduct failed", err);
    return { ok: false, error: "Could not save — slug or reference may already be in use." };
  }

  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ---- Image management -----------------------------------------------------

export async function addProductImages(productId: string, fd: FormData): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!product) return { ok: false, error: "Product not found." };

  const files = imageFiles(fd);
  if (files.length === 0) return { ok: false, error: "Choose at least one image." };

  const hasPrimary = product.images.some((i) => i.role === "PRIMARY");
  let position = product.images.reduce((max, i) => Math.max(max, i.position), -1) + 1;

  try {
    for (let i = 0; i < files.length; i++) {
      const url = await uploadProductImage(files[i], product.slug, position);
      await prisma.productImage.create({
        data: {
          productId,
          url,
          alt: `${product.brand} ${product.name}`.trim(),
          role: !hasPrimary && i === 0 ? "PRIMARY" : "GALLERY",
          position,
        },
      });
      position += 1;
    }
  } catch (err) {
    console.error("addProductImages failed", err);
    return { ok: false, error: "Image upload failed. Check file type/size and try again." };
  }

  updateTag(PRODUCTS_TAG);
  revalidatePath(`/admin/products/${productId}`);
  return { ok: true };
}

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return { ok: false, error: "Image not found." };

  // Note: only the DB row is removed. The file remains on ImageKit (we store the
  // URL, not the ImageKit fileId, so we can't delete it from here). Orphaned CDN
  // files are harmless; a future cleanup could store fileId to enable deletion.
  await prisma.productImage.delete({ where: { id: imageId } });

  updateTag(PRODUCTS_TAG);
  revalidatePath(`/admin/products/${image.productId}`);
  return { ok: true };
}

export async function setPrimaryImage(imageId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return { ok: false, error: "Image not found." };

  await prisma.$transaction([
    prisma.productImage.updateMany({
      where: { productId: image.productId, role: "PRIMARY" },
      data: { role: "GALLERY" },
    }),
    prisma.productImage.update({ where: { id: imageId }, data: { role: "PRIMARY" } }),
  ]);

  updateTag(PRODUCTS_TAG);
  revalidatePath(`/admin/products/${image.productId}`);
  return { ok: true };
}

// ---- Stock / publish / delete ---------------------------------------------

export async function adjustStock(id: string, stock: number): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };
  if (!Number.isInteger(stock) || stock < 0 || stock > 100_000) {
    return { ok: false, error: "Invalid stock value." };
  }

  await prisma.product.update({ where: { id }, data: { stock } });
  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function togglePublished(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  const product = await prisma.product.findUnique({ where: { id }, select: { published: true } });
  if (!product) return { ok: false, error: "Product not found." };

  await prisma.product.update({ where: { id }, data: { published: !product.published } });
  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Forbidden" };

  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    console.error("deleteProduct failed", err);
    return { ok: false, error: "Could not delete — the product may be referenced by orders." };
  }

  updateTag(PRODUCTS_TAG);
  revalidatePath("/admin/products");
  return { ok: true };
}
