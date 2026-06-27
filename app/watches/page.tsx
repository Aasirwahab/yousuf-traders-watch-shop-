import type { Metadata } from "next";
import WatchesPage from "@/components/sections/WatchesPage";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Selected Watches | Ovalen",
  description: "Browse men's, ladies', new, pre-owned, and limited edition watches curated by Ovalen.",
};

type PageProps = {
  searchParams: Promise<{ category?: string | string[]; brand?: string | string[] }>;
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: PageProps) {
  const products = await getAllProducts();
  const params = await searchParams;
  const category = first(params.category);
  const brand = first(params.brand);

  // Key forces a fresh mount when the category/brand query changes, so the
  // active filters always reflect the URL (e.g. nav links into a category).
  return (
    <WatchesPage
      key={`${category ?? ""}|${brand ?? ""}`}
      products={products}
      initialCategory={category}
      initialBrand={brand}
    />
  );
}
