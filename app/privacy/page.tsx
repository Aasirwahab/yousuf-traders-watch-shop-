import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Ovalen",
  description: "How Ovalen collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="June 2026"
      legalNote
      intro="This policy explains what personal data Ovalen collects, why we collect it, and the choices you have. It applies to ovalen.com and our checkout."
    >
      <LegalSection heading="Who we are">
        <p>
          Ovalen ([legal entity name], [registered address]) is the data controller for personal data processed through
          this site. For any privacy question, contact us at concierge@ovalen.com.
        </p>
      </LegalSection>

      <LegalSection heading="Data we collect">
        <p>We collect only what we need to run the store:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="text-black">Account details</span> — name and email, managed through our authentication provider (Clerk) when you create an account or sign in.</li>
          <li><span className="text-black">Order details</span> — shipping name, address, phone (optional), email, and the items you order.</li>
          <li><span className="text-black">Technical data</span> — a small number of cookies needed to keep your cart and session working (see our Cookie Policy).</li>
        </ul>
        <p>We do not knowingly collect data from anyone under 18.</p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <p>To process and deliver your orders, provide order history and customer support, prevent fraud and abuse, and meet legal and accounting obligations. We do not sell your personal data.</p>
      </LegalSection>

      <LegalSection heading="Who we share it with">
        <p>We share data only with service providers that help us operate, under appropriate safeguards:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Clerk — account authentication.</li>
          <li>Neon (PostgreSQL) — secure database hosting for orders and accounts.</li>
          <li>ImageKit — product image delivery.</li>
          <li>PayPal — payment processing (once enabled). Payment card details are handled by the processor, not stored by us.</li>
          <li>Shipping and logistics partners — to deliver your order.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <p>Order records are retained as long as needed to fulfil the order and to meet tax and legal requirements. Account data is kept until you ask us to delete your account.</p>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>Depending on where you live, you may have the right to access, correct, delete, or export your personal data, and to object to certain processing. To exercise any of these, email concierge@ovalen.com and we will respond within the time required by [applicable law].</p>
      </LegalSection>

      <LegalSection heading="Security">
        <p>Data is transmitted over encrypted connections (HTTPS) and stored with reputable providers. No method of transmission is perfectly secure, but we take reasonable measures to protect your information.</p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>We may update this policy from time to time. The “last updated” date above reflects the latest version.</p>
      </LegalSection>
    </LegalLayout>
  );
}
