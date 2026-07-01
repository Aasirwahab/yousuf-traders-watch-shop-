import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import AboutSection from "@/components/sections/AboutSection";
import CentralFeature from "@/components/sections/CentralFeature";
import ShopSection from "@/components/sections/ShopSection";
import TechSection from "@/components/sections/TechSection";
import ConciergeSection from "@/components/sections/ConciergeSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import { getAllProducts } from "@/lib/products";

export default async function Home() {
  const products = await getAllProducts();
  return (
    <main className="min-h-screen overflow-x-clip bg-[#eef0ef] font-sans text-[#101416]">
      <Navbar overlay />
      <HeroSection />
      <TrustStrip />
      <ShopSection products={products} />
      <AboutSection />
      <CentralFeature />
      <TechSection />
      <TestimonialsSection />
      <ConciergeSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
