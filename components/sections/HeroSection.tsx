"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { DesktopNav, Logo, MobileNav } from "@/components/layout/Navbar";

const HERO_IMAGE = "/hero-image.png";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="absolute left-6 top-8 z-30 text-black md:hidden">
        <Logo />
      </div>

      <MobileNav />
      <MobileHero />
      <DesktopHero />
    </section>
  );
}

function MobileHero() {
  return (
    <div className="flex min-h-[680px] flex-col px-6 pb-6 pt-32 md:hidden">
      <Tagline />
      <h1 className="mt-4 text-[clamp(2.25rem,10vw,3rem)] font-normal leading-[1.02] tracking-[-0.055em] text-black">
        <span className="block whitespace-nowrap">Ovalen will make</span>
        <span className="block whitespace-nowrap">your life easier</span>
      </h1>
      <Description className="mt-7" />
      <ExploreButton className="mt-5" />
      <div className="relative mt-9 min-h-[260px] flex-1 overflow-hidden rounded-[28px]">
        <Image
          src={HERO_IMAGE}
          alt="Black mechanical Ovalen watch with red hands"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}

function DesktopHero() {
  return (
    <div className="relative hidden aspect-[890/551] w-full overflow-hidden bg-white [container-type:inline-size] md:block">
      <div
        className="absolute left-0 top-0 h-[551px] w-[890px] origin-top-left"
        style={{ transform: "scale(calc(100cqw / 890px))" }}
      >
      <div className="absolute left-[35px] top-[14px] z-30 text-black">
        <Logo />
      </div>

      <div className="absolute inset-y-0 left-[264px] right-0 overflow-hidden rounded-bl-[28px]">
        <Image
          src={HERO_IMAGE}
          alt="Black mechanical Ovalen watch with red hands"
          fill
          priority
          sizes="70vw"
          className="scale-150 object-cover object-[72%_center]"
        />
      </div>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 890 551"
        preserveAspectRatio="none"
      >
        <path
          fill="white"
          d="M0 0H264V80Q264 98 282 98H364Q382 98 382 116Q382 133 400 133H424Q442 133 442 151V184Q442 202 424 202H405Q387 202 387 220V246Q387 264 369 264H282Q264 264 264 282V551H0Z"
        />
      </svg>
      <DesktopNav />

      <span className="absolute left-[655px] top-[252px] z-20 text-[17px] font-semibold tracking-[-0.04em] text-white">
        menghsun
      </span>

      <div className="absolute left-[35px] top-[114px] z-20 flex items-center gap-4">
        <Tagline />
      </div>

      <h1 className="absolute left-[35px] top-[139px] z-20 text-[53px] font-normal leading-[1.06] tracking-[-0.048em] text-black">
        <span className="block whitespace-nowrap">Ovalen will make</span>
        <span className="block whitespace-nowrap">your life easier</span>
      </h1>

      <div className="absolute left-[35px] top-[294px] z-20 w-[175px]">
        <Description />
        <ExploreButton className="mt-6" />
      </div>

      <NavigationArrows />
      <ProductCard />
      <CarouselIndicators />
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <article className="absolute bottom-[10px] left-[calc(29.7%+24px)] z-20 flex h-[110px] w-[270px] items-center gap-3 rounded-[17px] bg-white p-[6px] pr-3 text-black shadow-[0_12px_35px_rgba(0,0,0,0.16)]">
      <div className="relative h-full w-[98px] flex-none overflow-hidden rounded-[13px] bg-[#171717]">
        <Image
          src="/prototype -design.webp"
          width={1015}
          height={4136}
          alt="Oris Divers Sixty-Five watch"
          className="absolute left-[-344px] top-[-504px] max-w-none"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-[#969696]">Oris</p>
        <h2 className="truncate text-[15px] font-medium leading-tight tracking-[-0.02em]">
          Divers Sixty-Five
        </h2>
        <p className="mt-1 truncate text-[7px] text-[#9b9b9b]">
          REF 01 733 7720 4054-07 8 21 18
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-[17px] font-medium">$2.470</span>
            <span className="text-[11px] text-[#a5a5a5] line-through">$2.990</span>
          </div>
          <button
            type="button"
            aria-label="Add Oris Divers Sixty-Five to bag"
            className="grid h-7 w-7 place-items-center rounded-full border border-[#bcbcbc] transition-colors hover:bg-black hover:text-white"
          >
            <ShoppingBag className="h-[42%] w-[42%]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Tagline() {
  return (
    <div className="flex items-center gap-4 whitespace-nowrap">
      <span className="block h-px w-[54px] bg-[#aaa] md:w-[88px]" />
      <p className="text-[11px] font-normal text-[#8d8d8d] md:text-[12px]">
        Effective gadgets for the modern world
      </p>
    </div>
  );
}

function Description({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[12px] leading-[1.25] text-[#878787] ${className}`}>
      Explore our best products to find what you want, there you will definitely find it.
    </p>
  );
}

function ExploreButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`self-start rounded-full bg-black px-[22px] py-[9px] text-[11px] font-medium text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 ${className}`}
    >
      Explore Product
    </button>
  );
}

function NavigationArrows() {
  return (
    <div className="absolute bottom-[10px] left-[35px] z-20 flex gap-[15px]">
      <ArrowButton label="Previous product">
        <ArrowLeft className="h-full w-full" />
      </ArrowButton>
      <ArrowButton label="Next product" strong>
        <ArrowRight className="h-full w-full" />
      </ArrowButton>
    </div>
  );
}

function ArrowButton({ children, label, strong = false }: { children: React.ReactNode; label: string; strong?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`grid h-[34px] w-[34px] place-items-center rounded-full border transition-colors ${strong ? "border-black hover:bg-black hover:text-white" : "border-[#bdbdbd] text-[#888] hover:border-black hover:text-black"}`}
    >
      <span className="block h-[38%] w-[38%]">{children}</span>
    </button>
  );
}

function CarouselIndicators() {
  return (
    <div className="absolute bottom-[11px] right-[20px] z-20 flex items-center gap-1" aria-label="Product carousel position">
      <span className="h-[3px] w-[22px] rounded-full bg-white" />
      {[1, 2, 3, 4].map((item) => (
        <span key={item} className="h-[3px] w-[6px] rounded-full bg-white/45" />
      ))}
    </div>
  );
}
