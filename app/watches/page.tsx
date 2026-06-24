import type { Metadata } from "next";
import WatchesPage from "@/components/sections/WatchesPage";

export const metadata: Metadata = {
  title: "Selected Watches | Ovalen",
  description: "Browse men's, ladies', new, pre-owned, and limited edition watches curated by Ovalen.",
};

export default function Page() {
  return <WatchesPage />;
}
