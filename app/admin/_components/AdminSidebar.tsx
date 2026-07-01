"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  PackageSearch,
  Settings,
  ShoppingBag,
  Sparkles,
  UsersRound,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: PackageSearch },
  { label: "Customers", href: "/admin/customers", icon: UsersRound },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Campaigns", href: "/admin/campaigns", icon: Sparkles },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[#d9dfdd] bg-[#eef2f1] px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-[256px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-[#101719] text-sm font-semibold text-white">O</div>
        <div>
          <p className="text-sm font-semibold leading-none">Ovalen Admin</p>
          <p className="mt-1 text-xs text-[#667176]">Operations desk</p>
        </div>
      </div>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:mt-10 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-11 shrink-0 items-center gap-3 rounded-lg px-3 text-sm font-medium transition lg:w-full ${
                isActive
                  ? "bg-[#101719] text-white shadow-[0_12px_28px_rgba(17,23,25,0.18)]"
                  : "text-[#5f6a6f] hover:bg-white hover:text-[#101719]"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
