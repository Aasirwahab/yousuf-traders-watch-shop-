import Link from "next/link";

// Shown for unmatched routes and any notFound() call (e.g. an order a session
// isn't allowed to view).
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 text-black">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6e6e6b]">
          404
        </p>
        <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-normal leading-[1] tracking-[-0.05em]">
          This page can&apos;t be found.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#6e6e6b]">
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="grid h-12 place-items-center rounded-full bg-black px-7 text-sm text-white"
          >
            Return home
          </Link>
          <Link
            href="/watches"
            className="grid h-12 place-items-center rounded-full border border-black px-7 text-sm"
          >
            Browse watches
          </Link>
        </div>
      </div>
    </main>
  );
}
