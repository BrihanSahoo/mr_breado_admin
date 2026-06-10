import { useMemo, useState, type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
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
  data, columns, searchableKeys, title, subtitle, filters, pageSize = 10, showExport = true, loading = false,
}: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);

  const filtered = useMemo(() => {
    if (!q) return data;
    const lc = q.toLowerCase();
    return data.filter(row =>
      (searchableKeys ?? Object.keys(row) as (keyof T)[]).some(k =>
        String(row[k] ?? "").toLowerCase().includes(lc)
      )
    );
  }, [data, q, searchableKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const current = filtered.slice((page - 1) * size, page * size);

  const exportCsv = () => {
    const headers = columns.map(c => c.header).join(",");
    const rows = filtered.map(r =>
      columns.map(c => {
        const v = c.accessor ? c.accessor(r) : r[c.key];
        return `"${String(v ?? "").replace(/"/g, '""')}"`;
      }).join(",")
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${title || "export"}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      {(title || filters || showExport) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div>
            {title && <h3 className="text-base font-semibold">{title}</h3>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
                placeholder="Search..." className="w-44 bg-transparent outline-none" />
            </div>
            {filters}
            {showExport && (
              <button onClick={exportCsv}
                className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent">
                <Download className="h-4 w-4" /> Export
              </button>
            )}
            <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(1); }}
              className="rounded-md border border-border bg-background px-2 py-1.5 text-sm">
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map(c => (
                <th key={c.key} className={cn("whitespace-nowrap px-4 py-3 font-medium", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(size, 10) }).map((_, i) => (
                <tr key={i}><td colSpan={columns.length} className="px-4 py-3"><div className="h-8 w-full animate-pulse rounded bg-primary/10" /></td></tr>
              ))
            ) : current.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-16 text-center text-muted-foreground">No records found</td></tr>
            ) : current.map((row, i) => (
              <tr key={i} className="border-b border-border/60 transition-colors hover:bg-accent/30">
                {columns.map(c => (
                  <td key={c.key} className={cn("whitespace-nowrap px-4 py-3", c.className)}>
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row">
        <div>Showing {(page - 1) * size + 1}–{Math.min(page * size, filtered.length)} of {filtered.length}</div>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
          <span className="px-2">Page {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
