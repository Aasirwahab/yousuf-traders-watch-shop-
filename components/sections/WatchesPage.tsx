"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Filter, Grid2X2, Heart, List, ShieldCheck, SlidersHorizontal, Truck, X } from "lucide-react";
import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { formatPrice } from "@/lib/format";
import { SHOP_CATEGORIES, SHOP_FILTERS, type ShopProduct } from "@/data/shop";

type Category = (typeof SHOP_CATEGORIES)[number];
type ViewMode = "grid" | "list";
type FilterKey = keyof typeof SHOP_FILTERS;

const filterLabels: Record<FilterKey, string> = {
  collection: "Collection",
  brand: "Brand",
  material: "Case material",
  dial: "Dial color",
  diameter: "Diameter",
  condition: "Condition",
  gender: "Gender",
};

const trustItems = [
  { label: "Authenticity guaranteed", icon: ShieldCheck },
  { label: "5-year warranty", icon: Check },
  { label: "Worldwide shipping", icon: Truck },
  { label: "Secure checkout", icon: ShieldCheck },
];

export default function WatchesPage({
  products,
  initialCategory,
  initialBrand,
}: {
  products: ShopProduct[];
  initialCategory?: string;
  initialBrand?: string;
}) {
  return (
    <main className="min-h-screen overflow-x-clip bg-white text-black">
      <Navbar />
      <WatchesContent allProducts={products} initialCategory={initialCategory} initialBrand={initialBrand} />
      <Footer />
    </main>
  );
}

function WatchesContent({
  allProducts,
  initialCategory,
  initialBrand,
}: {
  allProducts: ShopProduct[];
  initialCategory?: string;
  initialBrand?: string;
}) {
  const startCategory: Category = (SHOP_CATEGORIES as readonly string[]).includes(initialCategory ?? "")
    ? (initialCategory as Category)
    : "All watches";

  const [activeCategory, setActiveCategory] = useState<Category>(startCategory);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState("Newest");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<FilterKey, Set<string>>>(() => ({
    collection: new Set(),
    brand: new Set(
      initialBrand && (SHOP_FILTERS.brand as readonly string[]).includes(initialBrand) ? [initialBrand] : [],
    ),
    material: new Set(),
    dial: new Set(),
    diameter: new Set(),
    condition: new Set(),
    gender: new Set(),
  }));

  const products = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      const categoryMatch = activeCategory === "All watches" || product.categoryTags.includes(activeCategory);
      if (!categoryMatch) return false;

      return (Object.keys(selectedFilters) as FilterKey[]).every((key) => {
        const selected = selectedFilters[key];
        if (!selected.size) return true;
        if (key === "diameter") {
          const diameter = product.diameter;
          return (
            (selected.has("30-36mm") && diameter >= 30 && diameter <= 36) ||
            (selected.has("37-40mm") && diameter >= 37 && diameter <= 40) ||
            (selected.has("41-44mm") && diameter >= 41 && diameter <= 44)
          );
        }
        const value = product[key === "material" ? "material" : key];
        return selected.has(value);
      });
    });

    return [...filtered].sort((a, b) => {
      if (sort === "Price high") return b.price - a.price;
      if (sort === "Price low") return a.price - b.price;
      return allProducts.findIndex((product) => product.slug === a.slug) - allProducts.findIndex((product) => product.slug === b.slug);
    });
  }, [activeCategory, selectedFilters, sort, allProducts]);

  const activeFilterCount = Object.values(selectedFilters).reduce((total, values) => total + values.size, 0);

  function toggleFilter(key: FilterKey, value: string) {
    setSelectedFilters((current) => {
      const next = { ...current, [key]: new Set(current[key]) };
      if (next[key].has(value)) next[key].delete(value);
      else next[key].add(value);
      return next;
    });
  }

  function resetFilters() {
    setSelectedFilters({
      collection: new Set(),
      brand: new Set(),
      material: new Set(),
      dial: new Set(),
      diameter: new Set(),
      condition: new Set(),
      gender: new Set(),
    });
  }

  return (
    <>
      <section className="border-b border-black/10 px-5 pb-6 pt-8 md:px-[4.5%] md:pb-10 md:pt-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-[11px] text-[#6e6e6b]">
            <Link href="/" className="transition-colors hover:text-black">Home</Link>
            <span className="px-2">/</span>
            <span>Watches</span>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-2xl text-[clamp(3rem,7.4vw,6.7rem)] font-normal leading-[0.92] tracking-[-0.065em]">
                Selected<br />watches
              </h1>
              <p className="mt-6 max-w-sm text-[13px] leading-6 text-[#6e6e6b]">
                Independent and iconic timepieces, curated with a collector&apos;s eye.
              </p>
            </div>
            <div className="hidden items-center gap-3 rounded-full border border-black/10 px-4 py-3 text-[11px] uppercase tracking-[0.12em] text-[#6e6e6b] md:flex">
              <span className="h-2 w-2 rounded-full bg-[#6b1824]" />
              {products.length} timepieces
            </div>
          </div>

          <div className="no-scrollbar mt-9 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
            {SHOP_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
                className={`h-10 shrink-0 rounded-full border px-5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  activeCategory === category
                    ? "border-[#6b1824] bg-[#6b1824] text-white"
                    : "border-black/15 bg-white text-black hover:border-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6 md:px-[4.5%] md:py-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="sticky top-0 z-30 -mx-5 border-b border-black/10 bg-white/95 px-5 py-4 backdrop-blur-xl md:top-0 md:mx-0 md:rounded-none md:px-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-black/15 px-4 text-[12px] font-medium lg:hidden"
              >
                <Filter className="h-4 w-4 stroke-[1.4]" />
                Filters
                {activeFilterCount ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#6b1824] px-1 text-[10px] text-white">{activeFilterCount}</span> : null}
              </button>

              <div className="hidden items-center gap-2 text-[12px] text-[#6e6e6b] lg:flex">
                <SlidersHorizontal className="h-4 w-4 stroke-[1.4]" />
                Refine your selection
              </div>

              <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
                <label className="relative min-w-[132px]">
                  <span className="sr-only">Sort watches</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="h-11 w-full appearance-none rounded-full border border-black/15 bg-white px-4 pr-9 text-[12px] outline-none focus:border-[#6b1824]">
                    <option>Newest</option>
                    <option>Price high</option>
                    <option>Price low</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 stroke-[1.3]" />
                </label>
                <div className="hidden rounded-full border border-black/15 p-1 sm:flex">
                  <IconToggle label="Grid view" active={viewMode === "grid"} onClick={() => setViewMode("grid")}><Grid2X2 /></IconToggle>
                  <IconToggle label="List view" active={viewMode === "list"} onClick={() => setViewMode("list")}><List /></IconToggle>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 pt-6 lg:grid-cols-[260px_1fr] xl:grid-cols-[300px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <FilterPanel selectedFilters={selectedFilters} onToggle={toggleFilter} onReset={resetFilters} />
              </div>
            </aside>

            <div>
              <div className="mb-5 flex items-center justify-between text-[11px] uppercase tracking-[0.12em] text-[#6e6e6b]">
                <span>{products.length} timepieces</span>
                <span className="hidden sm:inline">Curated independently</span>
              </div>

              {products.length === 0 ? (
                <div className="grid place-items-center rounded-[16px] border border-black/10 px-5 py-20 text-center">
                  <p className="text-lg">No watches match your filters.</p>
                  <p className="mt-2 max-w-sm text-sm text-[#6e6e6b]">Try removing a filter or two, or reset to see the full collection.</p>
                  <button type="button" onClick={resetFilters} className="mt-6 grid h-11 place-items-center rounded-full bg-black px-6 text-sm text-white">Reset filters</button>
                </div>
              ) : (
                <div className={viewMode === "grid" ? "grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-3 xl:grid-cols-4" : "grid gap-4"}>
                  {products.map((product) => (
                    <ProductCard key={product.slug} product={product} viewMode={viewMode} />
                  ))}
                </div>
              )}

              <div className="mt-12 grid gap-4 rounded-[16px] border border-black/10 bg-[#f7f7f5] p-5 sm:grid-cols-2 lg:grid-cols-4">
                {trustItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 border-black/10 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4d4d49] lg:border-r last:lg:border-r-0">
                    <item.icon className="h-5 w-5 shrink-0 stroke-[1.35]" />
                    {item.label}
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 rounded-[16px] border border-black/10 p-5 md:grid-cols-[1.3fr_1fr] md:items-center">
                <div>
                  <h2 className="text-2xl font-normal tracking-[-0.04em]">Looking for something particular?</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#6e6e6b]">Our concierge can source a specific reference, arrange a private viewing, or help compare men&apos;s, ladies&apos;, and unisex pieces.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                  <a href="/contact" className="grid h-12 place-items-center rounded-full bg-black px-5 text-sm text-white">Contact concierge</a>
                  <a href="tel:+18336222536" className="grid h-12 place-items-center rounded-full border border-black px-5 text-sm">Call boutique</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <FilterPanel selectedFilters={selectedFilters} onToggle={toggleFilter} onReset={resetFilters} />
      </FilterDrawer>
    </>
  );
}

function FilterPanel({ selectedFilters, onToggle, onReset }: { selectedFilters: Record<FilterKey, Set<string>>; onToggle: (key: FilterKey, value: string) => void; onReset: () => void }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em]">Filters</h2>
        <button type="button" onClick={onReset} className="text-[11px] uppercase tracking-[0.12em] text-[#6e6e6b] hover:text-black">Reset</button>
      </div>
      <div className="divide-y divide-black/10 border-y border-black/10">
        {(Object.keys(SHOP_FILTERS) as FilterKey[]).map((key) => (
          <details key={key} open={key === "collection" || key === "gender"} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] marker:hidden">
              {filterLabels[key]}
              <span className="grid h-6 w-6 place-items-center rounded-full text-base font-light transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="mt-4 space-y-3">
              {SHOP_FILTERS[key].map((value) => {
                const active = selectedFilters[key].has(value);
                return (
                  <label key={value} className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-[#555550]">
                    <span>{value}</span>
                    <input type="checkbox" checked={active} onChange={() => onToggle(key, value)} className="peer sr-only" />
                    <span className={`grid h-4 w-4 place-items-center border transition-colors ${active ? "border-[#6b1824] bg-[#6b1824]" : "border-black/25 bg-white"}`}>
                      {active ? <Check className="h-3 w-3 text-white" /> : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function FilterDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm lg:hidden" onMouseDown={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Filter watches" onMouseDown={(event) => event.stopPropagation()} className="ml-auto flex h-full w-[90%] max-w-sm flex-col bg-white">
        <div className="flex h-16 items-center justify-between border-b border-black/10 px-5">
          <h2 className="text-sm font-medium">Refine watches</h2>
          <button type="button" aria-label="Close filters" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-black/5">
            <X className="h-5 w-5 stroke-[1.3]" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
        <button type="button" onClick={onClose} className="m-5 grid h-12 place-items-center rounded-full bg-black text-sm text-white">View watches</button>
      </aside>
    </div>
  );
}

function ProductCard({ product, viewMode }: { product: ShopProduct; viewMode: ViewMode }) {
  const commerce = useCommerce();
  const list = viewMode === "list";
  const favorite = commerce.isWished(product.slug);
  const onFavorite = () => commerce.toggleWishlist(product.slug);

  return (
    <article className={list ? "grid grid-cols-[112px_1fr_auto] gap-4 rounded-[16px] border border-black/10 p-3 max-sm:grid-cols-[104px_1fr]" : "group min-w-0"}>
      <div className={`relative overflow-hidden rounded-[16px] bg-[#f4f4f4] ${list ? "aspect-square" : "aspect-[0.86]"}`}>
        <Link href={`/watches/${product.slug}`} className="absolute inset-0" aria-label={`View ${product.brand} ${product.name}`}>
          <Image src={product.image} alt={`${product.brand} ${product.name}`} fill sizes={list ? "112px" : "(min-width: 1280px) 20vw, (min-width: 1024px) 28vw, (min-width: 768px) 30vw, 50vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
        </Link>
        {!list ? (
          <button type="button" aria-label={`${favorite ? "Remove" : "Add"} ${product.name} ${favorite ? "from" : "to"} wishlist`} aria-pressed={favorite} onClick={onFavorite} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur-sm">
            <Heart className={`h-[17px] w-[17px] stroke-[1.4] ${favorite ? "fill-[#6b1824] text-[#6b1824]" : ""}`} />
          </button>
        ) : null}
      </div>
      <div className={list ? "min-w-0 self-center" : "mt-4"}>
        <div className={list ? "flex items-start justify-between gap-3" : "flex items-start justify-between gap-3"}>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.11em]">{product.brand}</p>
            <h3 className={`${list ? "mt-1 text-base" : "mt-1 truncate text-[14px]"}`}><Link href={`/watches/${product.slug}`} className="hover:text-[#6b1824]">{product.name}</Link></h3>
            <p className="mt-1 text-[10px] text-[#8a8a86]">Ref. {product.reference}</p>
          </div>
          <button type="button" aria-label={`${favorite ? "Remove" : "Add"} ${product.name} ${favorite ? "from" : "to"} wishlist`} aria-pressed={favorite} onClick={onFavorite} className={`${list ? "grid" : "hidden"} h-10 w-10 shrink-0 place-items-center rounded-full border border-black/10`}>
            <Heart className={`h-[17px] w-[17px] stroke-[1.4] ${favorite ? "fill-[#6b1824] text-[#6b1824]" : ""}`} />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#6e6e6b]">
          <span>{product.gender}</span>
          <span>{product.material}</span>
          <span>{product.diameter}mm</span>
          <span>{product.condition}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{formatPrice(product.price)}</p>
          {!list ? (
            <button type="button" onClick={() => commerce.addItem(product.slug)} className="group/button inline-flex h-9 items-center gap-2 rounded-full border border-black px-3 text-[11px] transition-colors hover:bg-black hover:text-white">
              Reserve <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-0.5" />
            </button>
          ) : null}
        </div>
      </div>
      {list ? <button type="button" onClick={() => commerce.addItem(product.slug)} className="self-center rounded-full bg-black px-5 py-3 text-[12px] text-white max-sm:col-span-2 max-sm:w-full">Reserve</button> : null}
    </article>
  );
}

function IconToggle({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactElement<{ className?: string }> }) {
  return (
    <button type="button" aria-label={label} aria-pressed={active} onClick={onClick} className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${active ? "bg-black text-white" : "text-[#6e6e6b] hover:text-black"}`}>
      {children}
    </button>
  );
}
