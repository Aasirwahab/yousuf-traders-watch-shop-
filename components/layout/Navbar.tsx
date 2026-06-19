"use client";

import React from "react";
import { ChevronDown, Search, ShoppingBag, User } from "lucide-react";
import { NAV_LINKS } from "@/data/constants";

/**
 * Navbar — renders in two modes:
 *  • Desktop: white text overlaid on the hero image (inside the clip-path area)
 *  • Mobile:  black icons positioned top-right of the page
 */

export function DesktopNav() {
  return (
    <div className="absolute top-10 left-[480px] xl:left-[520px] right-16 flex justify-between items-center z-20 text-white">
      <div className="flex gap-8 text-[15px] font-medium tracking-wide">
        {NAV_LINKS.map((link) => (
          <span
            key={link.label}
            className="flex items-center gap-1.5 cursor-pointer hover:text-gray-300 transition-colors"
          >
            {link.label}
            {link.hasDropdown && (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            )}
          </span>
        ))}
      </div>
      <div className="flex gap-8">
        <Search className="w-[18px] h-[18px] cursor-pointer hover:text-gray-300 transition-colors" />
        <ShoppingBag className="w-[18px] h-[18px] cursor-pointer hover:text-gray-300 transition-colors" />
        <User className="w-[18px] h-[18px] cursor-pointer hover:text-gray-300 transition-colors" />
      </div>
    </div>
  );
}

export function MobileNav() {
  return (
    <div className="lg:hidden absolute top-10 right-8 flex gap-4 z-20 text-black">
      <Search className="w-5 h-5 cursor-pointer" />
      <ShoppingBag className="w-5 h-5 cursor-pointer" />
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-8 h-8 rounded-full border-[3px] border-current flex items-center justify-center">
        <div className="w-2 h-2 bg-current rounded-full" />
      </div>
      <span className="font-bold text-xl tracking-[0.15em]">OVALEN</span>
    </div>
  );
}
