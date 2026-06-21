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
  title: "Ovalen — Luxury Watch Collection",
  description:
    "Discover Ovalen's curated collection of luxury watches. Explore modern timepieces, limited editions, chronographs, and classic watches from the world's finest brands.",
  keywords: [
    "luxury watches",
    "Ovalen",
    "timepieces",
    "chronographs",
    "limited edition watches",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${teko.variable}`}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
