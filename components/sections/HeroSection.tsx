"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { DesktopNav, MobileNav, Logo } from "@/components/layout/Navbar";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1600&q=80";
const PRODUCT_CARD_IMAGE =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80";

// The white "tab" carved out of the left edge of the hero image, replicating the
// reference mockup's full outline (top → bottom on the right edge):
//   1. a narrow upper shelf at the tagline, then a STEP out to the wider headline
//      block (rounded inner + outer corners),
//   2. a deep CONCAVE scoop (two `A` arcs, concave sweep) where the round watch
//      face pokes INTO the pocket,
//   3. a rounded bottom-right corner, with soft fillets where the tab meets the
//      straight image edge.
// Authored in the image's local coordinate space (x:0 = image's left edge). ONE line.
const HERO_CLIP_PATH =
  "path('M 110 0 L 4000 0 L 4000 850 L 40 850 C 18 850 0 832 0 810 L 0 474 C 0 430 30 404 98 398 L 286 398 C 312 398 332 384 332 372 A 16 16 0 0 1 316 356 L 300 356 A 16 16 0 0 0 284 340 L 284 276 A 16 16 0 0 0 300 260 L 316 260 A 16 16 0 0 1 332 244 L 332 196 C 332 168 312 150 280 150 L 98 150 C 42 150 0 118 0 62 L 0 40 C 0 18 18 0 40 0 Z')";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen lg:min-h-0 lg:h-[850px] bg-white flex flex-col lg:flex-row lg:items-start pt-32 lg:pt-0">
      {/* Logo */}
      <div className="absolute top-10 left-8 md:left-16 xl:left-32 z-20 text-black">
        <Logo />
      </div>

      {/* ── Mobile / Tablet Content ── */}
      <MobileContent />

      {/* ── Desktop Content Overlay ── */}
      <DesktopContent />

      {/* ── Right Image with Clip Path (Desktop) ── */}
      <HeroImage />

      {/* Mobile Nav */}
      <MobileNav />

      {/* Mobile Image (No clip path) */}
      <div className="w-full lg:hidden h-[400px] sm:h-[500px] relative mt-0 mb-8">
        <Image
          src={HERO_IMAGE.replace("w=1600", "w=1000")}
          alt="Hero Watch Mobile"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function MobileContent() {
  return (
    <div className="w-full lg:hidden p-8 md:p-16 z-10 flex flex-col justify-center">
      <Tagline />
      <h1 className="text-5xl md:text-7xl leading-[1.05] tracking-tight font-medium text-black mb-8">
        Ovalen will make
        <br />
        your life easier
      </h1>
      <Description />
      <ExploreButton className="mb-16" />
      <NavigationArrows />
    </div>
  );
}

function DesktopContent() {
  return (
    <div className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <div className="w-full h-full relative pl-16 xl:pl-32">
        <div className="absolute top-[140px] flex items-center gap-4 h-[40px] pointer-events-auto">
          <Tagline />
        </div>

        <h1 className="absolute top-[176px] text-[56px] xl:text-[72px] tracking-tight font-medium text-black pointer-events-auto whitespace-nowrap">
          <span className="block h-[78px] leading-[78px]">
            Ovalen will make
          </span>
          <span className="block h-[72px] leading-[72px] mt-[28px]">
            your life easier
          </span>
        </h1>

        <div className="absolute top-[470px] pointer-events-auto flex flex-col gap-8 max-w-[160px] xl:max-w-[220px]">
          <Description />
          <ExploreButton />
          <NavigationArrows className="mt-4" />
        </div>
      </div>
    </div>
  );
}

function HeroImage() {
  return (
    <div className="hidden lg:block absolute right-0 top-0 lg:w-[calc(100%-240px)] xl:w-[calc(100%-360px)] h-[850px] z-0">
      <div
        className="w-full h-full relative"
        style={{
          clipPath: HERO_CLIP_PATH,
          WebkitClipPath: HERO_CLIP_PATH,
        }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Hero Watch"
          fill
          className="object-cover object-center scale-[1.02] brightness-90 saturate-[0.8]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/50 to-transparent opacity-80" />

        {/* Nav Overlay */}
        <DesktopNav />

        {/* Product Card */}
        <ProductCard />

        {/* Carousel indicators */}
        <CarouselIndicators />
      </div>
    </div>
  );
}

function ProductCard() {
  return (
    <div className="absolute bottom-28 left-8 bg-white text-black p-4 rounded-3xl flex gap-5 w-[340px] items-center shadow-2xl z-20">
      <div className="w-[90px] h-[90px] relative rounded-2xl overflow-hidden flex-shrink-0 bg-[#f8f9fa] flex items-center justify-center">
        <Image
          src={PRODUCT_CARD_IMAGE}
          fill
          alt="Watch"
          className="object-cover scale-110"
        />
      </div>
      <div className="flex flex-col flex-1 pl-1">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-1">
          Oris
        </span>
        <span className="font-bold text-[17px] mb-1 leading-snug tracking-tight">
          Divers Sixty-Five
        </span>
        <span className="text-[10px] text-gray-400 font-mono tracking-tighter mb-3 block">
          REF 01 733 7720
        </span>
        <div className="flex justify-between items-end">
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-[19px] leading-none">
              $2.470
            </span>
            <span className="text-gray-400 text-[11px] font-medium line-through leading-none">
              $2.990
            </span>
          </div>
          <button className="w-[34px] h-[34px] rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer">
            <ShoppingBag className="w-[14px] h-[14px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CarouselIndicators() {
  return (
    <div className="absolute bottom-16 right-16 flex gap-2 z-20">
      <div className="w-10 h-[3px] bg-white rounded-full cursor-pointer" />
      <div className="w-2.5 h-[3px] bg-white/40 rounded-full hover:bg-white/60 transition-colors cursor-pointer" />
      <div className="w-2.5 h-[3px] bg-white/40 rounded-full hover:bg-white/60 transition-colors cursor-pointer" />
      <div className="w-2.5 h-[3px] bg-white/40 rounded-full hover:bg-white/60 transition-colors cursor-pointer" />
    </div>
  );
}

/* ── Shared Atoms ───────────────────────────────────────────── */

function Tagline() {
  return (
    <>
      <div className="w-12 h-px bg-gray-400" />
      <span className="text-gray-500 font-medium text-sm md:text-base lg:text-base">
        Effective gadgets for the modern world
      </span>
    </>
  );
}

function Description() {
  return (
    <p className="text-gray-500 max-w-sm leading-relaxed text-base md:text-lg lg:text-lg">
      Explore our best products to find what you want, there you will definitely
      find it.
    </p>
  );
}

function ExploreButton({ className = "" }: { className?: string }) {
  return (
    <button
      className={`bg-black text-white px-8 py-4 rounded-[30px] font-medium hover:bg-gray-800 transition-colors shadow-lg w-fit whitespace-nowrap tracking-wide cursor-pointer self-start ${className}`}
    >
      Explore Product
    </button>
  );
}

function NavigationArrows({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4 text-gray-500" />
      </button>
      <button className="w-12 h-12 rounded-full border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all group cursor-pointer">
        <ArrowRight className="w-4 h-4 text-black group-hover:text-white transition-colors" />
      </button>
    </div>
  );
}
