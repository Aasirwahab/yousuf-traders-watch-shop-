import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailPage from "@/components/sections/ProductDetailPage";
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/lib/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

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
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, 4);

  return <ProductDetailPage product={product} related={related} />;
}
