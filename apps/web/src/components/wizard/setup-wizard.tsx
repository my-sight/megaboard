"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { MaterialCard } from "@/components/ui/material-card";
import { WizardStep } from "@/components/wizard/wizard-step";
import { useWizardForm } from "@/components/wizard/use-wizard-form";
import { steps } from "@/components/wizard/steps";

export function SetupWizard() {
  const form = useWizardForm();
  const [completed, setCompleted] = useState<string[]>([]);

  const status = useMemo(
    () => ({
      total: steps.length,
      done: completed.length
    }),
    [completed.length]
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10">
      <MaterialCard>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-slate-900">mysight Setup Wizard</h1>
          <p className="text-sm text-slate-600">
            Geführter Installer für Raspberry Pi 4 + Supabase + Cloudflare Tunnel. Deine Eingaben werden ausschließlich lokal im Browser gespeichert.
          </p>
          <p className="rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-700">
            Zugriff nur für Superuser (z.B. michael@mysight.net). Nach Abschluss Zugang wieder sperren.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-primary-500/10 px-3 py-1 font-medium text-primary-700">
              Fortschritt: {status.done} / {status.total} Schritte
            </span>
            <CopyButton text={JSON.stringify(form.values, null, 2)} label="Konfiguration kopieren" />
          </div>
        </div>
      </MaterialCard>
      <div className="space-y-6">
        {steps.map((step) => (
          <WizardStep
            key={step.id}
            step={step}
            form={form}
            completed={completed.includes(step.id)}
            onToggleComplete={() =>
              setCompleted((prev) =>
                prev.includes(step.id) ? prev.filter((id) => id !== step.id) : [...prev, step.id]
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
