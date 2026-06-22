"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { NAV_LINKS } from "@/data/constants";
import { useCommerce } from "@/components/providers/CommerceProvider";

export default function Navbar() {
  const commerce = useCommerce();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-xl md:rounded-t-[10px]">
        <div className="relative mx-auto flex h-[72px] items-center justify-between px-5 md:h-[84px] md:px-[3.5%]">
          <Logo />

          <nav aria-label="Primary navigation" className="absolute left-[19.5%] hidden items-center gap-[clamp(28px,3.8vw,56px)] text-[13px] md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.label} href={link.href} className="relative py-2 transition-colors hover:text-[#6b1824] focus-visible:outline-2 focus-visible:outline-offset-4">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <HeaderButton label="Search" onClick={() => commerce.setSearchOpen(true)}><Search /></HeaderButton>
            <HeaderButton label="Account" className="hidden sm:grid"><User /></HeaderButton>
            <HeaderButton label={`Shopping bag with ${commerce.cartCount} items`} onClick={() => commerce.setCartOpen(true)}>
              <ShoppingBag />
              {commerce.cartCount > 0 ? <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#6b1824] px-1 text-[9px] text-white">{commerce.cartCount}</span> : null}
            </HeaderButton>
            <HeaderButton label="Open menu" className="md:hidden" onClick={() => commerce.setMenuOpen(true)}><Menu /></HeaderButton>
          </div>
        </div>
      </header>

      <SearchPanel open={commerce.searchOpen} onClose={() => commerce.setSearchOpen(false)} />
      <MobileMenu open={commerce.menuOpen} onClose={() => commerce.setMenuOpen(false)} />
      <CartPanel count={commerce.cartCount} open={commerce.cartOpen} onClose={() => commerce.setCartOpen(false)} />
    </>
  );
}

function HeaderButton({ children, className = "", label, onClick }: { children: React.ReactNode; className?: string; label: string; onClick?: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 [&_svg]:h-[19px] [&_svg]:w-[19px] [&_svg]:stroke-[1.4] ${className}`}>{children}</button>;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="#top" aria-label="Ovalen home" className={`flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 ${light ? "text-white" : "text-black"}`}>
      <span className="text-[18px] font-semibold tracking-[0.32em]">OVALEN</span>
    </Link>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm" onMouseDown={onClose}><div onMouseDown={(event) => event.stopPropagation()}>{children}</div></div>;
}

function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Search watches" className="bg-white px-5 py-8 md:px-[8%] md:py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between"><p className="text-sm text-[#6e6e6b]">Search the collection</p><HeaderButton label="Close search" onClick={onClose}><X /></HeaderButton></div>
          <form action="#shop" onSubmit={onClose} className="mt-7 flex border-b border-black pb-4">
            <input autoFocus aria-label="Search watches" placeholder="Brand, model, reference..." className="min-w-0 flex-1 bg-transparent text-2xl outline-none placeholder:text-black/25 md:text-4xl" />
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
      <div role="dialog" aria-modal="true" aria-label="Mobile menu" className="ml-auto min-h-screen w-[88%] max-w-sm bg-white p-6">
        <div className="flex items-center justify-between"><Logo /><HeaderButton label="Close menu" onClick={onClose}><X /></HeaderButton></div>
        <nav className="mt-16 flex flex-col border-t border-black/10">
          {NAV_LINKS.map((link) => <Link key={link.label} href={link.href} onClick={onClose} className="border-b border-black/10 py-5 text-2xl">{link.label}</Link>)}
        </nav>
        <a href="mailto:concierge@ovalen.com" className="mt-12 block text-sm text-[#6e6e6b]">concierge@ovalen.com</a>
      </div>
    </Overlay>
  );
}

function CartPanel({ count, open, onClose }: { count: number; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <Overlay onClose={onClose}>
      <aside role="dialog" aria-modal="true" aria-label="Shopping bag" className="ml-auto flex min-h-screen w-[92%] max-w-md flex-col bg-white p-6 md:p-8">
        <div className="flex items-center justify-between"><h2 className="text-2xl">Your bag <span className="text-[#6e6e6b]">({count})</span></h2><HeaderButton label="Close bag" onClick={onClose}><X /></HeaderButton></div>
        <div className="grid flex-1 place-items-center text-center"><div><ShoppingBag className="mx-auto h-8 w-8 stroke-1" /><p className="mt-5 text-lg">{count ? `${count} watch ${count === 1 ? "is" : "are"} reserved in your bag.` : "Your bag is waiting."}</p><p className="mt-2 text-sm text-[#6e6e6b]">Secure checkout will be connected with the product catalogue.</p></div></div>
        <a href="#shop" onClick={onClose} className="grid h-13 place-items-center bg-black text-sm text-white">Continue shopping</a>
      </aside>
    </Overlay>
  );
}
