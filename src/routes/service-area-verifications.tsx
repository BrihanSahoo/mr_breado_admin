import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, MapPin, CheckCircle2, XCircle, ExternalLink, FileText, Bike, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { serviceAreaVerificationService, type VerificationRequest } from "@/services/service-area-verification.service";

export const Route = createFileRoute("/service-area-verifications")({
  head: () => ({ meta: [{ title: "Verification Requests | Mr Breado Admin" }] }),
  component: ServiceAreaVerificationPage,
});

type RequestType = "ALL" | "RESTAURANT" | "RIDER";

function ServiceAreaVerificationPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [type, setType] = useState<RequestType>("ALL");
  const [range, setRange] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<VerificationRequest | null>(null);

  const area = useQuery({ queryKey: ["service-area"], queryFn: serviceAreaVerificationService.getServiceArea });
  const requests = useQuery({
    queryKey: ["verifications", status, type],
    queryFn: () => serviceAreaVerificationService.listVerifications(status, type),
    staleTime: 8_000,
  });

  const grouped = useMemo(() => {
    const all = requests.data ?? [];
    return {
      all: all.length,
      restaurant: all.filter((x) => requestKind(x) === "RESTAURANT").length,
      rider: all.filter((x) => requestKind(x) === "RIDER").length,
      pending: all.filter((x) => String(x.status ?? "").toUpperCase() === "PENDING").length,
    };
  }, [requests.data]);

  const saveArea = useMutation({
    mutationFn: () => serviceAreaVerificationService.updateServiceArea({
      defaultRangeKm: Number(range || area.data?.defaultRangeKm || 0),
      message: message || area.data?.message || "Sorry, this restaurant cannot deliver to your selected location right now.",
      enabled: area.data?.enabled ?? true,
    }),
    onSuccess: () => { toast.success("Service area updated successfully"); qc.invalidateQueries({ queryKey: ["service-area"] }); },
    onError: () => toast.error("Service area could not be updated. Please try again."),
  });

  const approve = useMutation({
    mutationFn: (req: VerificationRequest) => serviceAreaVerificationService.approve(req, "Verified by admin."),
    onSuccess: () => { toast.success("Verification approved successfully"); qc.invalidateQueries({ queryKey: ["verifications"] }); },
    onError: () => toast.error("Verification could not be approved. Please refresh and try again."),
  });

  const reject = useMutation({
    mutationFn: ({ req, reason }: { req: VerificationRequest; reason: string }) => serviceAreaVerificationService.reject(req, reason),
    onSuccess: () => { toast.success("Verification rejected successfully"); qc.invalidateQueries({ queryKey: ["verifications"] }); },
    onError: () => toast.error("Verification could not be rejected. Please refresh and try again."),
  });

  return <>
    <PageHeader title="Verification Requests" icon={<ShieldCheck className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Service Management" }, { label: "Verification Requests" }]} />

    <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" /><h2 className="text-lg font-bold">Delivery service area</h2></div>
        <p className="mt-2 text-sm text-muted-foreground">Set the maximum restaurant-to-customer delivery radius. Checkout is blocked professionally when the user is outside this range.</p>
        <label className="mt-5 block text-sm font-semibold">Default delivery range in KM</label>
        <input className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none" type="number" min="0" step="0.1" placeholder={String(area.data?.defaultRangeKm ?? 5)} value={range} onChange={(e) => setRange(e.target.value)} />
        <label className="mt-4 block text-sm font-semibold">Out-of-range user message</label>
        <textarea className="mt-2 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none" placeholder={area.data?.message ?? "Sorry, this restaurant cannot deliver to your selected location right now."} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={() => saveArea.mutate()} disabled={saveArea.isPending} className="mt-4 w-full rounded-xl gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60">{saveArea.isPending ? "Saving..." : "Save service area"}</button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-bold">Restaurant & Rider Verification Requests</h2>
            <p className="text-sm text-muted-foreground">Approve only after checking uploaded business/rider documents. Until approved, restaurants/products/rider assignments stay blocked.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as RequestType)}>
              <option value="ALL">All request types</option><option value="RESTAURANT">Restaurants only</option><option value="RIDER">Riders only</option>
            </select>
            <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option><option value="PENDING">Pending</option><option value="VERIFIED">Verified</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="UNVERIFIED">Unverified</option>
            </select>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <Metric label="Total" value={grouped.all} icon={<ShieldCheck className="h-4 w-4" />} />
          <Metric label="Restaurants" value={grouped.restaurant} icon={<Store className="h-4 w-4" />} />
          <Metric label="Riders" value={grouped.rider} icon={<Bike className="h-4 w-4" />} />
          <Metric label="Pending" value={grouped.pending} icon={<FileText className="h-4 w-4" />} />
        </div>

        {requests.isLoading ? <div className="grid gap-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}</div> : (
          <div className="grid gap-3">
            {(requests.data ?? []).map((req) => <RequestCard key={`${req.source}-${String(req.id)}-${req.entityType}`} req={req} approving={approve.isPending} rejecting={reject.isPending} onView={() => setSelected(req)} onApprove={() => approve.mutate(req)} onReject={() => { const reason = prompt("Reason for rejection?") || "Documents are not valid."; reject.mutate({ req, reason }); }} />)}
            {(requests.data ?? []).length === 0 && <div className="rounded-xl border border-dashed border-border p-10 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div><p className="font-semibold">No verification requests found</p><p className="mt-1 text-sm text-muted-foreground">When sellers or riders submit documents from the app, their requests will appear here.</p></div>}
          </div>
        )}
      </section>
    </div>
    {selected && <RequestDetailsModal req={selected} onClose={() => setSelected(null)} onApprove={() => approve.mutate(selected)} onReject={() => { const reason = prompt("Reason for rejection?") || "Documents are not valid."; reject.mutate({ req: selected, reason }); }} busy={approve.isPending || reject.isPending} />}
  </>;
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="rounded-xl border border-border bg-background/60 p-3"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-bold uppercase tracking-wider">{label}</span>{icon}</div><div className="mt-2 text-2xl font-extrabold">{value}</div></div>;
}

function requestKind(req: VerificationRequest) {
  const raw = String(req.entityType ?? req.requestType ?? req.source ?? "").toUpperCase();
  if (raw.includes("RIDER") || raw.includes("DRIVER")) return "RIDER";
  if (raw.includes("RESTAURANT") || req.restaurantId) return "RESTAURANT";
  return "REQUEST";
}

function requestTitle(req: VerificationRequest) {
  return req.businessName || req.restaurantName || req.riderName || req.driverName || req.applicantName || "Verification request";
}

function RequestCard({ req, onView, onApprove, onReject, approving, rejecting }: { req: VerificationRequest; onView: () => void; onApprove: () => void; onReject: () => void; approving: boolean; rejecting: boolean }) {
  const name = requestTitle(req);
  const kind = requestKind(req);
  const docs = req.documents ?? [];
  const done = ["VERIFIED", "APPROVED", "REJECTED"].includes(String(req.status ?? "").toUpperCase());
  return <article className="rounded-xl border border-border bg-background/50 p-4">
    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-base font-bold">{name}</h3><StatusBadge status={req.status || req.verificationStatus || "PENDING"} /><span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">{kind}</span></div>
        <p className="mt-1 text-sm text-muted-foreground">Mobile: {req.contactMobile || req.mobile || "N/A"} · Submitted: {req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"}</p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{req.note || req.address || "Open details to review submitted information and uploaded documents."}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {docs.slice(0, 4).map((d, i) => documentUrl(d) ? <a key={i} href={documentUrl(d)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted">{documentName(d, i)} <ExternalLink className="h-3 w-3" /></a> : null)}
          {docs.length === 0 && <span className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground">No document links returned by backend</span>}
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button onClick={onView} className="rounded-xl border border-info/30 px-4 py-2 text-sm font-bold text-info hover:bg-info/10">View Details</button>
        <button onClick={onApprove} disabled={approving || done} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Approve</button>
        <button onClick={onReject} disabled={rejecting || done} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><XCircle className="h-4 w-4" />Reject</button>
      </div>
    </div>
  </article>;
}

function documentUrl(d: any) { return d?.url || d?.fileUrl; }
function documentName(d: any, i: number) { return d?.name || d?.type || d?.documentType || d?.fileName || `Document ${i + 1}`; }

function RequestDetailsModal({ req, onClose, onApprove, onReject, busy }: { req: VerificationRequest; onClose: () => void; onApprove: () => void; onReject: () => void; busy: boolean }) {
  const docs = req.documents ?? [];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-extrabold">{requestTitle(req)}</h2><p className="text-sm text-muted-foreground">{requestKind(req)} verification request</p></div><button onClick={onClose} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted">Close</button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Info label="Status" value={req.status || req.verificationStatus || "PENDING"} />
        <Info label="Mobile" value={req.contactMobile || req.mobile || "N/A"} />
        <Info label="GSTIN" value={req.gstin || "N/A"} />
        <Info label="PAN" value={req.panNumber || "N/A"} />
        <Info label="FSSAI" value={req.fssaiNumber || "N/A"} />
        <Info label="Driving license" value={req.drivingLicenseNumber || "N/A"} />
        <Info label="Vehicle number" value={req.vehicleRegistrationNumber || "N/A"} />
        <Info label="Submitted" value={req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"} />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-background/50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address / Note</div><p className="mt-2 whitespace-pre-wrap text-sm">{req.address || req.note || "No note provided."}</p></div>
      <div className="mt-4"><h3 className="font-bold">Uploaded documents</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">
        {docs.map((d, i) => documentUrl(d) ? <a key={i} href={documentUrl(d)} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-background/50 px-3 py-3 text-sm font-semibold hover:bg-muted"><span>{documentName(d, i)}</span><ExternalLink className="h-4 w-4" /></a> : null)}
        {docs.length === 0 && <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Backend did not return document links for this request.</div>}
      </div></div>
      <div className="mt-5 flex flex-wrap justify-end gap-2"><button onClick={onApprove} disabled={busy} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Approve Verification</button><button onClick={onReject} disabled={busy} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Reject Verification</button></div>
    </div>
  </div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-background/50 p-3"><div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}
