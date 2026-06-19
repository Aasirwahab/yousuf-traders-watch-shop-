"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { DesktopNav, MobileNav, Logo } from "@/components/layout/Navbar";

const HERO_IMAGE = "/hero-image.png";
const PRODUCT_CARD_IMAGE =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80";

// The hero is now layered: full-bleed watch image → WHITE SVG shape on top →
// text/nav/card above that. This `d` draws the white panel directly (positive
// shape) in a fixed 760×850 coordinate space (1 unit = 1px, no distortion).
// Right-edge outline, top → bottom:
//   • big rounded curve where the image tucks behind the nav,
//   • a stepped shoulder out to the headline block,
//   • a square BOX notch (straight → rounded corner → straight) where the watch
//     pokes into the panel,
//   • a big bottom-right curve melting back into the image.
// Tune the numbers here to match the reference; H = panel width, V = step heights.
const HERO_WHITE_PATH =
  "M 0 0 H 448 V 116 Q 448 152 486 156 H 560 C 662 162 702 172 712 214 V 266 C 712 324 648 334 634 390 C 626 426 634 462 634 496 V 550 Q 634 608 582 628 Q 516 652 516 708 V 850 H 0 Z";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen lg:min-h-0 lg:h-[850px] bg-white flex flex-col lg:block pt-32 lg:pt-0">
      {/* Logo (sits on the white panel, both modes) */}
      <div className="absolute top-10 left-8 md:left-16 xl:left-20 z-30 text-black">
        <Logo />
      </div>

      {/* ── Mobile / Tablet ── */}
      <MobileContent />
      <MobileNav />
      <div className="w-full lg:hidden h-[400px] sm:h-[500px] relative mt-0 mb-8">
        <Image
          src={HERO_IMAGE}
          alt="Hero Watch Mobile"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* ── Desktop (layered: image → white SVG → content → nav → card) ── */}
      <DesktopHero />
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

function DesktopHero() {
  return (
    <div className="hidden lg:block absolute inset-0">
      {/* 1. Watch image (full-bleed background) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HERO_IMAGE}
          alt="Hero Watch"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[54%_46%]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-transparent to-transparent" />
      </div>

      {/* 2. White curve panel (drawn directly as an SVG shape, 1:1 — no distortion) */}
      <svg
        className="absolute left-0 top-0 h-full w-full z-10"
        viewBox="0 0 760 850"
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        aria-hidden="true"
      >
        <path d={HERO_WHITE_PATH} fill="white" />
      </svg>

      {/* 3. Text content (over the white panel) */}
      <div className="absolute inset-0 z-20 pointer-events-none pl-16 xl:pl-20">
        <div className="absolute top-[140px] flex items-center gap-4 h-[40px] pointer-events-auto">
          <Tagline />
        </div>

        <h1 className="absolute top-[178px] text-[52px] xl:text-[60px] tracking-tight font-medium text-black pointer-events-auto whitespace-nowrap">
          <span className="block h-[64px] leading-[64px]">Ovalen will make</span>
          <span className="block h-[64px] leading-[64px] mt-[20px]">
            your life easier
          </span>
        </h1>

        <div className="absolute top-[432px] pointer-events-auto flex flex-col gap-8 max-w-[200px] xl:max-w-[240px]">
          <Description />
          <ExploreButton />
          <NavigationArrows className="mt-4" />
        </div>
      </div>

      {/* 4. Nav (over the image, right side) */}
      <DesktopNav />

      {/* 5. Product card + carousel (over the image) */}
      <ProductCard />
      <CarouselIndicators />
    </div>
  );
}

function ProductCard() {
  return (
    <div className="absolute bottom-12 left-[420px] xl:left-[470px] bg-white text-black p-4 rounded-3xl flex gap-5 w-[340px] items-center shadow-2xl z-20">
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
