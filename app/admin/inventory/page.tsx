import { listInventory } from "@/lib/admin/queries";
import { PageHeader } from "../_components/PageHeader";
import { InventoryTable } from "../_components/InventoryTable";

export default async function AdminInventoryPage() {
  const rows = await listInventory();
  const lowOrOut = rows.filter((r) => r.stock <= 3).length;

  return (
    <>
      <PageHeader
        title="Inventory"
        description={`${rows.length} products · ${lowOrOut} at or below the low-stock line (3). Lowest stock first.`}
      />
      <InventoryTable rows={rows} />
    </>
  );
}
