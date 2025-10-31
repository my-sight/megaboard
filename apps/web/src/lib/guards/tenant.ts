export type TenantRole = "ADMIN" | "USER" | "GUEST";

export interface TenantMembership {
  tenantSlug: string;
  role: TenantRole;
  isDemo?: boolean;
}

export function canWrite(membership: TenantMembership | null) {
  if (!membership) return false;
  if (membership.isDemo) return false;
  return membership.role === "ADMIN" || membership.role === "USER";
}

export function requireAdmin(membership: TenantMembership | null) {
  return membership?.role === "ADMIN";
}
