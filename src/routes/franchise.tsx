import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, Phone, Mail, MapPin, Store, PackagePlus, Truck, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export const Route = createFileRoute("/franchise")({
  head: () => ({ meta: [{ title: "Franchise & Outlets | Mr. Breado Admin" }] }),
  component: FranchisePage,
});

type Any = Record<string, any>;
const arr = (x: any) => Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : Array.isArray(x?.data) ? x.data : Array.isArray(x?.requests) ? x.requests : Array.isArray(x?.outlets) ? x.outlets : [];
const money = (v:any) => `₹${Number(v || 0).toFixed(2)}`;

function FranchisePage() {
  const [requests, setRequests] = useState<Any[]>([]);
  const [outlets, setOutlets] = useState<Any[]>([]);
  const [refills, setRefills] = useState<Any[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<Any | null>(null);
  const [inventory, setInventory] = useState<Any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [rq, out, rf] = await Promise.all([
        api.get(endpoints.admin.franchiseRequests).catch(() => ({ data: { items: [] } })),
        api.get(endpoints.admin.franchiseOutlets).catch(() => ({ data: { items: [] } })),
        api.get(endpoints.admin.franchiseRefillRequests).catch(() => ({ data: { items: [] } })),
      ]);
      setRequests(arr(rq.data?.data ?? rq.data));
      setOutlets(arr(out.data?.data ?? out.data));
      setRefills(arr(rf.data?.data ?? rf.data));
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function updateRequest(id: any, status: string) {
    try { await api.patch(endpoints.admin.franchiseRequestStatus(id), { status }); toast.success(`Request marked ${status}`); load(); }
    catch { toast.error("Could not update franchise request"); }
  }
  async function markContacted(id: any) {
    try { await api.post(endpoints.admin.franchiseRequestContact(id), { note: "Contacted from admin panel" }); toast.success("Marked as contacted"); load(); }
    catch { toast.error("Could not mark contacted"); }
  }
  async function openInventory(o: Any) {
    setSelectedOutlet(o);
    try { const r = await api.get(endpoints.admin.franchiseOutletInventory(o.id ?? o.restaurantId)); setInventory(arr(r.data?.data ?? r.data)); }
    catch { setInventory([]); toast.error("Inventory could not be loaded"); }
  }
  const pending = useMemo(() => requests.filter(r => String(r.status).toUpperCase() === "PENDING").length, [requests]);

  return <>
    <PageHeader title="Franchise & Outlets" icon={<Building2 className="h-5 w-5" />} breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Restaurant Management"},{label:"Franchise & Outlets"}]} actions={<button onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-accent"><RefreshCcw className="h-4 w-4" /> Refresh</button>} />
    <div className="grid gap-4 md:grid-cols-4">
      <Stat label="Franchise Requests" value={requests.length} icon={<Building2 />} />
      <Stat label="Pending Leads" value={pending} icon={<Phone />} />
      <Stat label="Outlets" value={outlets.length} icon={<Store />} />
      <Stat label="Refill Requests" value={refills.length} icon={<PackagePlus />} />
    </div>

    <section className="mt-5 rounded-2xl border border-orange-500/25 bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-extrabold">Franchise business requests</h2><p className="text-sm text-muted-foreground">Seller app franchise enquiries appear here. Contact them, then approve or reject.</p></div><span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500">{pending} pending</span></div>
      <div className="grid gap-3">
        {requests.length === 0 ? <Empty text="No franchise requests yet" /> : requests.map(r => <div key={r.id} className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="text-base font-extrabold">{r.ownerName || r.owner_name || r.name || "Franchise lead"}</h3><p className="text-sm text-muted-foreground">{r.businessName || r.business_name || "Mr. Breado outlet enquiry"} · {r.city || "—"} {r.pincode ? `· ${r.pincode}` : ""}</p></div>
            <Badge status={r.status} />
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3"><Info icon={<Phone />} label="Phone" value={r.phone || r.mobile || "—"} /><Info icon={<Mail />} label="Email" value={r.email || "—"} /><Info icon={<MapPin />} label="Location" value={[r.address, r.city, r.state, r.pincode].filter(Boolean).join(", ") || "—"} /></div>
          <div className="mt-3 rounded-xl border border-border bg-card p-3 text-sm"><b>Query:</b> {r.query || r.message || "No query provided."}</div>
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            {r.email && <a href={`mailto:${r.email}?subject=Mr. Breado franchise enquiry`} className="rounded-xl border border-info/40 px-4 py-2 text-sm font-bold text-info hover:bg-info/10">Email</a>}
            {r.phone && <a href={`tel:${r.phone}`} className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-bold text-emerald-500 hover:bg-emerald-500/10">Call</a>}
            <button onClick={() => markContacted(r.id)} className="rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-accent">Mark contacted</button>
            <button onClick={() => updateRequest(r.id, "APPROVED")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white"><CheckCircle2 className="mr-1 inline h-4 w-4" />Approve</button>
            <button onClick={() => updateRequest(r.id, "REJECTED")} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"><XCircle className="mr-1 inline h-4 w-4" />Reject</button>
          </div>
        </div>)}
      </div>
    </section>

    <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="text-lg font-extrabold">Mr. Breado outlets</h2><p className="text-sm text-muted-foreground">All restaurants/outlets under Mr. Breado brand. Track stock, orders, payable, and sent stock.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {outlets.length === 0 ? <Empty text="No Mr. Breado outlets found" /> : outlets.map(o => <button key={o.id} onClick={() => openInventory(o)} className="rounded-2xl border border-border bg-background/40 p-4 text-left hover:border-orange-500/50">
          <div className="flex justify-between gap-3"><div><h3 className="font-extrabold">{o.name || o.outletName}</h3><p className="text-sm text-muted-foreground">#{o.id} · {o.city || "—"}</p></div><Badge status={o.verificationStatus || "OUTLET"} /></div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm"><Mini label="Stock" value={o.totalStock ?? 0} /><Mini label="Orders" value={o.totalOrders ?? 0} /><Mini label="Sales" value={money(o.grossSales)} /></div>
        </button>)}
      </div>
    </section>

    <section className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-card">
      <h2 className="text-lg font-extrabold">Franchise refill requests</h2><p className="text-sm text-muted-foreground">Track stock refill demand from franchise sellers and dispatch cost.</p>
      <div className="mt-4 grid gap-3">
        {refills.length === 0 ? <Empty text="No refill requests" /> : refills.map(r => <div key={r.id} className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="flex flex-wrap justify-between gap-2"><b>{r.restaurantName || `Outlet #${r.restaurantId || r.restaurant_id}`}</b><Badge status={r.status} /></div>
          <div className="mt-1 text-sm text-muted-foreground">Estimated cost: {money(r.estimatedCost || r.estimated_cost)} · Submitted: {String(r.createdAt || r.created_at || "—").slice(0,19)}</div>
          <div className="mt-3 flex flex-wrap gap-2">{(r.items || []).map((it:any, idx:number)=><span key={idx} className="rounded-full bg-muted px-3 py-1 text-xs font-bold">{it.name || it.title || it.productName || `Product #${it.productId || it.product_id}`} × {it.quantity || it.qty}</span>)}</div>
        </div>)}
      </div>
    </section>

    {selectedOutlet && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl"><div className="flex justify-between gap-3"><div><h2 className="text-xl font-extrabold">{selectedOutlet.name}</h2><p className="text-sm text-muted-foreground">Outlet inventory and current stock</p></div><button onClick={()=>setSelectedOutlet(null)} className="rounded-xl border border-border px-4 py-2 font-bold">Close</button></div><div className="mt-5 grid gap-3 md:grid-cols-2">{inventory.map(i=><div key={i.productId || i.id} className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"><img src={i.image || i.imageUrl} className="h-14 w-14 rounded-xl object-cover" onError={(e:any)=>{e.currentTarget.style.display='none'}}/><div className="flex-1"><b>{i.title || i.name}</b><p className="text-sm text-muted-foreground">Price {money(i.price)} · Stock {i.stockQuantity ?? 0}</p></div></div>)}</div></div></div>}
  </>;
}
function Stat({label,value,icon}:{label:string;value:any;icon:any}){return <div className="rounded-2xl border border-border bg-card p-4 shadow-card"><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">{icon}</div><div className="text-2xl font-extrabold">{value}</div><div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</div></div>}
function Info({label,value,icon}:{label:string;value:any;icon:any}){return <div className="rounded-xl border border-border bg-card p-3"><div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{icon}{label}</div><div className="break-words font-semibold">{value}</div></div>}
function Mini({label,value}:{label:string;value:any}){return <div className="rounded-xl bg-card p-2"><div className="font-extrabold">{value}</div><div className="text-[10px] uppercase text-muted-foreground">{label}</div></div>}
function Badge({status}:{status:any}){const s=String(status||"PENDING").toUpperCase(); const cls=s.includes('APPROV')||s.includes('VERIF')?'bg-emerald-500/15 text-emerald-400':s.includes('REJECT')?'bg-red-500/15 text-red-400':'bg-orange-500/15 text-orange-400'; return <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${cls}`}>{s}</span>}
function Empty({text}:{text:string}){return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">{text}</div>}
