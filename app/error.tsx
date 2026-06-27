"use client";

import Link from "next/link";
import { useEffect } from "react";

// Route-segment error boundary. Catches unhandled errors thrown while rendering
// a page so shoppers see a calm recovery screen instead of a raw stack trace.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 text-black">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">
          Something went wrong
        </p>
        <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-normal leading-[1] tracking-[-0.05em]">
          An unexpected error occurred.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#6e6e6b]">
          Please try again. If the problem continues, return home and start over.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="grid h-12 place-items-center rounded-full bg-black px-7 text-sm text-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="grid h-12 place-items-center rounded-full border border-black px-7 text-sm"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
