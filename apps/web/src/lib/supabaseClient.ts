import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import { appConfig } from "@/lib/config";

export function createClient() {
  return createBrowserClient(appConfig.supabase.url, appConfig.supabase.anonKey);
}
