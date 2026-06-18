import React from "react";
import Image from "next/image";
import { CATEGORIES, unsplashUrl } from "@/data/constants";

export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 lg:py-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-12 mb-20 items-start">
        <div className="w-full md:w-1/3">
          <h2 className="text-3xl md:text-[38px] font-medium tracking-tight">
            About Ovalen
          </h2>
        </div>
        <div className="w-full md:w-2/3">
          <p className="text-gray-400 text-[17px] leading-[1.7] max-w-[650px] font-medium">
            Ovalen is the horological point of contact for other news, business
            and lifestyle media. Ovalen has been prominently featured in various
            international media, including The New York Times, The Wall Street
            Journal, The Financial Times, Esquire, Gear Patrol, GQ,
            HighSnobiety.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-6 xl:gap-8">
        {CATEGORIES.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-full aspect-square rounded-[32px] bg-white border border-gray-100 p-8 mb-6 flex items-center justify-center group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
              <div className="relative w-full h-full">
                <Image
                  src={unsplashUrl(item.imageId, 300)}
                  fill
                  alt={item.name}
                  className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <span className="font-semibold text-gray-800 text-[15px] tracking-wide">
              ( {item.name} )
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
