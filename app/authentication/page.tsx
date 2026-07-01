import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Authentication | Yusuf Traders",
  description: "How Yusuf Traders authenticates every timepiece — the checks behind our guarantee.",
};

export default function AuthenticationPage() {
  return (
    <LegalLayout
      title="Authentication"
      updated="June 2026"
      intro="Every watch we sell is inspected and authenticated by our specialists before it reaches you. Authenticity is guaranteed."
    >
      <LegalSection heading="Specialist inspection">
        <p>Each timepiece is examined in person by a trained watchmaker, who verifies the case, dial, hands, crown, and bracelet against the manufacturer&apos;s reference.</p>
      </LegalSection>

      <LegalSection heading="Movement verification">
        <p>We open and inspect the movement to confirm it is genuine, correct for the reference, and running within specification.</p>
      </LegalSection>

      <LegalSection heading="Documentation & history">
        <p>Where available, we review box, papers, and service history. For pre-owned watches we assess condition honestly and disclose it before dispatch — no surprises.</p>
      </LegalSection>

      <LegalSection heading="Our guarantee">
        <p>If any watch is ever found not to be authentic as described, we will make it right. Authenticity is the foundation of everything we sell.</p>
      </LegalSection>
    </LegalLayout>
  );
}
