"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState, type FocusEvent } from "react";
import { IMAGES } from "@/data/images";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const SLIDE_DURATION = 6500;
const HERO_SLIDES = [
  {
    src: IMAGES.cinematicHeroCutouts[0],
    alt: "Black chronograph with polished steel and red detailing",
    frame: "inset-0",
  },
  {
    src: IMAGES.cinematicHeroCutouts[1],
    alt: "Angular black chronograph with polished steel and blue detailing",
    frame: "inset-0",
  },
  {
    src: IMAGES.cinematicHeroCutouts[2],
    alt: "Black skeleton chronograph with champagne-gold mechanical detailing",
    frame: "inset-0",
  },
] as const;

export default function HeroSection() {
  const reduceMotion = usePrefersReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);
  const [controlsPaused, setControlsPaused] = useState(false);
  const entrance = { opacity: 0, y: reduceMotion ? 0 : 22 };

  useEffect(() => {
    if (controlsPaused) return;

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
      }
    }, SLIDE_DURATION);

    return () => window.clearInterval(interval);
  }, [activeSlide, controlsPaused]);

  function showPreviousSlide() {
    setActiveSlide((current) => (current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }

  function showNextSlide() {
    setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
  }

  function resumeControls(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setControlsPaused(false);
    }
  }

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Featured watches"
      className="relative h-[100svh] min-h-[760px] max-h-[960px] overflow-hidden bg-black text-white"
    >
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <motion.div
              key={slide.src}
              aria-hidden={!isActive}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive && !reduceMotion ? 1.018 : 1,
              }}
              transition={{
                opacity: { duration: reduceMotion ? 0 : 1.15, ease: "easeInOut" },
                scale: { duration: reduceMotion ? 0 : SLIDE_DURATION / 1000, ease: "linear" },
              }}
              className="absolute inset-0"
            >
              <div className={`absolute ${slide.frame}`}>
                <Image
                  src={slide.src}
                  alt={isActive ? slide.alt : ""}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "eager"}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-20 flex h-full flex-col px-6 md:px-[4.7%]">
        <div className="flex flex-1 items-end pb-[150px] pt-28 md:items-center md:pb-16 md:pt-36">
          <div className="max-w-[470px]">
            <motion.h1
              initial={entrance}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3.6rem,5.5vw,5.6rem)] font-normal leading-[1.04] tracking-[-0.06em]"
            >
              Time,<br />exceptionally<br />chosen.
            </motion.h1>

            <motion.p
              initial={entrance}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-[330px] text-[13px] leading-[1.55] text-white/65"
            >
              Independent and iconic watches, authenticated for a lifetime of collecting.
            </motion.p>

            <motion.div
              initial={entrance}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <HeroLink href="#shop" primary>Shop new arrivals</HeroLink>
              <HeroLink href="#categories">Explore brands</HeroLink>
            </motion.div>
          </div>
        </div>

        <div className="grid min-h-[82px] grid-cols-1 items-center border-t border-white/20 text-[11px] text-white/55 md:grid-cols-[1.25fr_1fr_1fr_auto] md:gap-10">
          <p className="hidden md:block">Curated independently. Authenticated for life.</p>
          <p className="hidden md:block">Worldwide shipping</p>
          <p className="hidden md:block">Secure checkout</p>

          <div
            onMouseEnter={() => setControlsPaused(true)}
            onMouseLeave={() => setControlsPaused(false)}
            onFocusCapture={() => setControlsPaused(true)}
            onBlurCapture={resumeControls}
            className="ml-auto flex items-center gap-2 text-white"
          >
            <SlideArrow label="Show previous watch" onClick={showPreviousSlide} direction="left" />

            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show watch ${index + 1}`}
                aria-current={index === activeSlide ? "true" : undefined}
                className="relative h-10 w-10 text-[11px] tabular-nums text-white/45 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span className={index === activeSlide ? "text-white" : ""}>0{index + 1}</span>
                <span className="absolute inset-x-2 bottom-1 h-px overflow-hidden bg-white/20">
                  {index === activeSlide ? (
                    <motion.span
                      key={`${activeSlide}-${controlsPaused}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: controlsPaused || reduceMotion ? 0 : 1 }}
                      transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                      className="block h-full origin-left bg-white"
                    />
                  ) : null}
                </span>
              </button>
            ))}

            <SlideArrow label="Show next watch" onClick={showNextSlide} direction="right" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideArrow({ direction, label, onClick }: { direction: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid h-10 w-10 place-items-center text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      {direction === "left" ? <ArrowLeft className="h-4 w-4 stroke-[1.4]" /> : <ArrowRight className="h-4 w-4 stroke-[1.4]" />}
    </button>
  );
}

function HeroLink({ children, href, primary = false }: { children: React.ReactNode; href: string; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-h-[52px] min-w-[205px] items-center justify-between border px-5 text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${primary ? "border-white bg-white text-black hover:bg-white/85" : "border-white/45 text-white hover:border-white hover:bg-white hover:text-black"}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 stroke-[1.4]" />
    </Link>
  );
}
