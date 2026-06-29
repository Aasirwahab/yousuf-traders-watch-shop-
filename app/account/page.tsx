import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Box, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { getUserOrders } from "@/lib/orders";
import { getOrCreateUser } from "@/lib/user";
import AccountView, { type AccountOrder } from "./AccountView";

export const metadata: Metadata = {
  title: "My collection | Ovalen",
};

const trustItems = [
  { icon: Sparkles, title: "Authenticity", body: "Guaranteed" },
  { icon: Box, title: "Worldwide", body: "Insured shipping" },
  { icon: ShieldCheck, title: "Secure", body: "Checkout" },
  { icon: BadgeCheck, title: "Expert", body: "Concierge" },
] as const;

export default async function AccountPage() {
  const [user, orders] = await Promise.all([getOrCreateUser(), getUserOrders()]);
  const userEmail = user?.email ?? "collector@ovalen.com";
  const displayName = user?.name ?? "Collector";

  const accountOrders: AccountOrder[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    total: order.total,
    itemName: order.items[0]?.name ?? null,
    itemCount: order.items.length,
  }));

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      <AccountView displayName={displayName} userEmail={userEmail} orders={accountOrders} />

      <section className="border-y border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto grid max-w-[1280px] border-x border-black/10 md:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, body }, index) => (
            <div key={title} className={`flex min-h-[122px] items-center justify-center gap-4 px-6 py-6 ${index > 0 ? "border-t border-black/10 md:border-l md:border-t-0" : ""}`}>
              <Icon className="h-7 w-7 shrink-0 stroke-[1.25]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em]">{title}</p>
                <p className="mt-1 text-[11px] text-[#777]">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-8 border-x border-black/10 px-6 py-9 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/" className="text-[24px] font-semibold tracking-[0.28em]">
              OVALEN
            </Link>
            <p className="mt-3 max-w-[190px] text-[11px] leading-4 text-[#555]">Curated independently. Authenticated for life.</p>
          </div>
          <nav aria-label="Account footer" className="flex flex-wrap gap-x-10 gap-y-3 text-[11px]">
            <Link href="/about" className="hover:text-[#7b1020]">About Us</Link>
            <Link href="/faq" className="hover:text-[#7b1020]">FAQ</Link>
            <Link href="/watches" className="hover:text-[#7b1020]">Journal</Link>
            <Link href="mailto:concierge@ovalen.com" className="hover:text-[#7b1020]">Contact</Link>
          </nav>
          <div className="flex gap-5 text-[12px] text-[#555]">
            <span>Instagram</span>
            <span>X</span>
            <span>Pinterest</span>
            <span>YouTube</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
