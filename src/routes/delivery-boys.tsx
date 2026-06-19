import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Bike, CheckCircle2, CreditCard, Eye, IndianRupee, MapPin, ShieldCheck, Wallet, X } from "lucide-react";
import { useDrivers, driverKeys } from "@/hooks/queries/use-drivers";
import { driversService } from "@/services/drivers.service";
import type { AdminDriverCashResponse } from "@/types";

export const Route = createFileRoute("/delivery-boys")({
  head: () => ({ meta: [{ title: "Rider Control | Mr. Breado Admin" }] }),
  component: RidersPage,
});

function verified(r: AdminDriverCashResponse) {
  return ["VERIFIED", "APPROVED", "ACTIVE"].includes(String(r.verificationStatus || "").toUpperCase()) || r.verified === true;
}

function RidersPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminDriverCashResponse | null>(null);
  const { search, setSearch, debounced } = useTableSearch();
  const { data, isLoading, isFetching, error } = useDrivers({ page, perPage: 20, search: debounced });

  const verification = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: "VERIFIED" | "UNVERIFIED" | "REJECTED" }) => driversService.setVerificationStatus(id, status),
    onSuccess: () => { toast.success("Rider verification updated"); qc.invalidateQueries({ queryKey: driverKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const cols: ServerColumn<AdminDriverCashResponse>[] = [
    { key: "rider", header: "Rider", render: r => <div><div className="font-semibold">{r.driverName || "Rider"}</div><div className="text-xs text-muted-foreground">{r.driverMobile || "—"}</div></div> },
    { key: "status", header: "Status", render: r => <StatusBadge status={r.online && r.available ? "Online" : "Offline"} /> },
    { key: "verification", header: "Verification", render: r => <StatusBadge status={verified(r) ? "Verified" : (r.verificationStatus || "Unverified")} /> },
    { key: "deliveries", header: "Delivered", render: r => String(r.totalDeliveries ?? 0) },
    { key: "cash", header: "COD to collect", render: r => <Money value={r.cashInHand} /> },
    { key: "payout", header: "Pay rider", render: r => <Money value={r.pendingPayout} /> },
    { key: "upi", header: "UPI", render: r => r.upiId || <span className="text-amber-500">Not submitted</span> },
    { key: "actions", header: "Actions", render: r => <button onClick={() => setSelected(r)} className="inline-flex items-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10"><Eye className="h-4 w-4" />Control</button> },
  ];

  return <>
    <PageHeader title="Rider Control" icon={<Bike className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Delivery Management" }, { label: "Rider Control" }]} />
    <div className="mb-5 grid gap-4 md:grid-cols-3">
      <Summary title="Active riders" value={String((data?.items || []).filter(x => x.online && x.available).length)} icon={<Bike className="h-5 w-5" />} />
      <Summary title="COD awaiting admin" value={`₹${(data?.items || []).reduce((s,x)=>s+Number(x.cashInHand||0),0).toFixed(2)}`} icon={<Wallet className="h-5 w-5" />} />
      <Summary title="Rider payout due" value={`₹${(data?.items || []).reduce((s,x)=>s+Number(x.pendingPayout||0),0).toFixed(2)}`} icon={<IndianRupee className="h-5 w-5" />} />
    </div>
    <ServerTable title={`${data?.total ?? 0} riders`} columns={cols} items={data?.items ?? []} page={page} totalPages={data?.total_pages ?? 1} total={data?.total ?? 0} isLoading={isLoading} isFetching={isFetching} error={error} onPageChange={setPage} search={search} onSearchChange={s => { setSearch(s); setPage(1); }} searchPlaceholder="Search rider name, phone or email" rowKey={r => r.driverId} />
    {selected && <RiderControl rider={selected} onClose={() => setSelected(null)} onChanged={() => qc.invalidateQueries({ queryKey: driverKeys.all })} verify={(status) => verification.mutate({ id: selected.driverId, status })} />}
  </>;
}

function RiderControl({ rider, onClose, onChanged, verify }: { rider: AdminDriverCashResponse; onClose:()=>void; onChanged:()=>void; verify:(s:"VERIFIED"|"UNVERIFIED"|"REJECTED")=>void }) {
  const [detail,setDetail]=useState<AdminDriverCashResponse>(rider);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{let mounted=true;setLoading(true);driversService.details(rider.driverId).then(x=>mounted&&setDetail(x)).catch(e=>toast.error(e.message)).finally(()=>mounted&&setLoading(false));return()=>{mounted=false};},[rider.driverId]);

  const cash = useMutation({
    mutationFn: async()=>{
      const max=Number(detail.cashInHand||0); const raw=window.prompt(`Confirm exact COD cash received from ${detail.driverName}`,max.toFixed(2)); if(raw===null) return null;
      const amount=Number(raw); if(!Number.isFinite(amount)||amount<=0) throw new Error("Enter a valid amount");
      return driversService.verifyDeposit(detail.driverId,{amount,paymentMethod:"CASH",note:"Exact COD cash received and approved by admin"});
    },
    onSuccess: async x=>{if(!x)return;toast.success("Collected cash confirmed");setDetail(await driversService.details(detail.driverId));onChanged();},onError:(e:Error)=>toast.error(e.message)
  });
  const payout=useMutation({
    mutationFn: async()=>{
      if(!detail.upiId) throw new Error("Rider has not submitted a UPI ID");
      const max=Number(detail.pendingPayout||0); const raw=window.prompt(`Pay rider to ${detail.upiId}`,max.toFixed(2)); if(raw===null)return null;
      const amount=Number(raw); if(!Number.isFinite(amount)||amount<=0)throw new Error("Enter a valid payout amount");
      const ref=window.prompt("Enter UPI transaction reference")||""; if(!ref.trim())throw new Error("UPI transaction reference is required");
      return driversService.payout(detail.driverId,{amount,upiId:detail.upiId,paymentReference:ref,note:"Monthly rider payout"});
    },
    onSuccess:async x=>{if(!x)return;toast.success("Rider payout recorded");setDetail(await driversService.details(detail.driverId));onChanged();},onError:(e:Error)=>toast.error(e.message)
  });
  const remind=useMutation({mutationFn:()=>driversService.requestUpi(detail.driverId),onSuccess:()=>toast.success("UPI reminder sent to rider"),onError:(e:Error)=>toast.error(e.message)});
  const busy=cash.isPending||payout.isPending||remind.isPending;
  const orders=detail.orders||[];

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
    <div className="mx-auto my-6 w-full max-w-6xl rounded-3xl border border-border bg-card shadow-2xl">
      <div className="sticky top-0 z-10 flex items-start justify-between rounded-t-3xl border-b border-border bg-card/95 p-5 backdrop-blur-xl">
        <div><h2 className="text-2xl font-black">{detail.driverName || "Rider"}</h2><p className="text-sm text-muted-foreground">Complete verification, COD collection and payout control</p></div>
        <button onClick={onClose} className="rounded-xl border border-border p-2 hover:bg-muted"><X className="h-5 w-5" /></button>
      </div>
      {loading ? <div className="p-10 text-center text-muted-foreground">Loading rider account…</div> : <div className="space-y-6 p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Summary title="Delivered orders" value={String(detail.totalDeliveries||0)} icon={<CheckCircle2 className="h-5 w-5" />} />
          <Summary title="COD with rider" value={`₹${Number(detail.cashInHand||0).toFixed(2)}`} icon={<Wallet className="h-5 w-5" />} />
          <Summary title="Payout due" value={`₹${Number(detail.pendingPayout||0).toFixed(2)}`} icon={<IndianRupee className="h-5 w-5" />} />
          <Summary title="Total earned" value={`₹${Number(detail.totalEarnings||0).toFixed(2)}`} icon={<CreditCard className="h-5 w-5" />} />
        </div>
        <section className="grid gap-4 rounded-2xl border border-border p-4 md:grid-cols-3">
          <Info label="Phone" value={detail.driverMobile||"—"}/><Info label="Email" value={detail.driverEmail||"—"}/><Info label="Verification" value={detail.verificationStatus||"UNVERIFIED"}/>
          <Info label="UPI ID" value={detail.upiId||"Not submitted"}/><Info label="Cash limit" value={`₹${Number(detail.cashLimit||0).toFixed(2)}`}/><Info label="Rating" value={String(detail.rating||0)}/>
          <Info label="Latest location" value={detail.latestLocation ? `${detail.latestLocation.latitude}, ${detail.latestLocation.longitude}` : "Not available"}/>
        </section>
        <div className="flex flex-wrap gap-3">
          {!verified(detail) && <button onClick={()=>verify("VERIFIED")} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"><ShieldCheck className="mr-2 inline h-4 w-4"/>Approve verification</button>}
          <button disabled={busy||Number(detail.cashInHand||0)<=0} onClick={()=>cash.mutate()} className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-40">Confirm collected COD</button>
          {detail.upiId ? <button disabled={busy||Number(detail.pendingPayout||0)<=0} onClick={()=>payout.mutate()} className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40">Pay rider by UPI</button> : <button disabled={busy} onClick={()=>remind.mutate()} className="rounded-xl border border-primary px-5 py-3 text-sm font-bold text-primary">Request UPI ID</button>}
        </div>
        {detail.verificationRequest?.documents?.length ? <section><h3 className="mb-3 text-lg font-bold">Verification documents</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{detail.verificationRequest.documents.map((d,i)=><a key={i} href={d.url} target="_blank" rel="noreferrer" className="rounded-xl border border-border p-3 text-sm font-semibold hover:bg-muted">{d.alt||`Document ${i+1}`}</a>)}</div></section>:null}
        <section><h3 className="mb-3 text-lg font-bold">Delivery history</h3><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead className="bg-muted/50"><tr><th className="p-3 text-left">Order</th><th className="p-3 text-left">Outlet</th><th className="p-3 text-left">Customer</th><th className="p-3 text-left">Distance</th><th className="p-3 text-left">Payment</th><th className="p-3 text-left">Status</th><th className="p-3 text-right">Total</th></tr></thead><tbody>{orders.map((o,i)=><tr key={o.id||i} className="border-t border-border"><td className="p-3 font-semibold">{o.orderNumber}</td><td className="p-3">{o.outletName||"—"}</td><td className="p-3">{o.customerName||"—"}</td><td className="p-3">{Number(o.distanceKm||0).toFixed(2)} km</td><td className="p-3">{o.paymentMethod} / {o.paymentStatus}</td><td className="p-3"><StatusBadge status={o.status||"—"}/></td><td className="p-3 text-right font-bold">₹{Number(o.total||0).toFixed(2)}</td></tr>)}</tbody></table>{orders.length===0&&<div className="p-8 text-center text-muted-foreground">No delivery history yet</div>}</div></section>
        {detail.payouts?.length ? <section><h3 className="mb-3 text-lg font-bold">Payout history</h3><div className="space-y-2">{detail.payouts.map(p=><div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3"><div><div className="font-bold">₹{Number(p.amount||0).toFixed(2)} · {p.status}</div><div className="text-xs text-muted-foreground">{p.upiId} · Ref: {p.paymentReference||"—"}</div></div><div className="text-xs text-muted-foreground">{p.paidAt?new Date(p.paidAt).toLocaleString():"Pending"}</div></div>)}</div></section>:null}
      </div>}
    </div>
  </div>;
}

function Summary({title,value,icon}:{title:string;value:string;icon:React.ReactNode}){return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-bold uppercase tracking-wider">{title}</span>{icon}</div><div className="mt-2 text-2xl font-black">{value}</div></div>}
function Info({label,value}:{label:string;value:string}){return <div><div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold">{value}</div></div>}
function Money({value}:{value?:number}){return <span className="font-bold">₹{Number(value||0).toFixed(2)}</span>}
