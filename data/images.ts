import { imageKitUrl } from "@/lib/imagekit-url";

export const IMAGES = {
  hero: imageKitUrl("/ovalen/hero-image.png"),
  cinematicHero: imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch.png"),
  cinematicHeroSlides: [
    imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch.png"),
    imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch-2.png"),
    imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch-3.png"),
  ],
  cinematicHeroCutouts: [
    imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch-remove-bg.png"),
    imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch-2-bg-remove.png"),
    imageKitUrl("/ovalen/prototype-assets/hero-cinematic-watch-3-bg-remove.png"),
  ],
  mobileHeroSlides: [
    imageKitUrl("/ovalen/prototype-assets/mobile-hero-section.png"),
    imageKitUrl("/ovalen/prototype-assets/mobile-hero-section-2.png"),
    imageKitUrl("/ovalen/prototype-assets/mobile-hero-section-3.png"),
  ],
  heroSlides: [
    imageKitUrl("/ovalen/hero-image.png"),
    imageKitUrl("/ovalen/prototype-assets/hero-2.png"),
    imageKitUrl("/ovalen/prototype-assets/hero-3.png"),
  ],
  prototypeDesign: imageKitUrl("/ovalen/prototype-design.webp"),
  article: {
    lead: imageKitUrl("/ovalen/prototype-assets/article-lead.webp"),
    sideTop: imageKitUrl("/ovalen/prototype-assets/article-side.webp"),
    sideBottom: imageKitUrl("/ovalen/prototype-assets/article-face.webp"),
  },
  concierge: "/prototype-assets/concierge-service.webp",
  categories: [
    imageKitUrl("/ovalen/prototype-assets/category-modern.webp"),
    imageKitUrl("/ovalen/prototype-assets/category-limited.webp"),
    imageKitUrl("/ovalen/prototype-assets/category-chronograph.webp"),
    imageKitUrl("/ovalen/prototype-assets/category-classic.webp"),
  ],
  findWatch: {
    dial: imageKitUrl("/ovalen/prototype-assets/find-watch-dial.png"),
    crown: imageKitUrl("/ovalen/prototype-assets/find-watch-crown.png"),
    chronograph: imageKitUrl("/ovalen/prototype-assets/find-watch-chronograph.png"),
  },
  featureWatch: imageKitUrl("/ovalen/prototype-assets/feature-watch.png"),
  products: [
    imageKitUrl("/ovalen/prototype-assets/product-louis.webp"),
    imageKitUrl("/ovalen/prototype-assets/product-roger.webp"),
    imageKitUrl("/ovalen/prototype-assets/product-jean.webp"),
    imageKitUrl("/ovalen/prototype-assets/product-seiko.webp"),
  ],
  productDetail: {
    steelBlue: {
      main: imageKitUrl("/ovalen/prototype-assets/product-detail/steel-blue-main.png"),
      side: imageKitUrl("/ovalen/prototype-assets/product-detail/steel-blue-side.png"),
      bracelet: imageKitUrl("/ovalen/prototype-assets/product-detail/steel-blue-bracelet.png"),
      caseback: imageKitUrl("/ovalen/prototype-assets/product-detail/steel-blue-caseback.png"),
      wrist: imageKitUrl("/ovalen/prototype-assets/product-detail/steel-blue-wrist.png"),
      macro: imageKitUrl("/ovalen/prototype-assets/product-detail/steel-blue-macro.png"),
    },
  },
  techWatch: imageKitUrl("/ovalen/prototype-assets/tech-watch.webp"),
} as const;
