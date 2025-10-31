"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { WizardStepDefinition } from "@/components/wizard/steps";
import { useWizardForm } from "@/components/wizard/use-wizard-form";
import { cn } from "@/lib/utils/cn";

interface WizardStepProps {
  step: WizardStepDefinition;
  form: ReturnType<typeof useWizardForm>;
  completed: boolean;
  onToggleComplete: () => void;
}

export function WizardStep({ step, form, completed, onToggleComplete }: WizardStepProps) {
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const runValidation = () => {
    const newErrors: Record<string, string | null> = {};
    step.inputs?.forEach((input) => {
      if (!input.validator) return;
      newErrors[input.key] = input.validator(form.values[input.key]);
    });
    setErrors(newErrors);
    return Object.values(newErrors).every((value) => value === null || value === undefined);
  };

  const statusTone = useMemo(() => {
    if (completed) return "bg-emerald-100 text-emerald-700";
    if (step.inputs && step.inputs.length > 0) {
      const hasErrors = step.inputs.some((input) => {
        const validator = input.validator;
        if (!validator) return false;
        return Boolean(validator(form.values[input.key]));
      });
      return hasErrors ? "bg-amber-100 text-amber-700" : "bg-primary-100 text-primary-700";
    }
    return "bg-primary-100 text-primary-700";
  }, [completed, form.values, step.inputs]);

  return (
    <section className="material-card space-y-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Wizard Step</p>
          <h2 className="text-2xl font-semibold text-slate-900">{step.title}</h2>
          <p className="text-sm text-slate-600">{step.description}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            const valid = runValidation();
            if (valid) onToggleComplete();
          }}
          className={cn(
            "self-start rounded-full px-4 py-2 text-sm font-medium shadow transition",
            completed ? "bg-emerald-500 text-white" : "bg-primary-500 text-white hover:bg-primary-600"
          )}
        >
          {completed ? "Als offen markieren" : "Als erledigt markieren"}
        </button>
      </header>
      {step.inputs && (
        <div className="grid gap-4 md:grid-cols-2">
          {step.inputs.map((input) => (
            <label key={input.key} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">{input.label}</span>
              <input
                value={form.values[input.key]}
                onChange={(event) => form.update(input.key, event.target.value)}
                placeholder={input.placeholder}
                className={cn(
                  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200",
                  errors[input.key] ? "border-red-400" : undefined
                )}
              />
              {errors[input.key] ? (
                <span className="text-xs text-red-600">{errors[input.key]}</span>
              ) : (
                <span className="text-xs text-slate-500">{input.helper ?? "Wert bleibt lokal gespeichert."}</span>
              )}
            </label>
          ))}
        </div>
      )}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Code Snippets</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {step.snippets.map((snippet) => {
            const code = snippet.template(form.values);
            return (
              <div key={snippet.label} className="material-section">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{snippet.label}</span>
                  <CopyButton text={code} />
                </div>
                <pre className="overflow-auto rounded-lg bg-slate-900/90 p-4 text-xs text-slate-100">
                  <code>{code}</code>
                </pre>
              </div>
            );
          })}
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Validierungen</h3>
        <ul className="space-y-2">
          {step.validators.map((validator) => (
            <li key={validator.label} className={cn("flex flex-col rounded-lg px-3 py-2 text-sm", statusTone)}>
              <span className="font-semibold">{validator.label}</span>
              <span>{validator.description}</span>
              {validator.command && (
                <code className="mt-1 rounded bg-black/10 px-2 py-1 text-xs font-mono">
                  {validator.command(form.values)}
                </code>
              )}
              {validator.endpoint && (
                <code className="mt-1 rounded bg-black/10 px-2 py-1 text-xs font-mono">
                  {validator.endpoint(form.values)}
                </code>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
