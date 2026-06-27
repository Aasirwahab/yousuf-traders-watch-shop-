import type { Metadata } from "next";
import WishlistView from "@/components/sections/WishlistView";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Wishlist | Ovalen",
  description: "The watches you've saved to revisit.",
};

export default async function WishlistPage() {
  const products = await getAllProducts();
  return <WishlistView products={products} />;
}
