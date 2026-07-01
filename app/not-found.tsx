import Link from "next/link";

// Shown for unmatched routes and any notFound() call (e.g. an order a session
// isn't allowed to view).
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#eef0ef] px-5 text-[#101416]">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#687276]">
          404
        </p>
        <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-normal leading-[1] tracking-[-0.05em]">
          This page can&apos;t be found.
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#687276]">
          The page you&apos;re looking for may have moved or no longer exists.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="grid h-12 place-items-center rounded-full bg-[#16343d] px-7 text-sm text-[#eef0ef]"
          >
            Return home
          </Link>
          <Link
            href="/watches"
            className="grid h-12 place-items-center rounded-full border border-[#16343d] px-7 text-sm"
          >
            Browse watches
          </Link>
        </div>
      </div>
    </main>
  );
}
