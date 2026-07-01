import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "../_components/PageHeader";

// Read-only configuration overview. These values are managed via environment
// variables (see .env), so this page reports them rather than editing them —
// changing them means updating .env and restarting.
export default async function AdminSettingsPage() {
  const user = await currentUser();
  const adminEmail = user?.primaryEmailAddress?.emailAddress ?? "—";

  const adminCount = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim()).filter(Boolean).length;
  const lkrPerUsd = process.env.NEXT_PUBLIC_LKR_PER_USD || "300";
  const imageKitReady = Boolean(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT);

  const rows: { label: string; value: string; note?: string }[] = [
    { label: "Signed in as", value: adminEmail },
    { label: "Admin allowlist", value: `${adminCount} email${adminCount === 1 ? "" : "s"}`, note: "ADMIN_EMAILS in .env" },
    { label: "Display currency", value: `LKR at ${lkrPerUsd} per USD`, note: "NEXT_PUBLIC_LKR_PER_USD (charged in USD)" },
    { label: "ImageKit", value: imageKitReady ? "Connected" : "Not configured", note: "product image storage" },
  ];

  return (
    <>
      <PageHeader title="Settings" description="Store configuration (managed via environment variables)." />

      <div className="mt-6 max-w-2xl divide-y divide-[#e5eae8] rounded-lg border border-[#d9dfdd] bg-white">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[#101719]">{row.label}</p>
              {row.note ? <p className="mt-0.5 text-xs text-[#8b969a]">{row.note}</p> : null}
            </div>
            <p className="shrink-0 text-sm font-medium text-[#485357]">{row.value}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 max-w-2xl text-xs leading-5 text-[#7a8589]">
        To add an admin, append their email to <code className="rounded bg-[#f2f5f4] px-1">ADMIN_EMAILS</code> in
        <code className="rounded bg-[#f2f5f4] px-1">.env</code> (comma-separated) and restart the server.
      </p>
    </>
  );
}
