import { useState, type ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

export interface ServerColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface Props<T> {
  columns: ServerColumn<T>[];
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  isLoading?: boolean;
  isFetching?: boolean;
  error?: unknown;
  onPageChange: (p: number) => void;
  search?: string;
  onSearchChange?: (s: string) => void;
  searchPlaceholder?: string;
  title?: string;
  toolbar?: ReactNode;
  filters?: ReactNode;
  rowKey: (row: T) => string | number;
}

export function ServerTable<T>({
  columns, items, page, totalPages, total,
  isLoading, isFetching, error, onPageChange,
  search, onSearchChange, searchPlaceholder = "Search...",
  title, toolbar, filters, rowKey,
}: Props<T>) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold">
            {title ?? `${total} records`}
            {isFetching && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {onSearchChange && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-56 bg-transparent outline-none"
              />
            </div>
          )}
          {filters}
          {toolbar}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th key={c.key} className={cn("whitespace-nowrap px-4 py-3 font-medium", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-border/60">
                  <td colSpan={columns.length} className="px-4 py-4">
                    <div className="h-5 w-full animate-pulse rounded bg-primary/10" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-destructive">
                  {(error as Error).message || "Failed to load"}
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-muted-foreground">
                  No records found
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={rowKey(row)} className="border-b border-border/60 transition-colors hover:bg-accent/30">
                  {columns.map((c) => (
                    <td key={c.key} className={cn("whitespace-nowrap px-4 py-3", c.className)}>
                      {c.render ? c.render(row) : (row as Record<string, unknown>)[c.key] as ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <div>Page {page} of {Math.max(1, totalPages)} · {total} total</div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || isFetching}
            className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages || 1, page + 1))}
            disabled={page >= totalPages || isFetching}
            className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useTableSearch(delay = 300) {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, delay);
  return { search, setSearch, debounced };
}
