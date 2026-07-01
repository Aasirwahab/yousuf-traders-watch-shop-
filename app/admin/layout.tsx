import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin/auth";
import { AdminSidebar } from "./_components/AdminSidebar";

// Server gate for the whole /admin tree. requireAdmin() 404s any non-admin, so
// no admin child page or data ever renders for an unauthorised visitor. Also
// provides the shared shell (sidebar + content column) for every admin page.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[#f5f7f6] text-[#111719]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1720px] flex-col lg:flex-row">
        <AdminSidebar />
        <section className="min-w-0 flex-1 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">{children}</section>
      </div>
    </main>
  );
}
