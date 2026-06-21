import PrototypeCrop from "@/components/ui/PrototypeCrop";
import { MaskReveal, Reveal } from "@/components/ui/Reveal";

const ARTICLE_CROPS = {
  lead: "/prototype-assets/article-lead.webp",
  sideTop: "/prototype-assets/article-side.webp",
  sideBottom: "/prototype-assets/article-face.webp",
};

export default function ArticleSection() {
  return (
    <section className="px-6 py-16 md:px-[calc(3.93%_+_6px)] md:py-20">
      <div className="mb-10 flex items-center justify-between">
        <Reveal><h2 className="text-[32px] font-normal tracking-[-0.035em] md:text-[40px]">New Article</h2></Reveal>
        <Reveal delay={0.1}><button className="rounded-full bg-black px-8 py-2.5 text-[13px] text-white transition-colors hover:bg-[#222]">View More</button></Reveal>
      </div>

      <div className="grid gap-[14px] md:grid-cols-2">
        <MaskReveal className="rounded-[16px]" from="left">
          <article className="group relative h-[430px] overflow-hidden rounded-[16px] md:h-[440px]">
            <PrototypeCrop src={ARTICLE_CROPS.lead} alt="Luxury watch movement" className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[92px] bg-gradient-to-t from-black via-black/95 to-transparent" />
            <button className="absolute left-[47%] top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#777]/95 text-[13px] text-white">Learn more</button>
            <div className="absolute bottom-7 left-7 right-7 text-white">
              <h3 className="text-[20px] font-normal tracking-[-0.02em] md:text-[22px]">5 Gibran&apos;s Luxury Watch Collection</h3>
              <p className="mt-2 max-w-[430px] text-[12px] leading-[1.35]">Here&apos;s Gibran Rakabuming&apos;s collection of luxury watches, the number two vice president in the 2024 Election.</p>
            </div>
          </article>
        </MaskReveal>

        <Reveal className="grid min-h-[430px] gap-[14px] md:min-h-[440px] md:grid-rows-2" delay={0.14} distance={40}>
          <PrototypeCrop src={ARTICLE_CROPS.sideTop} alt="Ovalen watch side profile" className="h-full w-full rounded-[16px] bg-[#fafafa]" />
          <PrototypeCrop src={ARTICLE_CROPS.sideBottom} alt="Ovalen black watch face" className="h-full w-full rounded-[16px] bg-[#fafafa]" />
        </Reveal>
      </div>
    </section>
  );
}
