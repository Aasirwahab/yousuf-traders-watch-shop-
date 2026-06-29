import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { IMAGES } from "@/data/images";

const SERVICES = [
  {
    number: "01",
    title: "Compare references",
    copy: "Shortlist the right case size, dial, movement and price range with a specialist.",
  },
  {
    number: "02",
    title: "Review condition",
    copy: "Understand provenance, wear, service history and authentication notes before you decide.",
  },
  {
    number: "03",
    title: "Arrange secure delivery",
    copy: "Coordinate insured delivery, handover details and aftercare for your chosen timepiece.",
  },
];

export default function ConciergeSection() {
  return (
    <section id="concierge" className="border-b border-black/10 px-6 py-14 md:px-[4.5%] md:py-20">
      <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
        <div className="relative min-h-[430px] overflow-hidden rounded-[8px] bg-[#efefed] md:min-h-[620px]">
          <Image
            src={IMAGES.concierge}
            alt="Specialist inspecting a luxury watch"
            fill
            unoptimized
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover object-[52%_86%]"
          />
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 border-t border-white/25 bg-black/55 text-white backdrop-blur-sm">
            <ProofPoint value="24h" label="Response" />
            <ProofPoint value="1:1" label="Guidance" />
            <ProofPoint value="100%" label="Insured" />
          </div>
        </div>

        <div className="flex flex-col justify-between border-y border-black/10 py-10 lg:py-12 lg:pl-[7%]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#6b1824]">Concierge service</p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2.3rem,3.25vw,3.3rem)] font-normal leading-[1.05] tracking-[-0.055em]">
              Need help choosing the right watch?
            </h2>
            <p className="mt-7 max-w-2xl text-[15px] leading-6 text-[#6e6e6b]">
              Yusuf Traders helps you compare models, understand condition, confirm fit and choose confidently before you commit.
            </p>
          </div>

          <div className="mt-12 border-t border-black/10">
            {SERVICES.map((service) => (
              <div key={service.title} className="grid gap-5 border-b border-black/10 py-7 sm:grid-cols-[72px_1fr]">
                <span className="text-[11px] font-medium tracking-[0.16em] text-[#6b1824]">{service.number}</span>
                <div>
                  <h3 className="text-xl tracking-[-0.025em]">{service.title}</h3>
                  <p className="mt-3 max-w-xl text-[12px] leading-5 text-[#777773]">{service.copy}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <a
              href="mailto:concierge@yousuftrade.store?subject=Private%20watch%20consultation"
              className="inline-flex min-h-13 items-center justify-center gap-3 bg-black px-6 text-sm text-white transition-colors hover:bg-[#6b1824] focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <MessageCircle className="h-4 w-4 stroke-[1.4]" />
              Speak with a specialist
            </a>
            <Link href="#shop" className="inline-flex w-fit items-center gap-6 border-b border-black pb-2 text-sm">
              Return to collection
              <ArrowRight className="h-4 w-4 stroke-[1.4]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-white/20 px-4 py-4 last:border-r-0 md:px-6">
      <p className="text-xl tracking-[-0.04em]">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/55">{label}</p>
    </div>
  );
}
