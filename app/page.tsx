import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import CentralFeature from "@/components/sections/CentralFeature";
import ShopSection from "@/components/sections/ShopSection";
import TechSection from "@/components/sections/TechSection";
import ArticleSection from "@/components/sections/ArticleSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white text-black font-sans overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <CentralFeature />
      <ShopSection />
      <TechSection />
      <ArticleSection />
      <Footer />
    </main>
  );
}
