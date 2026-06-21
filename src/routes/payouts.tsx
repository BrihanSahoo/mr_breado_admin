import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Wallet, Check } from "lucide-react";
import {
  useSettlements, useMarkSettlementPaid,
} from "@/hooks/queries/use-settlements";
import { usePaymentsSummary } from "@/hooks/queries/use-payments";
import type { AdminRestaurantPayoutResponse } from "@/types";

export const Route = createFileRoute("/payouts")({
  head: () => ({ meta: [{ title: "Payouts | Mr. Breado Admin" }] }),
  component: PayoutsPage,
});

function PayoutsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useSettlements({ page, perPage: 20 });
  const { data: summary } = usePaymentsSummary();
  const markPaid = useMarkSettlementPaid();

  const items = data?.items ?? [];

  const cols: ServerColumn<AdminRestaurantPayoutResponse>[] = [
    { key: "id", header: "Settlement #", render: (r) => <span className="font-mono text-primary">#{r.id}</span> },
    { key: "restaurant", header: "Restaurant", render: (r) => (
      <div>
        <div className="font-medium">{r.restaurantName}</div>
        <div className="text-xs text-muted-foreground">#{r.restaurantId}</div>
      </div>
    )},
    { key: "period", header: "Period", render: (r) => (
      <span className="text-xs">
        {r.periodStart ? new Date(r.periodStart).toLocaleDateString() : "—"} → {r.periodEnd ? new Date(r.periodEnd).toLocaleDateString() : "—"}
      </span>
    )},
    { key: "orders", header: "Orders", render: (r) => r.totalOrders ?? 0 },
    { key: "gross", header: "Gross", render: (r) => <span className="font-semibold">₹{Number(r.grossAmount ?? 0).toFixed(2)}</span> },
    { key: "commission", header: "Commission", render: (r) => `₹${Number(r.commissionAmount ?? 0).toFixed(2)}` },
    { key: "payable", header: "Payable", render: (r) => <span className="font-semibold text-success">₹{Number(r.payableAmount ?? 0).toFixed(2)}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status || "PENDING"} /> },
    { key: "actions", header: "Actions", render: (r) => (
      <button
        onClick={() => {
          const ref = window.prompt("Payment reference (txn id)?") || "";
          if (ref) markPaid.mutate({ id: r.id, body: { paymentMethod: "BANK", paymentReference: ref } });
        }}
        disabled={markPaid.isPending || r.status === "PAID"}
        className="rounded p-1.5 text-success hover:bg-success/10 disabled:opacity-40"
        title="Mark paid"
      >
        <Check className="h-4 w-4" />
      </button>
    )},
  ];

  return (
    <>
      <PageHeader title="Restaurant Settlements" icon={<Wallet className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Service Management"},{label:"Settlements"}]} />

      {summary && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Collected", value: `₹${Number(summary.totalCollected ?? 0).toFixed(2)}` },
            { label: "Platform Fee", value: `₹${Number(summary.platformFee ?? 0).toFixed(2)}` },
            { label: "Restaurant Payable", value: `₹${Number(summary.restaurantPayable ?? 0).toFixed(2)}` },
            { label: "Admin Commission", value: `₹${Number(summary.adminCommission ?? 0).toFixed(2)}` },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <ServerTable
        title={`${data?.total ?? 0} settlements`}
        columns={cols}
        items={items}
        page={page}
        totalPages={data?.total_pages ?? 1}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onPageChange={setPage}
        rowKey={(r) => r.id}
      />
    </>
  );
}
