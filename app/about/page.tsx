import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Our Story | Ovalen",
  description: "Ovalen curates independent and iconic watches, authenticated by specialists for a lifetime of collecting.",
};

export default function AboutPage() {
  return (
    <LegalLayout
      title="Our Story"
      updated="June 2026"
      intro="Ovalen is a curated house for independent and iconic timepieces — chosen with a collector's eye and authenticated for a lifetime of wear."
    >
      <LegalSection heading="Why we exist">
        <p>Great watches outlive trends. We started Ovalen to make buying one feel as considered as the watches themselves — no noise, no doubt about authenticity, just pieces worth keeping.</p>
      </LegalSection>

      <LegalSection heading="How we choose">
        <p>We favour independent and iconic houses over hype. Every reference is selected for its design, mechanics, and lasting appeal, whether new or carefully sourced pre-owned.</p>
      </LegalSection>

      <LegalSection heading="Authenticated, always">
        <p>Each timepiece is inspected and authenticated by our specialists before it reaches you, and protected by our warranty. Authenticity isn't a feature — it's the foundation.</p>
      </LegalSection>

      <LegalSection heading="A considered service">
        <p>From sourcing a specific reference to arranging a private viewing, our concierge is here for the details. Reach us any time at concierge@ovalen.com.</p>
      </LegalSection>
    </LegalLayout>
  );
}
