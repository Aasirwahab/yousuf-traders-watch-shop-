import type { Metadata } from "next";
import WatchesPage from "@/components/sections/WatchesPage";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Selected Watches | Ovalen",
  description: "Browse men's, ladies', new, pre-owned, and limited edition watches curated by Ovalen.",
};

export default async function Page() {
  const products = await getAllProducts();
  return <WatchesPage products={products} />;
}
