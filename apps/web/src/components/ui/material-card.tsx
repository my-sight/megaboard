import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils/cn";

export function MaterialCard({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={cn("material-card space-y-4 p-6", className)}>{children}</section>;
}
