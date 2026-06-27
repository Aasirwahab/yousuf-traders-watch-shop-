"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarClock, Check, Expand, Heart, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { formatPrice } from "@/lib/format";
import { type ShopProduct } from "@/data/shop";

type TabId = "description" | "specifications" | "condition" | "shipping";

const TABS: { id: TabId; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "specifications", label: "Specifications" },
  { id: "condition", label: "Condition" },
  { id: "shipping", label: "Shipping & returns" },
];

const trustItems = [
  { title: "Authenticated", text: "Each watch is verified by our specialists", icon: ShieldCheck },
  { title: "Warranty", text: "12-month Ovalen warranty included", icon: ShieldCheck },
  { title: "Insured delivery", text: "Worldwide delivery with full insurance", icon: Truck },
  { title: "Returns", text: "14-day return policy", icon: RotateCcw },
];

export default function ProductDetailPage({ product, related }: { product: ShopProduct; related: ShopProduct[] }) {
  return (
    <main className="min-h-screen overflow-x-clip bg-white text-black">
      <Navbar />
      <ProductDetailContent product={product} related={related} />
      <Footer />
    </main>
  );
}

function ProductDetailContent({ product, related }: { product: ShopProduct; related: ShopProduct[] }) {
  const commerce = useCommerce();
  const gallery = useMemo(() => {
    if (product.gallery) return product.gallery;
    const fallback = related.map((item) => item.image).filter((image) => image !== product.image);
    return [product.image, ...fallback].slice(0, 5);
  }, [product.gallery, product.image, related]);
  const [selectedImage, setSelectedImage] = useState(gallery[0] ?? product.image);
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const tabContent: Record<TabId, React.ReactNode> = {
    description: <p className="max-w-xl text-sm leading-7 text-[#555550]">{product.description}</p>,
    specifications: (
      <dl className="max-w-xl divide-y divide-black/10 border-y border-black/10 text-[12px]">
        <SpecRow label="Reference" value={product.reference} />
        <SpecRow label="Year" value={String(product.year ?? 2025)} />
        <SpecRow label="Movement" value={product.movement ?? "Automatic"} />
        <SpecRow label="Case material" value={product.material} />
        <SpecRow label="Diameter" value={`${product.diameter} mm`} />
        <SpecRow label="Dial" value={product.dial} />
        <SpecRow label="Water resistance" value={product.waterResistance ?? "50 m"} />
      </dl>
    ),
    condition: (
      <p className="max-w-xl text-sm leading-7 text-[#555550]">
        Condition: <span className="font-medium text-black">{product.condition}</span>.{" "}
        {product.condition === "New"
          ? "Supplied unworn with full manufacturer specification, inspected and authenticated by our specialists."
          : "Pre-owned and fully authenticated by our specialists, with any signs of wear assessed and disclosed before dispatch."}
      </p>
    ),
    shipping: (
      <p className="max-w-xl text-sm leading-7 text-[#555550]">
        Complimentary insured worldwide delivery, fully tracked and signature-required. Returns accepted within 14 days
        of receipt in original, unworn condition. A 12-month Ovalen warranty is included with every timepiece.
      </p>
    ),
  };

  return (
    <>
      <section className="px-5 pb-10 pt-7 md:px-[4.5%] md:pb-14 md:pt-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="text-[11px] text-[#6e6e6b]">
            <Link href="/" className="transition-colors hover:text-black">Home</Link>
            <span className="px-2">/</span>
            <Link href="/watches" className="transition-colors hover:text-black">Watches</Link>
            <span className="px-2">/</span>
            <span>{product.brand}</span>
          </div>

          <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px] xl:grid-cols-[minmax(0,1.15fr)_460px]">
            <div className="grid gap-4 md:grid-cols-[72px_1fr]">
              <div className="no-scrollbar order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col md:overflow-visible">
                {gallery.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === image}
                    onClick={() => setSelectedImage(image)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[10px] border bg-[#f4f4f4] transition-colors md:h-[72px] md:w-[72px] ${
                      selectedImage === image ? "border-[#6b1824] ring-1 ring-[#6b1824]" : "border-black/10 hover:border-black/35"
                    }`}
                  >
                    <Image src={image} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>

              <div className="relative order-1 aspect-[0.86] overflow-hidden rounded-[16px] bg-[#f4f4f4] md:order-2 md:aspect-[1.02] lg:h-[640px] lg:aspect-auto">
                <Image src={selectedImage} alt={`${product.brand} ${product.name}`} fill priority sizes="(min-width: 1024px) 56vw, 100vw" className="object-contain p-5 md:p-8" />
                <button type="button" aria-label="Expand image" className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
                  <Expand className="h-4 w-4 stroke-[1.3]" />
                </button>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border-b border-black/10 pb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{product.brand}</p>
                <h1 className="mt-3 text-[clamp(2.15rem,4.3vw,3.7rem)] font-normal leading-[0.96] tracking-[-0.06em]">
                  {product.name}
                </h1>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e6b]">
                  {product.material} · {product.dial} dial · {product.diameter}mm
                </p>
                <p className="mt-7 text-2xl font-medium">{formatPrice(product.price)}</p>
                <p className="mt-2 text-[12px] text-[#6e6e6b]">Includes duties and insured delivery</p>
              </div>

              <dl className="divide-y divide-black/10 border-b border-black/10 text-[12px]">
                <SpecRow label="Condition" value={product.condition} />
                <SpecRow label="Reference" value={product.reference} />
                <SpecRow label="Year" value={String(product.year ?? 2025)} />
                <SpecRow label="Movement" value={product.movement ?? "Automatic"} />
                <SpecRow label="Case material" value={product.material} />
                <SpecRow label="Diameter" value={`${product.diameter} mm`} />
                <SpecRow label="Water resistance" value={product.waterResistance ?? "50 m"} />
              </dl>

              <div className="mt-6 grid gap-3">
                <button type="button" onClick={() => commerce.addItem(product.slug)} className="grid h-13 place-items-center bg-[#6b1824] text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-black">
                  Add to bag
                </button>
                <a href="mailto:concierge@ovalen.com" className="grid h-13 place-items-center border border-black text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white">
                  Book a private viewing
                </a>
                <button type="button" onClick={() => commerce.toggleWishlist(product.slug)} aria-pressed={commerce.isWished(product.slug)} className="inline-flex h-11 items-center justify-center gap-2 text-[12px] text-[#4d4d49]">
                  <Heart className={`h-4 w-4 stroke-[1.35] ${commerce.isWished(product.slug) ? "fill-[#6b1824] text-[#6b1824]" : ""}`} />
                  {commerce.isWished(product.slug) ? "Saved to wishlist" : "Add to wishlist"}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 px-5 py-5 md:px-[4.5%]">
        <div className="mx-auto grid max-w-[1440px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-3 border-black/10 py-2 lg:border-r last:lg:border-r-0">
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 stroke-[1.35]" />
              <div>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em]">{item.title}</h2>
                <p className="mt-1 max-w-[210px] text-[11px] leading-5 text-[#6e6e6b]">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-10 md:px-[4.5%] md:py-14">
        <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="flex gap-8 border-b border-black/10 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6e6e6b]">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 transition-colors ${tab.id === "shipping" ? "hidden sm:inline" : ""} ${
                    activeTab === tab.id ? "border-b-2 border-[#6b1824] text-black" : "hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mt-8">{tabContent[activeTab]}</div>
          </div>
          <div className="overflow-hidden rounded-[16px] bg-[#f4f4f4]">
            <div className="relative aspect-[1.85]">
              <Image src={product.detailImage ?? gallery[1] ?? product.image} alt={`${product.brand} ${product.name} detail`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-[4.5%] md:pb-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em]">You may also like</h2>
            <Link href="/watches" className="hidden items-center gap-2 text-sm md:flex">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {related.map((item) => (
              <Link key={item.slug} href={`/watches/${item.slug}`} className="group">
                <div className="relative aspect-[0.9] overflow-hidden rounded-[12px] bg-[#f4f4f4]">
                  <Image src={item.image} alt={`${item.brand} ${item.name}`} fill sizes="(min-width: 768px) 23vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.1em]">{item.brand}</p>
                <h3 className="mt-1 truncate text-[13px]">{item.name}</h3>
                <p className="mt-2 text-[12px] font-medium">{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 px-5 py-3 shadow-[0_-12px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em]">{product.brand}</p>
            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
          </div>
          <button type="button" onClick={() => commerce.addItem(product.slug)} className="h-11 shrink-0 bg-[#6b1824] px-6 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
            Add to bag
          </button>
        </div>
      </div>
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 py-3">
      <dt className="font-semibold uppercase tracking-[0.1em] text-[#555550]">{label}</dt>
      <dd className="text-right text-[#222]">{value}</dd>
    </div>
  );
}

