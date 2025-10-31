import { ReactNode } from "react";
import { TenantShell } from "@/components/boards/tenant-shell";

export default function TenantLayout({ children }: { children: ReactNode }) {
  return <TenantShell>{children}</TenantShell>;
}
