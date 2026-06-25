import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import AboutSection from "@/components/sections/AboutSection";
import CentralFeature from "@/components/sections/CentralFeature";
import ShopSection from "@/components/sections/ShopSection";
import TechSection from "@/components/sections/TechSection";
import ArticleSection from "@/components/sections/ArticleSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import NewsletterSection from "@/components/sections/NewsletterSection";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip bg-white font-sans text-black">
      <Navbar overlay />
      <HeroSection />
      <TrustStrip />
      <ShopSection />
      <AboutSection />
      <CentralFeature />
      <TechSection />
      <TestimonialsSection />
      <ArticleSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
