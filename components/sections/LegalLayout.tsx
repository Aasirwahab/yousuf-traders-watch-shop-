import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LegalLayout({
  title,
  updated,
  intro,
  legalNote = false,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  legalNote?: boolean;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 pb-24 pt-8 md:px-8 md:pt-12">
        <div className="text-[11px] text-[#6e6e6b]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="px-2">/</span>
          <span>{title}</span>
        </div>

        <h1 className="mt-7 text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[0.95] tracking-[-0.05em]">{title}</h1>
        <p className="mt-4 text-[12px] text-[#8a8a86]">Last updated {updated}</p>
        {intro ? <p className="mt-6 max-w-xl text-sm leading-7 text-[#555550]">{intro}</p> : null}

        <div className="mt-10 space-y-9">{children}</div>

        {legalNote ? (
          <p className="mt-14 rounded-[12px] border border-black/10 bg-[#f7f7f5] p-5 text-[12px] leading-6 text-[#6e6e6b]">
            This page is a general template, not legal advice. Have it reviewed by a qualified professional and complete the
            bracketed details (legal entity, registered address, governing law) before accepting real payments.
          </p>
        ) : null}
      </section>
      <Footer />
    </main>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-black">{heading}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-[#555550]">{children}</div>
    </section>
  );
}
