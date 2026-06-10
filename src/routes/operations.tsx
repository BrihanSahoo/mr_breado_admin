import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Activity, Send, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { paymentsService } from "@/services/payments.service";
import { reportsService } from "@/services/reports.service";
import { messagingService } from "@/services/messaging.service";
import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export const Route = createFileRoute("/operations")({
  head: () => ({ meta: [{ title: "Operations | Mr Breado Admin" }] }),
  component: OperationsPage,
});

const asItems = (data: any) => data?.items ?? data?.content ?? data?.records ?? data?.accounts ?? data?.transactions ?? data?.reports ?? data?.messages ?? [];

function OperationsPage() {
  const qc = useQueryClient();
  const [sellerId, setSellerId] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");

  const paymentSummary = useQuery({ queryKey: ["ops", "payment-summary"], queryFn: paymentsService.summary });
  const mrBreadoPayments = useQuery({ queryKey: ["ops", "mr-breado-payments"], queryFn: paymentsService.mrBreado });
  const reports = useQuery({ queryKey: ["ops", "reports"], queryFn: () => reportsService.list({ page: 1, perPage: 50 }) });
  const messages = useQuery({ queryKey: ["ops", "seller-messages"], queryFn: () => messagingService.list({ page: 1, perPage: 50 }) });
  const payoutAccounts = useQuery({
    queryKey: ["ops", "payout-accounts"],
    queryFn: () => request<any>({ url: endpoints.admin.sellerPayoutAccounts, method: "GET", params: { page: 1, perPage: 50 } }),
  });

  const sendSellerMessage = useMutation({
    mutationFn: () => messagingService.send({ sellerId: Number(sellerId), title: messageTitle.trim(), message: messageBody.trim() }),
    onSuccess: () => {
      toast.success("Seller message sent");
      setSellerId("");
      setMessageTitle("");
      setMessageBody("");
      qc.invalidateQueries({ queryKey: ["ops", "seller-messages"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const verifyPayout = useMutation({
    mutationFn: ({ id, approved }: { id: number | string; approved: boolean }) =>
      request<any>({ url: endpoints.admin.verifySellerPayout(id), method: "PATCH", data: { approved, verified: approved, status: approved ? "VERIFIED" : "REJECTED" } }),
    onSuccess: () => {
      toast.success("Payout account updated");
      qc.invalidateQueries({ queryKey: ["ops", "payout-accounts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateReport = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: string }) => reportsService.updateStatus(id, { status } as any),
    onSuccess: () => {
      toast.success("Report status updated");
      qc.invalidateQueries({ queryKey: ["ops", "reports"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const payouts = asItems(payoutAccounts.data);
  const reportItems = asItems(reports.data);
  const messageItems = asItems(messages.data);
  const paymentRows = asItems(mrBreadoPayments.data);

  return (
    <>
      <PageHeader
        title="Real World Operations"
        icon={<Activity className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Operations" }]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Total Payments" value={money((paymentSummary.data as any)?.totalAmount ?? (paymentSummary.data as any)?.totalPayments)} />
        <MetricCard title="Online Payments" value={money((paymentSummary.data as any)?.onlineAmount ?? (paymentSummary.data as any)?.onlinePayments)} />
        <MetricCard title="COD / Pending" value={money((paymentSummary.data as any)?.codAmount ?? (paymentSummary.data as any)?.pendingAmount)} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Seller Message Center" subtitle="Same admin-to-seller messaging flow as the app.">
          <div className="grid gap-3 md:grid-cols-[120px_1fr]">
            <input value={sellerId} onChange={(e) => setSellerId(e.target.value)} placeholder="Seller ID" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <input value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} placeholder="Message title" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
          </div>
          <textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} placeholder="Write message to seller" className="mt-3 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
          <div className="mt-3 flex justify-end">
            <Button disabled={!sellerId || !messageTitle.trim() || !messageBody.trim() || sendSellerMessage.isPending} onClick={() => sendSellerMessage.mutate()}>
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </div>
        </Panel>

        <Panel title="Recent Seller Messages" subtitle="Backend connected message history.">
          <MiniList loading={messages.isLoading} empty="No seller messages" rows={messageItems.map((m: any) => ({
            title: m.title ?? m.subject ?? "Message",
            sub: [m.sellerName ?? m.seller?.name, m.createdAt].filter(Boolean).join(" · "),
            right: m.status ?? "sent",
          }))} />
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="Restaurant Reports" subtitle="Review, resolve, approve, or reject seller/customer reports.">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="py-2">Report</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {reports.isLoading ? <tr><td className="py-8 text-muted-foreground" colSpan={3}>Loading reports...</td></tr> : reportItems.length === 0 ? <tr><td className="py-8 text-muted-foreground" colSpan={3}>No reports found</td></tr> : reportItems.map((r: any) => (
                  <tr key={r.id} className="border-b border-border/60">
                    <td className="py-3"><div className="font-medium">{r.restaurantName ?? r.restaurant?.name ?? r.title ?? `Report #${r.id}`}</div><div className="text-xs text-muted-foreground">{r.reason ?? r.message ?? r.description ?? "—"}</div></td>
                    <td><StatusBadge status={r.status ?? "PENDING"} /></td>
                    <td><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: r.id, status: "RESOLVED" })}>Resolve</Button><Button size="sm" variant="outline" onClick={() => updateReport.mutate({ id: r.id, status: "REJECTED" })}>Reject</Button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Seller Payout Accounts" subtitle="Verify or reject bank/UPI payout accounts.">
          <div className="space-y-3">
            {payoutAccounts.isLoading ? <div className="text-sm text-muted-foreground">Loading payout accounts...</div> : payouts.length === 0 ? <div className="text-sm text-muted-foreground">No payout accounts found</div> : payouts.map((a: any) => (
              <div key={a.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="font-medium">{a.accountHolderName ?? a.sellerName ?? `Account #${a.id}`}</div><div className="text-xs text-muted-foreground">{[a.bankName, a.upiId, a.ifscCode].filter(Boolean).join(" · ") || "Bank details available in backend"}</div></div>
                  <StatusBadge status={a.status ?? (a.verified ? "VERIFIED" : "PENDING")} />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => verifyPayout.mutate({ id: a.id, approved: true })}><ShieldCheck className="mr-1 h-4 w-4" />Verify</Button>
                  <Button size="sm" variant="outline" onClick={() => verifyPayout.mutate({ id: a.id, approved: false })}><XCircle className="mr-1 h-4 w-4" />Reject</Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Mr Breado Payment Ledger" subtitle="Admin-side store payment records from backend.">
          <MiniList loading={mrBreadoPayments.isLoading} empty="No payment ledger rows" rows={paymentRows.map((p: any) => ({
            title: p.orderNumber ?? p.paymentId ?? p.razorpayPaymentId ?? `Payment #${p.id ?? ""}`,
            sub: [p.customerName, p.paymentType, p.paymentStatus, p.createdAt].filter(Boolean).join(" · "),
            right: money(p.amount ?? p.grandTotal ?? p.totalAmount),
          }))} />
        </Panel>
      </div>
    </>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return <div className="rounded-xl border border-border bg-card p-4 shadow-card"><div className="text-sm text-muted-foreground">{title}</div><div className="mt-2 text-2xl font-semibold">{value}</div></div>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-border bg-card p-4 shadow-card"><div className="mb-4"><h3 className="text-base font-semibold">{title}</h3>{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}</div>{children}</section>;
}

function MiniList({ rows, loading, empty }: { rows: { title: string; sub?: string; right?: string }[]; loading?: boolean; empty: string }) {
  if (loading) return <div className="text-sm text-muted-foreground">Loading...</div>;
  if (!rows.length) return <div className="text-sm text-muted-foreground">{empty}</div>;
  return <div className="divide-y divide-border">{rows.slice(0, 8).map((row, i) => <div key={i} className="flex items-center justify-between gap-3 py-2"><div><div className="text-sm font-medium">{row.title}</div>{row.sub && <div className="text-xs text-muted-foreground">{row.sub}</div>}</div>{row.right && <div className="text-xs font-semibold text-primary">{row.right}</div>}</div>)}</div>;
}

function money(value: any) {
  const n = Number(value ?? 0);
  return `₹${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
}
