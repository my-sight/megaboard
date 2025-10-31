import { describe, expect, it } from "vitest";
import { canWrite, requireAdmin } from "@/lib/guards/tenant";

describe("tenant guards", () => {
  it("verhindert Schreibrechte für Demo", () => {
    expect(canWrite({ tenantSlug: "tryout", role: "ADMIN", isDemo: true })).toBe(false);
  });

  it("erlaubt Admins", () => {
    expect(canWrite({ tenantSlug: "weber", role: "ADMIN" })).toBe(true);
    expect(requireAdmin({ tenantSlug: "weber", role: "ADMIN" })).toBe(true);
  });

  it("verweigert Gäste", () => {
    expect(canWrite({ tenantSlug: "weber", role: "GUEST" })).toBe(false);
    expect(requireAdmin({ tenantSlug: "weber", role: "GUEST" })).toBe(false);
  });
});
