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
  { name: "Modern Watches" },
  { name: "Limited Edition" },
  { name: "Chronographs" },
  { name: "Classic Watches" },
];

// ─── Shop Section — Products ─────────────────────────────────
export const PRODUCTS: Product[] = [
  { name: "Louis Errard", price: "$5,450", oldPrice: "$6,990" },
  { name: "Roger Dubuis", price: "$17,850", oldPrice: "$18,290" },
  { name: "Jean Dunand", price: "$47,340", oldPrice: "$47,990" },
  { name: "Seiko Prospex", price: "$34,760", oldPrice: "$34,990" },
];

// ─── Central Feature — Annotations ──────────────────────────
export const FEATURES_LEFT: Feature[] = [
  { title: "Quality Materials", description: "Made from high-quality materials" },
  { title: "Modern Design", description: "Known for its minimalist and elegant design" },
  { title: "Accuracy", description: "Using famous Swiss-made machines" },
];

export const FEATURES_RIGHT: Feature[] = [
  { title: "Convenient to Use", description: "Very light and does not feel heavy on the wrist" },
  { title: "Safe to Use", description: "Very safe for the skin and non-irritating" },
  { title: "CR 2025", description: "Famously high-quality and long-lasting battery" },
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
