import PrototypeCrop from "@/components/ui/PrototypeCrop";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";

const TECH_IMAGE = "/prototype-assets/tech-watch.webp";

export default function TechSection() {
  return (
    <section className="px-6 py-16 md:px-[calc(3.93%_+_6px)] md:py-20">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-0">
        <div className="max-w-[480px]">
          <Reveal>
            <h2 className="text-[34px] font-normal leading-[1.08] tracking-[-0.035em] md:text-[40px]">
              Advanced technology
              <br />
              applied to Ovalen watches
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-[455px] text-[15px] leading-[1.5] text-[#929292]">
              Advanced technology applied to Ovalen watches has enabled the creation of timepieces that not only boast exquisite craftsmanship but also offer unparalleled precision, durability, and functionality, setting new standards in horological innovation and luxury.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <button className="mt-10 rounded-full border border-black bg-white px-8 py-2.5 text-[13px] transition-colors hover:bg-black hover:text-white">
              Shop Now
            </button>
          </Reveal>
        </div>

        <MaskReveal className="w-full rounded-[16px]" from="left" delay={0.1}>
          <PrototypeCrop src={TECH_IMAGE} alt="Ovalen watch technology detail" className="aspect-square w-full rounded-[16px] bg-[#fafafa]" />
        </MaskReveal>
      </div>
    </section>
  );
}
