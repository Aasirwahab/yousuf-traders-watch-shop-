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
import { CommerceProvider } from "@/components/providers/CommerceProvider";

export default function Home() {
  return (
    <CommerceProvider>
      <main className="min-h-screen overflow-x-clip bg-white font-sans text-black md:rounded-t-[14px] md:border-x-[3px] md:border-t-[3px] md:border-black">
        <Navbar />
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
    </CommerceProvider>
  );
}
