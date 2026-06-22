import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/data/images";

const STORIES = [
  { image: IMAGES.article.lead, category: "Guides", time: "6 min read", title: "How to buy your first mechanical watch" },
  { image: IMAGES.article.sideTop, category: "Materials", time: "5 min read", title: "A collector’s guide to case materials" },
  { image: IMAGES.article.sideBottom, category: "Care", time: "4 min read", title: "Keeping perfect time: care and servicing" },
];

export default function ArticleSection() {
  return (
    <section id="journal" className="border-b border-black/10 px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-6"><div><p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b1824]">Stories and expertise</p><h2 className="mt-3 text-[clamp(2.3rem,4vw,4rem)] tracking-[-0.045em]">From the journal</h2></div><Link href="#newsletter" className="hidden items-center gap-3 border-b border-black pb-1 text-sm md:flex">Receive journal notes <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <Story story={STORIES[0]} lead />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
            {STORIES.slice(1).map((story) => <Story key={story.title} story={story} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Story({ lead = false, story }: { lead?: boolean; story: (typeof STORIES)[number] }) {
  return (
    <article className={lead ? "group" : "group grid gap-5 sm:grid-cols-[48%_52%] lg:grid-cols-[48%_52%]"}>
      <div className={`relative overflow-hidden rounded-[16px] bg-[#f1f1ef] ${lead ? "aspect-[1.5]" : "aspect-[1.4] sm:aspect-auto sm:min-h-[210px]"}`}><Image src={story.image} alt="" fill sizes={lead ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 20vw, 50vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" /></div>
      <div className={lead ? "mt-6 flex items-end justify-between gap-5" : "flex flex-col justify-center"}>
        <div><p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#6e6e6b]">{story.category} · {story.time}</p><h3 className={`mt-3 tracking-[-0.03em] ${lead ? "text-[clamp(1.5rem,2.6vw,2.6rem)]" : "text-xl"}`}>{story.title}</h3></div>
        <ArrowRight aria-hidden="true" className="mb-1 hidden h-5 w-5 shrink-0 text-[#6b1824] sm:block" />
      </div>
    </article>
  );
}
