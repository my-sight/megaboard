"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "mysight-setup-values";

export interface WizardValues {
  siteDomain: string;
  tryoutTenant: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  cloudflareAccountId: string;
  cloudflareTunnelName: string;
  piHost: string;
  piUser: string;
}

const DEFAULTS: WizardValues = {
  siteDomain: "mysight.net",
  tryoutTenant: "tryout",
  supabaseUrl: "https://project.supabase.co",
  supabaseAnonKey: "",
  supabaseServiceRoleKey: "",
  cloudflareAccountId: "",
  cloudflareTunnelName: "mysight-pi",
  piHost: "pi.mysight.net",
  piUser: "pi"
};

export function useWizardForm() {
  const [values, setValues] = useState<WizardValues>(DEFAULTS);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setValues({ ...DEFAULTS, ...JSON.parse(stored) });
      } catch (error) {
        console.warn("Konnte gespeicherte Wizard-Werte nicht lesen", error);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  }, [values]);

  const update = useMemo(
    () =>
      function updateValue(key: keyof WizardValues, value: string) {
        setValues((prev) => ({ ...prev, [key]: value }));
      },
    []
  );

  return { values, update } as const;
}
