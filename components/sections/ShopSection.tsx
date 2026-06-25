"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { PRODUCTS } from "@/data/constants";
import { IMAGES } from "@/data/images";
import { useCommerce } from "@/components/providers/CommerceProvider";

const FILTERS = ["New arrivals", "Best sellers", "Pre-owned"] as const;

export default function ShopSection() {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("New arrivals");
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());
  const { addItem } = useCommerce();
  const products = useMemo(() => PRODUCTS.filter((product) => product.groups.includes(activeFilter)), [activeFilter]);

  function toggleFavorite(slug: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }

  return (
    <section id="shop" className="border-b border-black/10 px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-6">
          <div><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b1824]">The collection</p><h2 className="mt-3 text-[clamp(2.3rem,4vw,4rem)] font-normal tracking-[-0.045em]">Selected watches</h2></div>
          <Link href="#categories" className="hidden items-center gap-3 border-b border-black pb-1 text-sm md:flex">View all watches <ArrowRight className="h-4 w-4" /></Link>
        </div>

        <div role="group" aria-label="Filter watches" className="mt-10 flex gap-7 border-b border-black/10">
          {FILTERS.map((filter) => (
            <button key={filter} type="button" aria-pressed={activeFilter === filter} onClick={() => setActiveFilter(filter)} className={`relative min-h-11 pb-3 text-[13px] transition-colors ${activeFilter === filter ? "text-[#6b1824] after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:bg-[#6b1824]" : "text-[#6e6e6b] hover:text-black"}`}>{filter}</button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {products.map((product) => {
            const imageIndex = PRODUCTS.findIndex((item) => item.slug === product.slug);
            const isFavorite = favorites.has(product.slug);
            return (
              <article key={product.slug} className="group min-w-0">
                <div className="relative aspect-[0.86] overflow-hidden rounded-[16px] bg-[#f5f5f3]">
                  <Image src={IMAGES.products[imageIndex]} alt={`${product.brand} ${product.name}`} fill sizes="(min-width: 1024px) 23vw, (min-width: 768px) 32vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                  <button type="button" aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${isFavorite ? "from" : "to"} wishlist`} aria-pressed={isFavorite} onClick={() => toggleFavorite(product.slug)} className="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 backdrop-blur-sm focus-visible:outline-2 focus-visible:outline-offset-2">
                    <Heart className={`h-[18px] w-[18px] stroke-[1.4] ${isFavorite ? "fill-[#6b1824] text-[#6b1824]" : ""}`} />
                  </button>
                  <span className="absolute bottom-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] backdrop-blur-sm">{product.condition}</span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="text-[11px] font-semibold uppercase tracking-[0.1em]">{product.brand}</p><h3 className="mt-1 truncate text-[14px]">{product.name}</h3><p className="mt-1 text-[10px] text-[#8a8a86]">Ref. {product.reference}</p><p className="mt-3 text-sm font-medium">{product.price}</p></div>
                  <button type="button" onClick={() => addItem(product.slug)} aria-label={`Add ${product.name} to bag`} className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2"><Plus className="h-4 w-4" /></button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
