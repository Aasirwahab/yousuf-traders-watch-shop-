import Link from "next/link";
import { Plus } from "lucide-react";
import { listProducts } from "@/lib/admin/queries";
import { PageHeader } from "../_components/PageHeader";
import { ProductsTable } from "../_components/ProductsTable";

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} product${products.length === 1 ? "" : "s"} in the catalog.`}
        action={
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#101719] px-4 text-sm font-semibold text-white"
          >
            <Plus size={17} /> New product
          </Link>
        }
      />
      <ProductsTable products={products} />
    </>
  );
}
