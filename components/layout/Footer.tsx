import React from "react";
import { Logo } from "@/components/layout/Navbar";
import { FOOTER_NAV_LINKS, FOOTER_PRODUCTS } from "@/data/constants";

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 md:pt-24 pb-12 px-6 md:px-8 rounded-t-[40px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-16 md:gap-0 border-b border-white/10 pb-16">
        {/* Brand & Description */}
        <div className="w-full md:w-[35%]">
          <div className="mb-8">
            <Logo />
          </div>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-[280px]">
            Explore our best products to find what you want, there you will
            definitely find it.
          </p>
        </div>

        {/* Links Grid */}
        <div className="w-full md:w-[65%] flex flex-col md:flex-row justify-between gap-12 md:gap-0">
          {/* Top Nav Links */}
          <div className="flex gap-8 text-[14px] font-medium">
            {FOOTER_NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-gray-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex gap-16 md:pr-12">
            <div>
              <h4 className="font-bold mb-6 text-[15px]">Product</h4>
              <ul className="space-y-4 text-[14px] text-gray-400">
                {FOOTER_PRODUCTS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-[15px]">Location</h4>
              <p className="text-[14px] text-gray-400 leading-relaxed">
                483920, Moscow,
                <br />
                Myanitskaya 22/2/5, Office 4
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-500 font-medium">
        <div className="flex gap-4 mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <span className="text-white font-bold pb-1 block leading-none">
              o
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
            <span className="text-white text-xs font-bold block leading-none pt-0.5">
              X
            </span>
          </div>
        </div>
        <p>© 2024 — Copyright All Rights reserved</p>
      </div>
    </footer>
  );
}
