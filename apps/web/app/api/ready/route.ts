import { NextResponse } from "next/server";

const REQUIRED_ENV = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SITE_DOMAIN"] as const;

type EnvKey = (typeof REQUIRED_ENV)[number];

function getMissingEnv() {
  const missing: EnvKey[] = [];
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  return missing;
}

export function GET() {
  const missing = getMissingEnv();
  if (missing.length > 0) {
    return NextResponse.json({ status: "degraded", missing }, { status: 503 });
  }
  return NextResponse.json({ status: "ready" });
}
