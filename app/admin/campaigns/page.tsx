import { Sparkles } from "lucide-react";
import { PageHeader } from "../_components/PageHeader";

// Placeholder: there is no promotions/discounts data model yet. Rather than show
// invented figures, this page states honestly what's needed to make it real.
export default function AdminCampaignsPage() {
  return (
    <>
      <PageHeader title="Campaigns" description="Promotions, discount codes, and featured collections." />

      <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#cdd6d3] bg-white px-6 py-16 text-center">
        <div className="grid size-12 place-items-center rounded-xl bg-[#eef2f1] text-[#0f766e]">
          <Sparkles size={22} />
        </div>
        <h2 className="mt-4 text-lg font-semibold tracking-tight text-[#101719]">No campaigns yet</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#667176]">
          Campaigns aren&apos;t wired up because there&apos;s no promotions data model. To make this
          page functional we&apos;d add a <code className="rounded bg-[#f2f5f4] px-1">Campaign</code> /
          <code className="rounded bg-[#f2f5f4] px-1">DiscountCode</code> table (code, type, value,
          date range, usage limit) plus checkout logic to apply it. Say the word and I&apos;ll spec it.
        </p>
      </div>
    </>
  );
}
