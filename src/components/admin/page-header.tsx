import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  breadcrumbs?: { label: string; to?: string }[];
  icon?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs = [], icon, actions }: Props) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{icon}</div>
        )}
        <div>
          <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          {breadcrumbs.length > 0 && (
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  {b.to ? <Link to={b.to} className="hover:text-foreground">{b.label}</Link> : <span>{b.label}</span>}
                  {i < breadcrumbs.length - 1 && <ChevronRight className="h-3 w-3" />}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
