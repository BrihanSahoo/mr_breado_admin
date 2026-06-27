import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Bike,
  Check,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileText,
  IndianRupee,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Wallet,
  Mail,
  Paperclip,
  Send,
  AlertTriangle,
  X,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useDrivers, driverKeys } from "@/hooks/queries/use-drivers";
import { driversService } from "@/services/drivers.service";
import { customerEngagementService, type EmailCategory } from "@/services/customer-engagement.service";
import type {
  AdminDriverCashResponse,
  RiderFinanceHistoryRecord,
  RiderPayoutRecord,
  RiderSettlementRecord,
} from "@/types";

export const Route = createFileRoute("/delivery-boys")({
  head: () => ({ meta: [{ title: "Rider Finance & Control | Mr. Breado Admin" }] }),
  component: RidersPage,
});

function haptic(pattern: number | number[] = 30) {
  try { navigator.vibrate?.(pattern); } catch { /* not supported */ }
}

function verified(r: AdminDriverCashResponse) {
  return ["VERIFIED", "APPROVED", "ACTIVE"].includes(String(r.verificationStatus || "").toUpperCase()) || r.verified === true;
}

function riderRef(r: AdminDriverCashResponse): string | number {
  return (r as any).driverId ?? (r as any).mongoId ?? (r as any).userId ?? (r as any).profileId ?? "";
}

async function refreshRider(r: AdminDriverCashResponse) {
  return driversService.details(riderRef(r));
}

function RidersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminDriverCashResponse | null>(null);
  const { search, setSearch, debounced } = useTableSearch();
  const { data, isLoading, isFetching, error } = useDrivers({ page, perPage: 20, search: debounced });
  const financeSummary = useQuery({ queryKey: ["rider-finance-summary"], queryFn: driversService.financeSummary, staleTime: 10_000 });

  const verification = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: "VERIFIED" | "UNVERIFIED" | "REJECTED" }) =>
      driversService.setVerificationStatus(id, status),
    onSuccess: () => {
      haptic([30, 35, 30]);
      toast.success("Rider verification updated");
      qc.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: () => toast.error("Verification could not be updated. Please try again."),
  });

  const rows = data?.items || [];
  const cols: ServerColumn<AdminDriverCashResponse>[] = [
    {
      key: "rider",
      header: "Rider",
      render: (r) => <div className="flex items-center gap-3">
        <div className="h-11 w-11 overflow-hidden rounded-full border border-border bg-muted">
          {r.profileImage ? <img src={r.profileImage} alt={r.driverName || "Rider"} className="h-full w-full object-cover" /> : <Bike className="m-2.5 h-6 w-6 text-muted-foreground" />}
        </div>
        <div><div className="font-semibold">{r.driverName || "Rider"}</div><div className="text-xs text-muted-foreground">{r.driverMobile || "—"}</div></div>
      </div>,
    },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.online && r.available ? "Online" : "Offline"} /> },
    { key: "verification", header: "Verification", render: (r) => <StatusBadge status={verified(r) ? "Verified" : (r.verificationStatus || "Unverified")} /> },
    { key: "cash", header: "COD with rider", render: (r) => <Money value={r.cashInHand} /> },
    {
      key: "cashRequests",
      header: "Cash requests",
      render: (r) => Number(r.pendingCashSettlementCount || 0) > 0
        ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">{r.pendingCashSettlementCount} pending</span>
        : <span className="text-xs text-muted-foreground">None</span>,
    },
    { key: "payout", header: "Rider earnings due", render: (r) => <Money value={r.pendingPayout} /> },
    { key: "upi", header: "UPI ID", render: (r) => r.upiId || <span className="text-amber-600">Not submitted</span> },
    {
      key: "actions",
      header: "Actions",
      render: (r) => <button onClick={() => { haptic(); setSelected(r); }} className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10"><Eye className="h-4 w-4" />Control</button>,
    },
  ];

  return <>
    <PageHeader title="Rider Finance & Control" icon={<Bike className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Delivery Management" }, { label: "Rider Control" }]} />
    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <Summary title="Online riders" value={String(financeSummary.data?.onlineRiders ?? financeSummary.data?.riders?.online ?? rows.filter((x) => x.online && x.available).length)} icon={<Bike className="h-5 w-5" />} />
      <Summary title="Total COD collected" value={`₹${Number(financeSummary.data?.totalCodCollected || 0).toFixed(2)}`} icon={<Wallet className="h-5 w-5" />} />
      <Summary title="Received from riders" value={`₹${Number(financeSummary.data?.totalReceivedFromRiders || 0).toFixed(2)}`} icon={<ArrowDownLeft className="h-5 w-5 text-emerald-600" />} />
      <Summary title="COD held by riders" value={`₹${Number(financeSummary.data?.totalCodHeldByRiders ?? financeSummary.data?.totalHeldByRiders ?? 0).toFixed(2)}`} icon={<Wallet className="h-5 w-5 text-amber-600" />} />
      <Summary title="Paid to riders" value={`₹${Number(financeSummary.data?.totalPaidToRiders || 0).toFixed(2)}`} icon={<ArrowUpRight className="h-5 w-5 text-red-600" />} />
      <Summary title="Rider payout due" value={`₹${Number(financeSummary.data?.totalPendingRiderPayout || 0).toFixed(2)}`} icon={<IndianRupee className="h-5 w-5 text-primary" />} />
    </div>
    <ServerTable
      title={`${data?.total ?? 0} riders`}
      columns={cols}
      items={rows}
      page={page}
      totalPages={data?.total_pages ?? 1}
      total={data?.total ?? 0}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onPageChange={setPage}
      search={search}
      onSearchChange={(value) => { setSearch(value); setPage(1); }}
      searchPlaceholder="Search rider name, phone or email"
      rowKey={(r) => riderRef(r)}
    />
    {selected && <RiderControl
      rider={selected}
      onClose={() => setSelected(null)}
      onChanged={() => { qc.invalidateQueries({ queryKey: driverKeys.all }); qc.invalidateQueries({ queryKey: ["rider-finance-summary"] }); }}
      verify={(status) => verification.mutate({ id: riderRef(selected), status })}
    />}
  </>;
}

function RiderControl({ rider, onClose, onChanged, verify }: {
  rider: AdminDriverCashResponse;
  onClose: () => void;
  onChanged: () => void;
  verify: (status: "VERIFIED" | "UNVERIFIED" | "REJECTED") => void;
}) {
  const [detail, setDetail] = useState<AdminDriverCashResponse>(rider);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<{ url: string; label: string } | null>(null);
  const [emailOpen, setEmailOpen] = useState(false);

  const reload = async () => {
    setLoading(true);
    try { setDetail(await refreshRider(detail)); }
    catch { toast.error("Rider details could not be refreshed."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    refreshRider(rider)
      .then((value) => { if (mounted) setDetail(value); })
      .catch(() => toast.error("Rider details could not be loaded."))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [rider]);

  const afterAction = async (message: string) => {
    haptic([35, 35, 55]);
    toast.success(message);
    const updated = await refreshRider(detail);
    setDetail(updated);
    onChanged();
  };

  const approveCash = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => driversService.approveSettlement(id, note),
    onSuccess: () => afterAction("Cash receipt approved and rider COD balance updated"),
    onError: () => toast.error("Cash request could not be approved. Refresh and try again."),
  });

  const rejectCash = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => driversService.rejectSettlement(id, reason),
    onSuccess: () => afterAction("Cash handover request rejected"),
    onError: () => toast.error("Cash request could not be rejected. Refresh and try again."),
  });

  const createPayout = useMutation({
    mutationFn: async () => {
      if (!detail.upiId) throw new Error("UPI_REQUIRED");
      const due = Number(detail.pendingPayout || 0);
      const raw = window.prompt(`Create a payout to ${detail.upiId}`, due.toFixed(2));
      if (raw === null) return null;
      const amount = Number(raw);
      if (!Number.isFinite(amount) || amount <= 0 || amount > due + 0.01) throw new Error("INVALID_AMOUNT");
      return driversService.payout(riderRef(detail), { amount, upiId: detail.upiId, note: "Rider payout awaiting payment confirmation" });
    },
    onSuccess: (value) => value && afterAction("Payout created. Mark it paid after completing the UPI transfer."),
    onError: (error: Error) => toast.error(error.message === "UPI_REQUIRED" ? "Ask the rider to submit a UPI ID first." : "Enter a valid payout amount within the rider's due balance."),
  });

  const markPaid = useMutation({
    mutationFn: async (payout: RiderPayoutRecord) => {
      const reference = window.prompt(`Enter the UPI transaction reference for ₹${Number(payout.amount).toFixed(2)}`)?.trim();
      if (!reference) throw new Error("REFERENCE_REQUIRED");
      return driversService.markPayoutPaid(payout.id, { paymentReference: reference, note: "Paid to rider by admin" });
    },
    onSuccess: () => afterAction("Rider payout marked paid and pending earnings cleared"),
    onError: (error: Error) => toast.error(error.message === "REFERENCE_REQUIRED" ? "A payment reference is required." : "Payout could not be confirmed. Please try again."),
  });

  const cancelPayout = useMutation({
    mutationFn: async (payout: RiderPayoutRecord) => {
      const reason = window.prompt("Reason for cancelling this payout", "Payment was not completed")?.trim();
      if (!reason) throw new Error("REASON_REQUIRED");
      return driversService.cancelPayout(payout.id, reason);
    },
    onSuccess: () => afterAction("Pending payout cancelled"),
    onError: () => toast.error("Payout could not be cancelled."),
  });

  const remind = useMutation({
    mutationFn: () => driversService.requestUpi(riderRef(detail)),
    onSuccess: () => { haptic(); toast.success("UPI reminder sent to rider"); },
    onError: () => toast.error("UPI reminder could not be sent."),
  });

  const pendingCash = (detail.settlements || []).filter((item) => item.method === "CASH" && item.status === "PENDING");
  const pendingPayouts = (detail.payouts || []).filter((item) => item.status === "PENDING");
  const history = detail.financeHistory || [];
  const busy = approveCash.isPending || rejectCash.isPending || createPayout.isPending || markPaid.isPending || cancelPayout.isPending || remind.isPending;

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
    <div className="mx-auto my-6 w-full max-w-7xl rounded-3xl border border-border bg-card shadow-2xl">
      <div className="sticky top-0 z-10 flex items-start justify-between rounded-t-3xl border-b border-border bg-card/95 p-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-border bg-muted">
            {detail.profileImage ? <img src={detail.profileImage} alt={detail.driverName || "Rider"} className="h-full w-full object-cover" /> : <Bike className="m-4 h-8 w-8 text-muted-foreground" />}
          </div>
          <div><h2 className="text-2xl font-black">{detail.driverName || "Rider"}</h2><p className="text-sm text-muted-foreground">Verification, COD settlement and payout ledger</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { haptic(); setEmailOpen(true); }} className="rounded-xl border border-primary/30 p-2 text-primary hover:bg-primary/10" title="Email rider"><Mail className="h-5 w-5" /></button>
          <button onClick={() => { haptic(); reload(); }} className="rounded-xl border border-border p-2 hover:bg-muted" title="Refresh"><RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} /></button>
          <button onClick={onClose} className="rounded-xl border border-border p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
        </div>
      </div>

      {loading ? <div className="p-12 text-center text-muted-foreground">Loading rider account…</div> : <div className="space-y-7 p-5">
        <div className="grid gap-4 md:grid-cols-5">
          <Summary title="Delivered" value={String(detail.totalDeliveries || 0)} icon={<CheckCircle2 className="h-5 w-5" />} />
          <Summary title="COD with rider" value={`₹${Number(detail.cashInHand || 0).toFixed(2)}`} icon={<Wallet className="h-5 w-5" />} />
          <Summary title="Cash awaiting review" value={`₹${Number(detail.pendingCashSettlement || 0).toFixed(2)}`} icon={<ArrowDownLeft className="h-5 w-5 text-emerald-600" />} />
          <Summary title="Earnings due" value={`₹${Number(detail.pendingPayout || 0).toFixed(2)}`} icon={<IndianRupee className="h-5 w-5" />} />
          <Summary title="Payout pending" value={`₹${Number(detail.payoutAwaitingConfirmation || 0).toFixed(2)}`} icon={<ArrowUpRight className="h-5 w-5 text-red-600" />} />
        </div>

        <section className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-4">
          <Info label="Phone" value={detail.driverMobile || "—"} />
          <Info label="Email" value={detail.driverEmail || "—"} />
          <Info label="Verification" value={detail.verificationStatus || "UNVERIFIED"} />
          <Info label="UPI ID" value={detail.upiId || "Not submitted"} />
          <Info label="Cash limit" value={`₹${Number(detail.cashLimit || 0).toFixed(2)}`} />
          <Info label="Rating" value={String(detail.rating || 0)} />
          <Info label="Latest location" value={detail.latestLocation ? `${detail.latestLocation.latitude}, ${detail.latestLocation.longitude}` : "Not available"} />
          <Info label="Rider state" value={detail.online && detail.available ? "Online and available" : "Offline"} />
        </section>

        <div className="flex flex-wrap gap-3">
          {!verified(detail) && <button onClick={() => { haptic(); verify("VERIFIED"); }} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"><ShieldCheck className="mr-2 inline h-4 w-4" />Approve verification</button>}
          {detail.upiId
            ? <button disabled={busy || Number(detail.pendingPayout || 0) <= 0 || pendingPayouts.length > 0} onClick={() => { haptic(); createPayout.mutate(); }} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"><CreditCard className="mr-2 inline h-4 w-4" />Create rider payout</button>
            : <button disabled={busy} onClick={() => remind.mutate()} className="rounded-xl border border-primary px-5 py-3 text-sm font-bold text-primary"><Smartphone className="mr-2 inline h-4 w-4" />Request UPI ID</button>}
        </div>

        <section className="rounded-2xl border border-amber-300 bg-amber-50/60 p-4 dark:bg-amber-950/10">
          <div className="mb-4 flex items-center justify-between"><div><h3 className="text-lg font-black">COD cash handover requests</h3><p className="text-sm text-muted-foreground">Approve only after physically receiving the exact amount. Razorpay payments complete automatically.</p></div><span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-800">{pendingCash.length} pending</span></div>
          {pendingCash.length === 0 ? <Empty text="No cash handover request is awaiting review." /> : <div className="space-y-3">{pendingCash.map((item) => <SettlementCard key={item.id} item={item} busy={busy} onApprove={() => {
            const note = window.prompt("Optional receipt note", "Cash received from rider") || undefined;
            haptic(); approveCash.mutate({ id: item.id, note });
          }} onReject={() => {
            const reason = window.prompt("Reason for rejection", "Cash was not received or the amount did not match")?.trim();
            if (!reason) return;
            haptic([60, 40, 60]); rejectCash.mutate({ id: item.id, reason });
          }} />)}</div>}
        </section>

        <section className="rounded-2xl border border-border p-4">
          <div className="mb-4"><h3 className="text-lg font-black">Pending rider payouts</h3><p className="text-sm text-muted-foreground">Create a payout, transfer to the displayed UPI ID, then confirm it using the actual transaction reference.</p></div>
          {pendingPayouts.length === 0 ? <Empty text="No payout is awaiting payment confirmation." /> : <div className="space-y-3">{pendingPayouts.map((item) => <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background/60 p-4">
            <div><div className="text-xl font-black">₹{Number(item.amount).toFixed(2)}</div><div className="text-sm text-muted-foreground">Pay to {item.upiId || detail.upiId || "UPI ID unavailable"}</div><div className="mt-1 text-xs text-muted-foreground">Created {dateText(item.createdAt)}</div></div>
            <div className="flex gap-2"><button disabled={busy} onClick={() => { haptic(); markPaid.mutate(item); }} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"><Check className="mr-1 inline h-4 w-4" />Mark paid</button><button disabled={busy} onClick={() => cancelPayout.mutate(item)} className="rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-40"><XCircle className="mr-1 inline h-4 w-4" />Cancel</button></div>
          </div>)}</div>}
        </section>

        <section className="rounded-2xl border border-border p-4">
          <div className="mb-4"><h3 className="text-lg font-black">Money movement ledger</h3><p className="text-sm text-muted-foreground">Green arrows are money received from riders. Red arrows are payouts sent to riders.</p></div>
          {history.length === 0 ? <Empty text="No rider finance history yet." /> : <div className="space-y-2">{history.map((item) => <LedgerRow key={`${item.direction}-${item.id}`} item={item} />)}</div>}
        </section>

        {detail.verificationRequest?.documents?.length ? <section className="rounded-2xl border border-border p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-lg font-black">Verification documents</h3><p className="text-xs text-muted-foreground">Includes the rider's passport-size profile photograph.</p></div><StatusBadge status={detail.verificationRequest.status || detail.verificationStatus || "PENDING"} /></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{detail.verificationRequest.documents.map((document, index) => {
            const url = String(document.url || document.downloadUrl || "");
            const label = String(document.alt || `Document ${index + 1}`).replace(/([A-Z])/g, " $1").trim();
            const isPdf = /\.pdf(?:$|\?)/i.test(url) || url.startsWith("data:application/pdf");
            return <div key={`${url}-${index}`} className="rounded-xl border border-border bg-background/60 p-3"><div className="mb-3 flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary">{isPdf ? <FileText className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</div><div className="min-w-0"><div className="truncate text-sm font-bold capitalize">{label}</div><div className="text-xs text-muted-foreground">{isPdf ? "PDF document" : "Image document"}</div></div></div><div className="flex gap-2"><button type="button" disabled={!url} onClick={() => url && setPreview({ url, label })} className="flex-1 rounded-lg border border-primary/30 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 disabled:opacity-40"><Eye className="mr-1 inline h-3.5 w-3.5" />View</button><a href={url || undefined} download target="_blank" rel="noreferrer" className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs font-bold hover:bg-muted"><Download className="mr-1 inline h-3.5 w-3.5" />Download</a></div></div>;
          })}</div>
        </section> : null}

        <DeliveryHistory orders={detail.orders || []} />
      </div>}
    </div>

    {emailOpen && <RiderEmailPanel rider={detail} onClose={() => setEmailOpen(false)} />}

    {preview && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4" onClick={() => setPreview(null)}><div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between border-b border-border p-4"><div><div className="font-bold capitalize">{preview.label}</div><div className="text-xs text-muted-foreground">Rider verification document</div></div><div className="flex items-center gap-2"><a href={preview.url} download target="_blank" rel="noreferrer" className="rounded-lg border border-border p-2 hover:bg-muted"><Download className="h-4 w-4" /></a><button onClick={() => setPreview(null)} className="rounded-lg border border-border p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div></div><div className="h-[75vh] bg-black/20 p-3">{/\.pdf(?:$|\?)/i.test(preview.url) || preview.url.startsWith("data:application/pdf") ? <iframe src={preview.url} title={preview.label} className="h-full w-full rounded-xl bg-white" /> : <img src={preview.url} alt={preview.label} className="h-full w-full rounded-xl object-contain" />}</div></div></div>}
  </div>;
}

function SettlementCard({ item, busy, onApprove, onReject }: { item: RiderSettlementRecord; busy: boolean; onApprove: () => void; onReject: () => void }) {
  return <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-300 bg-background/70 p-4"><div><div className="text-xl font-black">₹{Number(item.amount).toFixed(2)}</div><div className="text-sm font-semibold">Cash handover</div><div className="text-xs text-muted-foreground">Requested {dateText(item.requestedAt || item.createdAt)}</div>{item.note && <div className="mt-1 text-xs text-muted-foreground">{item.note}</div>}</div><div className="flex gap-2"><button disabled={busy} onClick={onApprove} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40"><Check className="mr-1 inline h-4 w-4" />Approve received</button><button disabled={busy} onClick={onReject} className="rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-40"><XCircle className="mr-1 inline h-4 w-4" />Reject</button></div></div>;
}

function LedgerRow({ item }: { item: RiderFinanceHistoryRecord }) {
  const incoming = item.direction === "RIDER_TO_ADMIN";
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/60 p-3"><div className="flex items-center gap-3"><div className={`rounded-full p-2 ${incoming ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{incoming ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}</div><div><div className="font-bold">{incoming ? "Received from rider" : "Paid to rider"}</div><div className="text-xs text-muted-foreground">{item.method || item.kind} · {dateText(item.completedAt || item.createdAt)}</div>{item.paymentReference && <div className="text-xs text-muted-foreground">Ref: {item.paymentReference}</div>}</div></div><div className="text-right"><div className={`text-lg font-black ${incoming ? "text-emerald-700" : "text-red-700"}`}>{incoming ? "+" : "−"}₹{Number(item.amount).toFixed(2)}</div><StatusBadge status={item.status || "PENDING"} /></div></div>;
}

function DeliveryHistory({ orders }: { orders: NonNullable<AdminDriverCashResponse["orders"]> }) {
  return <section><h3 className="mb-3 text-lg font-black">Delivery history</h3><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead className="bg-muted/50"><tr><th className="p-3 text-left">Order</th><th className="p-3 text-left">Outlet</th><th className="p-3 text-left">Customer</th><th className="p-3 text-left">Distance</th><th className="p-3 text-left">Payment</th><th className="p-3 text-left">Status</th><th className="p-3 text-right">Total</th></tr></thead><tbody>{orders.map((order, index) => <tr key={String(order.id || index)} className="border-t border-border"><td className="p-3 font-semibold">{order.orderNumber}</td><td className="p-3">{order.outletName || "—"}</td><td className="p-3">{order.customerName || "—"}</td><td className="p-3">{Number(order.distanceKm || 0).toFixed(2)} km</td><td className="p-3">{order.paymentMethod} / {order.paymentStatus}</td><td className="p-3"><StatusBadge status={order.status || "—"} /></td><td className="p-3 text-right font-bold">₹{Number(order.total || 0).toFixed(2)}</td></tr>)}</tbody></table>{orders.length === 0 && <Empty text="No delivery history yet." />}</div></section>;
}

function dateText(value?: string) { return value ? new Date(value).toLocaleString() : "—"; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">{text}</div>; }
function Summary({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) { return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-bold uppercase tracking-wider">{title}</span>{icon}</div><div className="mt-2 text-2xl font-black">{value}</div></div>; }
function Info({ label, value }: { label: string; value: string }) { return <div><div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold">{value}</div></div>; }
function Money({ value }: { value?: number }) { return <span className="font-bold">₹{Number(value || 0).toFixed(2)}</span>; }


function RiderEmailPanel({ rider, onClose }: { rider: AdminDriverCashResponse; onClose: () => void }) {
  const id = riderRef(rider);
  const name = rider.driverName || "Rider";
  const email = (rider as any).driverEmail || (rider as any).email || "";
  const [category, setCategory] = useState<EmailCategory>("GENERAL");
  const [subject, setSubject] = useState("Message from Mr. Breado");
  const [bodyText, setBodyText] = useState(`Hello ${name},

You have received a message from the Mr. Breado administration team.

Add your message here.

Regards,
Mr. Breado Team`);
  const [files, setFiles] = useState<File[]>([]);
  const config = useQuery({ queryKey: ["email-config"], queryFn: customerEngagementService.emailConfig, staleTime: 30_000 });
  const templates = useQuery({ queryKey: ["email-templates", name], queryFn: () => customerEngagementService.templates(name), staleTime: 60_000 });
  const sendEmail = useMutation({
    mutationFn: () => customerEngagementService.emailRider(id, { category, subject, bodyText, attachments: files }),
    onSuccess: () => { haptic([35, 35, 55]); toast.success("Email sent to rider"); onClose(); },
    onError: (error: Error) => toast.error(error.message),
  });
  const applyTemplate = (next: EmailCategory) => {
    setCategory(next);
    const template = templates.data?.find((row: any) => row.category === next);
    if (template) { setSubject(template.subject || ""); setBodyText(template.bodyText || ""); }
  };
  return <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6">
    <div className="mx-auto my-4 w-full max-w-3xl rounded-3xl border border-border bg-card p-5 shadow-2xl sm:p-7">
      <div className="mb-5 flex items-center justify-between gap-3"><div><h3 className="text-2xl font-black">Email {name}</h3><p className="text-sm text-muted-foreground">{email || "No email address is saved for this rider."}</p></div><button onClick={onClose} className="rounded-xl border border-border p-2 hover:bg-muted"><X className="h-5 w-5" /></button></div>
      {!config.data?.configured && <div className="mb-4 animate-pulse rounded-2xl border border-amber-400 bg-amber-50 p-4 text-amber-900"><div className="flex gap-3"><AlertTriangle className="h-5 w-5" /><div><div className="font-black">SMTP email configuration required</div><div className="text-sm">Open API Keys and configure SMTP host, username, app password and sender email.</div></div></div></div>}
      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold">Email section<select value={category} onChange={(event) => applyTemplate(event.target.value as EmailCategory)} className="min-h-12 rounded-xl border border-input bg-background px-3 text-base"><option value="PROMOTIONAL">Promotional</option><option value="ALERT">Alert</option><option value="PAYMENT_REQUEST">Payment request</option><option value="DOCUMENT">PDF / image / document</option><option value="GENERAL">Admin message</option></select></label>
        <label className="grid gap-2 text-sm font-bold">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} className="min-h-12 rounded-xl border border-input bg-background px-3 text-base" /></label>
        <label className="grid gap-2 text-sm font-bold">Message<textarea value={bodyText} onChange={(event) => setBodyText(event.target.value)} className="min-h-56 rounded-xl border border-input bg-background p-3 text-base leading-relaxed" /></label>
        <label className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm font-bold"><div className="flex items-center gap-2"><Paperclip className="h-4 w-4" />Attach images, PDF, Word or spreadsheet files</div><input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" className="mt-3 block w-full text-sm" onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 5))} /></label>
        <button disabled={!config.data?.configured || !email || sendEmail.isPending || !subject.trim() || !bodyText.trim()} onClick={() => sendEmail.mutate()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground disabled:opacity-40"><Send className="h-4 w-4" />{sendEmail.isPending ? "Sending…" : "Send email"}</button>
      </div>
    </div>
  </div>;
}
