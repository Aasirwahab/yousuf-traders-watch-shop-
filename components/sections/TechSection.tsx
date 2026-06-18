import React from "react";
import Image from "next/image";

const TECH_IMAGE =
  "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=1000&q=80";

export default function TechSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 lg:py-32">
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
        {/* Text Content */}
        <div className="w-full md:w-[45%]">
          <h2 className="text-[34px] md:text-[44px] tracking-tight leading-[1.1] mb-8 font-medium">
            Advanced technology applied to Ovalen watches
          </h2>
          <p className="text-gray-400 text-[16px] leading-[1.6] mb-12 max-w-[420px]">
            Advanced technology applied to Ovalen watches has enabled the
            creation of timepieces that not only boast exquisite craftsmanship
            but also offer unparalleled precision, durability, and
            functionality.
          </p>
          <button className="px-8 py-3.5 border border-gray-300 rounded-[30px] font-medium text-[15px] hover:bg-gray-50 transition-colors">
            Shop Now
          </button>
        </div>

        {/* Image */}
        <div className="w-full md:w-[55%] h-[400px] md:h-[600px] relative rounded-[32px] overflow-hidden bg-[#f4f4f4]">
          <Image
            src={TECH_IMAGE}
            fill
            className="object-cover"
            alt="Technology detail"
          />
        </div>
      </div>
    </section>
  );
}
