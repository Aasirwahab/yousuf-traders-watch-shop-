"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "../actions";

export function OrderStatusControl({ orderId }: { orderId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function set(status: string) {
    setError(null);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => set("FULFILLED")}
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg bg-[#101719] px-4 text-sm font-semibold text-white disabled:opacity-60"
        >
          Mark fulfilled
        </button>
        <button
          onClick={() => set("CANCELLED")}
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg border border-[#d5dcda] bg-white px-4 text-sm font-medium text-[#394246] disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={() => set("REFUNDED")}
          disabled={pending}
          className="inline-flex h-10 items-center rounded-lg border border-[#f0c9bd] bg-[#faeadf] px-4 text-sm font-medium text-[#9a4e27] disabled:opacity-60"
        >
          Refund
        </button>
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-[#a14632]">{error}</p> : null}
    </div>
  );
}
