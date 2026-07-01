"use client";

import { useState, useTransition } from "react";
import { adjustStock } from "../products/actions";

type Row = {
  id: string;
  brand: string;
  name: string;
  reference: string;
  stock: number;
  published: boolean;
};

function StockCell({ id, stock }: { id: string; stock: number }) {
  const [value, setValue] = useState(stock);
  const [saved, setSaved] = useState<null | "ok" | "err">(null);
  const [pending, startTransition] = useTransition();
  const dirty = value !== stock;

  function save() {
    setSaved(null);
    startTransition(async () => {
      const res = await adjustStock(id, value);
      setSaved(res.ok ? "ok" : "err");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => {
          setValue(Math.max(0, Number(e.target.value)));
          setSaved(null);
        }}
        className="h-9 w-20 rounded-lg border border-[#d5dcda] bg-white px-2 text-sm outline-none focus:border-[#0f766e]"
      />
      <button
        onClick={save}
        disabled={!dirty || pending}
        className="h-9 rounded-lg bg-[#101719] px-3 text-xs font-semibold text-white disabled:opacity-40"
      >
        {pending ? "…" : "Save"}
      </button>
      {saved === "ok" ? <span className="text-xs text-[#0f766e]">Saved</span> : null}
      {saved === "err" ? <span className="text-xs text-[#a14632]">Failed</span> : null}
    </div>
  );
}

export function InventoryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="mt-5 rounded-lg border border-[#d9dfdd] bg-white shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-[#f7f9f8] text-xs uppercase tracking-[0.14em] text-[#7a8589]">
            <tr>
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-5 py-3 font-semibold">Reference</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5eae8]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#7a8589]">
                  No products yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-[#f8faf9]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#101719]">{r.name}</p>
                    <p className="text-xs text-[#8b969a]">{r.brand}</p>
                  </td>
                  <td className="px-5 py-4 text-[#485357]">{r.reference}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${
                        r.stock === 0
                          ? "bg-[#f7e9e5] text-[#a14632]"
                          : r.stock <= 3
                            ? "bg-[#fbefd9] text-[#9a6419]"
                            : "bg-[#e5f3ef] text-[#0f766e]"
                      }`}
                    >
                      {r.stock === 0 ? "Out of stock" : r.stock <= 3 ? "Low" : "In stock"}
                      {!r.published ? " · draft" : ""}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StockCell id={r.id} stock={r.stock} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
