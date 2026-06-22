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
    desktopSrc: IMAGES.cinematicHeroCutouts[0],
    mobileSrc: IMAGES.mobileHeroSlides[0],
    alt: "Black chronograph with polished steel and red detailing",
  },
  {
    desktopSrc: IMAGES.cinematicHeroCutouts[1],
    mobileSrc: IMAGES.mobileHeroSlides[1],
    alt: "Angular black chronograph with polished steel and blue detailing",
  },
  {
    desktopSrc: IMAGES.cinematicHeroCutouts[2],
    mobileSrc: IMAGES.mobileHeroSlides[2],
    alt: "Black skeleton chronograph with champagne-gold mechanical detailing",
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
    <section id="top" aria-roledescription="carousel" aria-label="Featured watches" className="relative bg-black text-white">
      <MobileHero
        activeSlide={activeSlide}
        controlsPaused={controlsPaused}
        entrance={entrance}
        reduceMotion={reduceMotion}
        resumeControls={resumeControls}
        setActiveSlide={setActiveSlide}
        setControlsPaused={setControlsPaused}
      />

      <DesktopHero
        activeSlide={activeSlide}
        controlsPaused={controlsPaused}
        entrance={entrance}
        reduceMotion={reduceMotion}
        resumeControls={resumeControls}
        setActiveSlide={setActiveSlide}
        setControlsPaused={setControlsPaused}
        showNextSlide={showNextSlide}
        showPreviousSlide={showPreviousSlide}
      />
    </section>
  );
}

type HeroSharedProps = {
  activeSlide: number;
  controlsPaused: boolean;
  entrance: { opacity: number; y: number };
  reduceMotion: boolean;
  resumeControls: (event: FocusEvent<HTMLDivElement>) => void;
  setActiveSlide: (index: number) => void;
  setControlsPaused: (paused: boolean) => void;
};

function MobileHero({
  activeSlide,
  controlsPaused,
  entrance,
  reduceMotion,
  resumeControls,
  setActiveSlide,
  setControlsPaused,
}: HeroSharedProps) {
  return (
    <div className="flex min-h-[100svh] flex-col md:hidden">
      <div className="relative h-[clamp(360px,47svh,430px)] overflow-hidden border-b border-white/15">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeSlide;

            return (
              <motion.div
                key={slide.mobileSrc}
                aria-hidden={!isActive}
                initial={false}
                animate={{ opacity: isActive ? 1 : 0, scale: isActive && !reduceMotion ? 1.012 : 1 }}
                transition={{
                  opacity: { duration: reduceMotion ? 0 : 0.9, ease: "easeInOut" },
                  scale: { duration: reduceMotion ? 0 : SLIDE_DURATION / 1000, ease: "linear" },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.mobileSrc}
                  alt={isActive ? slide.alt : ""}
                  fill
                  loading="eager"
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(max-width: 767px) 100vw, 1px"
                  className="object-cover object-[54%_32%]"
                />
              </motion.div>
            );
          })}
        </div>

        <div className="absolute bottom-10 left-6 top-[128px] z-10 flex w-7 flex-col items-center text-[12px] tabular-nums">
          <span className="text-white">0{activeSlide + 1}</span>
          <span className="my-4 w-px flex-1 overflow-hidden bg-white/30">
            <motion.span
              key={`mobile-vertical-${activeSlide}-${controlsPaused}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: controlsPaused || reduceMotion ? 0 : 1 }}
              transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
              className="block h-full origin-top bg-[#d8362a]"
            />
          </span>
          <span className="text-white/70">03</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 pb-[max(18px,env(safe-area-inset-bottom))] pt-6 min-[400px]:px-8 min-[400px]:pt-7">
        <motion.h1
          initial={entrance}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(2.75rem,13vw,3.55rem)] font-medium leading-[0.98] tracking-[-0.055em]"
        >
          Time,<br />exceptionally<br />chosen.
        </motion.h1>

        <motion.p
          initial={entrance}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-[340px] text-[13px] leading-[1.6] text-white/55"
        >
          Independent and iconic watches, authenticated for a lifetime of collecting.
        </motion.p>

        <motion.div
          initial={entrance}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.75, delay: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5"
        >
          <HeroLink href="#shop" primary mobile>Shop new arrivals</HeroLink>
          <Link
            href="#categories"
            className="mt-3 inline-flex min-h-11 items-center gap-4 text-[14px] text-white transition-colors hover:text-white/65 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Explore brands
            <span aria-hidden="true" className="h-px w-8 bg-white/75" />
          </Link>
        </motion.div>

        <div
          onTouchStart={() => setControlsPaused(true)}
          onTouchEnd={() => setControlsPaused(false)}
          onFocusCapture={() => setControlsPaused(true)}
          onBlurCapture={resumeControls}
          className="mt-auto grid grid-cols-3 gap-1 pt-5"
        >
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.mobileSrc}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Show watch ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              className="group relative min-h-12 pt-4 text-[12px] tabular-nums text-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span className="absolute inset-x-0 top-0 h-px overflow-hidden bg-white/20">
                {index === activeSlide ? (
                  <motion.span
                    key={`mobile-horizontal-${activeSlide}-${controlsPaused}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: controlsPaused || reduceMotion ? 0 : 1 }}
                    transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                    className="block h-full origin-left bg-white"
                  />
                ) : null}
              </span>
              <span className={index === activeSlide ? "text-white" : "transition-colors group-hover:text-white/70"}>0{index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DesktopHero({
  activeSlide,
  controlsPaused,
  entrance,
  reduceMotion,
  resumeControls,
  setActiveSlide,
  setControlsPaused,
  showNextSlide,
  showPreviousSlide,
}: HeroSharedProps & { showNextSlide: () => void; showPreviousSlide: () => void }) {
  return (
    <div className="relative hidden h-[100svh] min-h-[760px] max-h-[960px] overflow-hidden md:block">
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeSlide;

          return (
            <motion.div
              key={slide.desktopSrc}
              aria-hidden={!isActive}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, scale: isActive && !reduceMotion ? 1.018 : 1 }}
              transition={{
                opacity: { duration: reduceMotion ? 0 : 1.15, ease: "easeInOut" },
                scale: { duration: reduceMotion ? 0 : SLIDE_DURATION / 1000, ease: "linear" },
              }}
              className="absolute inset-0"
            >
              <Image
                src={slide.desktopSrc}
                alt={isActive ? slide.alt : ""}
                fill
                loading="eager"
                fetchPriority={index === 0 ? "high" : "auto"}
                sizes="(min-width: 768px) 100vw, 1px"
                className="object-cover object-center"
              />
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-20 flex h-full flex-col px-[4.7%]">
        <div className="flex flex-1 items-center pb-16 pt-36">
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
              className="mt-8 flex gap-3"
            >
              <HeroLink href="#shop" primary>Shop new arrivals</HeroLink>
              <HeroLink href="#categories">Explore brands</HeroLink>
            </motion.div>
          </div>
        </div>

        <div className="grid min-h-[82px] grid-cols-[1.25fr_1fr_1fr_auto] items-center gap-10 border-t border-white/20 text-[11px] text-white/55">
          <p>Curated independently. Authenticated for life.</p>
          <p>Worldwide shipping</p>
          <p>Secure checkout</p>

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
                key={slide.desktopSrc}
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
    </div>
  );
}

function SlideArrow({ direction, label, onClick }: { direction: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="grid h-10 w-10 place-items-center text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
      {direction === "left" ? <ArrowLeft className="h-4 w-4 stroke-[1.4]" /> : <ArrowRight className="h-4 w-4 stroke-[1.4]" />}
    </button>
  );
}

function HeroLink({ children, href, mobile = false, primary = false }: { children: React.ReactNode; href: string; mobile?: boolean; primary?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex min-h-[52px] items-center justify-between border px-5 text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${mobile ? "w-full" : "min-w-[205px]"} ${primary ? "border-white bg-white text-black hover:bg-white/85" : "border-white/45 text-white hover:border-white hover:bg-white hover:text-black"}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 stroke-[1.4]" />
    </Link>
  );
}
