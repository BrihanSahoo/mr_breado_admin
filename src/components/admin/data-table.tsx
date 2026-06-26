import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";

import { haptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
  accessor?: (row: T) => string | number;
}

interface Props<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  searchableKeys?: (keyof T)[];
  title?: string;
  subtitle?: string;
  filters?: ReactNode;
  pageSize?: number;
  showExport?: boolean;
  loading?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchableKeys,
  title,
  subtitle,
  filters,
  pageSize = 10,
  showExport = true,
  loading = false,
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data;
    return data.filter((row) =>
      (searchableKeys ?? (Object.keys(row) as (keyof T)[])).some((key) =>
        String(row[key] ?? "").toLowerCase().includes(normalized),
      ),
    );
  }, [data, query, searchableKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const current = filtered.slice((page - 1) * size, page * size);

  useEffect(() => {
    setPage((value) => Math.min(Math.max(1, value), totalPages));
  }, [totalPages]);

  const exportCsv = () => {
    if (typeof window === "undefined" || filtered.length === 0) return;
    haptic(18);
    const headers = columns.map((column) => column.header).join(",");
    const rows = filtered.map((row) =>
      columns.map((column) => {
        const value = column.accessor ? column.accessor(row) : row[column.key];
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      }).join(","),
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${title || "export"}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const from = filtered.length === 0 ? 0 : (page - 1) * size + 1;
  const to = Math.min(page * size, filtered.length);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {(title || filters || showExport) && (
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {title && <h3 className="truncate text-base font-semibold sm:text-lg">{title}</h3>}
            {subtitle && <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm">{subtitle}</p>}
          </div>
          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <label className="col-span-2 flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm sm:col-span-1 sm:w-56">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search records…"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
              />
            </label>
            {filters}
            {showExport && (
              <button
                type="button"
                onClick={exportCsv}
                disabled={filtered.length === 0}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-semibold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            )}
            <select
              value={size}
              onChange={(event) => {
                setSize(Number(event.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
              className="min-h-11 rounded-xl border border-border bg-background px-3 text-base outline-none sm:text-sm"
            >
              {[10, 25, 50, 100].map((value) => <option key={value} value={value}>{value} rows</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Mobile card list: readable and fully actionable without horizontal scrolling. */}
      <div className="space-y-3 p-3 md:hidden">
        {loading ? (
          Array.from({ length: Math.min(size, 5) }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border bg-background/45 p-4">
              <div className="h-5 w-1/2 animate-pulse rounded bg-primary/10" />
              <div className="mt-3 h-16 w-full animate-pulse rounded-xl bg-primary/5" />
            </div>
          ))
        ) : current.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-4 py-14 text-center text-sm text-muted-foreground">
            No records found
          </div>
        ) : current.map((row, rowIndex) => {
          const key = String(row.id ?? row._id ?? rowIndex);
          return (
            <article key={key} className="overflow-hidden rounded-2xl border border-border bg-background/45 shadow-sm">
              {columns.map((column, columnIndex) => {
                const content = column.render ? column.render(row) : row[column.key];
                const actionColumn = /action/i.test(column.key) || /action/i.test(column.header);
                return (
                  <div
                    key={column.key}
                    className={cn(
                      "grid gap-2 border-b border-border/60 px-4 py-3 last:border-b-0",
                      actionColumn ? "grid-cols-1" : "grid-cols-[88px_minmax(0,1fr)] items-center",
                      columnIndex === 0 && "bg-primary/[0.025]",
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                      {column.header}
                    </span>
                    <div className={cn("min-w-0 text-sm", actionColumn && "mt-1")}>{content}</div>
                  </div>
                );
              })}
            </article>
          );
        })}
      </div>

      {/* Desktop table. */}
      <div className="admin-table-scroll hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((column) => (
                <th key={column.key} className={cn("whitespace-nowrap px-4 py-3 font-medium", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(size, 10) }).map((_, index) => (
                <tr key={index}>
                  <td colSpan={columns.length} className="px-4 py-3">
                    <div className="h-8 w-full animate-pulse rounded bg-primary/10" />
                  </td>
                </tr>
              ))
            ) : current.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-muted-foreground">No records found</td>
              </tr>
            ) : current.map((row, rowIndex) => (
              <tr key={String(row.id ?? row._id ?? rowIndex)} className="border-b border-border/60 transition-colors hover:bg-accent/30">
                {columns.map((column) => (
                  <td key={column.key} className={cn("whitespace-nowrap px-4 py-3", column.className)}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row">
        <div>Showing {from}–{to} of {filtered.length}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              haptic(10);
              setPage((value) => Math.max(1, value - 1));
            }}
            disabled={page === 1}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background transition hover:bg-accent disabled:opacity-35"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-24 text-center font-medium">Page {page} / {totalPages}</span>
          <button
            type="button"
            onClick={() => {
              haptic(10);
              setPage((value) => Math.min(totalPages, value + 1));
            }}
            disabled={page === totalPages}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background transition hover:bg-accent disabled:opacity-35"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </section>
  );
}
