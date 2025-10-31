# mysight – Multi-Mandanten Projekt- & Teamboards

Dieses Repository liefert das komplette Produktions-Setup für mysight inkl. Next.js 14 App, Supabase-Schema, Setup-Wizard und Raspberry-Pi Deployment.

## Struktur

```
mysight/
  apps/web/              # Next.js App mit Material Design UI und Setup Wizard
  prisma/schema.prisma   # Prisma Datenmodell passend zur Supabase DB
  supabase/*.sql         # Schema, Policies, Seeds
  scripts/               # Raspberry-Pi & Cloudflare Hilfen
  tests/                 # Vitest & Playwright Tests
  .github/workflows/ci.yml
```

Die vorhandene Landingpage bitte unter `apps/web/public/index.html` ersetzen.

## Setup Wizard

Der geführte Installer ist unter `/setup` erreichbar und speichert alle Eingaben ausschließlich lokal im Browser. Schritte spiegeln dieses README wider und liefern Code-Snippets sowie Validierungsbefehle (DNS, Tunnel, Supabase, Healthchecks, Tests).

## Supabase

1. Neues Projekt anlegen und die Inhalte aus `supabase/schema.sql`, `supabase/policies.sql` sowie `supabase/seed.sql` in der angegebenen Reihenfolge ausführen.
2. Supabase Storage Bucket `project_images` erstellen und signierte URL Policies gemäß Kommentar in `policies.sql` setzen.
3. Seed-Superuser `michael@mysight.net` erhält initial das Passwort `Serum4x!` (Sofort nach Login ändern!).

## Lokale Entwicklung

```bash
npm install
npm run dev --workspace apps/web
```

ENV-Variablen siehe `.env.example`. Die App verwendet Material-Design-inspirierte Karten mit Tailwind.

## Tests

```bash
npm run test --workspace apps/web   # Vitest
npm run e2e --workspace apps/web    # Playwright
```

## Deployment auf Raspberry Pi

1. Raspberry Pi vorbereiten (`scripts/pi_bootstrap.sh` auf dem Gerät ausführen).
2. Repository nach `/srv/mysight/app` clonen.
3. Deployment über `scripts/pi_deploy.sh` oder automatisiert per GitHub Actions Workflow `deploy-pi` (SSH-Secrets erforderlich).
4. Cloudflare Tunnel mit `scripts/cloudflare_tunnel.yml` konfigurieren (TLS endet bei Cloudflare, lokal kein öffentliches TLS nötig).

## Annahmen

- Raspberry Pi 4 mit 4 GB RAM & SSD.
- Node.js 20 LTS, Next.js 14, Prisma 5.x, Supabase als Auth & DB.
- Cloudflare Tunnel ist einzige externe Exposition.
- tryout Mandant bleibt streng read-only (RLS Policies erzwingen dies).
- Bilder liegen in Supabase Storage (signierte URLs).
