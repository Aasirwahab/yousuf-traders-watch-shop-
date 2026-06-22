"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useInView, type Transition } from "motion/react";
import { useRef } from "react";
import { FEATURES_LEFT, FEATURES_RIGHT } from "@/data/constants";
import { IMAGES } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const STEP_BASE = 0.8;
const STEP_GAP = 0.4;
const stepDelay = (step: number) => STEP_BASE + step * STEP_GAP;

const LEFT_SPECS = FEATURES_LEFT.map((spec, index) => ({ ...spec, step: index * 2 }));
const RIGHT_SPECS = FEATURES_RIGHT.map((spec, index) => ({ ...spec, step: index * 2 + 1 }));
const MOBILE_SPECS = [...LEFT_SPECS, ...RIGHT_SPECS].sort((a, b) => a.step - b.step);
const CONNECTORS = [
  { points: "145,170 330,170 405,235", start: [145, 170], end: [405, 235] },
  { points: "815,170 630,170 555,235", start: [815, 170], end: [555, 235] },
  { points: "145,300 405,300", start: [145, 300], end: [405, 300] },
  { points: "815,300 555,300", start: [815, 300], end: [555, 300] },
  { points: "145,430 330,430 405,365", start: [145, 430], end: [405, 365] },
  { points: "815,430 630,430 555,365", start: [815, 430], end: [555, 365] },
];

export default function CentralFeature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = usePrefersReducedMotion();
  const transition = (delay: number, duration = 0.6): Transition =>
    reduceMotion
      ? {
          opacity: { duration: 0.4, delay },
          pathLength: { duration: 0.5, delay },
          default: { duration: 0 },
        }
      : { duration, delay, ease: [0.22, 1, 0.36, 1] };

  return (
    <section ref={ref} className="border-y border-black/10 px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={transition(0, 0.7)}
          className="flex flex-col justify-between gap-7 md:flex-row md:items-end"
        >
          <div><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b1824]">The anatomy of quality</p><h2 className="mt-3 text-[clamp(2.6rem,5vw,5rem)] font-normal tracking-[-0.055em]">Built to be kept.</h2></div>
          <Link href="#shop" className="flex w-fit items-center gap-8 border-b border-black pb-2 text-sm">Explore the collection <ArrowRight className="h-4 w-4" /></Link>
        </motion.div>

        <div className="relative mt-10 hidden h-[590px] md:block">
          <svg aria-hidden="true" viewBox="0 0 960 590" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
            {CONNECTORS.map((connector, index) => (
              <g key={connector.points}>
                <motion.polyline points={connector.points} fill="none" stroke="#7b7b77" strokeWidth="1" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : undefined} transition={transition(stepDelay(index), 0.55)} />
                <motion.circle cx={connector.start[0]} cy={connector.start[1]} r="4" fill="#fff" stroke="#6b1824" strokeWidth="1" vectorEffect="non-scaling-stroke" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={transition(stepDelay(index), 0.2)} />
                <motion.circle cx={connector.end[0]} cy={connector.end[1]} r="3" fill="#6b1824" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={transition(stepDelay(index) + 0.3, 0.2)} />
              </g>
            ))}
          </svg>

          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={inView ? { opacity: 1, scale: 1 } : undefined} transition={transition(0.2, 0.7)} className="absolute inset-0 flex justify-center">
            <div className="relative h-full w-[310px]"><Image src={IMAGES.featureWatch} alt="Black mesh watch with annotated specifications" fill sizes="310px" loading="eager" className="object-contain" /></div>
          </motion.div>

          <SpecColumn specs={LEFT_SPECS} side="left" inView={inView} transition={transition} />
          <SpecColumn specs={RIGHT_SPECS} side="right" inView={inView} transition={transition} />
        </div>

        <div className="mt-12 md:hidden">
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={inView ? { opacity: 1, scale: 1 } : undefined} transition={transition(0.2, 0.7)} className="relative mx-auto h-[400px] w-[220px]"><Image src={IMAGES.featureWatch} alt="Black mesh watch" fill sizes="220px" loading="eager" className="object-contain" /></motion.div>
          <ol className="mt-7 border-t border-black/10">
            {MOBILE_SPECS.map((spec, index) => <motion.li key={spec.title} initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={transition(stepDelay(spec.step), 0.45)} className="grid grid-cols-[30px_1fr] gap-3 border-b border-black/10 py-4"><span className="text-[11px] font-medium text-[#6b1824]">{String(index + 1).padStart(2, "0")}</span><div><h3 className="text-sm font-medium">{spec.title}</h3><p className="mt-1 text-[12px] leading-5 text-[#6e6e6b]">{spec.description}</p></div></motion.li>)}
          </ol>
        </div>
      </div>
    </section>
  );
}

function SpecColumn({
  inView,
  side,
  specs,
  transition,
}: {
  inView: boolean;
  side: "left" | "right";
  specs: Array<{ title: string; description: string; step: number }>;
  transition: (delay: number, duration?: number) => Transition;
}) {
  return (
    <div className={`absolute inset-y-[22%] flex w-[30%] flex-col justify-between ${side === "left" ? "left-0 text-right" : "right-0"}`}>
      {specs.map((spec) => <motion.div key={spec.title} initial={{ opacity: 0, x: side === "left" ? -22 : 22 }} animate={inView ? { opacity: 1, x: 0 } : undefined} transition={transition(stepDelay(spec.step) + 0.08, 0.5)} className={side === "left" ? "ml-auto max-w-[210px]" : "max-w-[210px]"}><h3 className="text-[13px] font-medium">{spec.title}</h3><p className="mt-2 text-[11px] leading-5 text-[#777773]">{spec.description}</p></motion.div>)}
    </div>
  );
}
