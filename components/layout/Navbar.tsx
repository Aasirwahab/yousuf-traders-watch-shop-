"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Minus, Plus, Search, ShoppingBag, User, X } from "lucide-react";
import { Show, UserButton } from "@clerk/nextjs";
import { NAV_LINKS } from "@/data/constants";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { formatPrice } from "@/lib/format";

export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const commerce = useCommerce();

  return (
    <>
      <header className={overlay ? "absolute inset-x-0 top-0 z-50 text-[#eef0ef]" : "sticky top-0 z-50 border-b border-[#cbd2d2] bg-[#fbfcfb]/95 backdrop-blur-xl"}>
        <div className="relative mx-auto flex h-[72px] items-center px-[4.7%] md:h-[84px]">
          <nav aria-label="Primary navigation" className="hidden items-center gap-[clamp(28px,3.8vw,56px)] text-[13px] md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className={`relative py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${overlay ? "hover:text-[#7e8c93]" : "hover:text-[#16343d]"}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="absolute left-1/2 top-0 flex h-full -translate-x-1/2 items-center">
            <Logo light={overlay} />
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <HeaderButton label="Search" onClick={() => commerce.setSearchOpen(true)}><Search /></HeaderButton>
            <Link
              href="/wishlist"
              aria-label={`Wishlist with ${commerce.wishlistCount} items`}
              className="relative hidden h-11 w-11 place-items-center rounded-full transition-colors hover:bg-[#0f252b]/5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid [&_svg]:h-[19px] [&_svg]:w-[19px] [&_svg]:stroke-[1.4]"
            >
              <Heart />
              {commerce.wishlistCount > 0 ? <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#16343d] px-1 text-[9px] text-[#eef0ef]">{commerce.wishlistCount}</span> : null}
            </Link>
            <Show when="signed-out">
              <Link
                href="/sign-in"
                aria-label="Sign in"
                className="relative hidden h-11 w-11 place-items-center rounded-full transition-colors hover:bg-[#0f252b]/5 focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid [&_svg]:h-[19px] [&_svg]:w-[19px] [&_svg]:stroke-[1.4]"
              >
                <User />
              </Link>
            </Show>
            <Show when="signed-in">
              <span className="hidden h-11 w-11 place-items-center sm:grid">
                <UserButton userProfileMode="navigation" userProfileUrl="/account" />
              </span>
            </Show>
            <HeaderButton label={`Shopping bag with ${commerce.cartCount} items`} onClick={() => commerce.setCartOpen(true)}>
              <ShoppingBag />
              {commerce.cartCount > 0 ? <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#16343d] px-1 text-[9px] text-[#eef0ef]">{commerce.cartCount}</span> : null}
            </HeaderButton>
            <HeaderButton label="Open menu" className="md:hidden" onClick={() => commerce.setMenuOpen(true)}><Menu /></HeaderButton>
          </div>
        </div>
      </header>

      <SearchPanel open={commerce.searchOpen} onClose={() => commerce.setSearchOpen(false)} />
      <MobileMenu open={commerce.menuOpen} onClose={() => commerce.setMenuOpen(false)} />
      <CartPanel open={commerce.cartOpen} onClose={() => commerce.setCartOpen(false)} />
    </>
  );
}

function HeaderButton({ children, className = "", label, onClick }: { children: React.ReactNode; className?: string; label: string; onClick?: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-[#0f252b]/5 focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:h-[19px] [&_svg]:w-[19px] [&_svg]:stroke-[1.4] ${className}`}>{children}</button>;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Yusuf Traders home" className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-4">
      <Image src="/logo.png" alt="Yusuf Traders" width={1133} height={586} priority className={`h-10 w-auto md:h-12 ${light ? "brightness-0 invert" : ""}`} />
    </Link>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] bg-[#0f252b]/40 backdrop-blur-sm" onMouseDown={onClose}><div onMouseDown={(event) => event.stopPropagation()}>{children}</div></div>;
}

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Search watches" className="bg-[#eef0ef] px-5 py-8 md:px-[8%] md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between"><p className="text-sm text-[#687276]">Search the collection</p><HeaderButton label="Close search" onClick={onClose}><X /></HeaderButton></div>
          <form action="/search" method="get" onSubmit={onClose} className="mt-7 flex border-b border-[#16343d] pb-4">
            <input name="q" autoFocus aria-label="Search watches" placeholder="Brand, model, reference..." className="min-w-0 flex-1 bg-transparent text-2xl outline-none placeholder:text-[#101416]/25 md:text-4xl" />
            <button className="px-3 text-sm font-medium">Search</button>
          </form>
        </div>
      </div>
    </Overlay>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Mobile menu" className="ml-auto min-h-screen w-[88%] max-w-sm bg-[#eef0ef] p-6">
        <div className="flex items-center justify-between"><Logo /><HeaderButton label="Close menu" onClick={onClose}><X /></HeaderButton></div>
        <nav className="mt-16 flex flex-col border-t border-[#cbd2d2]">
          {NAV_LINKS.map((link) => <Link key={link.label} href={link.href} onClick={onClose} className="border-b border-[#cbd2d2] py-5 text-2xl">{link.label}</Link>)}
          <Link href="/wishlist" onClick={onClose} className="border-b border-[#cbd2d2] py-5 text-2xl">Wishlist</Link>
        </nav>
        <a href="mailto:concierge@yousuftrade.store" className="mt-12 block text-sm text-[#687276]">concierge@yousuftrade.store</a>
      </div>
    </Overlay>
  );
}

function CartPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, cartCount, subtotal, updateQty, removeItem } = useCommerce();
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Shopping bag" className="ml-auto flex min-h-screen w-[92%] max-w-md flex-col bg-[#eef0ef] p-6 md:p-8">
        <div className="flex items-center justify-between"><h2 className="text-2xl">Your bag <span className="text-[#687276]">({cartCount})</span></h2><HeaderButton label="Close bag" onClick={onClose}><X /></HeaderButton></div>

        {items.length === 0 ? (
          <>
            <div className="grid flex-1 place-items-center text-center"><div><ShoppingBag className="mx-auto h-8 w-8 stroke-1" /><p className="mt-5 text-lg">Your bag is waiting.</p><p className="mt-2 text-sm text-[#687276]">Add a timepiece from the collection to begin.</p></div></div>
            <a href="#shop" onClick={onClose} className="grid h-13 place-items-center bg-[#16343d] text-sm text-[#eef0ef]">Continue shopping</a>
          </>
        ) : (
          <>
            <div className="-mx-1 mt-6 min-h-0 flex-1 overflow-y-auto px-1">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 border-b border-[#cbd2d2] py-5">
                  <Link href={`/watches/${item.slug}`} onClick={onClose} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-[10px] bg-[#fbfcfb]">
                    <Image src={item.image} alt={`${item.brand} ${item.name}`} fill sizes="64px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em]">{item.brand}</p>
                        <h3 className="mt-1 truncate text-[13px]"><Link href={`/watches/${item.slug}`} onClick={onClose} className="hover:text-[#16343d]">{item.name}</Link></h3>
                        <p className="mt-1 text-[10px] text-[#7e8c93]">Ref. {item.reference}</p>
                      </div>
                      <button type="button" aria-label={`Remove ${item.name} from bag`} onClick={() => removeItem(item.productId)} className="shrink-0 text-[#7e8c93] transition-colors hover:text-[#101416]"><X className="h-4 w-4 stroke-[1.4]" /></button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-[#cbd2d2]">
                        <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(item.productId, item.quantity - 1)} className="grid h-8 w-8 place-items-center text-[#101416]/70 transition-colors hover:text-[#101416]"><Minus className="h-3.5 w-3.5 stroke-[1.6]" /></button>
                        <span className="min-w-6 text-center text-[12px] tabular-nums">{item.quantity}</span>
                        <button type="button" aria-label="Increase quantity" disabled={item.quantity >= item.stock} onClick={() => updateQty(item.productId, item.quantity + 1)} className="grid h-8 w-8 place-items-center text-[#101416]/70 transition-colors hover:text-[#101416] disabled:opacity-25"><Plus className="h-3.5 w-3.5 stroke-[1.6]" /></button>
                      </div>
                      <p className="text-[13px] font-medium">{formatPrice(item.lineTotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#cbd2d2] pt-5">
              <div className="flex items-center justify-between text-sm"><span className="text-[#687276]">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <p className="mt-1 text-[11px] text-[#7e8c93]">Shipping &amp; taxes calculated at checkout.</p>
              <Link href="/checkout" onClick={onClose} className="mt-4 grid h-13 w-full place-items-center bg-[#16343d] text-sm text-[#eef0ef] transition-colors hover:bg-[#16343d]">Checkout</Link>
              <button type="button" onClick={onClose} className="mt-2 grid h-11 w-full place-items-center text-sm text-[#687276] transition-colors hover:text-[#101416]">Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </Overlay>
  );
}
