"use client";

import { useMemo, useState } from "react";
import { TenantDescriptor } from "@/lib/utils/tenantRegistry";
import { MaterialCard } from "@/components/ui/material-card";
import { cn } from "@/lib/utils/cn";
import { canWrite } from "@/lib/guards/tenant";

const PRIORITIES = ["P1", "P2", "P3", "P4", "P5"] as const;
const PROJECT_PHASES = ["Entdeckung", "Planung", "Durchführung", "Übergabe"];

interface MockCard {
  id: string;
  title: string;
  assignee: string;
  priority: (typeof PRIORITIES)[number];
  due: string;
  phase: string;
}

const MOCK_CARDS: MockCard[] = PRIORITIES.map((priority, index) => ({
  id: `card-${priority}`,
  title: `Projekt ${priority}`,
  assignee: ["Alex", "Mira", "Lars", "Sven", "Sara"][index]!,
  priority,
  due: new Date(Date.now() + index * 86400000).toISOString(),
  phase: PROJECT_PHASES[index % PROJECT_PHASES.length]!
}));

export function BoardHub({ tenant }: { tenant: TenantDescriptor }) {
  const [selectedPriority, setSelectedPriority] = useState<(typeof PRIORITIES)[number] | "ALL">("ALL");

  const cards = useMemo(() => {
    if (selectedPriority === "ALL") return MOCK_CARDS;
    return MOCK_CARDS.filter((card) => card.priority === selectedPriority);
  }, [selectedPriority]);

  const membership = useMemo(
    () => ({ tenantSlug: tenant.slug, role: tenant.isDemo ? "GUEST" : "ADMIN", isDemo: tenant.isDemo }),
    [tenant]
  );

  return (
    <div className="space-y-6">
      <MaterialCard>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Projektboards</h2>
            <p className="text-sm text-slate-600">Material Design inspiriertes Kanban mit Prioritäten und Phasen.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priorität</span>
            <div className="flex gap-2">
              {["ALL", ...PRIORITIES].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setSelectedPriority(priority as typeof PRIORITIES[number] | "ALL")}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition",
                    selectedPriority === priority
                      ? "bg-primary-500 text-white shadow"
                      : "bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-700"
                  )}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article key={card.id} className="material-section space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{card.priority}</span>
                <span className="text-xs text-slate-500">Fällig: {new Date(card.due).toLocaleDateString("de-DE")}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              <p className="text-sm text-slate-600">Phase: {card.phase}</p>
              <footer className="flex items-center justify-between text-sm text-slate-500">
                <span>Bearbeiter*in: {card.assignee}</span>
                <span>{tenant.isDemo ? "Nur Lesen" : "Bearbeiten"}</span>
              </footer>
            </article>
          ))}
        </div>
      </MaterialCard>
      <MaterialCard>
        <h2 className="text-xl font-semibold text-slate-900">Aktionen</h2>
        <p className="text-sm text-slate-600">
          {canWrite(membership)
            ? "Du kannst Karten aktualisieren, Swimlanes konfigurieren und Eskalationen anlegen."
            : "Schreibrechte sind deaktiviert. Tryout-Mandanten bleiben read-only."}
        </p>
      </MaterialCard>
    </div>
  );
}
