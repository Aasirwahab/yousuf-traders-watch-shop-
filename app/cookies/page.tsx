import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/sections/LegalLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | Yusuf Traders",
  description: "The cookies Yusuf Traders uses and how to control them.",
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Policy"
      updated="June 2026"
      legalNote
      intro="This policy explains the cookies and similar technologies we use, and the choices you have over them."
    >
      <LegalSection heading="What cookies are">
        <p>Cookies are small files stored on your device. We use them to keep the site working and to remember your cart and session.</p>
      </LegalSection>

      <LegalSection heading="Cookies we use">
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="text-[#101416]">Essential — cart &amp; orders.</span> A cookie keeps your shopping bag and lets you view orders you placed in this browser. The site cannot function without it.</li>
          <li><span className="text-[#101416]">Essential — authentication.</span> Our provider (Clerk) sets cookies to keep you securely signed in to your account.</li>
        </ul>
        <p>We do not currently use advertising or third-party tracking cookies. If we add analytics in future, we will update this policy and ask for consent where required.</p>
      </LegalSection>

      <LegalSection heading="Managing cookies">
        <p>You can delete or block cookies through your browser settings. Note that blocking essential cookies will stop the cart, checkout, and sign-in from working.</p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>We may update this policy as our use of cookies changes. The “last updated” date above reflects the latest version.</p>
      </LegalSection>
    </LegalLayout>
  );
}
