import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/data/constants";
import { IMAGES } from "@/data/images";

export default function AboutSection() {
  return (
    <section id="categories" className="px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="max-w-3xl"><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b1824]">Explore by character</p><h2 className="mt-3 text-[clamp(2.3rem,4vw,4rem)] font-normal tracking-[-0.045em]">Find your next watch</h2></div>

        <div className="mt-12 grid gap-4 md:grid-cols-12 md:grid-rows-2">
          <CategoryCard index={0} className="min-h-[190px] md:col-span-4 md:row-span-2 md:min-h-[680px]" />
          <CategoryCard index={1} className="min-h-[190px] md:col-span-5 md:row-span-2 md:min-h-[680px]" />
          <CategoryCard index={2} className="min-h-[190px] md:col-span-3" />
          <CategoryCard index={3} className="min-h-[190px] md:col-span-3" />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ className, index }: { className: string; index: number }) {
  const category = CATEGORIES[index];
  return (
    <Link href="#shop" className={`group relative isolate overflow-hidden rounded-[16px] bg-[#efefed] focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}>
      <Image src={IMAGES.categories[index]} alt={`${category.name} watches`} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-6 text-white md:p-7">
        <div><h3 className="text-2xl tracking-[-0.03em]">{category.name}</h3><p className="mt-2 max-w-[220px] text-[12px] leading-5 text-white/70">{category.description}</p></div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/60 transition-colors group-hover:bg-white group-hover:text-black"><ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  );
}
