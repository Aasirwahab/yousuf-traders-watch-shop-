import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CentralFeature from "@/components/sections/CentralFeature";
import ShopSection from "@/components/sections/ShopSection";
import TechSection from "@/components/sections/TechSection";
import ArticleSection from "@/components/sections/ArticleSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    // Full-bleed white page — content runs edge-to-edge (no centered card,
    // margins or rounded corners), so the hero fills the screen.
    <main className="min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <div className="w-full bg-white overflow-hidden">
        <HeroSection />
        <AboutSection />
        <CentralFeature />
        <ShopSection />
        <TechSection />
        <ArticleSection />
        <Footer />
      </div>
    </main>
  );
}
