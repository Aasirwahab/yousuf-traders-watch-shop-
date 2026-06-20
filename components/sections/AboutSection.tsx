import React from "react";
import { CATEGORIES } from "@/data/constants";
import PrototypeCrop from "@/components/ui/PrototypeCrop";

const CATEGORY_CROPS = [
  "/prototype-assets/category-modern.webp",
  "/prototype-assets/category-limited.webp",
  "/prototype-assets/category-chronograph.webp",
  "/prototype-assets/category-classic.webp",
];

export default function AboutSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
      <div className="mb-20 grid items-start gap-10 md:mb-[120px] md:grid-cols-2 md:gap-0">
        <h2 className="text-3xl font-normal tracking-[-0.035em] md:text-[40px]">
          About Ovalen
        </h2>

        <div className="flex justify-center">
          <p className="max-w-[500px] text-center text-[16px] font-normal leading-[1.48] text-[#999ba3] md:text-[17px] md:tracking-[-0.025em]">
            <span className="md:hidden">
              Ovalen is the horological point of contact for other news, business
              and lifestyle media. Ovalen has been prominently featured in various
              international media, including The New York Times, The Wall Street
              Journal, The Financial Times, Esquire, Gear Patrol, GQ, HighSnobiety.
            </span>
            <span className="hidden md:block">Ovalen is the horological point of contact for other</span>
            <span className="hidden md:block">news, business and lifestyle media. Ovalen has been</span>
            <span className="hidden md:block">prominently featured in various international media,</span>
            <span className="hidden md:block">including The New York Times, The Wall Street Journal, The</span>
            <span className="hidden md:block">Financial Times, Esquire, Gear Patrol, GQ, HighSnobiety.</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-[14px]">
        {CATEGORIES.map((item, i) => (
          <div
            key={i}
            className="group flex aspect-[0.82] cursor-pointer flex-col items-center rounded-[16px] border-[3px] border-[#f7f7f7] bg-white px-5 pb-5 pt-6 transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:px-7 md:pb-6 md:pt-7"
          >
            <div className="mb-4 flex min-h-0 w-full flex-1 items-center justify-center">
              <PrototypeCrop
                src={CATEGORY_CROPS[i]}
                alt={item.name}
                className="aspect-[7/8] h-[82%] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <span className="whitespace-nowrap text-[clamp(14px,1.7vw,18px)] font-normal tracking-[-0.015em] text-black">
              ( {item.name} )
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
