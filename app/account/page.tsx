import type { Metadata } from "next";
import Link from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getOrCreateUser } from "@/lib/user";
import { getUserOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Your account | Ovalen",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Reserved · awaiting payment",
  PAID: "Paid",
  FULFILLED: "Shipped",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export default async function AccountPage() {
  // Middleware guarantees a signed-in user here; this also syncs them to the DB.
  const user = await getOrCreateUser();
  const orders = await getUserOrders();

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
        <div className="text-[11px] text-[#6e6e6b]">
          <Link href="/" className="transition-colors hover:text-black">Home</Link>
          <span className="px-2">/</span>
          <span>Account</span>
        </div>

        <h1 className="mt-8 text-[clamp(2.4rem,5vw,4rem)] font-normal leading-[0.95] tracking-[-0.05em]">
          Your account
        </h1>

        <div className="mt-10 rounded-[16px] border border-black/10 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">Signed in as</p>
          <p className="mt-2 text-lg">{user?.name ?? "Collector"}</p>
          {user?.email ? <p className="mt-1 text-sm text-[#6e6e6b]">{user.email}</p> : null}
        </div>

        <div className="mt-6 rounded-[16px] border border-black/10 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">Order history</p>

          {orders.length === 0 ? (
            <>
              <p className="mt-3 text-sm leading-6 text-[#6e6e6b]">
                You have no orders yet. Your reservations and purchases will appear here.
              </p>
              <Link href="/watches" className="mt-5 inline-grid h-11 place-items-center rounded-full bg-black px-6 text-sm text-white">
                Browse the collection
              </Link>
            </>
          ) : (
            <ul className="mt-4 divide-y divide-black/10">
              {orders.map((order) => (
                <li key={order.id} className="py-4 first:pt-0">
                  <Link href={`/checkout/${order.id}`} className="flex items-center justify-between gap-4 transition-colors hover:text-[#6b1824]">
                    <span className="min-w-0">
                      <span className="block text-[13px] font-medium">{order.orderNumber}</span>
                      <span className="mt-0.5 block text-[11px] text-[#8a8a86]">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        {" · "}
                        {order.items.reduce((count, item) => count + item.quantity, 0)} item(s)
                        {" · "}
                        {ORDER_STATUS_LABELS[order.status] ?? order.status}
                      </span>
                    </span>
                    <span className="shrink-0 text-[13px] font-medium">{formatPrice(order.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <SignOutButton>
            <button type="button" className="text-[12px] uppercase tracking-[0.12em] text-[#6e6e6b] underline-offset-4 hover:text-black hover:underline">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </section>
      <Footer />
    </main>
  );
}
