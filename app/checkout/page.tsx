import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CheckoutForm from "@/components/sections/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout | Ovalen",
};

export default async function CheckoutPage() {
  const user = await currentUser();
  const prefillEmail = user?.primaryEmailAddress?.emailAddress ?? undefined;

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <CheckoutForm prefillEmail={prefillEmail} />
      <Footer />
    </main>
  );
}
