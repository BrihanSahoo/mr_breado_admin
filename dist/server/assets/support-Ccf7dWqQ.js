import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./router-1xz68c6T.js";
import { b as useSupportDashboard } from "./use-support-CoQZ32-t.js";
import { Ticket, Clock, CheckCircle2, Headphones, LifeBuoy } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function SupportDashboardPage() {
  const {
    data,
    isLoading
  } = useSupportDashboard();
  const stats = [{
    label: "All Tickets",
    value: data?.allTickets ?? 0,
    icon: Ticket,
    color: "gradient-info"
  }, {
    label: "All Pending",
    value: data?.allPending ?? 0,
    icon: Clock,
    color: "gradient-primary"
  }, {
    label: "Today's Pending",
    value: data?.todayPending ?? 0,
    icon: CheckCircle2,
    color: "gradient-warning"
  }, {
    label: "Today's Active",
    value: data?.todayActive ?? 0,
    icon: Headphones,
    color: "gradient-danger"
  }];
  const tickets = data?.todayTickets ?? [];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Support Dashboard", icon: /* @__PURE__ */ jsx(LifeBuoy, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Support Dashboard"
    }] }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxs("div", { className: "flex min-h-20 items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-lg text-primary-foreground ${s.color}`, children: /* @__PURE__ */ jsx(s.icon, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.label }),
        /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold", children: isLoading ? "…" : s.value })
      ] })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Today's Tickets" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            tickets.length,
            " open today"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("select", { className: "rounded-md border border-border bg-background px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsx("option", { children: "10" }),
          /* @__PURE__ */ jsx("option", { children: "25" }),
          /* @__PURE__ */ jsx("option", { children: "50" })
        ] })
      ] }),
      tickets.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex min-h-[340px] flex-col items-center justify-center text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary", children: /* @__PURE__ */ jsx(Headphones, { className: "h-9 w-9" }) }),
        /* @__PURE__ */ jsx("h4", { className: "text-lg font-semibold", children: "No Open Tickets" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 max-w-md text-sm text-muted-foreground", children: "You're all caught up — no pending or active tickets are waiting on you today." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-2", children: tickets.map((t) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: t.issue ?? t.subject }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            t.userName ?? t.user?.name ?? "Unknown",
            " · ",
            t.userType ?? t.type ?? "User"
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-fit rounded-full bg-info/15 px-2 py-0.5 text-xs text-info", children: t.status })
      ] }, t.id)) })
    ] })
  ] });
}
export {
  SupportDashboardPage as component
};
