import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProduct } from "@/lib/admin/queries";
import { PageHeader } from "../../_components/PageHeader";
import { ProductForm, type ProductInitial } from "../../_components/ProductForm";
import { ImageManager } from "../../_components/ImageManager";
import { updateProduct } from "../actions";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const initial: ProductInitial = {
    brand: product.brand,
    name: product.name,
    reference: product.reference,
    slug: product.slug,
    price: product.price,
    gender: product.gender,
    collection: product.collection,
    condition: product.condition,
    material: product.material,
    dial: product.dial,
    diameter: product.diameter,
    stock: product.stock,
    year: product.year,
    waterResistance: product.waterResistance,
    movement: product.movement,
    description: product.description,
    published: product.published,
    categoryTags: product.categoryTags,
  };

  return (
    <>
      <PageHeader
        title="Edit product"
        description={`${product.brand} ${product.name}`}
        action={
          <Link href="/admin/products" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d5dcda] bg-white px-4 text-sm font-medium text-[#394246]">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />

      <div className="mt-6">
        <ImageManager
          productId={product.id}
          images={product.images.map((i) => ({ id: i.id, url: i.url, role: i.role, alt: i.alt }))}
        />
      </div>

      <ProductForm
        action={updateProduct.bind(null, product.id)}
        initial={initial}
        submitLabel="Save changes"
        showImageUpload={false}
      />
    </>
  );
}
