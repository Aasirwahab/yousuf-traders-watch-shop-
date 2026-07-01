"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { formatPrice } from "@/lib/format";
import type { ShopProduct } from "@/data/shop";

const FILTERS = ["New arrivals", "Best sellers", "Pre-owned"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(product: ShopProduct, filter: Filter): boolean {
  // No sales data yet — "Best sellers" features the full curated set.
  if (filter === "Best sellers") return true;
  if (filter === "Pre-owned") {
    return product.condition === "Pre-owned" || product.categoryTags.includes("Pre-owned");
  }
  return product.categoryTags.includes("New arrivals");
}

export default function ShopSection({ products }: { products: ShopProduct[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("New arrivals");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const { addItem } = useCommerce();
  const shown = useMemo(
    () => products.filter((product) => matchesFilter(product, activeFilter)).slice(0, 8),
    [products, activeFilter],
  );

  function toggleFavorite(slug: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  return (
    <section id="shop" className="border-b border-[#cbd2d2] px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-6">
          <div><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#16343d]">The collection</p><h2 className="mt-3 text-[clamp(2.3rem,4vw,4rem)] font-normal tracking-[-0.045em]">Selected watches</h2></div>
          <Link href="/watches" className="hidden items-center gap-3 border-b border-[#16343d] pb-1 text-sm md:flex">View all watches <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div role="group" aria-label="Filter watches" className="mt-10 flex gap-7 border-b border-[#cbd2d2]">
          {FILTERS.map((filter) => (
            <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className={`relative min-h-11 pb-3 text-[13px] transition-colors ${activeFilter === filter ? "text-[#16343d] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:bg-[#16343d]" : "text-[#687276] hover:text-[#101416]"}`}>{filter}</button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 text-sm text-[#687276]">No watches in this selection yet.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {shown.map((product) => {
              const isFavorite = favorites.has(product.slug);
              return (
                <article key={product.slug} className="group min-w-0">
                  <div className="relative aspect-[0.86] overflow-hidden rounded-[16px] bg-[#fbfcfb]">
                    <Link href={`/watches/${product.slug}`} className="absolute inset-0" aria-label={`View ${product.brand} ${product.name}`}>
                      <Image src={product.image} alt={`${product.brand} ${product.name}`} fill quality={90} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 32vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                    </Link>
                    <button type="button" aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${isFavorite ? "from" : "to"} wishlist`} aria-pressed={isFavorite} onClick={() => toggleFavorite(product.slug)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-[#fbfcfb]/90 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2">
                      <Heart className={`h-[18px] w-[18px] stroke-[1.4] ${isFavorite ? "fill-[#16343d] text-[#16343d]" : ""}`} />
                    </button>
                    <span className="pointer-events-none absolute bottom-3 left-3 bg-[#fbfcfb]/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] backdrop-blur-sm">{product.condition}</span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-[0.1em]">{product.brand}</p><h3 className="mt-1 truncate text-[14px]"><Link href={`/watches/${product.slug}`} className="hover:text-[#16343d]">{product.name}</Link></h3><p className="mt-1 text-[10px] text-[#7e8c93]">Ref. {product.reference}</p><p className="mt-3 text-sm font-medium">{formatPrice(product.price)}</p></div>
                    <button type="button" onClick={() => addItem(product.slug)} aria-label={`Add ${product.name} to bag`} className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#16343d] transition-colors hover:bg-[#0f252b] hover:text-[#eef0ef] focus-visible:outline-2 focus-visible:outline-offset-2"><Plus className="h-4 w-4" /></button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
