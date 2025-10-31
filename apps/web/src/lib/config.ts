export const appConfig = {
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN ?? "mysight.net",
  tryoutTenant: process.env.NEXT_PUBLIC_TRYOUT_TENANT ?? "tryout",
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "public-anon-key"
  }
};

export const serverConfig = {
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  piHost: process.env.PI_HOST,
  piUser: process.env.PI_USER
};
