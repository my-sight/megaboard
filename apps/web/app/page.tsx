import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-12 px-6 py-24">
      <h1 className="text-center text-4xl font-bold text-slate-900">mysight Deployment Hub</h1>
      <p className="max-w-2xl text-center text-lg text-slate-600">
        Wähle einen Bereich aus, um zur Landingpage, zu Mandanten oder zum Setup Wizard zu gelangen.
      </p>
      <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
        <Card title="Landing" description="Marketing-Seite" href="/www" />
        <Card title="Mandanten" description="Subdomain basiertes Routing" href="/weber" />
        <Card title="Setup Wizard" description="Geführte Installation" href="/setup" />
      </div>
    </main>
  );
}
