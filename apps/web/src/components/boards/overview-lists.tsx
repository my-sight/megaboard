"use client";

import { TenantDescriptor } from "@/lib/utils/tenantRegistry";
import { cn } from "@/lib/utils/cn";

const ESCALATION_LEVELS = [
  { label: "Keine", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Beobachtung", tone: "bg-amber-50 text-amber-700" },
  { label: "Kritisch", tone: "bg-red-50 text-red-600" }
];

const TOP_TOPICS = ["Qualitätssicherung", "Lieferkette", "Sprintplanung", "Stakeholder-Update", "Budget"];

export function OverviewLists({ tenant }: { tenant: TenantDescriptor }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Eskalationsstatus</h3>
        <ul className="mt-2 space-y-2">
          {ESCALATION_LEVELS.map((level) => (
            <li key={level.label} className={cn("rounded-lg px-3 py-2 text-sm", level.tone)}>
              {level.label}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Top Themen</h3>
        <ul className="mt-2 space-y-2">
          {TOP_TOPICS.map((topic) => (
            <li key={topic} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
              {topic}
            </li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-slate-500">
        {tenant.isDemo
          ? "Demomandant – Änderungen deaktiviert."
          : "Produktionsmandant – Änderungen über Boards möglich."}
      </p>
    </div>
  );
}
