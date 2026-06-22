import { BadgeCheck, Globe2, RotateCcw, ShieldCheck } from "lucide-react";

const ITEMS = [
  { icon: BadgeCheck, title: "Authenticated by specialists" },
  { icon: ShieldCheck, title: "24-month warranty" },
  { icon: Globe2, title: "Insured worldwide delivery" },
  { icon: RotateCcw, title: "14-day returns" },
];

export default function TrustStrip() {
  return (
    <section id="trust" aria-label="Purchase guarantees" className="border-b border-black/10 bg-white px-6 md:px-0">
      <div className="grid grid-cols-2 py-5 md:h-[124px] md:grid-cols-4 md:py-0">
        {ITEMS.map(({ icon: Icon, title }, index) => (
          <div key={title} className={`flex items-center gap-4 py-4 md:justify-center md:gap-6 md:px-5 ${index % 2 ? "border-l border-black/10 pl-5" : "pr-5"} ${index > 1 ? "border-t border-black/10 md:border-t-0" : ""} ${index > 0 ? "md:border-l md:border-black/10" : ""}`}>
            <Icon aria-hidden="true" className="h-9 w-9 shrink-0 stroke-[1.15] md:translate-x-7" />
            <h2 className="max-w-[130px] text-[12px] font-normal leading-4 md:translate-x-7">{title}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}
