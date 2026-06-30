"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { IMAGES } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import CurvedSlider, { type SliderImage } from "./CurvedSlider";

// Resize textures down for the WebGL slider — full-res hero PNGs are ~1.5MB
// each; ImageKit hands back a small, sharp crop instead.
const tex = (url: string) => `${url}?tr=w-760,q-82`;

// Seven cohesive, dark cinematic watch shots for the curved slider.
const CAROUSEL_IMAGES: SliderImage[] = [
  { src: tex(IMAGES.heroSlides[0]), alt: "Black chronograph with red detailing" },
  { src: tex(IMAGES.cinematicHeroSlides[0]), alt: "Black sports chronograph with red accents" },
  { src: tex(IMAGES.cinematicHeroSlides[1]), alt: "Black octagonal chronograph with blue accents" },
  { src: tex(IMAGES.featureWatch), alt: "Minimalist black watch on a mesh bracelet" },
  { src: tex(IMAGES.cinematicHeroSlides[2]), alt: "Black skeleton chronograph with gold detailing" },
  { src: tex(IMAGES.heroSlides[1]), alt: "Angular black chronograph with red detailing" },
  { src: tex(IMAGES.heroSlides[2]), alt: "Black chronograph with blue detailing" },
];

export default function HeroSection() {
  const reduceMotion = usePrefersReducedMotion();
  const rise = { initial: { opacity: 0, y: reduceMotion ? 0 : 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#08080a] text-white"
    >
      {/* ambient lighting: soft floor glow + top-down vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[46%] bg-[radial-gradient(120%_90%_at_50%_122%,rgba(255,255,255,0.05),rgba(8,8,10,0)_60%)]"
      />

      {/* headline block */}
      <div className="relative z-10 flex flex-col items-center px-5 pt-[clamp(92px,12vh,158px)] text-center">
        <motion.h1
          initial={rise.initial}
          animate={rise.animate}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif font-normal leading-[1.04] tracking-[-0.01em] text-[clamp(2.4rem,6vw,5.4rem)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Curated watches,
          <br />
          endlessly worth discovering.
        </motion.h1>

        <motion.p
          initial={rise.initial}
          animate={rise.animate}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(16px,2.4vh,26px)] max-w-[36ch] text-balance text-[clamp(13px,1.15vw,17px)] leading-[1.55] text-white/55"
        >
          Authenticated independent and iconic timepieces for collectors with exacting taste.
        </motion.p>

        <motion.div
          initial={rise.initial}
          animate={rise.animate}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(14px,2.2vh,26px)]"
        >
          <Link
            href="/watches"
            className="group inline-flex items-center gap-[18px] border border-white/45 px-[22px] py-[13px] text-[13.5px] tracking-[0.01em] text-white transition-colors duration-300 hover:border-white/85 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore the collection
            <ArrowRight className="h-4 w-4 stroke-[1.4] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* curved carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1, delay: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
        className="relative z-[5] mt-auto mb-[clamp(14px,2.4vh,32px)] h-[clamp(240px,33vh,420px)] w-full"
      >
        <CurvedSlider images={CAROUSEL_IMAGES} />
        {/* edge fade: outer cards recede into black on the left/right */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[50] bg-[linear-gradient(90deg,#08080a_0%,rgba(8,8,10,0)_9%,rgba(8,8,10,0)_91%,#08080a_100%)]"
        />
      </motion.div>

      {/* edge vignette over everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(135%_92%_at_50%_28%,rgba(8,8,10,0),rgba(8,8,10,0.32)_100%)]"
      />
    </section>
  );
}
