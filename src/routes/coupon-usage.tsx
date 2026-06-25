import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TicketCheck, IndianRupee, Users, Store, ShoppingBag, CircleCheckBig } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { couponUsageService } from "@/services/coupon-usage.service";
import type { CouponUsageRecord } from "@/types";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/coupon-usage")({
  head: () => ({ meta: [{ title: "Coupon Usage | Mr. Breado Admin" }] }),
  component: CouponUsagePage,
});

function money(value?: number) { return `₹${Number(value || 0).toFixed(2)}`; }

function CouponUsagePage() {
  const [page, setPage] = useState(1);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const query = useQuery({
    queryKey: ["coupon-usage", page, code, status],
    queryFn: () => couponUsageService.list({ page, perPage: 20, code: code.trim() || undefined, status: status || undefined }),
    staleTime: 10_000,
  });
  const summary = query.data?.summary;
  const columns: ServerColumn<CouponUsageRecord>[] = [
    { key: "coupon", header: "Coupon", render: (row) => <div><div className="font-mono font-black text-primary">{row.couponCode}</div><div className="text-xs text-muted-foreground">{row.couponTitle || "Promotion"}</div></div> },
    { key: "customer", header: "Customer", render: (row) => <div><div className="font-semibold">{row.customerName || row.customer?.name || "Customer"}</div><div className="text-xs text-muted-foreground">{row.customerPhone || row.customerEmail || row.customer?.phone || row.customer?.email || "—"}</div></div> },
    { key: "order", header: "Order", render: (row) => <div><div className="font-semibold">{row.orderNumber || row.order?.orderNumber || "—"}</div><div className="text-xs text-muted-foreground">{row.order?.paymentMethod || "—"} • {money(row.order?.total)}</div></div> },
    { key: "outlet", header: "Outlet", render: (row) => row.outletName || row.outlet?.name || "—" },
    { key: "saved", header: "Customer saved", render: (row) => <span className="font-black text-emerald-600">{money(row.discountAmount)}</span> },
    { key: "status", header: "Usage status", render: (row) => <StatusBadge status={row.status || "RESERVED"} /> },
    { key: "date", header: "Used at", render: (row) => row.createdAt ? new Date(row.createdAt).toLocaleString() : "—" },
  ];

  return <>
    <PageHeader title="Coupon Usage Ledger" icon={<TicketCheck className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Offer Management" }, { label: "Coupon Usage" }]} />
    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Summary label="Consumed" value={String(summary?.consumedCount || 0)} icon={<CircleCheckBig className="h-5 w-5 text-emerald-600" />} />
      <Summary label="Reserved" value={String(summary?.reservedCount || 0)} icon={<ShoppingBag className="h-5 w-5 text-amber-600" />} />
      <Summary label="Released" value={String(summary?.releasedCount || 0)} icon={<TicketCheck className="h-5 w-5 text-muted-foreground" />} />
      <Summary label="Consumed savings" value={money(summary?.consumedDiscount)} icon={<IndianRupee className="h-5 w-5 text-emerald-600" />} />
      <Summary label="Tracked savings" value={money(summary?.totalDiscount)} icon={<IndianRupee className="h-5 w-5 text-primary" />} />
    </div>
    <div className="mb-4 flex flex-wrap gap-3 rounded-2xl border bg-card p-4">
      <div className="relative min-w-56 flex-1"><Users className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><input value={code} onChange={(event) => { setCode(event.target.value.toUpperCase()); setPage(1); }} placeholder="Filter coupon code" className="w-full rounded-xl border bg-background py-2 pl-10 pr-3" /></div>
      <div className="relative min-w-52"><Store className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><select value={status} onChange={(event) => { haptic(); setStatus(event.target.value); setPage(1); }} className="w-full rounded-xl border bg-background py-2 pl-10 pr-8"><option value="">All usage states</option><option value="RESERVED">Reserved</option><option value="CONSUMED">Consumed</option><option value="RELEASED">Released</option></select></div>
    </div>
    <ServerTable
      title={`${query.data?.total || 0} coupon uses`}
      columns={columns}
      items={query.data?.items || []}
      page={page}
      totalPages={query.data?.total_pages ?? query.data?.totalPages ?? 1}
      total={query.data?.total || 0}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onPageChange={(next) => { haptic(); setPage(next); }}
      rowKey={(row) => row.id}
    />
  </>;
}

function Summary({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border bg-card p-4 shadow-card"><div className="flex items-center justify-between text-xs font-bold text-muted-foreground"><span>{label}</span>{icon}</div><div className="mt-2 text-2xl font-black">{value}</div></div>;
}
