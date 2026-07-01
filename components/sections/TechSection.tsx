import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/data/images";

const STEPS = [
  { number: "01", title: "Inspect", copy: "Case, movement and condition are examined by a specialist." },
  { number: "02", title: "Authenticate", copy: "Reference details and provenance are independently verified." },
  { number: "03", title: "Protect", copy: "The watch is documented and covered for twenty-four months." },
];

export default function TechSection() {
  return (
    <section id="authentication" className="bg-[#0f252b] text-[#eef0ef]">
      <div className="grid min-h-[650px] md:grid-cols-[38%_62%]">
        <div className="relative min-h-[360px] overflow-hidden md:min-h-full">
          <Image src={IMAGES.techWatch} alt="Watch inspected from the side" fill sizes="(min-width: 768px) 38vw, 100vw" className="scale-110 object-cover" />
          <div className="absolute inset-0 bg-[#0f252b]/25" />
        </div>
        <div className="flex flex-col justify-center px-6 py-16 md:px-[9%] md:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#7e8c93]">The Yusuf Traders standard</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[0.95] tracking-[-0.055em]">Every watch,<br />verified.</h2>
          <p className="mt-7 max-w-xl text-[15px] leading-6 text-[#cbd2d2]/75">Each timepiece is inspected by specialists, documented, and protected by our two-year warranty.</p>
          <ol className="mt-12 grid gap-8 border-t border-[#7e8c93]/30 pt-8 lg:grid-cols-3">
            {STEPS.map((step) => <li key={step.title}><span className="text-[11px] tracking-[0.16em] text-[#7e8c93]">{step.number}</span><h3 className="mt-3 text-xl">{step.title}</h3><p className="mt-3 text-[12px] leading-5 text-[#cbd2d2]/65">{step.copy}</p></li>)}
          </ol>
          <Link href="#story" className="mt-12 flex w-fit items-center gap-8 border-b border-[#7e8c93]/70 pb-2 text-sm text-[#eef0ef]">Our authentication standard <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
