"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import "lenis/dist/lenis.css";

/**
 * Global smooth-scroll provider (Lenis, root mode).
 *
 * `root` attaches Lenis to the window scroll, so it drives native scrollY —
 * Framer Motion's `whileInView` / `useScroll` reveals keep working unchanged
 * and simply react to the eased scroll position.
 *
 * Disabled entirely when the user prefers reduced motion: we render children
 * with the browser's native scroll instead.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1, // lower = smoother/heavier glide
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
