import React from "react";
import Image from "next/image";
import { FEATURES_LEFT, FEATURES_RIGHT } from "@/data/constants";
import type { Feature } from "@/types";

const WATCH_IMAGE =
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80";

// Interleave left/right so the stacked (mobile/tablet) order reads naturally.
const ALL_FEATURES: Feature[] = FEATURES_LEFT.flatMap((left, i) => [
  left,
  FEATURES_RIGHT[i],
]).filter(Boolean);

export default function CentralFeature() {
  return (
    <section className="w-full py-20 md:py-28 lg:py-32 relative overflow-hidden flex flex-col items-center">
      {/* Huge Background Text */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:-translate-y-[60%] text-[28vw] md:text-[25vw] font-serif font-medium text-gray-50 -z-10 leading-none select-none tracking-tighter opacity-80">
        ovalen
      </div>

      <div className="max-w-6xl w-full mx-auto relative flex justify-center items-center px-6 md:px-8">
        {/* Center Watch Image */}
        <div className="w-[240px] sm:w-[320px] md:w-[400px] lg:w-[450px] aspect-square relative z-10 lg:scale-110">
          <Image
            src={WATCH_IMAGE}
            fill
            sizes="(max-width: 1024px) 60vw, 450px"
            className="object-cover rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-black/5"
            alt="Watch Feature"
          />
        </div>

        {/* Feature annotations — desktop only (absolute around the watch) */}
        <FeatureColumn features={FEATURES_LEFT} side="left" />
        <FeatureColumn features={FEATURES_RIGHT} side="right" />
      </div>

      {/* Feature list — mobile / tablet (stacked grid below the watch) */}
      <div className="lg:hidden w-full max-w-2xl mx-auto px-6 mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
        {ALL_FEATURES.map((feature) => (
          <div key={feature.title} className="text-center sm:text-left">
            <h4 className="font-bold mb-1.5 text-[15px]">{feature.title}</h4>
            <p className="text-gray-400 text-[13px] leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-14 lg:mt-16 px-10 py-3.5 border border-gray-300 rounded-[30px] font-medium text-[15px] hover:bg-gray-50 transition-colors z-20 bg-white cursor-pointer">
        Shop Now
      </button>
    </section>
  );
}

/* ── Feature Column Sub-component (desktop annotations) ─────── */

function FeatureColumn({
  features,
  side,
}: {
  features: Feature[];
  side: "left" | "right";
}) {
  const isLeft = side === "left";

  return (
    <div
      className={`hidden lg:flex absolute ${isLeft ? "left-8" : "right-8"} top-1/4 flex-col gap-[120px]`}
    >
      {features.map((feature) => (
        <div
          key={feature.title}
          className={`${isLeft ? "text-right" : "text-left"} max-w-[200px] relative ${feature.offsetClass ?? ""}`}
        >
          <div
            className={`w-10 h-0.5 bg-gray-300 absolute ${isLeft ? "-right-14" : "-left-14"} top-2`}
          />
          <h4 className="font-bold mb-1 text-[15px]">{feature.title}</h4>
          <p className="text-gray-400 text-[13px] leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
