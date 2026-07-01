"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useCommerce } from "@/components/providers/CommerceProvider";
import { placeOrderAction, type CheckoutState } from "@/app/actions/checkout";
import { SHIPPING_METHODS } from "@/lib/shipping";
import { formatPrice, formatUsd } from "@/lib/format";

const initialState: CheckoutState = {};

export default function CheckoutForm({ prefillEmail }: { prefillEmail?: string }) {
  const { items, subtotal, cartLoaded } = useCommerce();
  const [state, formAction, pending] = useActionState(placeOrderAction, initialState);
  const [methodId, setMethodId] = useState<string>(SHIPPING_METHODS[0].id);

  const shippingCost = SHIPPING_METHODS.find((method) => method.id === methodId)?.cost ?? 0;
  const total = subtotal + shippingCost;

  if (cartLoaded && items.length === 0) {
    return (
      <section className="mx-auto max-w-[1440px] px-5 py-24 text-center md:px-[4.5%]">
        <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-normal tracking-[-0.05em]">Your bag is empty</h1>
        <p className="mt-4 text-sm text-[#687276]">Add a timepiece from the collection to begin checkout.</p>
        <Link href="/watches" className="mt-8 inline-grid h-12 place-items-center rounded-full bg-[#16343d] px-7 text-sm text-[#eef0ef]">
          Browse the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="px-5 pb-24 pt-8 md:px-[4.5%] md:pt-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="text-[11px] text-[#687276]">
          <Link href="/" className="transition-colors hover:text-[#101416]">Home</Link>
          <span className="px-2">/</span>
          <Link href="/watches" className="transition-colors hover:text-[#101416]">Watches</Link>
          <span className="px-2">/</span>
          <span>Checkout</span>
        </div>

        <h1 className="mt-7 text-[clamp(2.4rem,6vw,4.4rem)] font-normal leading-[0.95] tracking-[-0.06em]">Checkout</h1>

        <form action={formAction} className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-14">
          <div className="order-2 lg:order-1">
            {state.error ? (
              <p className="mb-6 rounded-[12px] border border-[#16343d]/30 bg-[#16343d]/5 px-4 py-3 text-[13px] text-[#16343d]">
                {state.error}
              </p>
            ) : null}

            <fieldset>
              <legend className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#687276]">Contact</legend>
              <div className="mt-4">
                <Field label="Email address" name="email" type="email" defaultValue={prefillEmail} error={state.fieldErrors?.email} autoComplete="email" />
              </div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#687276]">Shipping address</legend>
              <div className="mt-4 grid gap-4">
                <Field label="Full name" name="shipName" error={state.fieldErrors?.shipName} autoComplete="name" />
                <Field label="Phone (optional)" name="shipPhone" type="tel" error={state.fieldErrors?.shipPhone} autoComplete="tel" />
                <Field label="Address" name="shipLine1" error={state.fieldErrors?.shipLine1} autoComplete="address-line1" />
                <Field label="Apartment, suite (optional)" name="shipLine2" error={state.fieldErrors?.shipLine2} autoComplete="address-line2" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="City" name="shipCity" error={state.fieldErrors?.shipCity} autoComplete="address-level2" />
                  <Field label="State / Region (optional)" name="shipState" error={state.fieldErrors?.shipState} autoComplete="address-level1" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Postal code" name="shipPostal" error={state.fieldErrors?.shipPostal} autoComplete="postal-code" />
                  <Field label="Country" name="shipCountry" error={state.fieldErrors?.shipCountry} autoComplete="country-name" />
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-10">
              <legend className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#687276]">Delivery</legend>
              <div className="mt-4 grid gap-3">
                {SHIPPING_METHODS.map((method) => {
                  const active = methodId === method.id;
                  return (
                    <label key={method.id} className={`flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border px-4 py-4 transition-colors ${active ? "border-[#16343d]" : "border-[#cbd2d2] hover:border-[#7e8c93]"}`}>
                      <span className="flex items-center gap-3">
                        <input type="radio" name="shippingMethod" value={method.id} checked={active} onChange={() => setMethodId(method.id)} className="peer sr-only" />
                        <span className={`grid h-4 w-4 place-items-center rounded-full border ${active ? "border-[#16343d]" : "border-[#7e8c93]"}`}>
                          <span className={`h-2 w-2 rounded-full ${active ? "bg-[#16343d]" : "bg-transparent"}`} />
                        </span>
                        <span>
                          <span className="block text-[13px] font-medium">{method.label}</span>
                          <span className="mt-0.5 block text-[11px] text-[#7e8c93]">{method.detail}</span>
                        </span>
                      </span>
                      <span className="text-[13px] font-medium">{method.cost === 0 ? "Free" : formatPrice(method.cost)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <aside className="order-1 lg:order-2">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-[16px] border border-[#cbd2d2] p-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#687276]">Order summary</h2>

                <div className="mt-5 divide-y divide-[#cbd2d2]">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4 py-4 first:pt-0">
                      <div className="relative h-18 w-14 shrink-0 overflow-hidden rounded-[10px] bg-[#fbfcfb]">
                        <Image src={item.image} alt={`${item.brand} ${item.name}`} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.1em]">{item.brand}</p>
                        <h3 className="mt-1 truncate text-[13px]">{item.name}</h3>
                        <p className="mt-1 text-[10px] text-[#7e8c93]">Qty {item.quantity}</p>
                      </div>
                      <p className="text-[13px] font-medium">{formatPrice(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-2 border-t border-[#cbd2d2] pt-5 text-sm">
                  <div className="flex items-center justify-between"><span className="text-[#687276]">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="flex items-center justify-between"><span className="text-[#687276]">Shipping</span><span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span></div>
                  <div className="flex items-center justify-between border-t border-[#cbd2d2] pt-3 text-base font-medium"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>

                <button type="submit" disabled={pending} className="mt-6 grid h-13 w-full place-items-center bg-[#16343d] text-[12px] font-semibold uppercase tracking-[0.12em] text-[#eef0ef] transition-colors hover:bg-[#0f252b] disabled:opacity-60">
                  {pending ? "Placing order…" : "Continue to payment"}
                </button>
                <p className="mt-3 text-center text-[11px] text-[#7e8c93]">Prices shown in LKR · payment processed in USD ({formatUsd(total)})</p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#46555a]">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`h-12 w-full rounded-[10px] border bg-[#eef0ef] px-4 text-sm outline-none transition-colors focus:border-[#16343d] ${error ? "border-[#16343d]" : "border-[#cbd2d2]"}`}
      />
      {error ? <span className="mt-1 block text-[11px] text-[#16343d]">{error}</span> : null}
    </label>
  );
}
