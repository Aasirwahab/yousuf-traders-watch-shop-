"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { IMAGES } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export default function HeroSection() {
  const reduceMotion = usePrefersReducedMotion();
  const initial = { opacity: 0, y: 24 };
  const duration = reduceMotion ? 0.01 : 0.8;

  return (
    <section id="top" className="relative overflow-hidden border-b border-black/10 bg-white">
      <div className="relative mx-auto min-h-[690px] md:h-[clamp(560px,calc(100svh-275px),650px)] md:min-h-0">
        <div className="relative z-20 flex min-h-[690px] flex-col justify-center px-6 py-16 md:h-full md:min-h-0 md:w-[49%] md:translate-y-[21px] md:px-[5.4%] md:py-16">
          <motion.h1 initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration, ease: [0.22, 1, 0.36, 1] }} className="max-w-[470px] text-[clamp(3.5rem,5.4vw,5.15rem)] font-normal leading-[1.1] tracking-[-0.06em]">
            Time,<br />exceptionally<br />chosen.
          </motion.h1>
          <motion.p initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }} className="mt-7 max-w-[300px] text-[14px] leading-5 text-[#6e6e6b]">
            Independent and iconic watches, authenticated for a lifetime of collecting.
          </motion.p>
          <motion.div initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration, delay: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <HeroLink href="#shop" dark>Shop new arrivals</HeroLink>
            <HeroLink href="#categories">Explore brands</HeroLink>
          </motion.div>
        </div>

        <div className="relative min-h-[390px] overflow-hidden md:absolute md:inset-y-0 md:left-[43.2%] md:right-0 md:min-h-0">
          <Image src={IMAGES.hero} alt="Black mechanical watch with a red seconds hand" fill priority sizes="(min-width: 768px) 57vw, 100vw" className="object-cover object-center md:object-[48%_center]" />
        </div>

        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full md:block" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <path fill="white" d="M0 0H518V112C518 176 544 228 588 228V370C548 370 518 402 518 440V600H0Z" />
        </svg>
      </div>
    </section>
  );
}

function HeroLink({ children, dark = false, href }: { children: React.ReactNode; dark?: boolean; href: string }) {
  return <Link href={href} className={`flex min-h-[50px] min-w-[182px] items-center justify-between border px-5 text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${dark ? "border-black bg-black text-white hover:bg-[#6b1824] hover:border-[#6b1824]" : "border-black bg-white hover:bg-black hover:text-white"}`}>{children}<ArrowRight className="h-4 w-4 stroke-[1.4]" /></Link>;
}
