import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderDetail } from "@/lib/admin/queries";
import { formatUsd } from "@/lib/format";
import { PageHeader } from "../../_components/PageHeader";
import { OrderStatusControl } from "../../_components/OrderStatusControl";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-[#faeadf] text-[#9a4e27]",
  PAID: "bg-[#e5f3ef] text-[#0f766e]",
  FULFILLED: "bg-[#e8eef6] text-[#355c89]",
  CANCELLED: "bg-[#f1f3f2] text-[#6b7671]",
  REFUNDED: "bg-[#f7e9e5] text-[#a14632]",
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderDetail(id);
  if (!order) notFound();

  return (
    <>
      <PageHeader
        title={order.orderNumber}
        description={`Placed ${order.createdAt.toLocaleString("en-US")}`}
        action={
          <Link href="/admin/orders" className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#d5dcda] bg-white px-4 text-sm font-medium text-[#394246]">
            <ArrowLeft size={16} /> Back
          </Link>
        }
      />

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Items</h2>
              <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status] ?? ""}`}>
                {order.status}
              </span>
            </div>
            <div className="mt-4 divide-y divide-[#e5eae8]">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#101719]">{item.brand} {item.name}</p>
                    <p className="text-xs text-[#7a8589]">{item.reference} · qty {item.quantity}</p>
                  </div>
                  <p className="shrink-0 font-semibold">{formatUsd(item.lineTotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-[#e1e6e4] pt-4 text-sm">
              <Row label="Subtotal" value={formatUsd(order.subtotal)} />
              <Row label={`Shipping (${order.shippingMethod})`} value={formatUsd(order.shippingCost)} />
              <div className="flex justify-between pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatUsd(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">Shipping address</h2>
            <div className="mt-3 text-sm leading-6 text-[#485357]">
              <p className="font-medium text-[#101719]">{order.shipName}</p>
              {order.shipPhone ? <p>{order.shipPhone}</p> : null}
              <p>{order.shipLine1}</p>
              {order.shipLine2 ? <p>{order.shipLine2}</p> : null}
              <p>{order.shipCity}{order.shipState ? `, ${order.shipState}` : ""} {order.shipPostal}</p>
              <p>{order.shipCountry}</p>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5">
            <h2 className="text-lg font-semibold tracking-tight">Update status</h2>
            <p className="mt-1 text-sm text-[#667176]">Payment state (PAID) is set by the PayPal flow.</p>
            <div className="mt-4">
              <OrderStatusControl orderId={order.id} />
            </div>
          </section>

          <section className="rounded-lg border border-[#d9dfdd] bg-white p-5 text-sm">
            <h2 className="text-lg font-semibold tracking-tight">Customer &amp; payment</h2>
            <div className="mt-3 space-y-1 text-[#485357]">
              <Row label="Email" value={order.email} />
              <Row label="Payment" value={order.paymentProvider ?? "—"} />
              {order.paymentRef ? <Row label="Reference" value={order.paymentRef} /> : null}
              <Row label="Paid at" value={order.paidAt ? order.paidAt.toLocaleString("en-US") : "—"} />
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#7a8589]">{label}</span>
      <span className="min-w-0 truncate text-right text-[#485357]">{value}</span>
    </div>
  );
}
