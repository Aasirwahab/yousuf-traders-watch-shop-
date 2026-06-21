"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

type CopyProps = {
  children: ReactNode;
  /** Trigger on scroll-into-view (default) vs. immediately on mount. */
  animateOnScroll?: boolean;
  delay?: number;
};

/**
 * Line-by-line text reveal: splits the wrapped text into lines, masks each,
 * then slides them up with a stagger when scrolled into view (GSAP SplitText).
 *
 * Always renders a single wrapper element so server and client markup match
 * (a conditional clone-vs-wrap branch causes hydration mismatches across the
 * RSC boundary). The wrapper mirrors the previous <Reveal> wrapper, so layout
 * is unchanged.
 *
 * The reveal plays for everyone (it is not gated on prefers-reduced-motion) —
 * a scroll-triggered line reveal is intentional here. Splits only after fonts
 * are ready so line-wrapping is measured correctly, and stays hidden until
 * ready to avoid a flash of un-split text.
 */
export default function Copy({ children, animateOnScroll = true, delay = 0 }: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const targets = Array.from(container.children) as HTMLElement[];
      if (targets.length === 0) return;

      // Hide until ready (client-only, after hydration — no SSR mismatch).
      gsap.set(container, { autoAlpha: 0 });

      const splits: SplitText[] = [];
      let cancelled = false;

      const run = () => {
        if (cancelled || !containerRef.current) return;

        const lines: Element[] = [];
        targets.forEach((el) => {
          const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
          splits.push(split);
          lines.push(...split.lines);
        });

        gsap.set(lines, { yPercent: 100 });
        gsap.set(container, { autoAlpha: 1 });
        gsap.to(lines, {
          yPercent: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.out",
          delay,
          ...(animateOnScroll
            ? { scrollTrigger: { trigger: container, start: "top 75%", once: true } }
            : {}),
        });
      };

      if (document.fonts?.status === "loaded") {
        run();
      } else {
        document.fonts.ready.then(run);
      }

      return () => {
        cancelled = true;
        splits.forEach((split) => split.revert());
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] },
  );

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
