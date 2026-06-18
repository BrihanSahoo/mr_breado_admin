import { jsx, jsxs } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Building2, Download, Plus, TrendingUp, TrendingDown, CalendarDays, KeyRound, Package } from "lucide-react";
import { toast } from "sonner";
import { O as OutletCommandCenterPage, v as businessOutletsService, I as Input, B as Button, D as Dialog, w as DialogTrigger, l as DialogContent, C as Card, x as CardContent, y as CardHeader, z as CardTitle, E as Badge, n as DialogHeader, o as DialogTitle, L as Label } from "./router-1xz68c6T.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function money(v) {
  return `₹${Number(v || 0).toLocaleString("en-IN")}`;
}
function today() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function safeText(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const parts = [value.line1, value.line2, value.street, value.area, value.landmark, value.city, value.state, value.pincode, value.postalCode, value.country].map(safeText).filter(Boolean);
    if (parts.length) return Array.from(new Set(parts)).join(", ");
  }
  return "";
}
function outletAddress(outlet) {
  const direct = safeText(outlet?.addressText) || safeText(outlet?.formattedAddress) || safeText(outlet?.address);
  const extra = [outlet?.city, outlet?.state, outlet?.pincode].map(safeText).filter(Boolean);
  const all = [direct, ...extra].filter(Boolean);
  return Array.from(new Set(all)).join(", ") || "Address not configured";
}
function BusinessOutletsPage() {
  const routePathname = useRouterState({
    select: (s) => s.location.pathname
  });
  const browserPathname = typeof window !== "undefined" ? window.location.pathname : routePathname;
  const pathname = browserPathname || routePathname || "";
  const dashboardMatch = pathname.match(/^\/business-outlets\/([^/?#]+)/);
  if (dashboardMatch?.[1]) {
    return /* @__PURE__ */ jsx(OutletCommandCenterPage, { outletId: decodeURIComponent(dashboardMatch[1]) });
  }
  return /* @__PURE__ */ jsx(BusinessOutletsList, {});
}
function BusinessOutletsList() {
  const qc = useQueryClient();
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [selected, setSelected] = useState(null);
  const [credentialOutlet, setCredentialOutlet] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [dashboardOutletId, setDashboardOutletId] = useState(null);
  const dashboard = useQuery({
    queryKey: ["business-dashboard", from, to],
    queryFn: () => businessOutletsService.dashboard({
      from,
      to
    })
  });
  const outletListQuery = useQuery({
    queryKey: ["business-outlets-list"],
    queryFn: () => businessOutletsService.list()
  });
  const ensure = useMutation({
    mutationFn: businessOutletsService.ensureSchema,
    onSuccess: () => toast.success("Enterprise outlet schema ready")
  });
  const createOutlet = useMutation({
    mutationFn: businessOutletsService.createOutlet,
    onSuccess: () => {
      toast.success("Outlet created");
      setCreateOpen(false);
      qc.invalidateQueries({
        queryKey: ["business-dashboard"]
      });
      qc.invalidateQueries({
        queryKey: ["business-outlets-list"]
      });
    }
  });
  const exportCsv = useMutation({
    mutationFn: () => businessOutletsService.exportAccounting(from, to)
  });
  const outlets = useMemo(() => {
    const fromDashboard = dashboard.data?.outlets;
    if (Array.isArray(fromDashboard) && fromDashboard.length > 0) return fromDashboard;
    const raw = outletListQuery.data?.data ?? outletListQuery.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.outlets)) return raw.outlets;
    return [];
  }, [dashboard.data, outletListQuery.data]);
  if (dashboardOutletId) {
    return /* @__PURE__ */ jsx(OutletCommandCenterPage, { outletId: dashboardOutletId, onBack: () => setDashboardOutletId(null) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-card md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-primary", children: [
          /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }),
          " Mr. Breado Head Office"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-3xl font-bold tracking-tight", children: "Business Outlets Control" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Track every outlet's sales, stock, performance, credentials, and day-close ledger." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value), className: "w-40" }),
        /* @__PURE__ */ jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value), className: "w-40" }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => ensure.mutate(), children: "Prepare DB" }),
        /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => exportCsv.mutate(), children: [
          /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
          "Export CSV"
        ] }),
        /* @__PURE__ */ jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
          /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
            /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
            "Add Outlet"
          ] }) }),
          /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(OutletForm, { onSubmit: (data) => createOutlet.mutate(data) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Metric, { title: "Total Outlets", value: dashboard.data?.totalOutlets ?? outlets.length }),
      /* @__PURE__ */ jsx(Metric, { title: "Orders", value: dashboard.data?.totalOrders ?? 0 }),
      /* @__PURE__ */ jsx(Metric, { title: "Total Sales", value: money(dashboard.data?.totalSales) }),
      /* @__PURE__ */ jsx(Metric, { title: "Online Sales", value: money(dashboard.data?.onlineSales) })
    ] }),
    (dashboard.isError || outletListQuery.isError) && outlets.length === 0 && /* @__PURE__ */ jsx(Card, { className: "rounded-3xl border-destructive/30", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: "Unable to load outlets" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page stayed open safely. Retry after the backend outlet routes are available." }),
      /* @__PURE__ */ jsx(Button, { className: "mt-4", onClick: () => {
        dashboard.refetch();
        outletListQuery.refetch();
      }, children: "Try again" })
    ] }) }),
    outlets.length === 0 && !dashboard.isLoading && !outletListQuery.isLoading && !dashboard.isError && !outletListQuery.isError && /* @__PURE__ */ jsx(Card, { className: "rounded-3xl border-dashed", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-lg font-bold", children: "No outlets loaded yet" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Click Prepare DB, then Add Outlet. The table now uses the v42 enterprise outlet schema." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 xl:grid-cols-3", children: outlets.map((o) => /* @__PURE__ */ jsxs(Card, { className: "overflow-hidden rounded-3xl transition hover:border-primary/60 hover:shadow-lg", children: [
      /* @__PURE__ */ jsx(CardHeader, { className: "border-b bg-muted/30", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: o.name || o.outletName }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: outletAddress(o) }),
          /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs font-medium", children: [
            "GSTIN: ",
            o.gstin || "Not added"
          ] })
        ] }),
        /* @__PURE__ */ jsx(Badge, { variant: o.isOpen ? "default" : "secondary", children: o.isOpen ? "Open" : "Closed" })
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4 p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 text-center", children: [
          /* @__PURE__ */ jsx(Mini, { label: "Sales", value: money(o.totalSales) }),
          /* @__PURE__ */ jsx(Mini, { label: "Orders", value: o.orderCount ?? 0 }),
          /* @__PURE__ */ jsx(Mini, { label: "Low Stock", value: o.lowStockCount ?? 0 })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-2 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
            /* @__PURE__ */ jsx(TrendingUp, { className: "h-4 w-4 text-primary" }),
            " Best foods"
          ] }),
          (o.topFoods || []).slice(0, 3).map((f) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between rounded-xl bg-muted/40 px-3 py-2", children: [
            /* @__PURE__ */ jsx("span", { children: f.productName }),
            /* @__PURE__ */ jsx("span", { children: f.soldQuantity ?? 0 })
          ] }, f.productId)),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pt-2 font-semibold", children: [
            /* @__PURE__ */ jsx(TrendingDown, { className: "h-4 w-4 text-destructive" }),
            " Slow foods"
          ] }),
          (o.slowFoods || []).slice(0, 3).map((f) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between rounded-xl bg-muted/40 px-3 py-2", children: [
            /* @__PURE__ */ jsx("span", { children: f.productName }),
            /* @__PURE__ */ jsx("span", { children: f.soldQuantity ?? 0 })
          ] }, f.productId))
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => setDashboardOutletId(String(o.id || o.outletId || o._id)), children: "Full Dashboard" }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setSelected(o), children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "mr-2 h-4 w-4" }),
            "Quick Ledger"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setCredentialOutlet(o), children: [
            /* @__PURE__ */ jsx(KeyRound, { className: "mr-2 h-4 w-4" }),
            "Login Credentials"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => setSelected(o), children: [
            /* @__PURE__ */ jsx(Package, { className: "mr-2 h-4 w-4" }),
            "Stock"
          ] })
        ] })
      ] })
    ] }, String(o.id || o.outletId || o._id || o.slug || o.name))) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!selected, onOpenChange: (v) => !v && setSelected(null), children: /* @__PURE__ */ jsx(DialogContent, { className: "max-w-5xl", children: /* @__PURE__ */ jsx(OutletDetails, { outlet: selected, from, to }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!credentialOutlet, onOpenChange: (v) => !v && setCredentialOutlet(null), children: /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(CredentialsForm, { outlet: credentialOutlet }) }) })
  ] });
}
function Metric({
  title,
  value
}) {
  return /* @__PURE__ */ jsx(Card, { className: "rounded-3xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: title }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold", children: value })
  ] }) });
}
function Mini({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-muted/40 p-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: "font-bold", children: value })
  ] });
}
function OutletForm({
  onSubmit
}) {
  const [data, setData] = useState({
    name: "Mr. Breado - ",
    serviceRadiusKm: 5,
    isOpen: true
  });
  return /* @__PURE__ */ jsxs("form", { className: "space-y-3", onSubmit: (e) => {
    e.preventDefault();
    onSubmit(data);
  }, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Add Mr. Breado Outlet" }) }),
    [["name", "Outlet Name"], ["address", "Address"], ["city", "City"], ["pincode", "Pincode"], ["latitude", "Latitude"], ["longitude", "Longitude"], ["managerName", "Manager Name"], ["managerPhone", "Manager Phone"], ["managerEmail", "Manager Email"], ["gstin", "GSTIN (15 characters)"], ["invoiceLegalName", "Invoice Legal Name"], ["invoiceAddress", "Invoice Address"]].map(([k, l]) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: l }),
      /* @__PURE__ */ jsx(Input, { value: data[k] ?? "", onChange: (e) => setData((d) => ({
        ...d,
        [k]: e.target.value
      })) })
    ] }, k)),
    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Create Outlet" })
  ] });
}
function CredentialsForm({
  outlet
}) {
  const [data, setData] = useState({
    name: outlet?.managerName || "Outlet Manager",
    username: outlet?.outletCode || "",
    password: ""
  });
  const mutation = useMutation({
    mutationFn: () => businessOutletsService.setCredentials(outlet.id || outlet.outletId, data),
    onSuccess: () => toast.success("Outlet credentials saved")
  });
  return /* @__PURE__ */ jsxs("form", { className: "space-y-3", onSubmit: (e) => {
    e.preventDefault();
    mutation.mutate();
  }, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "Set Outlet Login - ",
      outlet?.name
    ] }) }),
    [["name", "Manager Name"], ["phone", "Phone"], ["email", "Email"], ["username", "Username"], ["password", "Password"]].map(([k, l]) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsx(Label, { children: l }),
      /* @__PURE__ */ jsx(Input, { type: k === "password" ? "password" : "text", value: data[k] ?? "", onChange: (e) => setData((d) => ({
        ...d,
        [k]: e.target.value
      })) })
    ] }, k)),
    /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Save Login Credentials" })
  ] });
}
function OutletDetails({
  outlet,
  from,
  to
}) {
  const id = outlet?.id || outlet?.outletId;
  const perf = useQuery({
    queryKey: ["outlet-performance", id, from, to],
    enabled: !!id,
    queryFn: () => businessOutletsService.performance(id, {
      from,
      to
    })
  });
  const cal = useQuery({
    queryKey: ["outlet-calendar", id, from, to],
    enabled: !!id,
    queryFn: () => businessOutletsService.calendar(id, {
      from,
      to
    })
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      outlet?.name,
      " business details"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Metric, { title: "Orders", value: perf.data?.orders ?? 0 }),
      /* @__PURE__ */ jsx(Metric, { title: "Total Sales", value: money(perf.data?.totalSales) }),
      /* @__PURE__ */ jsx(Metric, { title: "Low Stock", value: (perf.data?.lowStock ?? []).length })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Day Closing Calendar" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: (cal.data?.calendar ?? []).map((d) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { children: String(d.closingDate || d.closing_date).slice(0, 10) }),
          /* @__PURE__ */ jsx("span", { children: money(d.totalSales || d.total_sales) })
        ] }, d.id)) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Low Stock" }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2", children: (perf.data?.lowStock ?? []).map((s) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { children: s.productName }),
          /* @__PURE__ */ jsx("span", { children: s.stockQuantity ?? s.stock_quantity })
        ] }, s.id)) })
      ] })
    ] })
  ] });
}
export {
  BusinessOutletsPage as component
};
