import PrototypeCrop from "@/components/ui/PrototypeCrop";
import { FEATURES_LEFT, FEATURES_RIGHT } from "@/data/constants";
import type { Feature } from "@/types";

const WATCH_IMAGE = "/prototype-assets/feature-watch.png";

export default function CentralFeature() {
  return (
    <section className="relative mx-auto min-h-[760px] max-w-7xl overflow-hidden px-6 py-16 md:min-h-[780px] md:px-12">
      <div className="pointer-events-none absolute left-1/2 top-[13%] -translate-x-1/2 select-none font-serif text-[clamp(150px,25vw,310px)] leading-none tracking-[-0.07em] text-[#eeeef0]">
        ovalen
      </div>

      <div className="relative mx-auto h-[650px] max-w-[1120px] md:h-[700px]">
        <PrototypeCrop
          src={WATCH_IMAGE}
          alt="Ovalen black mesh watch"
          className="absolute left-1/2 top-[20%] z-10 aspect-[3/5] h-[60%] -translate-x-1/2"
        />

        <FeatureColumn features={FEATURES_LEFT} side="left" />
        <FeatureColumn features={FEATURES_RIGHT} side="right" />

        <button className="absolute bottom-[4%] left-1/2 z-20 -translate-x-1/2 rounded-full border border-black bg-white px-9 py-2.5 text-[14px] font-normal transition-colors hover:bg-black hover:text-white md:left-[38%]">
          Shop Now
        </button>
      </div>
    </section>
  );
}

function FeatureColumn({ features, side }: { features: Feature[]; side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div className={`absolute inset-y-[22%] hidden w-[34%] flex-col justify-between md:flex ${isLeft ? "left-0" : "right-0"}`}>
      {features.map((feature) => (
        <div
          key={feature.title}
          className={`relative max-w-[190px] ${isLeft ? "text-right" : "ml-auto text-left"}`}
        >
          <span
            className={`absolute top-[10px] h-px w-[clamp(90px,12vw,150px)] bg-[#9a9a9a] ${isLeft ? "left-[calc(100%+18px)]" : "right-[calc(100%+18px)]"}`}
          />
          <span
            className={`absolute top-[6px] h-[9px] w-[9px] rounded-full border border-black bg-white ${isLeft ? "left-[calc(100%+13px)]" : "right-[calc(100%+13px)]"}`}
          />
          <h3 className="text-[14px] font-semibold leading-none">{feature.title}</h3>
          <p className="mt-2 text-[12px] leading-[1.45] text-[#a1a1a1]">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
