"use client";

import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { useState } from "react";

const REVIEWS = [
  { quote: "The condition report was exact, delivery was discreet, and the watch arrived ready to wear.", name: "Marcus L.", location: "London" },
  { quote: "Yusuf Traders made a considered purchase feel effortless. Every question was answered with real expertise.", name: "Amelia R.", location: "Singapore" },
  { quote: "The authentication notes gave me the confidence to acquire a reference I had searched for for years.", name: "Daniel K.", location: "Copenhagen" },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const review = REVIEWS[index];
  const move = (direction: number) => setIndex((current) => (current + direction + REVIEWS.length) % REVIEWS.length);

  return (
    <section id="story" className="border-b border-[#cbd2d2] px-6 py-20 md:px-[4.5%] md:py-28">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-[30%_70%] md:gap-0">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#16343d]">Collector experience</p>
          <h2 className="mt-3 text-[clamp(2.2rem,3.8vw,3.8rem)] tracking-[-0.045em]">Trusted by collectors.</h2>
          <div className="mt-8 flex items-center gap-2"><span className="text-lg font-medium">4.9</span><span className="flex text-[#16343d]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</span></div>
          <p className="mt-1 text-[11px] text-[#687276]">From verified buyers</p>
        </div>

        <div aria-live="polite" className="border-l-0 border-[#cbd2d2] md:border-l md:pl-[10%]">
          <blockquote className="max-w-4xl text-[clamp(1.8rem,3.4vw,3.7rem)] leading-[1.08] tracking-[-0.04em]">“{review.quote}”</blockquote>
          <div className="mt-10 flex items-end justify-between gap-5">
            <p className="text-sm"><span className="font-medium">{review.name}</span> <span className="text-[#687276]">— {review.location}</span></p>
            <div className="flex gap-2">
              <button type="button" onClick={() => move(-1)} aria-label="Previous review" className="grid h-12 w-12 place-items-center rounded-full border border-[#cbd2d2] hover:border-[#0f252b] focus-visible:outline-2 focus-visible:outline-offset-2"><ArrowLeft className="h-4 w-4" /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next review" className="grid h-12 w-12 place-items-center rounded-full border border-[#16343d] text-[#16343d] hover:bg-[#16343d] hover:text-[#eef0ef] focus-visible:outline-2 focus-visible:outline-offset-2"><ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
