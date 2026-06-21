"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DesktopNav, Logo, MobileNav } from "@/components/layout/Navbar";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";
import { IMAGES } from "@/data/images";

const HERO_IMAGE = IMAGES.hero;

export default function HeroSection() {
  return (
    <section className="relative isolate min-h-[680px] overflow-hidden bg-white md:h-[min(100vh,62vw,850px)] md:min-h-[550px]">
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
      <Reveal delay={0.15}><Tagline /></Reveal>
      <h1 className="mt-4 text-[clamp(2.25rem,10vw,3rem)] font-normal leading-[1.02] tracking-[-0.055em] text-black">
        <span className="block overflow-hidden whitespace-nowrap"><Reveal inline className="block" delay={0.28}>Ovalen will make</Reveal></span>
        <span className="block overflow-hidden whitespace-nowrap"><Reveal inline className="block" delay={0.4}>your life easier</Reveal></span>
      </h1>
      <Reveal delay={0.56}><Description className="mt-7" /></Reveal>
      <Reveal delay={0.68}><ExploreButton className="mt-5" /></Reveal>
      <MaskReveal className="relative mt-9 min-h-[260px] flex-1 rounded-[28px]" delay={0.08}>
        <Image
          src={HERO_IMAGE}
          alt="Black mechanical Ovalen watch with red hands"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </MaskReveal>
    </div>
  );
}

function DesktopHero() {
  return (
    <div className="absolute inset-[6px] hidden overflow-hidden rounded-[12px] bg-white md:block">
      <div className="absolute left-[3.93%] top-[16px] z-30 text-black">
        <Logo />
      </div>

      <Reveal className="absolute inset-y-0 left-[29.65%] right-0 overflow-hidden rounded-l-[28px]" direction="none">
        <Image
          src={HERO_IMAGE}
          alt="Black mechanical Ovalen watch with red hands"
          fill
          priority
          sizes="70vw"
          className="scale-150 object-cover object-[77%_center]"
        />
        <span
          className="absolute left-[73.2%] top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 text-[clamp(30px,2.92vw,32px)] font-semibold leading-none tracking-[0.01em] text-white"
          style={{ fontFamily: "var(--font-teko)" }}
        >
          menghsun
        </span>
      </Reveal>

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        viewBox="0 0 890 551"
        preserveAspectRatio="none"
      >
        <path
          className="2xl:hidden"
          fill="white"
          d="M0 0H264V80Q264 98 282 98H364Q382 98 382 116Q382 133 400 133H424Q442 133 442 151V184Q442 202 424 202H405Q387 202 387 220V246Q387 264 369 264H282Q264 264 264 282V551H0Z"
        />
        <path
          className="hidden 2xl:block"
          fill="white"
          d="M0 0H264V80Q264 98 282 98H320Q338 98 338 116Q338 133 356 133H370Q388 133 388 151V184Q388 202 370 202H362Q344 202 344 220V246Q344 264 326 264H282Q264 264 264 282V551H0Z"
        />
      </svg>
      <DesktopNav />

      <div className="absolute left-[3.93%] top-[20.69%] z-20 [&>div]:gap-[clamp(14px,min(1.57vw,2.54vh),22px)] [&_p]:text-[clamp(12px,min(1.35vw,2.18vh),18px)] [&_span]:w-[clamp(88px,min(9.89vw,15.97vh),136px)]">
        <Reveal delay={0.28}><Tagline /></Reveal>
      </div>

      <h1 className="absolute left-[3.93%] top-[25.23%] z-20 text-[clamp(53px,min(5.96vw,9.62vh),82px)] font-normal leading-[1.06] tracking-[-0.048em] text-black">
        <span className="block overflow-hidden whitespace-nowrap"><Reveal inline className="block" delay={0.4}>Ovalen will make</Reveal></span>
        <span className="block overflow-hidden whitespace-nowrap"><Reveal inline className="block" delay={0.52}>your life easier</Reveal></span>
      </h1>

      <div className="absolute left-[3.93%] top-[53.36%] z-20 w-[clamp(155px,min(17.42vw,28.13vh),239px)]">
        <Reveal delay={0.68}><Description className="!text-[clamp(11px,min(1.24vw,2vh),17px)]" /></Reveal>
        <Reveal delay={0.82}><ExploreButton className="!mt-[clamp(28px,min(3.15vw,5.08vh),43px)] !px-[clamp(22px,min(2.47vw,3.99vh),34px)] !py-[clamp(6px,min(0.67vw,1.09vh),9px)] !text-[clamp(10px,min(1.12vw,1.81vh),15px)]" /></Reveal>
      </div>

      <NavigationArrows />
      <ProductCard />
      <CarouselIndicators />
    </div>
  );
}

function ProductCard() {
  return (
    <MaskReveal className="absolute bottom-[10px] left-[31.5%] z-20 hidden h-[110px] w-[270px] rounded-[17px] lg:block" delay={1.02}>
    <article aria-label="Oris Divers Sixty-Five watch" className="flex h-full w-full overflow-hidden rounded-[17px] border-[5px] border-white bg-white shadow-[0_12px_35px_rgba(0,0,0,0.16)]">
      <div
        className="h-full w-[108px] shrink-0 bg-[#171717] bg-no-repeat"
        style={{
          backgroundImage: `url('${IMAGES.prototypeDesign}')`,
          backgroundPosition: "-390px -561px",
          backgroundSize: "1150px 4686px",
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col px-3 py-2 text-black">
        <span className="text-[9px] text-[#999]">Oris</span>
        <strong className="mt-0.5 text-[14px] font-medium leading-none">Divers Sixty-Five</strong>
        <span className="mt-2 text-[8px] text-[#aaa]">REF: 01 733 7707 4064-07 8 20 18</span>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-[16px] font-medium">$2,470 <del className="ml-1 text-[11px] font-normal text-[#aaa]">$2,990</del></span>
          <span className="grid h-7 w-7 place-items-center rounded-full border border-black text-[11px]">○</span>
        </div>
      </div>
    </article>
    </MaskReveal>
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
    <div className="absolute bottom-[12px] left-[3.93%] z-20 flex gap-[15px]">
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
      className={`grid h-8 w-8 place-items-center rounded-full border transition-colors ${strong ? "border-black hover:bg-black hover:text-white" : "border-[#bdbdbd] text-[#888] hover:border-black hover:text-black"}`}
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
