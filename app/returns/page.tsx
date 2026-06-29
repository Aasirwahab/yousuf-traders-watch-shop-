import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Yusuf Traders",
  description: "Yusuf Traders's 14-day return policy and how to start a return or exchange.",
};

export default function ReturnsPage() {
  return (
    <LegalLayout
      title="Returns & Exchanges"
      updated="June 2026"
      intro="We want you to be certain about your timepiece. If it isn't right, you may return it within 14 days of receipt."
    >
      <LegalSection heading="Return window">
        <p>You have 14 days from the date you receive your order to request a return.</p>
      </LegalSection>

      <LegalSection heading="Condition">
        <p>Returned watches must be unworn and in their original condition, with all packaging, documentation, tags, and protective seals intact. Watches showing signs of wear or alteration cannot be accepted.</p>
      </LegalSection>

      <LegalSection heading="How to start a return">
        <p>Email concierge@yusuftraders.com with your order number. We will confirm the return and provide insured return shipping instructions — please do not ship a watch back without confirmation.</p>
      </LegalSection>

      <LegalSection heading="Refunds">
        <p>Once we receive and inspect the returned watch, we will issue your refund to the original payment method, typically within 5–10 business days.</p>
      </LegalSection>

      <LegalSection heading="Exchanges">
        <p>To exchange for a different reference, start a return and place a new order. Our concierge can help reserve the replacement while your return is processed.</p>
      </LegalSection>
    </LegalLayout>
  );
}
