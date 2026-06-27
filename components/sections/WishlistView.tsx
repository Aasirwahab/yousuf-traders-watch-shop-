"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, X } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { formatPrice } from "@/lib/format";
import type { ShopProduct } from "@/data/shop";

export default function WishlistView({ products }: { products: ShopProduct[] }) {
  const commerce = useCommerce();
  // The wishlist is read from localStorage after mount; gate on `mounted` so we
  // don't flash the empty state before it loads.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = products.filter((product) => commerce.wishlist.includes(product.slug));

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-8 md:px-[4.5%] md:pt-12">
        <div className="text-[11px] text-[#6e6e6b]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="px-2">/</span>
          <span>Wishlist</span>
        </div>

        <h1 className="mt-7 text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[0.95] tracking-[-0.05em]">Wishlist</h1>

        {!mounted ? (
          <div className="mt-10 h-40" />
        ) : items.length === 0 ? (
          <div className="mt-12 grid place-items-center rounded-[16px] border border-black/10 px-5 py-20 text-center">
            <Heart className="h-8 w-8 stroke-1" />
            <p className="mt-5 text-lg">Your wishlist is empty.</p>
            <p className="mt-2 max-w-sm text-sm text-[#6e6e6b]">Tap the heart on any watch to save it here for later.</p>
            <Link href="/watches" className="mt-6 grid h-11 place-items-center rounded-full bg-black px-6 text-sm text-white">Browse the collection</Link>
          </div>
        ) : (
          <>
            <p className="mt-8 text-[11px] uppercase tracking-[0.12em] text-[#6e6e6b]">
              {items.length} {items.length === 1 ? "saved watch" : "saved watches"}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {items.map((product) => (
                <article key={product.slug} className="group min-w-0">
                  <div className="relative aspect-[0.86] overflow-hidden rounded-[16px] bg-[#f4f4f4]">
                    <Link href={`/watches/${product.slug}`} className="absolute inset-0" aria-label={`View ${product.brand} ${product.name}`}>
                      <Image
                        src={product.image}
                        alt={`${product.brand} ${product.name}`}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                      />
                    </Link>
                    <button
                      type="button"
                      aria-label={`Remove ${product.name} from wishlist`}
                      onClick={() => commerce.toggleWishlist(product.slug)}
                      className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur-sm"
                    >
                      <X className="h-[17px] w-[17px] stroke-[1.4]" />
                    </button>
                  </div>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.11em]">{product.brand}</p>
                  <h2 className="mt-1 truncate text-[14px]"><Link href={`/watches/${product.slug}`} className="hover:text-[#6b1824]">{product.name}</Link></h2>
                  <p className="mt-1 text-[10px] text-[#8a8a86]">Ref. {product.reference}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{formatPrice(product.price)}</p>
                    <button type="button" onClick={() => commerce.addItem(product.slug)} className="group/button inline-flex h-9 items-center gap-2 rounded-full border border-black px-3 text-[11px] transition-colors hover:bg-black hover:text-white">
                      Reserve <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-0.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
