import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

// Public, indexable routes. Account, checkout, and auth pages are intentionally
// excluded (also disallowed in robots.ts).
const STATIC_PATHS = [
  "",
  "/watches",
  "/brands",
  "/about",
  "/shipping",
  "/returns",
  "/warranty",
  "/authentication",
  "/faq",
  "/privacy",
  "/terms",
  "/cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
  }));

  const slugs = await getAllProductSlugs();
  const productEntries = slugs.map((slug) => ({
    url: `${SITE_URL}/watches/${slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...productEntries];
}
