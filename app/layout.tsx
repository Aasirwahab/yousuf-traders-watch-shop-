import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Teko } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { CommerceProvider } from "@/components/providers/CommerceProvider";
import CookieConsent from "@/components/layout/CookieConsent";
import { SITE_URL } from "@/lib/site";

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
  metadataBase: new URL(SITE_URL),
  title: "Authenticated Luxury Watches | Yusuf Traders",
  description:
    "Shop independent and iconic watches authenticated by specialists, protected by a 24-month warranty, and delivered worldwide.",
  keywords: [
    "luxury watches",
    "Yusuf Traders",
    "timepieces",
    "chronographs",
    "limited edition watches",
  ],
  openGraph: {
    title: "Time, exceptionally chosen. | Yusuf Traders",
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
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${teko.variable}`}>
        <body className={`${inter.className} antialiased`} suppressHydrationWarning>
          <SmoothScroll>
            <CommerceProvider>{children}</CommerceProvider>
          </SmoothScroll>
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
