"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  FileCheck2,
  Heart,
  MapPin,
  PackageCheck,
  Settings,
  UserRound,
} from "lucide-react";
import { SHOP_PRODUCTS } from "@/data/shop";
import { formatPrice } from "@/lib/format";

export type AccountOrder = {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  itemName: string | null;
  itemCount: number;
};

type TabId =
  | "overview"
  | "wishlist"
  | "orders"
  | "addresses"
  | "payment-methods"
  | "authentication-docs"
  | "settings";

const accountNav = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "orders", label: "Orders", icon: PackageCheck },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "payment-methods", label: "Payment methods", icon: CreditCard },
  { id: "authentication-docs", label: "Authentication docs", icon: FileCheck2 },
  { id: "settings", label: "Settings", icon: Settings },
] as const satisfies ReadonlyArray<{ id: TabId; label: string; icon: typeof UserRound }>;

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Reserved",
  PAID: "Confirmed",
  FULFILLED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

const collectionPieces = SHOP_PRODUCTS.slice(0, 4);
const wishlistPieces = SHOP_PRODUCTS.slice(0, 8);

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AccountView({
  displayName,
  userEmail,
  orders,
}: {
  displayName: string;
  userEmail: string;
  orders: AccountOrder[];
}) {
  const [active, setActive] = useState<TabId>("overview");

  return (
    <section className="mx-auto grid max-w-[1280px] border-x border-black/10 lg:grid-cols-[292px_1fr]">
      <aside className="border-b border-black/10 bg-white lg:min-h-[860px] lg:border-b-0 lg:border-r">
        <div className="px-6 py-8 md:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#555]">My account</p>
          <nav aria-label="Account navigation" className="mt-6 overflow-x-auto lg:overflow-visible">
            <div className="flex min-w-max border-y border-black/10 lg:block lg:min-w-0 lg:border-y-0">
              {accountNav.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setActive(item.id)}
                    className={`flex h-14 w-full items-center gap-4 border-r border-black/10 px-5 text-left text-[11px] font-semibold uppercase tracking-[0.11em] transition-colors lg:border-r-0 lg:px-0 ${
                      isActive
                        ? "bg-[#f2f2f2] text-[#7b1020] lg:-mx-8 lg:border-l-2 lg:border-[#7b1020] lg:px-8"
                        : "text-[#5f5f5f] hover:text-black"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 stroke-[1.45]" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="hidden px-6 pb-8 pt-4 lg:block">
          <div className="border-t border-black/10 pt-8">
            <SectionLabel>Private concierge</SectionLabel>
            <p className="mt-4 max-w-[210px] text-[12px] leading-5 text-[#777]">
              Our specialists are here to assist with any request.
            </p>
            <a
              href="mailto:concierge@ovalen.com"
              className="mt-6 flex h-12 items-center justify-between border border-black/20 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-black hover:bg-black hover:text-white"
            >
              Contact concierge
              <ArrowRight className="h-4 w-4 stroke-[1.45]" />
            </a>
            <div className="relative mt-8 aspect-[0.84] overflow-hidden bg-[#111]">
              <Image src="/prototype-assets/article-side.webp" alt="Ovalen private concierge" fill sizes="230px" className="object-cover grayscale" />
            </div>
          </div>
        </div>
      </aside>

      <div className="px-6 py-10 md:px-10 md:py-14 lg:px-12">
        {active === "overview" && <OverviewPanel orders={orders} displayName={displayName} userEmail={userEmail} onNavigate={setActive} />}
        {active === "wishlist" && <WishlistPanel />}
        {active === "orders" && <OrdersPanel orders={orders} />}
        {active === "addresses" && <AddressesPanel displayName={displayName} userEmail={userEmail} />}
        {active === "payment-methods" && <PaymentMethodsPanel />}
        {active === "authentication-docs" && <AuthenticationDocsPanel orders={orders} />}
        {active === "settings" && <SettingsPanel displayName={displayName} userEmail={userEmail} />}
      </div>
    </section>
  );
}

function PanelHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[clamp(2.15rem,4vw,3.8rem)] font-normal leading-none tracking-[-0.045em]">{title}</h1>
        <p className="mt-4 text-[12px] leading-5 text-[#555]">{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function LinkAction({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors hover:text-[#7b1020]"
    >
      {children}
    </button>
  );
}

function OverviewPanel({
  orders,
  displayName,
  userEmail,
  onNavigate,
}: {
  orders: AccountOrder[];
  displayName: string;
  userEmail: string;
  onNavigate: (tab: TabId) => void;
}) {
  return (
    <>
      <PanelHeader
        title="My Collection"
        subtitle="Your saved timepieces."
        action={<LinkAction onClick={() => onNavigate("wishlist")}>View all</LinkAction>}
      />

      <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {collectionPieces.map((piece, index) => (
          <ProductCard key={piece.slug} piece={piece} active={index === 0} />
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between">
          <SectionLabel>Recent orders</SectionLabel>
          <LinkAction onClick={() => onNavigate("orders")}>View all</LinkAction>
        </div>
        <OrdersTable orders={orders.slice(0, 4)} />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <InfoPanel title="Saved addresses" onAction={() => onNavigate("addresses")}>
          <p className="font-semibold">{displayName}</p>
          <p className="mt-2 text-[#555]">No saved delivery address yet.</p>
          <p className="mt-2 text-[#555]">{userEmail}</p>
        </InfoPanel>
        <InfoPanel title="Payment methods" onAction={() => onNavigate("payment-methods")}>
          <p className="font-semibold">No saved cards</p>
          <p className="mt-2 text-[#555]">Payment details are added securely during checkout.</p>
        </InfoPanel>
        <InfoPanel title="Authentication docs" onAction={() => onNavigate("authentication-docs")}>
          <div className="flex gap-3">
            <FileCheck2 className="mt-0.5 h-6 w-6 shrink-0 stroke-[1.35]" />
            <div>
              <p className="font-semibold">{collectionPieces[0]?.brand} {collectionPieces[0]?.name}</p>
              <p className="mt-1 text-[#555]">Certificate available after purchase.</p>
            </div>
          </div>
        </InfoPanel>
      </section>
    </>
  );
}

function WishlistPanel() {
  return (
    <>
      <PanelHeader title="Wishlist" subtitle="Pieces you're tracking." />
      <div className="mt-9 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {wishlistPieces.map((piece, index) => (
          <ProductCard key={piece.slug} piece={piece} active={index === 0} />
        ))}
      </div>
    </>
  );
}

function OrdersPanel({ orders }: { orders: AccountOrder[] }) {
  return (
    <>
      <PanelHeader title="Orders" subtitle="Your purchases and reservations." />
      <div className="mt-9">
        <OrdersTable orders={orders} />
      </div>
    </>
  );
}

function OrdersTable({ orders }: { orders: AccountOrder[] }) {
  return (
    <div className="mt-5 overflow-hidden border border-black/10">
      <div className="grid grid-cols-[1.2fr_0.9fr_1.2fr_0.9fr_0.8fr] bg-[#fafafa] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777]">
        <span>Order</span>
        <span>Date</span>
        <span>Item</span>
        <span>Status</span>
        <span className="text-right">Total</span>
      </div>
      {orders.length ? (
        orders.map((order) => (
          <Link
            key={order.id}
            href={`/checkout/${order.id}`}
            className="grid grid-cols-[1.2fr_0.9fr_1.2fr_0.9fr_0.8fr] border-t border-black/10 px-4 py-4 text-[11px] transition-colors hover:bg-[#fafafa]"
          >
            <span className="font-semibold">{order.orderNumber}</span>
            <span className="text-[#555]">{formatOrderDate(order.createdAt)}</span>
            <span className="truncate pr-4">{order.itemName ?? `${order.itemCount} item${order.itemCount === 1 ? "" : "s"}`}</span>
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${order.status === "FULFILLED" || order.status === "PAID" ? "bg-[#0f7a3d]" : "bg-[#b98620]"}`} />
              {ORDER_STATUS_LABELS[order.status] ?? order.status}
            </span>
            <span className="text-right font-semibold">{formatPrice(order.total)}</span>
          </Link>
        ))
      ) : (
        <div className="border-t border-black/10 px-4 py-8 text-center">
          <p className="text-[13px] font-medium">No orders yet.</p>
          <p className="mt-2 text-[12px] text-[#777]">Your purchases and reservations will appear here after checkout.</p>
          <Link href="/watches" className="mt-5 inline-grid h-10 place-items-center border border-black px-5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white">
            Browse watches
          </Link>
        </div>
      )}
    </div>
  );
}

function AddressesPanel({ displayName, userEmail }: { displayName: string; userEmail: string }) {
  return (
    <>
      <PanelHeader title="Addresses" subtitle="Where your timepieces are delivered." />
      <div className="mt-9 grid gap-4 md:grid-cols-2">
        <article className="min-h-[180px] border border-black/10 p-6 text-[12px] leading-5">
          <SectionLabel>Default delivery</SectionLabel>
          <div className="mt-5">
            <p className="font-semibold">{displayName}</p>
            <p className="mt-2 text-[#555]">No saved delivery address yet.</p>
            <p className="mt-1 text-[#555]">{userEmail}</p>
          </div>
        </article>
        <article className="flex min-h-[180px] flex-col items-start justify-center border border-dashed border-black/20 p-6 text-[12px] leading-5">
          <MapPin className="h-6 w-6 stroke-[1.35]" />
          <p className="mt-3 font-semibold">Add a delivery address</p>
          <p className="mt-1 text-[#777]">You can save an address securely while checking out.</p>
          <Link href="/checkout" className="mt-5 inline-flex h-10 items-center gap-2 border border-black px-5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white">
            Add address
          </Link>
        </article>
      </div>
    </>
  );
}

function PaymentMethodsPanel() {
  return (
    <>
      <PanelHeader title="Payment methods" subtitle="Manage how you pay at checkout." />
      <div className="mt-9 grid gap-4 md:grid-cols-2">
        <article className="min-h-[180px] border border-black/10 p-6 text-[12px] leading-5">
          <SectionLabel>Saved cards</SectionLabel>
          <div className="mt-5">
            <p className="font-semibold">No saved cards</p>
            <p className="mt-2 text-[#555]">Payment details are added securely during checkout and never stored on our servers.</p>
          </div>
        </article>
        <article className="flex min-h-[180px] flex-col items-start justify-center border border-dashed border-black/20 p-6 text-[12px] leading-5">
          <CreditCard className="h-6 w-6 stroke-[1.35]" />
          <p className="mt-3 font-semibold">Add a payment method</p>
          <p className="mt-1 text-[#777]">We accept PayPal and major cards at checkout.</p>
          <Link href="/checkout" className="mt-5 inline-flex h-10 items-center gap-2 border border-black px-5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-black hover:text-white">
            Add payment method
          </Link>
        </article>
      </div>
    </>
  );
}

function AuthenticationDocsPanel({ orders }: { orders: AccountOrder[] }) {
  const paidOrders = orders.filter((order) => order.status === "PAID" || order.status === "FULFILLED");

  return (
    <>
      <PanelHeader title="Authentication documents" subtitle="Certificates for your authenticated pieces." />
      <div className="mt-9 overflow-hidden border border-black/10">
        {paidOrders.length ? (
          paidOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 border-t border-black/10 px-5 py-5 first:border-t-0 text-[12px]">
              <FileCheck2 className="h-6 w-6 shrink-0 stroke-[1.35]" />
              <div className="flex-1">
                <p className="font-semibold">{order.itemName ?? order.orderNumber}</p>
                <p className="mt-1 text-[#777]">Order {order.orderNumber} · {formatOrderDate(order.createdAt)}</p>
              </div>
              <Link href={`/checkout/${order.id}`} className="text-[10px] font-semibold uppercase tracking-[0.14em] hover:text-[#7b1020]">
                View
              </Link>
            </div>
          ))
        ) : (
          <div className="px-5 py-10 text-center text-[12px]">
            <FileCheck2 className="mx-auto h-7 w-7 stroke-[1.3]" />
            <p className="mt-3 text-[13px] font-medium">No certificates yet.</p>
            <p className="mt-2 text-[#777]">Authentication documents become available once an order is confirmed.</p>
          </div>
        )}
      </div>
    </>
  );
}

function SettingsPanel({ displayName, userEmail }: { displayName: string; userEmail: string }) {
  return (
    <>
      <PanelHeader title="Settings" subtitle="Your account details." />
      <div className="mt-9 max-w-[520px] border border-black/10">
        <Row label="Name" value={displayName} />
        <Row label="Email" value={userEmail} />
      </div>
      <p className="mt-5 max-w-[520px] text-[12px] leading-5 text-[#777]">
        Need to update your details? Reach our{" "}
        <a href="mailto:concierge@ovalen.com" className="font-semibold text-black hover:text-[#7b1020]">private concierge</a>{" "}
        and we&apos;ll take care of it.
      </p>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-black/10 px-5 py-4 text-[12px] first:border-t-0">
      <span className="font-semibold uppercase tracking-[0.12em] text-[#777]">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function ProductCard({ piece, active }: { piece: (typeof SHOP_PRODUCTS)[number]; active: boolean }) {
  return (
    <Link href={`/watches/${piece.slug}`} className="group relative overflow-hidden border border-black/10 bg-white transition-colors hover:border-[#7b1020]/40">
      <span aria-hidden className="absolute right-4 top-4 z-10 text-[#7b1020]">
        <Heart className={`h-5 w-5 stroke-[1.25] ${active ? "fill-[#7b1020]" : ""}`} />
      </span>
      <div className="relative mx-auto mt-4 aspect-[0.76] w-[72%]">
        <Image src={piece.image} alt={`${piece.brand} ${piece.name}`} fill sizes="180px" className="object-contain transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="px-4 pb-5 pt-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em]">{piece.brand}</p>
        <h2 className="mt-1 min-h-8 text-[12px] leading-4">{piece.name}</h2>
        <p className="mt-1 text-[10px] text-[#777]">Ref. {piece.reference}</p>
        <p className="mt-3 text-[12px] font-semibold">{formatPrice(piece.price)}</p>
      </div>
    </Link>
  );
}

function InfoPanel({ title, onAction, children }: { title: string; onAction: () => void; children: React.ReactNode }) {
  return (
    <article className="min-h-[150px] border border-black/10 p-5 text-[11px] leading-5">
      <div className="flex items-center justify-between gap-4">
        <SectionLabel>{title}</SectionLabel>
        <button
          type="button"
          onClick={onAction}
          className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#555] hover:text-black"
        >
          View all
        </button>
      </div>
      <div className="mt-5">{children}</div>
    </article>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[10px] font-semibold uppercase tracking-[0.14em]">{children}</h2>;
}
