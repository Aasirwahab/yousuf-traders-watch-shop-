"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { DesktopNav, MobileNav, Logo } from "@/components/layout/Navbar";

const HERO_IMAGE = "/hero-image.png";
const PRODUCT_CARD_IMAGE =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=200&q=80";

// The hero is layered: full-bleed watch image → WHITE SVG FRAME on top →
// text/nav/card above. Matching the prototype, the watch is NOT a full-bleed
// background with an organic blob cut out of it — it's a crisp **rounded-
// rectangle photo block**, inset from the top/right/bottom (the white "gap"),
// with one clean **rounded-rectangle notch** carved into its left edge to seat
// the headline.
//
// We draw the WHITE area as a single path = an outer rectangle (the full hero)
// with the photo silhouette punched out as a hole (fill-rule="evenodd"). The
// hole reveals the full-bleed image behind it; everything else stays white.
// The path lives in a fixed 1440×850 design box rendered 1:1 (not scaled), so
// the notch/gap stay aligned to the fixed-px headline & nav; on wider screens
// the watch bleeds past the frame to fill the screen.
//
// Photo block is FULL-BLEED on the right & bottom (the watch fills the screen);
// only the TOP keeps a white "gap" (T=82) and the LEFT keeps the white text
// panel (X1=458). The single feature on the left edge is the headline NOTCH:
// a tab that bulges right to seat "Ovalen will make / your life easier"
// (text occupies x≈80→539, y≈178→326). Its right edge is bowed convex out to
// x≈600 at the vertical middle — that's the "middle curve".
const HERO_FRAME_OUTER = "M0 0 H1440 V850 H0 Z";
const HERO_PHOTO_HOLE =
  "M482 12 L1470 12 L1470 870 L458 870 " + // small top gap + full-bleed right & bottom
  "L458 372 Q458 352 478 352 " + //            up to notch, concave fillet in
  "L557 352 Q585 352 588 324 " + //            tab bottom edge + bottom-right corner
  "Q600 290 600 258 Q600 226 588 192 " + //    bowed convex right edge (middle curve)
  "Q585 164 557 164 L478 164 " + //            top-right corner + tab top edge
  "Q458 164 458 144 L458 36 Q458 12 482 12 Z"; // concave fillet + top-left corner
const HERO_WHITE_PATH = `${HERO_FRAME_OUTER} ${HERO_PHOTO_HOLE}`;

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen lg:min-h-0 lg:h-[850px] bg-white flex flex-col lg:block pt-32 lg:pt-0 lg:overflow-hidden">
      {/* Logo (sits on the white panel, both modes) */}
      <div className="absolute top-10 lg:top-[28px] left-8 md:left-16 xl:left-20 z-30 text-black">
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

      {/* 2a. Full-width white "gap" strip across the very top, so on screens
             wider than the 1440 design the gap still spans edge-to-edge. */}
      <div className="absolute top-0 inset-x-0 h-[12px] bg-white z-10" />

      {/* 2b. White frame (outer rect + photo-shaped hole, evenodd), pinned at a
             FIXED 1440×850 / 1:1 anchored top-left. It is NOT scaled, so the
             notch + top gap always line up with the fixed-px headline and nav;
             on wider screens the watch simply bleeds past the frame's right
             edge to fill the screen. */}
      <svg
        className="absolute left-0 top-0 z-10"
        width={1440}
        height={850}
        viewBox="0 0 1440 850"
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        aria-hidden="true"
      >
        <path d={HERO_WHITE_PATH} fill="white" fillRule="evenodd" />
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
