import PrototypeCrop from "@/components/ui/PrototypeCrop";
import { FEATURES_LEFT, FEATURES_RIGHT } from "@/data/constants";
import type { Feature } from "@/types";

const WATCH_IMAGE = "/prototype-assets/feature-watch.png";

export default function CentralFeature() {
  return (
    <section className="relative mx-auto mt-10 min-h-[680px] max-w-7xl overflow-hidden px-6 py-12 md:mt-14 md:min-h-[650px] md:px-12">
      <div className="pointer-events-none absolute left-1/2 top-[-4%] -translate-x-1/2 select-none font-serif text-[clamp(150px,23vw,270px)] leading-none tracking-[-0.065em] text-[#e9e9ec]">
        ovalen
      </div>

      <div className="relative mx-auto h-[590px] max-w-[960px] md:h-[560px]">
        <FeatureConnectors />

        <PrototypeCrop
          src={WATCH_IMAGE}
          alt="Ovalen black mesh watch"
          className="absolute left-1/2 top-[14%] z-10 aspect-[3/5] h-[72%] -translate-x-1/2"
        />

        <FeatureColumn features={FEATURES_LEFT} side="left" />
        <FeatureColumn features={FEATURES_RIGHT} side="right" />
      </div>
    </section>
  );
}

function FeatureConnectors() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full md:block"
      viewBox="0 0 960 560"
      preserveAspectRatio="none"
    >
      <g fill="none" stroke="#8f8f8f" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <polyline points="185,185 350,185 405,245" />
        <polyline points="185,310 406,310" />
        <polyline points="185,415 320,415 405,340" />
        <polyline points="775,185 610,185 555,245" />
        <polyline points="775,310 554,310" />
        <polyline points="775,415 640,415 555,340" />
      </g>
      <g fill="white" stroke="#111" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {[185, 310, 415].map((y) => <circle key={`left-${y}`} cx="185" cy={y} r="4.5" />)}
        {[185, 310, 415].map((y) => <circle key={`right-${y}`} cx="775" cy={y} r="4.5" />)}
      </g>
      <g fill="#111">
        <circle cx="405" cy="245" r="2.25" />
        <circle cx="406" cy="310" r="2.25" />
        <circle cx="405" cy="340" r="2.25" />
        <circle cx="555" cy="245" r="2.25" />
        <circle cx="554" cy="310" r="2.25" />
        <circle cx="555" cy="340" r="2.25" />
      </g>
    </svg>
  );
}

function FeatureColumn({ features, side }: { features: Feature[]; side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div className={`absolute inset-y-[29.5%] hidden w-[30%] flex-col justify-between md:flex ${isLeft ? "left-[1%]" : "right-[1%]"}`}>
      {features.map((feature) => (
        <div
          key={feature.title}
          className={`relative z-20 ${isLeft ? "w-[132px] text-right" : "ml-auto w-[132px] text-left"}`}
        >
          <h3 className="text-[11px] font-semibold leading-none">{feature.title}</h3>
          <p className="mt-2 text-[9px] leading-[1.45] text-[#a1a1a1]">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
