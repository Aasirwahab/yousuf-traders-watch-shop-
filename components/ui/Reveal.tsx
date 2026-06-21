"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// Reduced-motion users get an opacity-only fade (no spatial movement, which is
// the part that matters for vestibular safety). NOTE: `initial` is intentionally
// the same on server and client — branching it on useReducedMotion() (which is
// false during SSR, true on a reduced client) causes a hydration mismatch.
// Only `transition` is branched, and transition is not rendered into SSR HTML.
const fadeOnly = (delay: number) => ({
  opacity: { duration: 0.5, delay, ease: "easeOut" as const },
  x: { duration: 0 },
  y: { duration: 0 },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
  distance?: number;
  inline?: boolean;
  amount?: number;
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 28,
  inline = false,
  amount = 0.2,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = direction === "none" ? {} : direction === "up" ? { y: distance } : direction === "left" ? { x: -distance } : { x: distance };
  const visible = direction === "none" ? { opacity: 1 } : { opacity: 1, x: 0, y: 0 };

  const MotionElement = inline ? motion.span : motion.div;

  return (
    <MotionElement
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={visible}
      viewport={{ once: true, amount }}
      transition={reduceMotion ? fadeOnly(delay) : { duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionElement>
  );
}

type MaskRevealProps = RevealProps & {
  axis?: "horizontal" | "vertical";
  from?: "left" | "right" | "top" | "bottom";
};

// Directional "wipe" reveal: opacity + slide inside an overflow-hidden container
// (content emerges from the clipped edge). Does NOT use clip-path — an element
// clipped to zero area never registers with IntersectionObserver, so a
// clip-path reveal deadlocks and never un-clips.
export function MaskReveal({ children, className = "", delay = 0, axis = "horizontal", from, amount = 0.2 }: MaskRevealProps) {
  const reduceMotion = useReducedMotion();
  const revealFrom = from ?? (axis === "horizontal" ? "left" : "top");
  const slide = {
    left: { x: -48, y: 0 },
    right: { x: 48, y: 0 },
    top: { x: 0, y: -48 },
    bottom: { x: 0, y: 48 },
  }[revealFrom];

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ opacity: 0, ...slide }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={reduceMotion ? fadeOnly(delay) : { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
