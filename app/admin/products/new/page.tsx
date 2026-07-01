import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "../../_components/PageHeader";
import { ProductForm } from "../../_components/ProductForm";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <>
      <PageHeader
        title="New product"
        description="Add a watch to the catalog and upload its images to ImageKit."
        action={
          <Link href="/admin/products" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d5dcda] bg-white px-4 text-sm font-medium text-[#394246]">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />
      <ProductForm action={createProduct} submitLabel="Create product" showImageUpload />
    </>
  );
}
