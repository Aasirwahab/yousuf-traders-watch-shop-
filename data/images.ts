import { imageKitUrl } from "@/lib/imagekit-url";

export const IMAGES = {
  hero: imageKitUrl("/ovalen/hero-image.png"),
  prototypeDesign: imageKitUrl("/ovalen/prototype-design.webp"),
  article: {
    lead: imageKitUrl("/ovalen/prototype-assets/article-lead.webp"),
    sideTop: imageKitUrl("/ovalen/prototype-assets/article-side.webp"),
    sideBottom: imageKitUrl("/ovalen/prototype-assets/article-face.webp"),
  },
  categories: [
    imageKitUrl("/ovalen/prototype-assets/category-modern.webp"),
    imageKitUrl("/ovalen/prototype-assets/category-limited.webp"),
    imageKitUrl("/ovalen/prototype-assets/category-chronograph.webp"),
    imageKitUrl("/ovalen/prototype-assets/category-classic.webp"),
  ],
  featureWatch: imageKitUrl("/ovalen/prototype-assets/feature-watch.png"),
  products: [
    imageKitUrl("/ovalen/prototype-assets/product-louis.webp"),
    imageKitUrl("/ovalen/prototype-assets/product-roger.webp"),
    imageKitUrl("/ovalen/prototype-assets/product-jean.webp"),
    imageKitUrl("/ovalen/prototype-assets/product-seiko.webp"),
  ],
  techWatch: imageKitUrl("/ovalen/prototype-assets/tech-watch.webp"),
} as const;
