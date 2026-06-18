import React from "react";
import Image from "next/image";

export default function ArticleSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-28 lg:py-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-[32px] md:text-[40px] font-medium tracking-tight">
          New Article
        </h2>
        <button className="px-8 py-3 bg-black text-white rounded-[30px] text-[14px] font-medium hover:bg-gray-800 transition-colors">
          View More
        </button>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:h-[550px]">
        {/* Main Article */}
        <div className="relative rounded-[32px] overflow-hidden group cursor-pointer h-[400px] md:h-full">
          <Image
            src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=800&q=80"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
            alt="Article Collection"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-10 text-white">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mb-6 backdrop-blur-sm self-start group-hover:bg-white group-hover:text-black transition-all duration-500">
              <span className="text-xs font-medium">Read</span>
            </div>
            <h3 className="text-[26px] md:text-[32px] font-medium mb-3 leading-tight tracking-tight">
              5 Gibran&apos;s Luxury
              <br />
              Watch Collection
            </h3>
            <p className="text-[14px] text-gray-300 opacity-80 max-w-[350px] leading-relaxed transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              Here&apos;s Gibran Rakabuming&apos;s collection of luxury watches,
              the number two vice president in the 2024 Election.
            </p>
          </div>
        </div>

        {/* Side Articles */}
        <div className="flex flex-col gap-6 h-[500px] md:h-full">
          <div className="relative flex-1 rounded-[32px] overflow-hidden cursor-pointer group">
            <Image
              src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&w=800&q=80"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
              alt="Article Feature"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          <div className="relative flex-1 rounded-[32px] overflow-hidden cursor-pointer group">
            <Image
              src="https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out object-top"
              alt="Article Feature 2"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
