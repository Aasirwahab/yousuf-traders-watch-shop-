"use client";

import { ChevronDown, Search, ShoppingBag, User } from "lucide-react";
import { NAV_LINKS } from "@/data/constants";

export function DesktopNav() {
  return (
    <nav aria-label="Primary navigation" className="absolute left-[calc(29.7%+28px)] right-[27px] top-[17px] z-20 flex items-center justify-between text-white">
      <div className="flex items-center gap-7 text-[12px]">
        {NAV_LINKS.map((link) => (
          <button key={link.label} type="button" className="flex items-center gap-1 whitespace-nowrap transition-opacity hover:opacity-70">
            {link.label}
            {link.hasDropdown ? <ChevronDown className="h-[0.8em] w-[0.8em]" strokeWidth={1.6} /> : null}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-5">
        <NavIcon label="Search" sizeClass="h-[15px] w-[15px]">
          <Search strokeWidth={1.3} />
        </NavIcon>
        <NavIcon label="Shopping bag" sizeClass="h-[14px] w-[14px]">
          <ShoppingBag strokeWidth={1.3} />
        </NavIcon>
        <NavIcon label="Account" sizeClass="h-[14px] w-[14px]">
          <User strokeWidth={1.3} />
        </NavIcon>
      </div>
    </nav>
  );
}

function NavIcon({ children, label, sizeClass = "h-[17px] w-[17px]" }: { children: React.ReactNode; label: string; sizeClass?: string }) {
  return (
    <button type="button" aria-label={label} className={`${sizeClass} transition-opacity hover:opacity-70`}>
      {children}
    </button>
  );
}

export function MobileNav() {
  return (
    <nav aria-label="Mobile navigation" className="absolute right-6 top-8 z-30 flex gap-5 text-black md:hidden">
      <NavIcon label="Search"><Search /></NavIcon>
      <NavIcon label="Shopping bag"><ShoppingBag /></NavIcon>
    </nav>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[7px] ${className}`} aria-label="Ovalen">
      <svg aria-hidden="true" viewBox="0 0 28 28" className="h-5 w-5">
        <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="5" strokeDasharray="50 13" transform="rotate(-46 14 14)" />
      </svg>
      <span className="text-[16px] font-medium tracking-[-0.025em]">OVALEN</span>
    </div>
  );
}
