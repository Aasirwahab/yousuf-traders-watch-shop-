"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatUsd } from "@/lib/format";
import { deleteProduct, togglePublished } from "../products/actions";

type Row = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  reference: string;
  price: number;
  stock: number;
  published: boolean;
  image: string;
  imageCount: number;
  orderCount: number;
};

export function ProductsTable({ products }: { products: Row[] }) {
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.brand, p.name, p.reference, p.slug].some((v) => v.toLowerCase().includes(q)),
    );
  }, [query, products]);

  function run(id: string, fn: () => Promise<unknown>) {
    setPendingId(id);
    startTransition(async () => {
      await fn();
      setPendingId(null);
    });
  }

  return (
    <div className="mt-5 rounded-lg border border-[#d9dfdd] bg-white shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
      <div className="border-b border-[#e1e6e4] p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by brand, name, reference…"
          className="h-10 w-full max-w-sm rounded-lg border border-[#d5dcda] bg-white px-3 text-sm outline-none focus:border-[#0f766e]"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-[#f7f9f8] text-xs uppercase tracking-[0.14em] text-[#7a8589]">
            <tr>
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Price</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eae8]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#7a8589]">
                  No products found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className={`hover:bg-[#f8faf9] ${pendingId === p.id ? "opacity-50" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#eef2f1]">
                        {p.image ? <Image src={p.image} alt="" fill sizes="48px" className="object-cover" /> : null}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-[#101719]">{p.name}</p>
                        <p className="truncate text-xs text-[#7a8589]">{p.brand} · {p.imageCount} image{p.imageCount === 1 ? "" : "s"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#485357]">{p.reference}</td>
                  <td className="px-5 py-3 font-semibold">{formatUsd(p.price)}</td>
                  <td className="px-5 py-3">
                    <span className={p.stock === 0 ? "text-[#9f2f3f]" : p.stock <= 3 ? "text-[#9a6419]" : "text-[#485357]"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => run(p.id, () => togglePublished(p.id))}
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                        p.published ? "bg-[#e5f3ef] text-[#0f766e]" : "bg-[#f1f3f2] text-[#6b7671]"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#d5dcda] bg-white px-3 text-xs font-medium text-[#394246]"
                      >
                        <Pencil size={14} /> Edit
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                            run(p.id, () => deleteProduct(p.id));
                          }
                        }}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#f0c9bd] bg-[#faeadf] px-3 text-xs font-medium text-[#9a4e27]"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
