import { notFound } from "next/navigation";
import { Suspense } from "react";
import { OverviewDashboard } from "@/components/boards/overview-dashboard";
import { tenantRegistry } from "@/lib/utils/tenantRegistry";

export default function OverviewPage({ params }: { params: { tenant: string } }) {
  const tenant = tenantRegistry.find((item) => item.slug === params.tenant);
  if (!tenant) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="p-10 text-slate-500">Lade Übersichtsboard…</div>}>
      <OverviewDashboard tenant={tenant} />
    </Suspense>
  );
}
