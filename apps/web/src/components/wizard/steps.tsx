import { WizardValues } from "@/components/wizard/use-wizard-form";
import { z } from "zod";

export interface WizardInput {
  key: keyof WizardValues;
  label: string;
  placeholder?: string;
  helper?: string;
  validator?: (value: string) => string | null;
}

export interface WizardSnippet {
  label: string;
  language: "bash" | "sql" | "yaml" | "json" | "ini" | "ts";
  template: (values: WizardValues) => string;
}

export interface WizardValidator {
  label: string;
  description: string;
  command?: (values: WizardValues) => string;
  endpoint?: (values: WizardValues) => string;
}

export interface WizardStepDefinition {
  id: string;
  title: string;
  description: string;
  inputs?: WizardInput[];
  snippets: WizardSnippet[];
  validators: WizardValidator[];
}

const urlSchema = z.string().url({ message: "Muss eine gültige URL sein" });

export const steps: WizardStepDefinition[] = [
  {
    id: "prerequisites",
    title: "Prüfungen & Voraussetzungen",
    description: "Verifiziere, dass dein Raspberry Pi vorbereitet ist.",
    inputs: [
      {
        key: "piHost",
        label: "Raspberry Pi Hostname",
        placeholder: "pi.mysight.net",
        validator: (value) => (value.length < 3 ? "Hostname zu kurz" : null)
      },
      {
        key: "piUser",
        label: "SSH Benutzer",
        placeholder: "pi",
        validator: (value) => (value.length === 0 ? "Pflichtfeld" : null)
      }
    ],
    snippets: [
      {
        label: "System vorbereiten",
        language: "bash",
        template: () =>
          `sudo apt update && sudo apt upgrade -y\ncurl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\nsudo apt install -y nodejs git cloudflared\nnpm install -g pnpm`
      }
    ],
    validators: [
      {
        label: "Node Version",
        description: "Stelle sicher, dass Node.js 20 installiert ist",
        command: () => "node -v"
      },
      {
        label: "cloudflared Version",
        description: "Prüfe den Tunnel-Client",
        command: () => "cloudflared --version"
      }
    ]
  },
  {
    id: "cloudflare",
    title: "Domain & Cloudflare Tunnel",
    description: "Erzeuge Tunnel und DNS für alle Subdomains.",
    inputs: [
      {
        key: "cloudflareTunnelName",
        label: "Tunnel Name",
        placeholder: "mysight-pi",
        validator: (value) => (value.length === 0 ? "Pflichtfeld" : null)
      },
      {
        key: "siteDomain",
        label: "Primäre Domain",
        placeholder: "mysight.net",
        validator: (value) => (value.includes(".") ? null : "Ungültige Domain")
      }
    ],
    snippets: [
      {
        label: "cloudflared login",
        language: "bash",
        template: () => "cloudflared tunnel login"
      },
      {
        label: "Tunnel erstellen",
        language: "bash",
        template: (values) => `cloudflared tunnel create ${values.cloudflareTunnelName}`
      },
      {
        label: "DNS Routen",
        language: "bash",
        template: (values) =>
          ["weber", "tryout", "www"]
            .map((sub) => `cloudflared tunnel route dns ${values.cloudflareTunnelName} ${sub}.${values.siteDomain}`)
            .join("\n")
      },
      {
        label: "cloudflared config",
        language: "yaml",
        template: (values) =>
          `tunnel: ${values.cloudflareTunnelName}\ncredentials-file: /home/pi/.cloudflared/${values.cloudflareTunnelName}.json\ningress:\n  - hostname: weber.${values.siteDomain}\n    service: http://localhost:3000\n  - hostname: tryout.${values.siteDomain}\n    service: http://localhost:3000\n  - hostname: www.${values.siteDomain}\n    service: http://localhost:8080\n  - service: http_status:404\n`
      }
    ],
    validators: [
      {
        label: "Tunnel Status",
        description: "cloudflared tunnel list",
        command: () => "cloudflared tunnel list"
      },
      {
        label: "DNS Check",
        description: "Nutze dig, um CNAME-Einträge zu prüfen",
        command: (values) => `dig +short weber.${values.siteDomain}`
      }
    ]
  },
  {
    id: "supabase",
    title: "Supabase – Projekt & Keys",
    description: "Setze SQL-Schema, Policies und Seeds auf deinem Supabase Projekt um.",
    inputs: [
      {
        key: "supabaseUrl",
        label: "Supabase URL",
        placeholder: "https://project.supabase.co",
        validator: (value) => {
          const result = urlSchema.safeParse(value);
          return result.success ? null : result.error.issues[0]?.message ?? "Ungültige URL";
        }
      },
      {
        key: "supabaseAnonKey",
        label: "Supabase anon key",
        placeholder: "",
        validator: (value) => (value.length < 10 ? "Key zu kurz" : null)
      },
      {
        key: "supabaseServiceRoleKey",
        label: "Supabase service role key",
        placeholder: "",
        validator: (value) => (value.length < 10 ? "Key zu kurz" : null)
      }
    ],
    snippets: [
      {
        label: "Schema anwenden",
        language: "sql",
        template: () => "-- kopiere supabase/schema.sql in den Supabase SQL Editor"
      },
      {
        label: "Policies anwenden",
        language: "sql",
        template: () => "-- kopiere supabase/policies.sql"
      },
      {
        label: "Seeds anwenden",
        language: "sql",
        template: () => "-- kopiere supabase/seed.sql"
      },
      {
        label: "Environment",
        language: "ini",
        template: (values) =>
          `NEXT_PUBLIC_SUPABASE_URL=${values.supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${values.supabaseAnonKey}\nSUPABASE_SERVICE_ROLE_KEY=${values.supabaseServiceRoleKey}`
      }
    ],
    validators: [
      {
        label: "select 1",
        description: "Teste den REST SQL Endpoint",
        endpoint: (values) => `${values.supabaseUrl}/rest/v1` // placeholder for wizard UI
      }
    ]
  },
  {
    id: "app-config",
    title: "App Konfiguration",
    description: "Pflege ENV-Dateien und Projektkonfiguration.",
    snippets: [
      {
        label: ".env.local",
        language: "ini",
        template: (values) =>
          `NEXT_PUBLIC_SITE_DOMAIN=${values.siteDomain}\nNEXT_PUBLIC_TRYOUT_TENANT=${values.tryoutTenant}\nNEXT_PUBLIC_SUPABASE_URL=${values.supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${values.supabaseAnonKey}\nSUPABASE_SERVICE_ROLE_KEY=${values.supabaseServiceRoleKey}`
      },
      {
        label: "config.ts Vorschau",
        language: "ts",
        template: (values) =>
          `export const appConfig = {\n  siteDomain: "${values.siteDomain}",\n  tryoutTenant: "${values.tryoutTenant}",\n  supabase: {\n    url: "${values.supabaseUrl}",\n    anonKey: "${values.supabaseAnonKey}"\n  }\n};`
      }
    ],
    validators: [
      {
        label: "Next Ready",
        description: "curl https://weber.<domain>/api/ready",
        command: (values) => `curl -fsS https://weber.${values.siteDomain}/api/ready`
      }
    ]
  },
  {
    id: "pi-bootstrap",
    title: "Raspberry Pi Bootstrap",
    description: "Richte Dienste und systemd Units ein.",
    snippets: [
      {
        label: "pi_bootstrap.sh",
        language: "bash",
        template: () => "# siehe scripts/pi_bootstrap.sh"
      },
      {
        label: "systemd Status",
        language: "bash",
        template: () => "sudo systemctl status mysight-web"
      }
    ],
    validators: [
      {
        label: "Healthcheck",
        description: "curl http://localhost:3000/healthz",
        command: () => "curl -fsS http://localhost:3000/healthz"
      }
    ]
  },
  {
    id: "deploy",
    title: "Build & Deploy",
    description: "Automatisiere Deployment via GitHub Actions & Skripte.",
    snippets: [
      {
        label: "pi_deploy.sh",
        language: "bash",
        template: () => "# siehe scripts/pi_deploy.sh"
      },
      {
        label: "GitHub Actions Secrets",
        language: "json",
        template: (values) =>
          JSON.stringify(
            {
              PI_HOST: values.piHost,
              PI_USER: values.piUser,
              SITE_DOMAIN: values.siteDomain,
              NEXT_PUBLIC_SUPABASE_URL: values.supabaseUrl
            },
            null,
            2
          )
      }
    ],
    validators: [
      {
        label: "Ready Endpoint",
        description: "curl https://tryout.<domain>/api/ready",
        command: (values) => `curl -fsS https://tryout.${values.siteDomain}/api/ready`
      }
    ]
  },
  {
    id: "tenants",
    title: "Mandanten & Rechte",
    description: "SQL-Snippets zum Erweitern der Mandantenliste.",
    snippets: [
      {
        label: "Neuer Tenant",
        language: "sql",
        template: () =>
          "insert into tenants (id, slug, name) values (gen_random_uuid(), 'neuerkunde', 'Neuer Kunde');\ninsert into domain_routes (subdomain, tenant_id) select 'neuerkunde', id from tenants where slug = 'neuerkunde';"
      }
    ],
    validators: [
      {
        label: "RLS Smoke",
        description: "Tryout darf nicht schreiben",
        command: () => "supabase functions invoke tryout_write_test"
      }
    ]
  },
  {
    id: "tests",
    title: "Tests & Abschluss",
    description: "Führe Vitest & Playwright aus.",
    snippets: [
      {
        label: "Vitest",
        language: "bash",
        template: () => "npm run test"
      },
      {
        label: "Playwright",
        language: "bash",
        template: () => "npx playwright test --project=chromium"
      }
    ],
    validators: [
      {
        label: "Checkliste",
        description: "Überprüfe Healthchecks & Tunnel"
      }
    ]
  }
];
