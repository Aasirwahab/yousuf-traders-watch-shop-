import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getViewableOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order | Ovalen",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getViewableOrder(id);

  if (!order) notFound();

  const isPaid = order.status === "PAID" || order.status === "FULFILLED";

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <section className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#6b1824] text-white">
            <Check className="h-4 w-4 stroke-[2]" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">
            {isPaid ? "Order confirmed" : "Order reserved"}
          </p>
        </div>

        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.98] tracking-[-0.05em]">
          Thank you{order.shipName ? `, ${order.shipName.split(" ")[0]}` : ""}.
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[#6e6e6b]">
          Order <span className="font-medium text-black">{order.orderNumber}</span> has been{" "}
          {isPaid ? "confirmed" : "reserved"}. A copy has been sent to {order.email}.
        </p>

        {!isPaid ? (
          <div className="mt-8 rounded-[16px] border border-black/10 bg-[#f7f7f5] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">Payment</p>
            <p className="mt-2 text-sm leading-6 text-[#555550]">
              Your order is reserved and awaiting payment. Secure payment (PayPal) is being connected — this is the
              next step in the build.
            </p>
          </div>
        ) : null}

        <div className="mt-8 rounded-[16px] border border-black/10 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">Items</p>
          <div className="mt-4 divide-y divide-black/10">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 py-4 first:pt-0">
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[10px] bg-[#f4f4f4]">
                  <Image src={item.image} alt={`${item.brand} ${item.name}`} fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em]">{item.brand}</p>
                  <h2 className="mt-1 text-[14px]">{item.name}</h2>
                  <p className="mt-1 text-[10px] text-[#8a8a86]">Ref. {item.reference} · Qty {item.quantity}</p>
                </div>
                <p className="text-[13px] font-medium">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-black/10 pt-5 text-sm">
            <div className="flex items-center justify-between"><span className="text-[#6e6e6b]">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex items-center justify-between"><span className="text-[#6e6e6b]">Shipping</span><span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span></div>
            <div className="flex items-center justify-between border-t border-black/10 pt-3 text-base font-medium"><span>Total</span><span>{formatPrice(order.total)}</span></div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 rounded-[16px] border border-black/10 p-6 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">Shipping to</p>
            <p className="mt-3 text-sm leading-6">
              {order.shipName}<br />
              {order.shipLine1}<br />
              {order.shipLine2 ? <>{order.shipLine2}<br /></> : null}
              {order.shipCity}{order.shipState ? `, ${order.shipState}` : ""} {order.shipPostal}<br />
              {order.shipCountry}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">Delivery</p>
            <p className="mt-3 text-sm leading-6">{order.shippingMethod}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/watches" className="grid h-12 place-items-center rounded-full bg-black px-7 text-sm text-white">
            Continue shopping
          </Link>
          <Link href="/account" className="grid h-12 place-items-center rounded-full border border-black px-7 text-sm">
            View your account
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}
