import type { Category, Feature, FooterLink, NavLink, Product } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "New arrivals", href: "/watches?category=New%20arrivals" },
  { label: "Watches", href: "/watches" },
  { label: "Pre-owned", href: "/watches?category=Pre-owned" },
  { label: "Brands", href: "/brands" },
];

export const CATEGORIES: Category[] = [
  { name: "Modern", description: "Contemporary forms and advanced materials." },
  { name: "Limited editions", description: "Rare releases selected for collectors." },
  { name: "Chronographs", description: "Precision timing built for performance." },
  { name: "Classics", description: "Enduring silhouettes that outlive trends." },
];

export const PRODUCTS: Product[] = [
  {
    slug: "louis-erard-excellence",
    brand: "Louis Erard",
    name: "Excellence Petite Seconde",
    reference: "LE-34237AA01",
    price: "$5,450",
    condition: "New",
    groups: ["New arrivals", "Best sellers"],
  },
  {
    slug: "roger-dubuis-excalibur",
    brand: "Roger Dubuis",
    name: "Excalibur Automatic",
    reference: "RDDBEX0984",
    price: "$17,850",
    condition: "Pre-owned",
    groups: ["New arrivals", "Best sellers", "Pre-owned"],
  },
  {
    slug: "jean-dunand-orbital",
    brand: "Jean Dunand",
    name: "Shabaka Grande Complication",
    reference: "JD-SHA-02",
    price: "$47,340",
    condition: "Pre-owned",
    groups: ["New arrivals", "Pre-owned"],
  },
  {
    slug: "seiko-prospex-speedtimer",
    brand: "Seiko",
    name: "Prospex Speedtimer",
    reference: "SRQ047J1",
    price: "$3,760",
    condition: "New",
    groups: ["New arrivals", "Best sellers"],
  },
];

export const FEATURES_LEFT: Feature[] = [
  { title: "Sapphire crystal", description: "Scratch-resistant with anti-reflective coating" },
  { title: "Swiss automatic movement", description: "Mechanical precision, inspected by specialists" },
  { title: "42-hour power reserve", description: "Reliable performance between wears" },
];

export const FEATURES_RIGHT: Feature[] = [
  { title: "316L steel case", description: "Corrosion-resistant, hand-finished construction" },
  { title: "100 m water resistance", description: "Engineered for everyday confidence" },
  { title: "24-month warranty", description: "Every authenticated watch is protected" },
];

export const FOOTER_GROUPS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: "Shop",
    links: [
      { label: "All watches", href: "/watches" },
      { label: "New arrivals", href: "/watches?category=New%20arrivals" },
      { label: "Pre-owned", href: "/watches?category=Pre-owned" },
      { label: "Brands", href: "/brands" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Shipping & delivery", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "About Yusuf Traders",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Authentication", href: "/authentication" },
      { label: "Warranty", href: "/warranty" },
      { label: "Concierge", href: "/#concierge" },
    ],
  },
];
