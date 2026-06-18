import type { NavLink, Category, Product, Feature, FooterLink } from "@/types";

// ─── Navigation ──────────────────────────────────────────────
export const NAV_LINKS: NavLink[] = [
  { label: "What's New", hasDropdown: true },
  { label: "Stories", hasDropdown: true },
  { label: "Brands", hasDropdown: true },
  { label: "Insurance", hasDropdown: false },
];

// ─── About Section — Categories ──────────────────────────────
export const CATEGORIES: Category[] = [
  { name: "Modern Watches", imageId: "1524592094714-0f0654e20314" },
  { name: "Limited Edition", imageId: "1547996160-81dfa63595aa" },
  { name: "Chronographs", imageId: "1612817159949-195b6eb9e31a" },
  { name: "Classic Watches", imageId: "1533139502658-0198f920d8e8" },
];

// ─── Shop Section — Products ─────────────────────────────────
export const PRODUCTS: Product[] = [
  { name: "Louis Errard", price: "$5,450", oldPrice: "$6,990", imageId: "1434056886845-dac89ffe9b56" },
  { name: "Roger Dubuis", price: "$17,850", oldPrice: "$18,290", imageId: "1508057198894-247b23fe5ade" },
  { name: "Jean Dunand", price: "$47,340", oldPrice: "$47,990", imageId: "1509048191080-d2984bad6ae5" },
  { name: "Seiko Prospex", price: "$34,760", oldPrice: "$34,990", imageId: "1495704907664-81f74a7efd9b" },
];

// ─── Central Feature — Annotations ──────────────────────────
export const FEATURES_LEFT: Feature[] = [
  {
    title: "Quality Materials",
    description: "Made from high-quality materials",
  },
  {
    title: "Modern Design",
    description: "Known for its minimalist and elegant design",
  },
  {
    title: "Accuracy",
    description: "Using famous Swiss-made machines",
    offsetClass: "translate-x-10",
  },
];

export const FEATURES_RIGHT: Feature[] = [
  {
    title: "Convenient to Use",
    description: "Very light and does not feel heavy on the wrist",
  },
  {
    title: "Safe to Use",
    description: "Very safe for the skin and non-irritating",
  },
  {
    title: "CR 2025",
    description: "Famously high-quality and long-lasting battery",
    offsetClass: "-translate-x-10",
  },
];

// ─── Footer ──────────────────────────────────────────────────
export const FOOTER_NAV_LINKS: FooterLink[] = [
  { label: "About Us", href: "#" },
  { label: "FAQ", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Contact", href: "#" },
];

export const FOOTER_PRODUCTS: FooterLink[] = [
  { label: "Modern Watches", href: "#" },
  { label: "Limited Edition", href: "#" },
  { label: "Chronographs", href: "#" },
  { label: "Classic Watches", href: "#" },
];

// ─── Image Helpers ───────────────────────────────────────────
export const UNSPLASH_BASE = "https://images.unsplash.com/photo-";

export function unsplashUrl(imageId: string, width: number = 400, quality: number = 80): string {
  return `${UNSPLASH_BASE}${imageId}?auto=format&fit=crop&w=${width}&q=${quality}`;
}
