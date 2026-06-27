"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "ovalen_cookie_consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (e.g. private mode) — don't block the UI.
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // Ignore — dismissing for the session is enough if storage is blocked.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Cookie notice" className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/10 bg-white/95 px-5 py-4 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[12px] leading-5 text-[#555550]">
          We use essential cookies to keep your cart and sign-in working. See our{" "}
          <Link href="/cookies" className="underline underline-offset-2 hover:text-black">Cookie Policy</Link>.
        </p>
        <button type="button" onClick={accept} className="grid h-10 shrink-0 place-items-center rounded-full bg-black px-6 text-sm text-white">
          Accept
        </button>
      </div>
    </div>
  );
}
