import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/constants";
import { IMAGES } from "@/data/images";

const categoryImages = [
  IMAGES.featureWatch,
  IMAGES.findWatch.dial,
  IMAGES.findWatch.crown,
  IMAGES.findWatch.chronograph,
] as const;

export default function AboutSection() {
  return (
    <section id="categories" className="px-6 py-16 md:px-[4.5%] md:py-20">
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-[clamp(2.25rem,3vw,2.8rem)] font-semibold tracking-[-0.05em]">
          Find your next watch
        </h2>

        <div className="mt-8 hidden h-[330px] grid-cols-[1.45fr_0.9fr_3fr_1fr_1.4fr] gap-x-8 lg:grid">
          <CategoryImage
            index={0}
            className="row-span-2"
            imageClassName="object-cover object-[50%_48%]"
            sizes="230px"
          />

          <div className="row-span-2 flex flex-col justify-between py-6">
            <CategoryDetails index={0} />
            <CategoryDetails index={3} />
          </div>

          <CategoryImage
            index={1}
            className="row-span-2"
            imageClassName="object-cover object-[48%_50%]"
            sizes="500px"
          />

          <div className="row-span-2 flex flex-col justify-between py-5">
            <CategoryDetails index={1} />
            <CategoryDetails index={2} />
          </div>

          <div className="row-span-2 grid grid-rows-2 gap-3">
            <CategoryImage
              index={2}
              imageClassName="object-cover object-center"
              sizes="220px"
            />
            <CategoryImage
              index={3}
              imageClassName="object-cover object-center"
              sizes="220px"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:hidden">
          {CATEGORIES.map((_, index) => (
            <article key={CATEGORIES[index].name}>
              <CategoryImage
                index={index}
                className="aspect-[4/3]"
                imageClassName={index === 1 ? "object-cover object-[48%_50%]" : "object-cover object-center"}
                sizes="(min-width: 640px) 50vw, 100vw"
              />
              <div className="mt-4">
                <CategoryDetails index={index} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryDetails({ index }: { index: number }) {
  const category = CATEGORIES[index];

  return (
    <div>
      <Link
        href="#shop"
        className="group flex items-center justify-between gap-4 border-b border-[#7e8c93] pb-2 text-[15px] font-semibold tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        {category.name}
        <ArrowRight className="h-4 w-4 shrink-0 text-[#16343d] transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
      <p className="mt-4 max-w-[180px] text-[11px] leading-[1.55] text-[#687276]">
        {category.description}
      </p>
    </div>
  );
}

function CategoryImage({
  className = "",
  imageClassName,
  index,
  sizes,
}: {
  className?: string;
  imageClassName: string;
  index: number;
  sizes: string;
}) {
  const category = CATEGORIES[index];

  return (
    <Link
      href="#shop"
      aria-label={`Explore ${category.name} watches`}
      className={`group relative block overflow-hidden rounded-[12px] bg-[#fbfcfb] focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
    >
      <Image
        src={categoryImages[index]}
        alt={`${category.name} watch detail`}
        fill
        sizes={sizes}
        className={`${imageClassName} transition-transform duration-700 ease-out group-hover:scale-[1.025]`}
      />
    </Link>
  );
}
