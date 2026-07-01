import { listCustomers } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "../_components/PageHeader";

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${customers.length} registered customer${customers.length === 1 ? "" : "s"}.`}
      />

      <div className="mt-5 rounded-lg border border-[#d9dfdd] bg-white shadow-[0_12px_30px_rgba(26,35,38,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#f7f9f8] text-xs uppercase tracking-[0.14em] text-[#7a8589]">
              <tr>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Orders</th>
                <th className="px-5 py-3 font-semibold">Total spent</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eae8]">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-[#7a8589]">
                    No customers yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#f8faf9]">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#101719]">{c.name ?? "—"}</p>
                      <p className="text-xs text-[#8b969a]">{c.email ?? "—"}</p>
                    </td>
                    <td className="px-5 py-4 text-[#485357]">{c.orderCount}</td>
                    <td className="px-5 py-4 font-semibold">{formatPrice(c.totalSpent)}</td>
                    <td className="px-5 py-4 text-[#59646a]">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
