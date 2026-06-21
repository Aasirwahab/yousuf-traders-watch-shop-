"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Transition } from "motion/react";
import PrototypeCrop from "@/components/ui/PrototypeCrop";
import { FEATURES_LEFT, FEATURES_RIGHT } from "@/data/constants";

const WATCH_IMAGE = "/prototype-assets/feature-watch.png";

// Sequence pacing (seconds). Plays once when the section scrolls into view.
const STEP_BASE = 0.8; // first callout starts after the watch has settled
const STEP_GAP = 0.4; // gap between each callout/line step
const stepDelay = (i: number) => STEP_BASE + i * STEP_GAP;

// Connector lines, in the exact reveal order from the video:
// top-left → top-right → mid-left → mid-right → bottom-left → bottom-right.
const CONNECTORS = [
  { points: "185,185 350,185 405,245", a: [185, 185], b: [405, 245] }, // 0  Quality Materials (TL)
  { points: "775,185 610,185 555,245", a: [775, 185], b: [555, 245] }, // 1  Convenient to Use (TR)
  { points: "185,310 406,310", a: [185, 310], b: [406, 310] }, //         2  Modern Design (ML)
  { points: "775,310 554,310", a: [775, 310], b: [554, 310] }, //         3  Safe to Use (MR)
  { points: "185,415 320,415 405,340", a: [185, 415], b: [405, 340] }, // 4  Accuracy (BL)
  { points: "775,415 640,415 555,340", a: [775, 415], b: [555, 340] }, // 5  CR 2025 (BR)
];

// left features → steps 0, 2, 4 ; right features → steps 1, 3, 5
const LEFT = FEATURES_LEFT.map((f, i) => ({ ...f, step: i * 2 }));
const RIGHT = FEATURES_RIGHT.map((f, i) => ({ ...f, step: i * 2 + 1 }));

export default function CentralFeature() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  // Reduced motion: fade (and draw) only — snap all spatial transforms (x/y/scale).
  // `initial` is kept identical across server/client to avoid hydration mismatch;
  // only `transition` (which is not serialized into SSR HTML) branches on reduceMotion.
  const trans = (delay: number, duration = 0.6): Transition =>
    reduceMotion
      ? { opacity: { duration: 0.4, delay }, pathLength: { duration: 0.5, delay }, default: { duration: 0 } }
      : { duration, delay, ease: [0.22, 1, 0.36, 1] };

  return (
    <section ref={ref} className="relative mx-auto mt-10 max-w-7xl overflow-hidden px-6 py-12 md:mt-14 md:px-12">
      {/* ───────── Desktop: radial spotlight ───────── */}
      <div className="relative mx-auto hidden h-[560px] max-w-[1000px] md:block">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[-14%] z-0 select-none text-center font-serif text-[clamp(150px,22vw,270px)] leading-none tracking-[-0.065em] text-[#e9e9ec]"
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={trans(0, 0.9)}
        >
          ovalen
        </motion.div>

        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 960 560"
          preserveAspectRatio="none"
        >
          {CONNECTORS.map((c, i) => (
            <g key={c.points}>
              <motion.polyline
                points={c.points}
                fill="none"
                stroke="#8f8f8f"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
                transition={trans(stepDelay(i), 0.55)}
              />
              <motion.circle
                cx={c.a[0]}
                cy={c.a[1]}
                r="4.5"
                fill="white"
                stroke="#111"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.2, delay: stepDelay(i) }}
              />
              <motion.circle
                cx={c.b[0]}
                cy={c.b[1]}
                r="2.25"
                fill="#111"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.2, delay: stepDelay(i) + 0.3 }}
              />
            </g>
          ))}
        </svg>

        {/* Watch — fades in solid, then stays solid */}
        <motion.div
          className="absolute inset-0 z-20 flex justify-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={trans(0.2, 0.7)}
        >
          <PrototypeCrop src={WATCH_IMAGE} alt="Ovalen black mesh watch" className="absolute top-[14%] aspect-[3/5] h-[72%]" />
        </motion.div>

        <CalloutColumn items={LEFT} side="left" inView={inView} trans={trans} />
        <CalloutColumn items={RIGHT} side="right" inView={inView} trans={trans} />

        <motion.div
          className="absolute bottom-[-5%] left-1/2 z-30 -translate-x-1/2"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={trans(stepDelay(6), 0.5)}
        >
          <button className="rounded-full border border-black bg-white px-7 py-2 text-[12px] transition-colors hover:bg-black hover:text-white">
            Shop Now
          </button>
        </motion.div>
      </div>

      {/* ───────── Mobile: stacked ───────── */}
      <div className="relative mx-auto min-h-[540px] max-w-md md:hidden">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[4%] z-0 select-none text-center font-serif text-[clamp(96px,30vw,170px)] leading-none tracking-[-0.065em] text-[#e9e9ec]"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={trans(0, 0.8)}
        >
          ovalen
        </motion.div>

        <motion.div
          className="relative z-10 mx-auto mt-6 flex justify-center"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={trans(0.2, 0.7)}
        >
          <PrototypeCrop src={WATCH_IMAGE} alt="Ovalen black mesh watch" className="aspect-[3/5] h-[330px]" />
        </motion.div>

        <div className="relative z-20 mt-10 grid grid-cols-2 gap-x-6 gap-y-7">
          {[...LEFT, ...RIGHT]
            .sort((a, b) => a.step - b.step)
            .map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={trans(stepDelay(f.step), 0.5)}
              >
                <h3 className="text-[12px] font-semibold leading-none">{f.title}</h3>
                <p className="mt-1.5 text-[10px] leading-[1.45] text-[#a1a1a1]">{f.description}</p>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}

function CalloutColumn({
  items,
  side,
  inView,
  trans,
}: {
  items: { title: string; description: string; step: number }[];
  side: "left" | "right";
  inView: boolean;
  trans: (delay: number, duration?: number) => Transition;
}) {
  const isLeft = side === "left";
  return (
    <div className={`absolute inset-y-[29.5%] z-20 flex w-[30%] flex-col justify-between ${isLeft ? "left-[1%]" : "right-[1%]"}`}>
      {items.map((f) => (
        <motion.div
          key={f.title}
          className={isLeft ? "w-[132px] text-right" : "ml-auto w-[132px] text-left"}
          initial={{ opacity: 0, x: isLeft ? -22 : 22 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={trans(stepDelay(f.step) + 0.08, 0.5)}
        >
          <h3 className="text-[11px] font-semibold leading-none">{f.title}</h3>
          <p className="mt-2 text-[9px] leading-[1.45] text-[#a1a1a1]">{f.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
