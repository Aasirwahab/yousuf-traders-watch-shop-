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
const CONNECTORS = [
  { points: "145,170 330,170 405,235", start: [145, 170], end: [405, 235] },
  { points: "815,170 630,170 555,235", start: [815, 170], end: [555, 235] },
  { points: "145,300 405,300", start: [145, 300], end: [405, 300] },
  { points: "815,300 555,300", start: [815, 300], end: [555, 300] },
  { points: "145,430 330,430 405,365", start: [145, 430], end: [405, 365] },
  { points: "815,430 630,430 555,365", start: [815, 430], end: [555, 365] },
];
const MOBILE_CONNECTORS = [
  { points: "94,104 118,104 143,164", start: [94, 104], end: [143, 164] },
  { points: "266,104 242,104 217,164", start: [266, 104], end: [217, 164] },
  { points: "94,260 143,260", start: [94, 260], end: [143, 260] },
  { points: "266,260 217,260", start: [266, 260], end: [217, 260] },
  { points: "94,416 118,416 143,356", start: [94, 416], end: [143, 356] },
  { points: "266,416 242,416 217,356", start: [266, 416], end: [217, 356] },
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
    <section ref={ref} className="overflow-hidden border-y border-[#cbd2d2] px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={transition(0, 0.7)}
          className="flex flex-col justify-between gap-7 md:flex-row md:items-end"
        >
          <div><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#16343d]">The anatomy of quality</p><h2 className="mt-3 text-[clamp(2.6rem,5vw,5rem)] font-normal tracking-[-0.055em]">Built to be kept.</h2></div>
          <Link href="#shop" className="flex w-fit items-center gap-8 border-b border-[#16343d] pb-2 text-sm">Explore the collection <ArrowRight className="h-4 w-4" /></Link>
        </motion.div>

        <div className="relative mt-10 hidden h-[590px] md:block">
          <svg aria-hidden="true" viewBox="0 0 960 590" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
            {CONNECTORS.map((connector, index) => (
              <g key={connector.points}>
                <motion.polyline points={connector.points} fill="none" stroke="#7e8c93" strokeWidth="1" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0, opacity: 0 }} animate={inView ? { pathLength: 1, opacity: 1 } : undefined} transition={transition(stepDelay(index), 0.55)} />
                <motion.circle cx={connector.start[0]} cy={connector.start[1]} r="4" fill="#fbfcfb" stroke="#16343d" strokeWidth="1" vectorEffect="non-scaling-stroke" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={transition(stepDelay(index), 0.2)} />
                <motion.circle cx={connector.end[0]} cy={connector.end[1]} r="3" fill="#16343d" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={transition(stepDelay(index) + 0.3, 0.2)} />
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
          <div className="relative -ml-2 h-[520px] w-[calc(100%+1rem)] max-w-[390px]">
            <svg aria-hidden="true" viewBox="0 0 360 520" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {MOBILE_CONNECTORS.map((connector, index) => (
                <g key={connector.points}>
                  <motion.polyline
                    points={connector.points}
                    fill="none"
                    stroke="#7e8c93"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                    transition={transition(stepDelay(index), 0.55)}
                  />
                  <motion.circle
                    cx={connector.start[0]}
                    cy={connector.start[1]}
                    r="3.5"
                    fill="#fbfcfb"
                    stroke="#16343d"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : undefined}
                    transition={transition(stepDelay(index), 0.2)}
                  />
                  <motion.circle
                    cx={connector.end[0]}
                    cy={connector.end[1]}
                    r="2.5"
                    fill="#16343d"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : undefined}
                    transition={transition(stepDelay(index) + 0.3, 0.2)}
                  />
                </g>
              ))}
            </svg>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 28, rotate: -2 }}
            animate={inView ? { opacity: 1, scale: 1, y: 0, rotate: 0 } : undefined}
            transition={transition(0.2, 0.85)}
              className="absolute inset-y-0 left-1/2 w-[146px] -translate-x-1/2 origin-center"
          >
              <Image src={IMAGES.featureWatch} alt="Black mesh watch" fill sizes="146px" loading="eager" className="object-contain" />
          </motion.div>

            {LEFT_SPECS.map((spec, index) => (
              <MobileCallout
                key={spec.title}
                index={index}
                inView={inView}
                side="left"
                spec={spec}
                transition={transition}
              />
            ))}
            {RIGHT_SPECS.map((spec, index) => (
              <MobileCallout
                key={spec.title}
                index={index}
                inView={inView}
                side="right"
                spec={spec}
                transition={transition}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileCallout({
  inView,
  index,
  side,
  spec,
  transition,
}: {
  inView: boolean;
  index: number;
  side: "left" | "right";
  spec: { title: string; description: string; step: number };
  transition: (delay: number, duration?: number) => Transition;
}) {
  const delay = stepDelay(spec.step);
  const top = `${20 + index * 30}%`;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -18 : 18 }}
      animate={inView ? { opacity: 1, x: 0 } : undefined}
      transition={transition(delay, 0.5)}
      style={{ top }}
      className={`absolute w-[27%] -translate-y-1/2 [overflow-wrap:anywhere] ${side === "left" ? "left-0 pl-1 text-right" : "right-0 pr-1"}`}
    >
      <h3 className="text-[10px] font-medium leading-[1.25] min-[390px]:text-[11px]">{spec.title}</h3>
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={transition(delay + 0.16, 0.4)}
        className="mt-1 text-[8px] leading-[1.45] text-[#687276] min-[390px]:text-[9px]"
      >
        {spec.description}
      </motion.p>
    </motion.div>
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
      {specs.map((spec) => <motion.div key={spec.title} initial={{ opacity: 0, x: side === "left" ? -22 : 22 }} animate={inView ? { opacity: 1, x: 0 } : undefined} transition={transition(stepDelay(spec.step) + 0.08, 0.5)} className={side === "left" ? "ml-auto max-w-[210px]" : "max-w-[210px]"}><h3 className="text-[13px] font-medium">{spec.title}</h3><p className="mt-2 text-[11px] leading-5 text-[#687276]">{spec.description}</p></motion.div>)}
    </div>
  );
}
