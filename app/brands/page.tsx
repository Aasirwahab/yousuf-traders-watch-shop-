import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Brands | Yusuf Traders",
  description: "Shop watches by maison — independent and iconic houses authenticated by Yusuf Traders.",
};

export default async function BrandsPage() {
  const products = await getAllProducts();

  // Group by brand for a count and a representative image, derived from the
  // live catalog so the directory never lists a brand we don't actually stock.
  const byBrand = new Map<string, { count: number; image: string }>();
  for (const product of products) {
    const entry = byBrand.get(product.brand);
    if (entry) entry.count += 1;
    else byBrand.set(product.brand, { count: 1, image: product.image });
  }

  const brands = [...byBrand.entries()]
    .map(([name, info]) => ({ name, ...info }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-[#eef0ef] text-[#101416]">
      <Navbar />
      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-8 md:px-[4.5%] md:pt-12">
        <div className="text-[11px] text-[#687276]">
          <Link href="/" className="transition-colors hover:text-[#101416]">Home</Link>
          <span className="px-2">/</span>
          <span>Brands</span>
        </div>

        <h1 className="mt-7 text-[clamp(3rem,7.4vw,6.7rem)] font-normal leading-[0.92] tracking-[-0.065em]">
          Brands
        </h1>
        <p className="mt-6 max-w-md text-[13px] leading-6 text-[#687276]">
          Shop by maison — independent and iconic houses, each authenticated by our specialists.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={`/watches?brand=${encodeURIComponent(brand.name)}`}
              className="group"
            >
              <div className="relative aspect-[1.1] overflow-hidden rounded-[16px] bg-[#fbfcfb]">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <h2 className="mt-3 text-[14px] font-medium group-hover:text-[#16343d]">{brand.name}</h2>
              <p className="mt-1 text-[11px] text-[#7e8c93]">
                {brand.count} {brand.count === 1 ? "timepiece" : "timepieces"}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
