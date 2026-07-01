export const SHOP_CATEGORIES = [
  "All watches",
  "Men",
  "Ladies",
  "New arrivals",
  "Pre-owned",
  "Limited edition",
] as const;

export type ShopCategory = (typeof SHOP_CATEGORIES)[number];
export type ShopProduct = {
  slug: string;
  brand: string;
  name: string;
  reference: string;
  price: number; // whole LKR
  image: string;
  gender: "Men" | "Ladies" | "Unisex";
  collection: "Classic" | "Chronograph" | "Dress" | "Limited" | "Sport";
  condition: "New" | "Pre-owned";
  material: "Steel" | "Gold" | "Two-tone" | "Rose gold";
  dial: "Silver" | "Black" | "Navy" | "Green" | "Brown" | "Gold" | "Ivory" | "White";
  diameter: number;
  categoryTags: ShopCategory[];
  gallery?: string[];
  detailImage?: string;
  year?: number;
  waterResistance?: string;
  movement?: string;
  description?: string;
};

// Real catalog: Citizen quartz 50 m watches, one listing per colourway. Images
// live in public/product-gallery/<slug>/ and are served as local paths.
const GALLERY = "/product-gallery";

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    slug: "citizen-quartz-full-gold-50m",
    brand: "Citizen",
    name: "Quartz 50M — Full Gold",
    reference: "CTZ-Q50-FGLD",
    price: 5500,
    image: `${GALLERY}/citizen-quartz-full-gold-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-full-gold-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-full-gold-50m/02-generated-angle.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Gold",
    dial: "Gold",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "A full gold-tone Citizen quartz that makes a statement. The gold case, dial and bracelet catch light from every angle, while a 50 m water-resistant build keeps it ready for daily wear. Precise quartz movement with a clean three-hand layout.",
  },
  {
    slug: "citizen-quartz-gold-black-50m",
    brand: "Citizen",
    name: "Quartz 50M — Gold / Black",
    reference: "CTZ-Q50-GBLK",
    price: 5500,
    image: `${GALLERY}/citizen-quartz-gold-black-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-gold-black-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-gold-black-50m/02-generated-angle.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Gold",
    dial: "Black",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "Gold-tone case and bracelet framing a deep black dial — a high-contrast pairing that reads dressy or casual. Water resistant to 50 m with a reliable quartz movement and a crisp three-hand face.",
  },
  {
    slug: "citizen-quartz-gold-navy-50m",
    brand: "Citizen",
    name: "Quartz 50M — Gold / Navy",
    reference: "CTZ-Q50-GNVY",
    price: 5500,
    image: `${GALLERY}/citizen-quartz-gold-navy-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-gold-navy-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-gold-navy-50m/02-generated-angle.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Gold",
    dial: "Navy",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "Warm gold tones meet a rich navy dial for an understated, versatile look. Water resistant to 50 m with a precise quartz movement and a matching gold-tone bracelet.",
  },
  {
    slug: "citizen-quartz-gold-silver-50m",
    brand: "Citizen",
    name: "Quartz 50M — Gold / Silver",
    reference: "CTZ-Q50-GSLV",
    price: 5500,
    image: `${GALLERY}/citizen-quartz-gold-silver-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-gold-silver-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-gold-silver-50m/02-front-three-quarter.png`,
      `${GALLERY}/citizen-quartz-gold-silver-50m/03-crown-case-angle.png`,
      `${GALLERY}/citizen-quartz-gold-silver-50m/04-bracelet-case-detail.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Gold",
    dial: "Silver",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "A gold-tone case and bracelet with a bright silver dial — light, elegant and easy to pair. Water resistant to 50 m with a dependable quartz movement; an everyday classic.",
  },
  {
    slug: "citizen-quartz-brown-50m",
    brand: "Citizen",
    name: "Quartz 50M — Brown",
    reference: "CTZ-Q50-BRN",
    price: 5000,
    image: `${GALLERY}/citizen-quartz-brown-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-brown-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-brown-50m/02-front-three-quarter.png`,
      `${GALLERY}/citizen-quartz-brown-50m/03-crown-case-angle.png`,
      `${GALLERY}/citizen-quartz-brown-50m/04-bracelet-case-detail.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Steel",
    dial: "Brown",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "A warm brown dial gives this steel Citizen quartz a vintage, earthy character. Comfortable on the wrist, water resistant to 50 m, and driven by an accurate quartz movement.",
  },
  {
    slug: "citizen-quartz-green-50m",
    brand: "Citizen",
    name: "Quartz 50M — Green",
    reference: "CTZ-Q50-GRN",
    price: 5000,
    image: `${GALLERY}/citizen-quartz-green-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-green-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-green-50m/02-left-angle.png`,
      `${GALLERY}/citizen-quartz-green-50m/03-crown-angle.png`,
      `${GALLERY}/citizen-quartz-green-50m/04-bracelet-case-angle.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Steel",
    dial: "Green",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "A fresh green sunray dial set in a steel case and bracelet — distinctive without being loud. Water resistant to 50 m with a precise quartz movement; an easy daily companion.",
  },
  {
    slug: "citizen-quartz-navy-50m",
    brand: "Citizen",
    name: "Quartz 50M — Navy",
    reference: "CTZ-Q50-NVY",
    price: 5000,
    image: `${GALLERY}/citizen-quartz-navy-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-navy-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-navy-50m/02-front-three-quarter.png`,
      `${GALLERY}/citizen-quartz-navy-50m/03-crown-case-angle.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Steel",
    dial: "Navy",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "A deep navy dial on a brushed steel case and bracelet — a timeless, go-anywhere choice. Water resistant to 50 m with a reliable quartz movement.",
  },
  {
    slug: "citizen-quartz-silver-50m",
    brand: "Citizen",
    name: "Quartz 50M — Silver",
    reference: "CTZ-Q50-SLV",
    price: 5000,
    image: `${GALLERY}/citizen-quartz-silver-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-silver-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-silver-50m/02-front-three-quarter.png`,
      `${GALLERY}/citizen-quartz-silver-50m/03-crown-case-angle.png`,
      `${GALLERY}/citizen-quartz-silver-50m/04-bracelet-case-detail.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Steel",
    dial: "Silver",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "The essential all-steel Citizen quartz: a clean silver dial, polished-and-brushed bracelet, and 50 m water resistance. Understated, versatile and precise.",
  },
  {
    slug: "citizen-quartz-two-tone-silver-50m",
    brand: "Citizen",
    name: "Quartz 50M — Two-Tone Silver",
    reference: "CTZ-Q50-TTS",
    price: 5000,
    image: `${GALLERY}/citizen-quartz-two-tone-silver-50m/01-original-front.jpg`,
    gallery: [
      `${GALLERY}/citizen-quartz-two-tone-silver-50m/01-original-front.jpg`,
      `${GALLERY}/citizen-quartz-two-tone-silver-50m/02-generated-angle.png`,
    ],
    gender: "Men",
    collection: "Classic",
    condition: "New",
    material: "Two-tone",
    dial: "Silver",
    diameter: 40,
    categoryTags: ["All watches", "Men", "New arrivals"],
    year: 2025,
    waterResistance: "50 m",
    movement: "Quartz",
    description:
      "A two-tone bracelet blends steel and gold accents around a bright silver dial — a little dressier while staying easy to wear. Water resistant to 50 m with a quartz movement.",
  },
];

export const SHOP_FILTERS = {
  collection: ["Classic"],
  brand: ["Citizen"],
  material: ["Steel", "Gold", "Two-tone"],
  dial: ["Silver", "Black", "Navy", "Green", "Brown", "Gold"],
  diameter: ["37-40mm", "41-44mm"],
  condition: ["New", "Pre-owned"],
  gender: ["Men", "Ladies", "Unisex"],
} as const;
