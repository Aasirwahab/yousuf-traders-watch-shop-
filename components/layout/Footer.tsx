import { Logo } from "@/components/layout/Navbar";
import { FOOTER_NAV_LINKS, FOOTER_PRODUCTS } from "@/data/constants";
import { Reveal } from "@/components/ui/Reveal";

export default function Footer() {
  return (
    <footer className="mx-[6px] rounded-b-[14px] bg-black px-6 py-16 text-white md:px-12 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-0">
        <Reveal className="flex min-h-[230px] flex-col">
          <Logo />
          <p className="mt-7 max-w-[320px] text-[12px] leading-[1.5] text-[#aaa]">Explore our best products to find what you want, there you will definitely find it.</p>
          <div className="mt-auto flex gap-2">
            {['♪', '𝕏', '◎'].map((icon) => (
              <a key={icon} href="#" aria-label="Social link" className="grid h-8 w-8 place-items-center rounded-full bg-white text-[13px] font-semibold text-black">{icon}</a>
            ))}
          </div>
        </Reveal>

        <Reveal className="grid gap-10 text-[12px] md:grid-cols-2" delay={0.12}>
          <nav className="col-span-full flex justify-between gap-6">
            {FOOTER_NAV_LINKS.map((link) => <a key={link.label} href={link.href} className="transition-opacity hover:opacity-65">{link.label}</a>)}
          </nav>
          <div>
            <h3 className="mb-4 text-[15px] font-medium">Product</h3>
            <ul className="space-y-2 text-[#bbb]">
              {FOOTER_PRODUCTS.map((item) => <li key={item.label}><a href={item.href} className="hover:text-white">{item.label}</a></li>)}
            </ul>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="mb-4 text-[15px] font-medium">Location</h3>
              <p className="text-[#bbb]">483920, Moscow,<br />Myanitskaya 22/2/5, Office 4</p>
            </div>
            <p className="mt-10 text-right text-[#bbb]">© 2021 — Copyright<br />All Rights reserved</p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
