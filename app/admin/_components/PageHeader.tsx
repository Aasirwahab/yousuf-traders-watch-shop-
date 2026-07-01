import type { ReactNode } from "react";

// Shared header for admin sub-pages: title, optional description, optional
// right-aligned action slot (e.g. a "New product" button).
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#d9dfdd] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[#101719]">{title}</h1>
        {description ? <p className="mt-2 text-sm text-[#667176]">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}
