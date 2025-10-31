"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { tenantRegistry } from "@/lib/utils/tenantRegistry";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: (slug: string) => `/${slug}/overview`, label: "Overview" },
  { href: (slug: string) => `/${slug}/boards`, label: "Boards" }
];

export function TenantShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const tenantSlug = pathname.split("/").filter(Boolean)[0] ?? "";
  const tenant = tenantRegistry.find((item) => item.slug === tenantSlug);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Mandant</p>
            <h1 className="text-2xl font-semibold text-slate-900">{tenant?.name ?? tenantSlug}</h1>
          </div>
          <nav className="flex gap-3">
            {NAV_ITEMS.map((item) => {
              const href = item.href(tenantSlug);
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={item.label}
                  href={href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    isActive
                      ? "bg-primary-500 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-8">{children}</div>
      </main>
    </div>
  );
}
