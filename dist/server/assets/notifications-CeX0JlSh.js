import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, RefreshCw, Search, CheckCircle2, Ticket, ShieldAlert, UserRound, Clock3 } from "lucide-react";
import { useState, useMemo } from "react";
import { e as endpoints, r as request, c as cn } from "./router-1xz68c6T.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const unwrapList = (value) => {
  if (Array.isArray(value)) return value;
  const data = value?.data ?? value?.items ?? value?.content ?? value?.notifications ?? value?.results;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return unwrapList(data);
  return [];
};
const notificationsService = {
  async list() {
    const candidates = [
      "/admin/notifications",
      "/admin/notifications/list",
      "/admin/notifications/all",
      "/admin/reports/notifications",
      endpoints.admin.supportTicketToday
    ];
    for (const url of candidates) {
      try {
        const response = await request({ url, method: "GET", params: { page: 1, per_page: 50, perPage: 50 } });
        const list = unwrapList(response);
        if (list.length || url === candidates[candidates.length - 1]) {
          return list.map((item, index) => ({
            id: item.id ?? item.ticketId ?? item.ticket_id ?? index,
            title: item.title ?? item.subject ?? item.issue ?? "Admin notification",
            message: item.message ?? item.body ?? item.description ?? item.issue ?? "New platform activity needs attention.",
            type: item.type ?? item.targetType ?? item.target_type ?? item.userType ?? "SYSTEM",
            status: item.status ?? "UNREAD",
            read: item.read ?? item.isRead ?? false,
            createdAt: item.createdAt ?? item.created_at ?? item.createdDate ?? item.created_at
          }));
        }
      } catch (_) {
      }
    }
    return [];
  }
};
const getTime = (item) => item.createdAt ?? item.created_at ?? "";
const getMessage = (item) => item.message ?? item.body ?? "New platform activity needs attention.";
const getTitle = (item) => item.title ?? "Admin notification";
const isUnread = (item) => !(item.read ?? item.isRead ?? false) && !["READ", "RESOLVED"].includes((item.status ?? "").toUpperCase());
function NotificationsPage() {
  const [search, setSearch] = useState("");
  const {
    data = [],
    isLoading,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: notificationsService.list,
    refetchInterval: 3e4
  });
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((item) => `${getTitle(item)} ${getMessage(item)} ${item.type ?? ""} ${item.status ?? ""}`.toLowerCase().includes(term));
  }, [data, search]);
  const unreadCount = data.filter(isUnread).length;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-glow", children: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Notifications" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Support reports, verification events, order alerts and system notices." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-2 text-sm", children: [
          /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "Unread:" }),
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: unreadCount })
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => refetch(), className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent", children: [
          /* @__PURE__ */ jsx(RefreshCw, { className: cn("h-4 w-4", isFetching && "animate-spin") }),
          " Refresh"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Notification center" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Click support tickets to manage replies and status." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-80", children: [
          /* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search notifications...", className: "h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "Loading notifications..." }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "p-12 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 font-semibold", children: "No notifications found" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "New support tickets, reports and verification activity will appear here." })
      ] }) : filtered.map((item) => {
        const type = (item.type ?? "SYSTEM").toUpperCase();
        const unread = isUnread(item);
        const icon = type.includes("TICKET") || type.includes("CUSTOMER") ? /* @__PURE__ */ jsx(Ticket, { className: "h-5 w-5" }) : type.includes("VERIFY") ? /* @__PURE__ */ jsx(ShieldAlert, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(UserRound, { className: "h-5 w-5" });
        const href = type.includes("TICKET") || getTitle(item).toLowerCase().includes("ticket") ? "/tickets" : type.includes("VERIFY") ? "/service-area-verifications" : "/notifications";
        return /* @__PURE__ */ jsxs(Link, { to: href, className: cn("flex gap-4 p-4 transition hover:bg-accent/70", unread && "bg-primary/5"), children: [
          /* @__PURE__ */ jsx("div", { className: cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border", unread ? "border-primary/40 bg-primary/15 text-primary" : "border-border bg-background text-muted-foreground"), children: icon }),
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: getTitle(item) }),
              unread && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary", children: "New" }),
              /* @__PURE__ */ jsx("span", { className: "rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground", children: type })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-sm text-muted-foreground", children: getMessage(item) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsx(Clock3, { className: "h-3.5 w-3.5" }),
              " ",
              getTime(item) || "Just now"
            ] })
          ] })
        ] }, item.id);
      }) })
    ] })
  ] });
}
export {
  NotificationsPage as component
};
