import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { c as cn } from "./router-1xz68c6T.js";
function DataTable({
  data,
  columns,
  searchableKeys,
  title,
  subtitle,
  filters,
  pageSize = 10,
  showExport = true,
  loading = false
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const filtered = useMemo(() => {
    if (!q) return data;
    const lc = q.toLowerCase();
    return data.filter(
      (row) => (searchableKeys ?? Object.keys(row)).some(
        (k) => String(row[k] ?? "").toLowerCase().includes(lc)
      )
    );
  }, [data, q, searchableKeys]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / size));
  const current = filtered.slice((page - 1) * size, page * size);
  const exportCsv = () => {
    const headers = columns.map((c) => c.header).join(",");
    const rows = filtered.map(
      (r) => columns.map((c) => {
        const v = c.accessor ? c.accessor(r) : r[c.key];
        return `"${String(v ?? "").replace(/"/g, '""')}"`;
      }).join(",")
    );
    const blob = new Blob([headers + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card shadow-card", children: [
    (title || filters || showExport) && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        title && /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: title }),
        subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: subtitle })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: q,
              onChange: (e) => {
                setQ(e.target.value);
                setPage(1);
              },
              placeholder: "Search...",
              className: "w-44 bg-transparent outline-none"
            }
          )
        ] }),
        filters,
        showExport && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: exportCsv,
            className: "flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-accent",
            children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
              " Export"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "select",
          {
            value: size,
            onChange: (e) => {
              setSize(Number(e.target.value));
              setPage(1);
            },
            className: "rounded-md border border-border bg-background px-2 py-1.5 text-sm",
            children: [10, 25, 50, 100].map((n) => /* @__PURE__ */ jsx("option", { value: n, children: n }, n))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground", children: columns.map((c) => /* @__PURE__ */ jsx("th", { className: cn("whitespace-nowrap px-4 py-3 font-medium", c.className), children: c.header }, c.key)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: loading ? Array.from({ length: Math.min(size, 10) }).map((_, i) => /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-3", children: /* @__PURE__ */ jsx("div", { className: "h-8 w-full animate-pulse rounded bg-primary/10" }) }) }, i)) : current.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "px-4 py-16 text-center text-muted-foreground", children: "No records found" }) }) : current.map((row, i) => /* @__PURE__ */ jsx("tr", { className: "border-b border-border/60 transition-colors hover:bg-accent/30", children: columns.map((c) => /* @__PURE__ */ jsx("td", { className: cn("whitespace-nowrap px-4 py-3", c.className), children: c.render ? c.render(row) : row[c.key] }, c.key)) }, i)) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "Showing ",
        (page - 1) * size + 1,
        "–",
        Math.min(page * size, filtered.length),
        " of ",
        filtered.length
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setPage((p) => Math.max(1, p - 1)),
            disabled: page === 1,
            className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "px-2", children: [
          "Page ",
          page,
          " / ",
          totalPages
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
            disabled: page === totalPages,
            className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
}
export {
  DataTable as D
};
