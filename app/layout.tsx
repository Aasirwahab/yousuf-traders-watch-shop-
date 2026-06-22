import type { Metadata } from "next";
import { Inter, Teko } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const teko = Teko({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-teko",
});

export const metadata: Metadata = {
  title: "Authenticated Luxury Watches | Ovalen",
  description:
    "Shop independent and iconic watches authenticated by specialists, protected by a 24-month warranty, and delivered worldwide.",
  keywords: [
    "luxury watches",
    "Ovalen",
    "timepieces",
    "chronographs",
    "limited edition watches",
  ],
  openGraph: {
    title: "Time, exceptionally chosen. | Ovalen",
    description: "Independent and iconic watches, authenticated for a lifetime of collecting.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${teko.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
