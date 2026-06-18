import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { PRODUCTS, unsplashUrl } from "@/data/constants";

export default function ShopSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 lg:py-32">
      {/* Header */}
      <div className="flex flex-col items-center mb-20">
        <h2 className="text-3xl md:text-[40px] font-medium tracking-tight mb-8">
          Explore the Ovalen Shop
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="px-7 py-3 bg-black text-white rounded-full text-sm font-medium">
            New Watches
          </button>
          <button className="px-7 py-3 border border-black rounded-full text-sm font-medium hover:bg-gray-50 transition-colors hidden sm:block">
            Pre-Owned
          </button>
          <button className="px-7 py-3 border border-black rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            Straps
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {PRODUCTS.map((item, i) => (
          <div key={i} className="flex flex-col group cursor-pointer">
            <div className="w-full aspect-[4/5] relative mb-5 rounded-[28px] overflow-hidden bg-[#f4f4f4]">
              <Image
                src={unsplashUrl(item.imageId, 400)}
                fill
                alt={item.name}
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out p-1 sm:p-0"
              />
              <button className="absolute right-4 bottom-4 w-[38px] h-[38px] bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                <ShoppingBag className="w-4 h-4 text-black" />
              </button>
            </div>
            <div className="px-1">
              <h4 className="font-semibold text-[15px] mb-1">{item.name}</h4>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-[14px]">{item.price}</span>
                <span className="text-gray-400 text-[12px] line-through font-medium">
                  {item.oldPrice}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
