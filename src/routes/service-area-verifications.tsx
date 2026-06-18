import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, MapPin, CheckCircle2, XCircle, Eye, FileText, Bike, Store, Download, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { serviceAreaVerificationService, type VerificationDocument, type VerificationRequest } from "@/services/service-area-verification.service";
import { driverKeys } from "@/hooks/queries/use-drivers";

export const Route = createFileRoute("/service-area-verifications")({
  head: () => ({ meta: [{ title: "Verification Requests | Mr. Breado Admin" }] }),
  component: ServiceAreaVerificationPage,
});

type RequestType = "ALL" | "RESTAURANT" | "RIDER";

function ServiceAreaVerificationPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("PENDING");
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

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["verifications"] });
    qc.invalidateQueries({ queryKey: driverKeys.all });
  };

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
    onSuccess: () => { toast.success("Verification approved successfully"); setSelected(null); refresh(); },
    onError: () => toast.error("Verification could not be approved. Please refresh and try again."),
  });

  const reject = useMutation({
    mutationFn: ({ req, reason }: { req: VerificationRequest; reason: string }) => serviceAreaVerificationService.reject(req, reason),
    onSuccess: () => { toast.success("Verification rejected successfully"); setSelected(null); refresh(); },
    onError: () => toast.error("Verification could not be rejected. Please refresh and try again."),
  });

  const items = requests.data ?? [];

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
            <p className="text-sm text-muted-foreground">Pending requests are highlighted here. Approved/rejected requests are removed from this working queue and reflected in Riders/Restaurants automatically.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value as RequestType)}>
              <option value="ALL">All request types</option><option value="RESTAURANT">Restaurants only</option><option value="RIDER">Riders only</option>
            </select>
            <select className="rounded-xl border border-border bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="PENDING">Pending only</option><option value="">All statuses</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option><option value="VERIFIED">Verified</option><option value="UNVERIFIED">Unverified</option>
            </select>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <Metric label="Showing" value={grouped.all} icon={<ShieldCheck className="h-4 w-4" />} />
          <Metric label="Restaurants" value={grouped.restaurant} icon={<Store className="h-4 w-4" />} />
          <Metric label="Riders" value={grouped.rider} icon={<Bike className="h-4 w-4" />} />
          <Metric label="Pending" value={grouped.pending} icon={<FileText className="h-4 w-4" />} />
        </div>

        {requests.isLoading ? <div className="grid gap-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}</div> : (
          <div className="grid gap-3">
            {items.map((req) => <RequestCard key={`${req.source}-${String(req.id)}-${req.entityType}`} req={req} approving={approve.isPending} rejecting={reject.isPending} onView={() => setSelected(req)} onApprove={() => approve.mutate(req)} onReject={() => { const reason = prompt("Reason for rejection?") || "Documents are not valid."; reject.mutate({ req, reason }); }} />)}
            {items.length === 0 && <div className="rounded-xl border border-dashed border-border p-10 text-center"><div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="h-6 w-6" /></div><p className="font-semibold">No pending verification requests found</p><p className="mt-1 text-sm text-muted-foreground">Approved or rejected requests are automatically removed from this queue.</p></div>}
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
function requestTitle(req: VerificationRequest) { return req.businessName || req.restaurantName || req.riderName || req.driverName || req.applicantName || "Verification request"; }
function documentUrl(d: any) { return d?.url || d?.fileUrl || d?.viewUrl || d?.view_url || d?.downloadUrl || d?.download_url; }
function documentName(d: any, i: number) { return d?.name || d?.originalName || d?.original_name || d?.type || d?.documentType || d?.document_type || d?.fileName || `Document ${i + 1}`; }
function isPdf(d: any) { return String(d?.mimeType || d?.mime_type || d?.type || d?.name || "").toLowerCase().includes("pdf"); }

function RequestCard({ req, onView, onApprove, onReject, approving, rejecting }: { req: VerificationRequest; onView: () => void; onApprove: () => void; onReject: () => void; approving: boolean; rejecting: boolean }) {
  const name = requestTitle(req); const kind = requestKind(req); const docs = req.documents ?? []; const status = String(req.status ?? req.verificationStatus ?? "PENDING").toUpperCase(); const done = ["VERIFIED", "APPROVED", "REJECTED"].includes(status);
  return <article className={`rounded-xl border p-4 ${status === "PENDING" ? "border-primary/40 bg-primary/5 shadow-[0_0_0_1px_rgba(255,92,0,0.15)]" : "border-border bg-background/50"}`}>
    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between"><div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-base font-bold">{name}</h3><StatusBadge status={req.status || req.verificationStatus || "PENDING"} /><span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary">{kind}</span>{status === "PENDING" && <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-500">Needs review</span>}</div>
      <p className="mt-1 text-sm text-muted-foreground">Mobile: {req.contactMobile || req.mobile || "N/A"} · Submitted: {req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"}</p>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{req.note || req.address || "Open details to review submitted information and uploaded documents."}</p>
      <div className="mt-3 flex flex-wrap gap-2">{docs.slice(0,4).map((d,i)=><button key={i} onClick={onView} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted"><FileText className="h-3 w-3" />{documentName(d,i)}</button>)}{docs.length===0 && <span className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground">No document links returned by backend</span>}</div>
    </div><div className="flex shrink-0 flex-wrap gap-2"><button onClick={onView} className="inline-flex items-center gap-2 rounded-xl border border-info/30 px-4 py-2 text-sm font-bold text-info hover:bg-info/10"><Eye className="h-4 w-4" />View Details</button><button onClick={onApprove} disabled={approving || done} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />Approve</button><button onClick={onReject} disabled={rejecting || done} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><XCircle className="h-4 w-4" />Reject</button></div></div>
  </article>;
}

function RequestDetailsModal({ req, onClose, onApprove, onReject, busy }: { req: VerificationRequest; onClose: () => void; onApprove: () => void; onReject: () => void; busy: boolean }) {
  const docs = req.documents ?? [];
  const kind = requestKind(req);
  const [activeDoc, setActiveDoc] = useState<VerificationDocument | null>(docs[0] ?? null);
  const [imageFailed, setImageFailed] = useState(false);
  const activeUrl = activeDoc ? documentUrl(activeDoc) : "";
  const riderFields = [
    ["Aadhaar", req.aadhaarNumber],
    ["Driving license", req.drivingLicenseNumber],
    ["Vehicle number", req.vehicleRegistrationNumber],
  ];
  const restaurantFields = [
    ["GSTIN", req.gstin],
    ["PAN", req.panNumber],
    ["FSSAI", req.fssaiNumber],
  ];
  const payoutFields = [
    ["UPI ID", (req as any).upiId || (req as any).upi_id],
    ["Bank name", (req as any).bankName || (req as any).bank_name],
    ["Account holder", (req as any).bankAccountName || (req as any).bank_account_name],
    ["Account number", (req as any).bankAccountNumber || (req as any).bank_account_number],
    ["IFSC", (req as any).bankIfsc || (req as any).bank_ifsc],
  ];
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
    <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-extrabold">{requestTitle(req)}</h2><p className="text-sm text-muted-foreground">{kind} verification request · Review documents without leaving this screen.</p></div><button onClick={onClose} className="rounded-lg border border-border p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div>
    <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_1.25fr]">
      <div>
        <div className="mb-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm"><b>{kind === "RIDER" ? "Rider payout + identity verification" : "Restaurant payout + business verification"}</b><p className="mt-1 text-muted-foreground">Only fields relevant to this request type are shown.</p></div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <Info label="Status" value={req.status || req.verificationStatus || "PENDING"} />
          <Info label="Mobile" value={req.contactMobile || req.mobile || "N/A"} />
          <Info label="Email" value={req.email || "N/A"} />
          {(kind === "RIDER" ? riderFields : restaurantFields).map(([label, value]) => <Info key={label} label={label} value={value || "Not provided"} />)}
          {payoutFields.map(([label, value]) => value ? <Info key={label} label={label} value={value} /> : null)}
          <Info label="Submitted" value={req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"} />
        </div>
        <div className="mt-4 rounded-xl border border-border bg-background/50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address / Note</div><p className="mt-2 whitespace-pre-wrap text-sm">{req.address || req.note || "No note provided."}</p></div>
      </div>
      <div><h3 className="font-bold">Uploaded documents</h3><div className="mt-3 grid gap-2 sm:grid-cols-2">{docs.map((d,i)=><button key={i} onClick={() => { setActiveDoc(d); setImageFailed(false); }} className={`flex items-center justify-between rounded-xl border px-3 py-3 text-left text-sm font-semibold hover:bg-muted ${activeDoc === d ? "border-primary bg-primary/10" : "border-border bg-background/50"}`}><span>{documentName(d,i)}</span><Eye className="h-4 w-4" /></button>)}{docs.length===0 && <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">Backend did not return document links for this request.</div>}</div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background/60"><div className="flex items-center justify-between border-b border-border px-4 py-3"><div className="text-sm font-bold">{activeDoc ? documentName(activeDoc,0) : "Document preview"}</div>{activeUrl && <a href={activeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-muted"><Download className="h-4 w-4" />Open / Download</a>}</div>{activeUrl ? (isPdf(activeDoc) ? <iframe src={activeUrl} title="Document preview" className="h-[520px] w-full bg-white" /> : <div className="flex min-h-[360px] max-h-[520px] items-center justify-center bg-black/20 p-3">{imageFailed ? <div className="text-center text-sm text-muted-foreground"><p className="font-semibold">Preview could not be rendered inline.</p><a className="mt-2 inline-flex rounded-lg border border-border px-3 py-2 font-bold hover:bg-muted" href={activeUrl} target="_blank" rel="noreferrer">Open document</a></div> : <img src={activeUrl} onError={() => setImageFailed(true)} alt="Verification document" className="max-h-[500px] max-w-full rounded-xl object-contain" />}</div>) : <div className="p-10 text-center text-sm text-muted-foreground">Select a document to preview here.</div>}</div></div>
    </div>
    <div className="mt-5 flex flex-wrap justify-end gap-2"><button onClick={onApprove} disabled={busy} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Approve Verification</button><button onClick={onReject} disabled={busy} className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Reject Verification</button></div>
  </div></div>;
}

function Info({ label, value }: { label: string; value: any }) { return <div className="rounded-xl border border-border bg-background/50 p-3"><div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold">{String(value || "N/A")}</div></div>; }
