import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/sections/ProductDetailPage";
import { SHOP_PRODUCTS } from "@/data/shop";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return SHOP_PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = SHOP_PRODUCTS.find((item) => item.slug === slug);

  if (!product) {
    return {
      title: "Watch not found | Ovalen",
    };
  }

  return {
    title: `${product.brand} ${product.name} | Ovalen`,
    description: product.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const product = SHOP_PRODUCTS.find((item) => item.slug === slug);

  if (!product) notFound();

  return <ProductDetailPage product={product} />;
}
