import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  title: string;
  description: string;
  href: string;
  actionLabel?: string;
}

export function Card({ title, description, href, actionLabel = "Öffnen" }: CardProps) {
  return (
    <div className="material-card flex h-full flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      <Link
        href={href}
        className={cn(
          "mt-6 inline-flex items-center justify-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
        )}
      >
        {actionLabel}
      </Link>
    </div>
  );
}
