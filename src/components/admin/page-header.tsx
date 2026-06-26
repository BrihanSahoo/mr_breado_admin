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
    <header className="mb-5 flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/55 p-4 shadow-card backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-sm">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold leading-tight tracking-tight sm:text-2xl">{title}</h1>
          {breadcrumbs.length > 0 && (
            <nav className="mt-1 flex min-w-0 items-center gap-1 overflow-hidden text-xs text-muted-foreground" aria-label="Breadcrumb">
              {breadcrumbs.map((breadcrumb, index) => (
                <span key={`${breadcrumb.label}-${index}`} className="flex min-w-0 items-center gap-1">
                  {index > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
                  {breadcrumb.to ? (
                    <Link to={breadcrumb.to} className="truncate transition hover:text-primary">{breadcrumb.label}</Link>
                  ) : (
                    <span className="truncate">{breadcrumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
      </div>
      {actions && <div className="w-full shrink-0 sm:w-auto">{actions}</div>}
    </header>
  );
}
