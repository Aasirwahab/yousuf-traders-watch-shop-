import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Yusuf Traders",
  description: "The terms that govern your use of Yusuf Traders and any purchase you make.",
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms & Conditions"
      updated="June 2026"
      legalNote
      intro="These terms govern your use of yusuftraders.com and any order you place with us. By using the site or placing an order, you agree to them."
    >
      <LegalSection heading="About us">
        <p>The site is operated by Yusuf Traders ([legal entity name], [registered address]). You can reach us at concierge@yusuftraders.com.</p>
      </LegalSection>

      <LegalSection heading="Eligibility">
        <p>You must be at least 18 and able to enter a binding contract to place an order.</p>
      </LegalSection>

      <LegalSection heading="Orders and acceptance">
        <p>Placing an order is an offer to buy. A contract is formed only when we confirm acceptance and payment is completed. We may decline or cancel an order — for example if an item is no longer available, a price is clearly wrong, or we cannot verify the order — and will refund any amount already taken.</p>
      </LegalSection>

      <LegalSection heading="Pricing and payment">
        <p>Prices are shown in [currency] and may change before an order is placed. Shipping is shown at checkout; taxes and duties are calculated at the payment step. Payment is processed securely by our payment provider (PayPal, once enabled).</p>
      </LegalSection>

      <LegalSection heading="Authentication guarantee">
        <p>Every timepiece is inspected and authenticated by our specialists before dispatch. New watches are supplied unworn; pre-owned watches are fully authenticated with their condition assessed and disclosed.</p>
      </LegalSection>

      <LegalSection heading="Shipping">
        <p>We offer insured, tracked, signature-required delivery. Estimated timeframes are shown at checkout and are not guaranteed delivery dates. Risk passes to you on delivery.</p>
      </LegalSection>

      <LegalSection heading="Returns and warranty">
        <p>Returns are accepted within 14 days of receipt in original, unworn condition with all packaging. A 12-month Yusuf Traders warranty is included with every timepiece. Full details are in our Returns and Warranty information.</p>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>All content on this site — text, images, and branding — belongs to Yusuf Traders or its licensors and may not be reused without permission.</p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>To the extent permitted by law, Yusuf Traders is not liable for indirect or consequential loss. Nothing in these terms limits liability that cannot be limited under [applicable law], including your statutory consumer rights.</p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>These terms are governed by the laws of [jurisdiction], and disputes are subject to its courts.</p>
      </LegalSection>
    </LegalLayout>
  );
}
