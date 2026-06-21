"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import PrototypeCrop from "@/components/ui/PrototypeCrop";
import { PRODUCTS } from "@/data/constants";
import { Reveal } from "@/components/ui/Reveal";

const PRODUCT_CROPS = [
  "/prototype-assets/product-louis.webp",
  "/prototype-assets/product-roger.webp",
  "/prototype-assets/product-jean.webp",
  "/prototype-assets/product-seiko.webp",
];

export default function ShopSection() {
  const [activeFilter, setActiveFilter] = useState("New Watches");

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <div className="mb-12 flex flex-col items-center md:mb-14">
        <Reveal><h2 className="mb-7 text-3xl font-normal tracking-[-0.035em] md:text-[40px]">Explore the Ovalen Shop</h2></Reveal>
        <Reveal className="flex gap-2.5" delay={0.12}>
          {['New Watches', 'Pre-Owned', 'Straps'].map((label) => (
            <button
              key={label}
              type="button"
              aria-pressed={activeFilter === label}
              onClick={() => setActiveFilter(label)}
              className={`rounded-full border border-black px-6 py-2 text-[13px] font-normal transition-colors ${activeFilter === label ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </Reveal>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-[14px]">
        {PRODUCTS.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.09}>
            <article className="group relative min-w-0">
              <PrototypeCrop
                src={PRODUCT_CROPS[index]}
                alt={item.name}
                className={`w-full rounded-[14px] bg-[#fafafa] ${index === 0 ? 'aspect-[0.78]' : 'aspect-square'}`}
              />
              <div className="relative px-1 pt-3">
                <h3 className="text-[13px] font-normal">{item.name}</h3>
                <p className="mt-1 text-[11px] font-medium">
                  {item.price} <del className="ml-1 font-normal text-[#aaa]">{item.oldPrice}</del>
                </p>
                <button aria-label={`Add ${item.name} to bag`} className="absolute bottom-0 right-1 grid h-8 w-8 place-items-center rounded-full border border-black bg-white transition-colors hover:bg-black hover:text-white">
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.4} />
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
