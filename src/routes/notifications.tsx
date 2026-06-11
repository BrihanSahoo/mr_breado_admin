import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, Clock3, RefreshCw, Search, ShieldAlert, Ticket, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { notificationsService, type AdminNotification } from "@/services/notifications.service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications | Mr Breado Admin" }] }),
  component: NotificationsPage,
});

const getTime = (item: AdminNotification) => item.createdAt ?? item.created_at ?? "";
const getMessage = (item: AdminNotification) => item.message ?? item.body ?? "New platform activity needs attention.";
const getTitle = (item: AdminNotification) => item.title ?? "Admin notification";
const isUnread = (item: AdminNotification) => !(item.read ?? item.isRead ?? false) && !["READ", "RESOLVED"].includes((item.status ?? "").toUpperCase());

function NotificationsPage() {
  const [search, setSearch] = useState("");
  const { data = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: notificationsService.list,
    refetchInterval: 30000,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((item) => `${getTitle(item)} ${getMessage(item)} ${item.type ?? ""} ${item.status ?? ""}`.toLowerCase().includes(term));
  }, [data, search]);

  const unreadCount = data.filter(isUnread).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl border border-primary/30 bg-primary/15 text-primary shadow-glow">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            <p className="text-sm text-muted-foreground">Support reports, verification events, order alerts and system notices.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm">
            <span className="text-muted-foreground">Unread:</span> <span className="font-bold text-primary">{unreadCount}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} /> Refresh
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">Notification center</h2>
            <p className="text-sm text-muted-foreground">Click support tickets to manage replies and status.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading notifications...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><CheckCircle2 className="h-6 w-6" /></div>
              <h3 className="mt-4 font-semibold">No notifications found</h3>
              <p className="mt-1 text-sm text-muted-foreground">New support tickets, reports and verification activity will appear here.</p>
            </div>
          ) : filtered.map((item) => {
            const type = (item.type ?? "SYSTEM").toUpperCase();
            const unread = isUnread(item);
            const icon = type.includes("TICKET") || type.includes("CUSTOMER") ? <Ticket className="h-5 w-5" /> : type.includes("VERIFY") ? <ShieldAlert className="h-5 w-5" /> : <UserRound className="h-5 w-5" />;
            const href = type.includes("TICKET") || getTitle(item).toLowerCase().includes("ticket") ? "/tickets" : type.includes("VERIFY") ? "/service-area-verifications" : "/notifications";
            return (
              <Link
                key={item.id}
                to={href as any}
                className={cn("flex gap-4 p-4 transition hover:bg-accent/70", unread && "bg-primary/5")}
              >
                <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl border", unread ? "border-primary/40 bg-primary/15 text-primary" : "border-border bg-background text-muted-foreground")}>{icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{getTitle(item)}</h3>
                    {unread && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">New</span>}
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">{type}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{getMessage(item)}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" /> {getTime(item) || "Just now"}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
