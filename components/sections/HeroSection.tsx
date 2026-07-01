"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import CurvedSlider, { type SliderImage } from "./CurvedSlider";

// Resize textures down for the WebGL slider — full-res hero PNGs are ~1.5MB
const HERO_STEEL_DIR = "/generated/hero-editorial-steel";

// Seven steel-toned watch cards generated to match the Midnight Steel palette.
const CAROUSEL_IMAGES: SliderImage[] = [
  { src: `${HERO_STEEL_DIR}/editorial-steel-01.webp`, alt: "Luxury chronograph in a teal steel studio" },
  { src: `${HERO_STEEL_DIR}/editorial-steel-02.webp`, alt: "Chronograph wrist shot in a teal steel studio" },
  { src: `${HERO_STEEL_DIR}/editorial-steel-03.webp`, alt: "Mechanical watch macro in teal steel lighting" },
  { src: `${HERO_STEEL_DIR}/editorial-steel-04.webp`, alt: "Full chronograph on slate with steel teal lighting" },
  { src: `${HERO_STEEL_DIR}/editorial-steel-05.webp`, alt: "Skeleton watch in teal steel lighting" },
  { src: `${HERO_STEEL_DIR}/editorial-steel-06.webp`, alt: "Dress watch on a brushed steel teal surface" },
  { src: `${HERO_STEEL_DIR}/editorial-steel-07.webp`, alt: "Watch bracelet macro on a teal steel surface" },
];

export default function HeroSection() {
  const reduceMotion = usePrefersReducedMotion();
  const rise = { initial: { opacity: 0, y: reduceMotion ? 0 : 18 }, animate: { opacity: 1, y: 0 } };

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0f252b] text-[#eef0ef]"
    >
      {/* ambient lighting: steel-blue floor glow + top-down vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,#16343d_0%,#0f252b_38%,#07090a_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[8%] top-[8%] z-0 h-[34%] rounded-full bg-[radial-gradient(closest-side,rgba(126,140,147,0.22),rgba(22,52,61,0)_70%)] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[46%] bg-[radial-gradient(120%_90%_at_50%_122%,rgba(126,140,147,0.18),rgba(7,9,10,0)_60%)]"
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
          Curated watches
          <br />
          endlessly worth discovering
        </motion.h1>

        <motion.p
          initial={rise.initial}
          animate={rise.animate}
          transition={{ duration: reduceMotion ? 0 : 0.8, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-[clamp(16px,2.4vh,26px)] max-w-[36ch] text-balance text-[clamp(13px,1.15vw,17px)] leading-[1.55] text-[#cbd2d2]/75"
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
            className="group inline-flex items-center gap-[18px] border border-[#7e8c93]/70 bg-[#16343d]/28 px-[22px] py-[13px] text-[13.5px] tracking-[0.01em] text-[#eef0ef] transition-colors duration-300 hover:border-[#cbd2d2] hover:bg-[#16343d]/55 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7e8c93]"
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
          className="pointer-events-none absolute inset-0 z-[50] bg-[linear-gradient(90deg,#07090a_0%,rgba(15,37,43,0)_9%,rgba(15,37,43,0)_91%,#07090a_100%)]"
        />
      </motion.div>

      {/* edge vignette over everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6] bg-[radial-gradient(135%_92%_at_50%_28%,rgba(22,52,61,0),rgba(7,9,10,0.38)_100%)]"
      />
    </section>
  );
}
