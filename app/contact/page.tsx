import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Yusuf Traders",
  description: "Reach the Yusuf Traders concierge for enquiries about availability, authentication, and private viewings.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#eef0ef] text-[#101416]">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#687276]">Concierge</p>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.98] tracking-[-0.05em]">
          Get in touch.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[#687276]">
          Questions about a piece, authentication, or a private viewing? Send a message and our concierge
          will reply by email. You can also reach us directly at{" "}
          <a href="mailto:concierge@yousuftrade.store" className="font-medium text-[#101416] underline underline-offset-4">
            concierge@yousuftrade.store
          </a>.
        </p>

        <ContactForm />
      </section>
      <Footer />
    </main>
  );
}
