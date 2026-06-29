import Link from "next/link";
import { Logo } from "@/components/layout/Navbar";
import { FOOTER_GROUPS } from "@/data/constants";

export default function Footer() {
  return (
    <footer id="footer" className="bg-[#0b0b0b] px-6 pb-8 pt-16 text-white md:px-[4.5%] md:pt-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 border-b border-white/15 pb-16 md:grid-cols-[1.2fr_2fr]">
          <div><Logo light /><p className="mt-6 max-w-xs text-[12px] leading-5 text-white/50">Independent and iconic watches, authenticated for a lifetime of collecting.</p><a href="mailto:concierge@yousuftrade.store" className="mt-8 block text-sm underline decoration-white/30 underline-offset-4">concierge@yousuftrade.store</a></div>
          <div className="hidden gap-8 sm:grid sm:grid-cols-3">
            {FOOTER_GROUPS.map((group) => <FooterNav key={group.title} group={group} />)}
          </div>
          <div className="border-t border-white/15 sm:hidden">
            {FOOTER_GROUPS.map((group) => (
              <details key={group.title} className="group border-b border-white/15">
                <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between text-sm font-medium marker:hidden">{group.title}<span aria-hidden="true" className="text-lg font-light transition-transform group-open:rotate-45">+</span></summary>
                <ul className="space-y-3 pb-5">{group.links.map((link) => <li key={link.label}><Link href={link.href} className="text-[12px] text-white/55">{link.label}</Link></li>)}</ul>
              </details>
            ))}
          </div>
        </div>
        <div className="grid gap-8 py-8 text-[11px] text-white/45 md:grid-cols-[1fr_auto] md:items-end">
          <div><p>We accept Visa, Mastercard, American Express, PayPal, Apple Pay and Google Pay.</p><div className="mt-4 flex flex-wrap gap-x-6 gap-y-2"><Link href="/terms" className="hover:text-white">Terms & conditions</Link><Link href="/privacy" className="hover:text-white">Privacy policy</Link><Link href="/cookies" className="hover:text-white">Cookies</Link></div></div>
          <div className="md:text-right"><div className="flex gap-5 md:justify-end"><a href="https://www.instagram.com" rel="noreferrer" target="_blank" className="hover:text-white">Instagram</a><a href="https://www.facebook.com" rel="noreferrer" target="_blank" className="hover:text-white">Facebook</a><a href="https://www.youtube.com" rel="noreferrer" target="_blank" className="hover:text-white">YouTube</a></div><p className="mt-4">© {new Date().getFullYear()} Yusuf Traders. All rights reserved.</p></div>
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ group }: { group: (typeof FOOTER_GROUPS)[number] }) {
  return <nav aria-label={group.title}><h2 className="text-sm font-medium">{group.title}</h2><ul className="mt-5 space-y-3">{group.links.map((link) => <li key={link.label}><Link href={link.href} className="text-[12px] text-white/55 transition-colors hover:text-white">{link.label}</Link></li>)}</ul></nav>;
}
