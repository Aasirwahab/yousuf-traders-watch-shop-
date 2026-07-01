import { listOrders } from "@/lib/admin/queries";
import { PageHeader } from "../_components/PageHeader";
import { OrdersTable } from "../_components/OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <>
      <PageHeader
        title="Orders"
        description={`${orders.length} order${orders.length === 1 ? "" : "s"}, newest first.`}
      />
      <OrdersTable orders={orders} />
    </>
  );
}
