import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Bike, CheckCircle2, CreditCard, Eye, ShieldCheck, X } from "lucide-react";
import { useDrivers, useVerifyDriverDeposit, driverKeys } from "@/hooks/queries/use-drivers";
import { driversService } from "@/services/drivers.service";
import type { AdminDriverCashResponse } from "@/types";

export const Route = createFileRoute("/delivery-boys")({
  head: () => ({ meta: [{ title: "Delivery Boys | Go4Food Admin" }] }),
  component: DriversPage,
});

function isDriverVerified(r: AdminDriverCashResponse) {
  const status = String(r.verificationStatus ?? "").toUpperCase();
  if (status) return status === "VERIFIED" || status === "APPROVED";
  return r.verified === true;
}

function driverActive(r: AdminDriverCashResponse) {
  return Boolean(r.online || r.available) && isDriverVerified(r) && !r.blocked;
}

function DriversPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminDriverCashResponse | null>(null);
  const { search, setSearch, debounced } = useTableSearch();
  const { data, isLoading, isFetching, error } = useDrivers({ page, perPage: 20, search: debounced });
  const verify = useVerifyDriverDeposit();
  const verification = useMutation({
    mutationFn: ({ driverId, status }: { driverId: number | string; status: "VERIFIED" | "UNVERIFIED" | "REJECTED" }) => driversService.setVerificationStatus(driverId, status),
    onSuccess: (_, v) => {
      toast.success(v.status === "VERIFIED" ? "Delivery partner verified" : "Delivery partner verification updated");
      qc.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: () => toast.error("Driver verification could not be updated. Please try again."),
  });

  const cashSettlement = (r: AdminDriverCashResponse) => {
    const amount = Number(window.prompt(`Enter cash settlement amount for ${r.driverName}`, String(Number(r.cashInHand ?? 0).toFixed(2))) || 0);
    if (amount <= 0) return;
    verify.mutate({ driverId: r.driverId, body: { amount, paymentMethod: "CASH", note: "Verified by admin panel" } });
  };

  const items = data?.items ?? [];
  const cols: ServerColumn<AdminDriverCashResponse>[] = [
    { key: "driver", header: "Driver", render: (r) => (
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-info text-xs font-bold text-primary-foreground">
            {(r.driverName || "?").split(" ").map((x) => x[0]).slice(0,2).join("")}
          </div>
          <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${driverActive(r) ? "bg-success" : "bg-muted-foreground"}`} />
        </div>
        <div>
          <div className="font-medium">{r.driverName}</div>
          <div className="text-xs text-muted-foreground">#{r.driverId}</div>
        </div>
      </div>
    )},
    { key: "mobile", header: "Mobile", render: (r) => r.driverMobile || "—" },
    { key: "online", header: "Status", render: (r) => <StatusBadge status={driverActive(r) ? "Active" : "Inactive"} /> },
    { key: "deliveries", header: "Deliveries", render: (r) => r.totalDeliveries ?? 0 },
    { key: "earnings", header: "Earnings", render: (r) => <span className="font-semibold">₹{Number(r.totalEarnings ?? 0).toFixed(2)}</span> },
    { key: "cash", header: "Cash in hand", render: (r) => <span>₹{Number(r.cashInHand ?? 0).toFixed(2)} / ₹{Number(r.cashLimit ?? 0).toFixed(2)}</span> },
    { key: "verified", header: "Verification", render: (r) => <StatusBadge status={isDriverVerified(r) ? "Verified" : (r.verificationStatus || "Unverified")} /> },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelected(r)} className="inline-flex items-center gap-1.5 rounded-lg border border-info/30 px-3 py-2 text-xs font-bold text-info hover:bg-info/10"><Eye className="h-4 w-4" />View</button>
        <button onClick={() => cashSettlement(r)} disabled={verify.isPending} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50"><CreditCard className="h-4 w-4" />Cash Settlement</button>
        {!isDriverVerified(r) && <button onClick={() => verification.mutate({ driverId: r.driverId, status: "VERIFIED" })} disabled={verification.isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Verify</button>}
      </div>
    )},
  ];

  return (
    <>
      <PageHeader title="Delivery Boys" icon={<Bike className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Delivery Management"},{label:"Delivery Boys"}]} />
      <ServerTable
        title={`${data?.total ?? 0} drivers`}
        columns={cols}
        items={items}
        page={page}
        totalPages={data?.total_pages ?? 1}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onPageChange={setPage}
        search={search}
        onSearchChange={(s) => { setSearch(s); setPage(1); }}
        searchPlaceholder="Search drivers..."
        rowKey={(r) => r.driverId}
      />
      {selected && <DriverModal driver={selected} onClose={() => setSelected(null)} onCash={() => cashSettlement(selected)} onVerify={() => verification.mutate({ driverId: selected.driverId, status: "VERIFIED" })} onUnverify={() => verification.mutate({ driverId: selected.driverId, status: "UNVERIFIED" })} busy={verify.isPending || verification.isPending} />}
    </>
  );
}

function DriverModal({ driver, onClose, onCash, onVerify, onUnverify, busy }: { driver: AdminDriverCashResponse; onClose: () => void; onCash: () => void; onVerify: () => void; onUnverify: () => void; busy: boolean }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-extrabold">{driver.driverName}</h2><p className="text-sm text-muted-foreground">Delivery partner #{driver.driverId}</p></div><button onClick={onClose} className="rounded-lg border border-border p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Info label="Mobile" value={driver.driverMobile || "—"} />
        <Info label="Email" value={driver.driverEmail || "—"} />
        <Info label="Verification" value={isDriverVerified(driver) ? "Verified" : (driver.verificationStatus || "Unverified")} />
        <Info label="Status" value={driverActive(driver) ? "Active" : "Inactive"} />
        <Info label="Deliveries" value={String(driver.totalDeliveries ?? 0)} />
        <Info label="Rating" value={String(driver.rating ?? 0)} />
        <Info label="Total earnings" value={`₹${Number(driver.totalEarnings ?? 0).toFixed(2)}`} />
        <Info label="Cash in hand" value={`₹${Number(driver.cashInHand ?? 0).toFixed(2)}`} />
        <Info label="Cash limit" value={`₹${Number(driver.cashLimit ?? 0).toFixed(2)}`} />
      </div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button onClick={onCash} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><CreditCard className="h-4 w-4" />Cash Settlement</button>
        {isDriverVerified(driver) ? <button onClick={onUnverify} disabled={busy} className="rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-500 disabled:opacity-50">Mark Unverified</button> : <button onClick={onVerify} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50"><ShieldCheck className="h-4 w-4" />Verify Driver</button>}
      </div>
    </div>
  </div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-background/50 p-3"><div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold">{value}</div></div>;
}
