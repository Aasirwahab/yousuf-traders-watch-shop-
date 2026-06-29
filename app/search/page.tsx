import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Search | Yusuf Traders",
  description: "Search the Yusuf Traders collection by brand, model, or reference.",
};

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

function first(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = (first(params.q) ?? "").trim();
  const query = q.toLowerCase();

  const products = await getAllProducts();
  const results = query
    ? products.filter((product) =>
        [product.brand, product.name, product.reference, product.collection]
          .some((field) => field?.toLowerCase().includes(query)),
      )
    : [];

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="mx-auto max-w-[1440px] px-5 pb-24 pt-8 md:px-[4.5%] md:pt-12">
        <div className="text-[11px] text-[#6e6e6b]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="px-2">/</span>
          <span>Search</span>
        </div>

        <h1 className="mt-7 text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[0.95] tracking-[-0.05em]">Search</h1>

        <form action="/search" method="get" className="mt-8 flex max-w-xl items-center gap-3 border-b border-black pb-3">
          <Search className="h-5 w-5 shrink-0 stroke-[1.5] text-[#6e6e6b]" />
          <input
            name="q"
            defaultValue={q}
            autoFocus
            aria-label="Search watches"
            placeholder="Brand, model, reference..."
            className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-black/25 md:text-xl"
          />
          <button type="submit" className="shrink-0 text-sm font-medium">Search</button>
        </form>

        {!query ? (
          <p className="mt-10 text-sm text-[#6e6e6b]">Start typing a brand, model, or reference to search the collection.</p>
        ) : results.length === 0 ? (
          <div className="mt-12 grid place-items-center rounded-[16px] border border-black/10 px-5 py-20 text-center">
            <p className="text-lg">No watches match “{q}”.</p>
            <p className="mt-2 max-w-sm text-sm text-[#6e6e6b]">Try a different brand, model, or reference — or browse the full collection.</p>
            <Link href="/watches" className="mt-6 grid h-11 place-items-center rounded-full bg-black px-6 text-sm text-white">Browse all watches</Link>
          </div>
        ) : (
          <>
            <p className="mt-10 text-[11px] uppercase tracking-[0.12em] text-[#6e6e6b]">
              {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
            </p>
            <div className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
              {results.map((product) => (
                <Link key={product.slug} href={`/watches/${product.slug}`} className="group">
                  <div className="relative aspect-[0.86] overflow-hidden rounded-[16px] bg-[#f4f4f4]">
                    <Image
                      src={product.image}
                      alt={`${product.brand} ${product.name}`}
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    />
                  </div>
                  <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.11em]">{product.brand}</p>
                  <h2 className="mt-1 truncate text-[14px] group-hover:text-[#6b1824]">{product.name}</h2>
                  <p className="mt-1 text-[10px] text-[#8a8a86]">Ref. {product.reference}</p>
                  <p className="mt-2 text-sm font-medium">{formatPrice(product.price)}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </main>
  );
}
