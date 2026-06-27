import type { Metadata } from "next";
import LegalLayout from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "FAQ | Ovalen",
  description: "Answers to common questions about buying, shipping, returns, and authentication at Ovalen.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are your watches authentic?",
    a: "Yes. Every timepiece is inspected and authenticated by our specialists before dispatch, and authenticity is guaranteed. See our Authentication page for the full process.",
  },
  {
    q: "Do you sell pre-owned watches?",
    a: "We do. Pre-owned pieces are fully authenticated, and their condition is honestly assessed and disclosed before you buy.",
  },
  {
    q: "How is my order shipped?",
    a: "All orders ship fully insured and tracked, with a signature required on delivery. Timeframes and costs are shown at checkout.",
  },
  {
    q: "What is your return policy?",
    a: "You can return an unworn watch in its original condition within 14 days of receipt. See our Returns & Exchanges page to start a return.",
  },
  {
    q: "Is there a warranty?",
    a: "Yes — every watch includes a 12-month Ovalen warranty covering movement and manufacturing defects under normal use.",
  },
  {
    q: "How do I pay?",
    a: "Checkout is secured by our payment provider. Card details are handled by the processor and never stored by us.",
  },
  {
    q: "Can you source a specific reference?",
    a: "Often, yes. Contact our concierge at concierge@ovalen.com with the reference you're looking for and we'll do our best to source it.",
  },
];

export default function FaqPage() {
  return (
    <LegalLayout
      title="FAQ"
      updated="June 2026"
      intro="Answers to the questions we hear most. Can't find what you need? Email concierge@ovalen.com."
    >
      <div className="divide-y divide-black/10 border-y border-black/10">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-medium marker:hidden">
              {item.q}
              <span aria-hidden="true" className="text-lg font-light transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#555550]">{item.a}</p>
          </details>
        ))}
      </div>
    </LegalLayout>
  );
}
