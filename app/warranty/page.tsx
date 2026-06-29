import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Warranty | Yusuf Traders",
  description: "Every Yusuf Traders timepiece includes a 12-month warranty. Here's what it covers.",
};

export default function WarrantyPage() {
  return (
    <LegalLayout
      title="Warranty"
      updated="June 2026"
      intro="Every authenticated Yusuf Traders timepiece is protected by a 12-month warranty from the date of delivery."
    >
      <LegalSection heading="What's covered">
        <p>The warranty covers defects in the movement and manufacturing under normal use — for example, a watch that stops keeping accurate time through no fault of the wearer.</p>
      </LegalSection>

      <LegalSection heading="What's not covered">
        <p>Normal wear to the case, crystal, strap, or bracelet; damage from accidents, misuse, or water exposure beyond the stated resistance; and any servicing or modification carried out by a third party are not covered.</p>
      </LegalSection>

      <LegalSection heading="Making a claim">
        <p>Contact concierge@yusuftraders.com with your order number and a description of the issue. We will assess the watch and arrange a repair or replacement as appropriate.</p>
      </LegalSection>

      <LegalSection heading="Servicing">
        <p>We recommend a routine mechanical service every 4–5 years to keep your timepiece running at its best. Our concierge can advise on service options.</p>
      </LegalSection>
    </LegalLayout>
  );
}
