import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Shipping & Delivery | Yusuf Traders",
  description: "How Yusuf Traders ships and delivers your timepiece — insured, tracked, and signature-required.",
};

export default function ShippingPage() {
  return (
    <LegalLayout
      title="Shipping & Delivery"
      updated="June 2026"
      intro="Every Yusuf Traders timepiece ships fully insured and tracked, with a signature required on delivery."
    >
      <LegalSection heading="Delivery methods">
        <p>At checkout you can choose between our standard insured delivery and an expedited option. Costs and estimated timeframes are shown before you place your order.</p>
      </LegalSection>

      <LegalSection heading="Processing time">
        <p>Orders are prepared and authenticated before dispatch, which typically takes 1–2 business days. You will receive tracking details once your watch is on its way.</p>
      </LegalSection>

      <LegalSection heading="Insurance & signature">
        <p>All shipments are insured for their full value while in transit and require an adult signature on delivery. Risk passes to you once the watch is delivered.</p>
      </LegalSection>

      <LegalSection heading="International orders">
        <p>We ship worldwide. Import duties and taxes may apply depending on your destination and are the responsibility of the recipient unless stated otherwise at checkout.</p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>For a specific delivery request or to arrange a private collection, contact our concierge at concierge@yusuftraders.com.</p>
      </LegalSection>
    </LegalLayout>
  );
}
