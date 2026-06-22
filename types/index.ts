export interface NavLink {
  label: string;
  href: string;
}

export interface Category {
  name: string;
  description: string;
}

export interface Product {
  slug: string;
  brand: string;
  name: string;
  reference: string;
  price: string;
  condition: "New" | "Pre-owned";
  groups: Array<"New arrivals" | "Best sellers" | "Pre-owned">;
}

export interface Feature {
  title: string;
  description: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
