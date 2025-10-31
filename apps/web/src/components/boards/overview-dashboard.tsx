"use client";

import { useMemo } from "react";
import { TenantDescriptor } from "@/lib/utils/tenantRegistry";
import { MaterialCard } from "@/components/ui/material-card";
import { OverviewCharts } from "@/components/boards/overview-charts";
import { OverviewLists } from "@/components/boards/overview-lists";

export interface OverviewDashboardProps {
  tenant: TenantDescriptor;
}

export function OverviewDashboard({ tenant }: OverviewDashboardProps) {
  const summary = useMemo(
    () => ({
      activeProjects: tenant.isDemo ? 4 : 12,
      teamFlowItems: tenant.isDemo ? 7 : 28,
      escalations: tenant.isDemo ? 0 : 3,
      topTopics: tenant.isDemo ? 5 : 9
    }),
    [tenant]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <MaterialCard className="lg:col-span-2">
        <h2 className="text-xl font-semibold text-slate-900">Projekt- & Teamüberblick</h2>
        <p className="text-sm text-slate-600">
          Kennzahlen für {tenant.name}. Tryout-Mandanten bleiben schreibgeschützt.
        </p>
        <OverviewCharts summary={summary} />
      </MaterialCard>
      <MaterialCard>
        <h2 className="text-xl font-semibold text-slate-900">Eskalationen & Themen</h2>
        <OverviewLists tenant={tenant} />
      </MaterialCard>
    </div>
  );
}
