"use client";

import { useActionState } from "react";
import { sendContactAction, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = {};

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactAction, initialState);

  if (state.ok) {
    return (
      <div className="mt-10 rounded-[16px] border border-[#16343d]/30 bg-[#16343d]/5 p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#16343d]">Message sent</p>
        <p className="mt-3 text-sm leading-6 text-[#46555a]">
          Thank you — our concierge has your enquiry and will reply by email shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-10 grid max-w-xl gap-4">
      {state.error ? (
        <p className="rounded-[12px] border border-[#16343d]/30 bg-[#16343d]/5 px-4 py-3 text-[13px] text-[#16343d]">
          {state.error}
        </p>
      ) : null}

      <Field label="Your name" name="name" error={state.fieldErrors?.name} autoComplete="name" />
      <Field label="Email address" name="email" type="email" error={state.fieldErrors?.email} autoComplete="email" />
      <Field label="Subject (optional)" name="subject" error={state.fieldErrors?.subject} />

      <label className="block">
        <span className="mb-1.5 block text-[12px] text-[#46555a]">Message</span>
        <textarea
          name="message"
          rows={6}
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          className={`w-full rounded-[10px] border bg-[#eef0ef] px-4 py-3 text-sm outline-none transition-colors focus:border-[#16343d] ${
            state.fieldErrors?.message ? "border-[#16343d]" : "border-[#cbd2d2]"
          }`}
        />
        {state.fieldErrors?.message ? (
          <span className="mt-1 block text-[11px] text-[#16343d]">{state.fieldErrors.message}</span>
        ) : null}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 grid h-13 w-fit place-items-center bg-[#16343d] px-10 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#eef0ef] transition-colors hover:bg-[#0f252b] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] text-[#46555a]">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        className={`h-12 w-full rounded-[10px] border bg-[#eef0ef] px-4 text-sm outline-none transition-colors focus:border-[#16343d] ${
          error ? "border-[#16343d]" : "border-[#cbd2d2]"
        }`}
      />
      {error ? <span className="mt-1 block text-[11px] text-[#16343d]">{error}</span> : null}
    </label>
  );
}
