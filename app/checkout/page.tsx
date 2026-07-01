import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/sections/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Yusuf Traders",
};

export default async function CheckoutPage() {
  const user = await currentUser();
  const prefillEmail = user?.primaryEmailAddress?.emailAddress ?? undefined;

  return (
    <main className="min-h-screen bg-[#eef0ef] text-[#101416]">
      <Navbar />
      <CheckoutForm prefillEmail={prefillEmail} />
      <Footer />
    </main>
  );
}
