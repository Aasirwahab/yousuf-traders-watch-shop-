"use client";

import { useActionState } from "react";
import { subscribeNewsletterAction, type NewsletterState } from "@/app/actions/newsletter";

const initialState: NewsletterState = {};

export default function NewsletterSection() {
  const [state, formAction, pending] = useActionState(subscribeNewsletterAction, initialState);

  return (
    <section id="newsletter" className="px-6 py-16 md:px-[4.5%] md:py-20">
      <div className="mx-auto grid max-w-[1440px] items-end gap-8 md:grid-cols-[1fr_0.7fr_1.3fr]">
        <h2 className="text-[clamp(2rem,3.4vw,3.6rem)] leading-[1.02] tracking-[-0.045em]">Notes on watches<br />worth knowing.</h2>
        <p className="max-w-xs text-[13px] leading-5 text-[#687276]">New arrivals, collector guides, and private releases — sent occasionally.</p>
        {state.ok ? (
          <p role="status" className="border-b border-[#16343d] pb-4 text-sm">You’re on the list. Your first note will arrive soon.</p>
        ) : (
          <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" name="email" required type="email" placeholder="Email address" aria-invalid={state.error ? true : undefined} className="min-h-13 min-w-0 flex-1 border border-[#cbd2d2] px-4 text-sm outline-none focus:border-[#16343d]" />
            <button disabled={pending} className="min-h-13 bg-[#16343d] px-8 text-sm text-[#eef0ef] transition-colors hover:bg-[#16343d] disabled:opacity-60">{pending ? "Joining…" : "Subscribe"}</button>
          </form>
        )}
        {state.error ? <p role="alert" className="text-[12px] text-[#16343d] md:col-start-3">{state.error}</p> : null}
      </div>
    </section>
  );
}
