import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { c as cn, t as useDebounce } from "./router-1xz68c6T.js";
function ServerTable({
  columns,
  items,
  page,
  totalPages,
  total,
  isLoading,
  isFetching,
  error,
  onPageChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  title,
  toolbar,
  filters,
  rowKey
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card shadow-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold", children: [
        title ?? `${total} records`,
        isFetching && /* @__PURE__ */ jsx(Loader2, { className: "ml-1 inline h-3 w-3 animate-spin" })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        onSearchChange && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: search ?? "",
              onChange: (e) => onSearchChange(e.target.value),
              placeholder: searchPlaceholder,
              className: "w-56 bg-transparent outline-none"
            }
          )
        ] }),
        filters,
        toolbar
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground", children: columns.map((c) => /* @__PURE__ */ jsx("th", { className: cn("whitespace-nowrap px-4 py-3 font-medium", c.className), children: c.header }, c.key)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: isLoading ? Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx("tr", { className: "border-b border-border/60", children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-4", children: /* @__PURE__ */ jsx("div", { className: "h-5 w-full animate-pulse rounded bg-primary/10" }) }) }, i)) : error ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-16 text-center text-destructive", children: error.message || "Failed to load" }) }) : items.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-16 text-center text-muted-foreground", children: "No records found" }) }) : items.map((row) => /* @__PURE__ */ jsx("tr", { className: "border-b border-border/60 transition-colors hover:bg-accent/30", children: columns.map((c) => /* @__PURE__ */ jsx("td", { className: cn("whitespace-nowrap px-4 py-3", c.className), children: c.render ? c.render(row) : row[c.key] }, c.key)) }, rowKey(row))) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "Page ",
        page,
        " of ",
        Math.max(1, totalPages),
        " · ",
        total,
        " total"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onPageChange(Math.max(1, page - 1)),
            disabled: page <= 1 || isFetching,
            className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => onPageChange(Math.min(totalPages || 1, page + 1)),
            disabled: page >= totalPages || isFetching,
            className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
function useTableSearch(delay = 300) {
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, delay);
  return { search, setSearch, debounced };
}
export {
  ServerTable as S,
  useTableSearch as u
};
