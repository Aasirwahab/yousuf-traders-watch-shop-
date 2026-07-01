import { getAdminDashboardData } from "@/lib/admin/metrics";
import { resolveRange } from "@/lib/admin/ranges";
import { AdminDashboard } from "./_components/AdminDashboard";

// Admin overview. A server component so every figure is fetched (and gated)
// server-side; the interactive shell lives in AdminDashboard. The selected time
// range is a URL param so switching it is a fresh server fetch, not client data.
export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const data = await getAdminDashboardData(resolveRange(range));

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return <AdminDashboard data={data} todayLabel={todayLabel} />;
}
