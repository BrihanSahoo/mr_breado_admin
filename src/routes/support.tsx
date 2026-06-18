import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { useSupportDashboard } from "@/hooks/queries/use-support";
import { LifeBuoy, Ticket, CheckCircle2, Clock, Headphones } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support Dashboard | Mr. Breado Admin" }] }),
  component: SupportDashboardPage,
});

function SupportDashboardPage() {
  const { data, isLoading } = useSupportDashboard();
  const stats = [
    { label: "All Tickets", value: data?.allTickets ?? 0, icon: Ticket, color: "gradient-info" },
    { label: "All Pending", value: data?.allPending ?? 0, icon: Clock, color: "gradient-primary" },
    { label: "Today's Pending", value: data?.todayPending ?? 0, icon: CheckCircle2, color: "gradient-warning" },
    { label: "Today's Active", value: data?.todayActive ?? 0, icon: Headphones, color: "gradient-danger" },
  ];

  const tickets = data?.todayTickets ?? [];

  return (
    <>
      <PageHeader
        title="Support Dashboard"
        icon={<LifeBuoy className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Support Dashboard" }]}
      />
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex min-h-20 items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-card">
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-primary-foreground ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-2xl font-bold">{isLoading ? "…" : s.value}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Today's Tickets</h3>
            <p className="text-xs text-muted-foreground">{tickets.length} open today</p>
          </div>
          <select className="rounded-md border border-border bg-background px-3 py-2 text-sm">
            <option>10</option><option>25</option><option>50</option>
          </select>
        </div>
        {tickets.length === 0 ? (
          <div className="flex min-h-[340px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-primary"><Headphones className="h-9 w-9" /></div>
            <h4 className="text-lg font-semibold">No Open Tickets</h4>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">You're all caught up — no pending or active tickets are waiting on you today.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((t: any) => (
              <div key={t.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background/40 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-medium">{t.issue ?? t.subject}</div>
                  <div className="text-xs text-muted-foreground">{t.userName ?? t.user?.name ?? "Unknown"} · {t.userType ?? t.type ?? "User"}</div>
                </div>
                <span className="w-fit rounded-full bg-info/15 px-2 py-0.5 text-xs text-info">{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
