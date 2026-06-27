import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Building2, CalendarDays, KeyRound, Package, TrendingDown, TrendingUp, Download, Plus, CheckCircle2, Trash2, Eye, EyeOff, Store } from "lucide-react";
import { toast } from "sonner";
import { businessOutletsService } from "@/services/business-outlets.service";
import { OutletCommandCenterPage } from "@/components/business-outlets/OutletCommandCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/business-outlets")({ component: BusinessOutletsPage });

function money(v: any) { return `₹${Number(v || 0).toLocaleString("en-IN")}`; }
function today() { return new Date().toISOString().slice(0, 10); }
function safeText(value: any): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const parts = [value.line1, value.line2, value.street, value.area, value.landmark, value.city, value.state, value.pincode, value.postalCode, value.country]
      .map(safeText).filter(Boolean);
    if (parts.length) return Array.from(new Set(parts)).join(", ");
  }
  return "";
}

function outletAddress(outlet: any): string {
  const direct = safeText(outlet?.addressText) || safeText(outlet?.formattedAddress) || safeText(outlet?.address);
  const extra = [outlet?.city, outlet?.state, outlet?.pincode].map(safeText).filter(Boolean);
  const all = [direct, ...extra].filter(Boolean);
  return Array.from(new Set(all)).join(", " ) || "Address not configured";
}


function BusinessOutletsPage() {
  const routePathname = useRouterState({ select: (s) => s.location.pathname });
  const browserPathname = typeof window !== "undefined" ? window.location.pathname : routePathname;
  const pathname = browserPathname || routePathname || "";
  const dashboardMatch = pathname.match(/^\/business-outlets\/([^/?#]+)/);
  if (dashboardMatch?.[1]) {
    return <OutletCommandCenterPage outletId={decodeURIComponent(dashboardMatch[1])} />;
  }
  return <BusinessOutletsList />;
}

function BusinessOutletsList() {
  const qc = useQueryClient();
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [selected, setSelected] = useState<any | null>(null);
  const [credentialOutlet, setCredentialOutlet] = useState<any | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [dashboardOutletId, setDashboardOutletId] = useState<string | null>(null);
  const selectedOutletQuery = useQuery({ queryKey: ["admin-selected-outlet"], queryFn: () => businessOutletsService.selectedOutlet(), refetchInterval: 15_000, refetchOnWindowFocus: true });
  const selectedOutletId = String(selectedOutletQuery.data?.outletId || selectedOutletQuery.data?.data?.outletId || "");
  const chooseOutlet = useMutation({ mutationFn: (outletId: string) => businessOutletsService.selectOutlet(outletId), onSuccess: async () => { toast.success("Admin operating outlet updated"); await qc.invalidateQueries({ queryKey: ["admin-selected-outlet"] }); await qc.invalidateQueries({ queryKey: ["business-outlets-list"] }); }, onError: (e:any)=>toast.error(e?.message||"Unable to select outlet") });
  const deleteOutlet = useMutation({ mutationFn: (id:string) => businessOutletsService.deleteOutlet(id), onSuccess:()=>{toast.success("Outlet deleted"); qc.invalidateQueries({queryKey:["business-dashboard"]}); qc.invalidateQueries({queryKey:["business-outlets-list"]});}, onError:(e:any)=>toast.error(e?.message||"Unable to delete outlet") });

  const dashboard = useQuery({ queryKey: ["business-dashboard", from, to], queryFn: () => businessOutletsService.dashboard({ from, to }), refetchInterval: 15_000, refetchOnWindowFocus: true });
  const outletListQuery = useQuery({ queryKey: ["business-outlets-list"], queryFn: () => businessOutletsService.list(), refetchInterval: 20_000, refetchOnWindowFocus: true });
  const ensure = useMutation({ mutationFn: businessOutletsService.ensureSchema, onSuccess: () => toast.success("Enterprise outlet schema ready") });
  const createOutlet = useMutation({ mutationFn: businessOutletsService.createOutlet, onSuccess: () => { toast.success("Outlet created"); setCreateOpen(false); qc.invalidateQueries({ queryKey: ["business-dashboard"] }); qc.invalidateQueries({ queryKey: ["business-outlets-list"] }); } });
  const exportCsv = useMutation({ mutationFn: () => businessOutletsService.exportAccounting(from, to) });

  const outlets = useMemo(() => {
    const fromDashboard = dashboard.data?.outlets;
    if (Array.isArray(fromDashboard) && fromDashboard.length > 0) return fromDashboard;
    const raw = outletListQuery.data?.data ?? outletListQuery.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.items)) return raw.items;
    if (Array.isArray(raw?.outlets)) return raw.outlets;
    return [];
  }, [dashboard.data, outletListQuery.data]);

  if (dashboardOutletId) {
    return <OutletCommandCenterPage outletId={dashboardOutletId} onBack={() => setDashboardOutletId(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-3xl border bg-card p-5 shadow-card md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Building2 className="h-4 w-4" /> Mr. Breado Head Office</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Business Outlets Control</h1>
          <p className="text-sm text-muted-foreground">Track every outlet's sales, stock, performance, credentials, and day-close ledger.</p><div className="mt-3 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-semibold"><Store className="h-3.5 w-3.5 text-primary"/>Admin seller outlet: {selectedOutletQuery.data?.outlet?.name || selectedOutletQuery.data?.data?.outlet?.name || "Not selected"}</div>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex xl:flex-wrap">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          <Button variant="outline" onClick={() => ensure.mutate()}>Prepare DB</Button>
          <Button variant="outline" onClick={() => exportCsv.mutate()}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Outlet</Button></DialogTrigger>
            <DialogContent><OutletForm onSubmit={(data) => createOutlet.mutate(data)} /></DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Total Outlets" value={dashboard.data?.totalOutlets ?? outlets.length} />
        <Metric title="Orders" value={dashboard.data?.totalOrders ?? 0} />
        <Metric title="Total Sales" value={money(dashboard.data?.totalSales)} />
        <Metric title="Online Sales" value={money(dashboard.data?.onlineSales)} />
      </div>

      {(dashboard.isError || outletListQuery.isError) && outlets.length === 0 && (
        <Card className="rounded-3xl border-destructive/30"><CardContent className="p-8 text-center"><p className="text-lg font-bold">Unable to load outlets</p><p className="mt-2 text-sm text-muted-foreground">The page stayed open safely. Retry after the backend outlet routes are available.</p><Button className="mt-4" onClick={() => { dashboard.refetch(); outletListQuery.refetch(); }}>Try again</Button></CardContent></Card>
      )}

      {outlets.length === 0 && !dashboard.isLoading && !outletListQuery.isLoading && !dashboard.isError && !outletListQuery.isError && (
        <Card className="rounded-3xl border-dashed"><CardContent className="p-8 text-center"><p className="text-lg font-bold">No outlets loaded yet</p><p className="mt-2 text-sm text-muted-foreground">Click Prepare DB, then Add Outlet. The table now uses the v42 enterprise outlet schema.</p></CardContent></Card>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {outlets.map((o: any) => (
          <Card key={String(o.id || o.outletId || o._id || o.slug || o.name)} className={`overflow-hidden rounded-3xl transition hover:border-primary/60 hover:shadow-lg ${selectedOutletId===String(o.id||o.outletId||o._id)?"border-primary ring-2 ring-primary/30 shadow-[0_0_32px_rgba(249,115,22,.22)]":""}`}>
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">{o.name || o.outletName}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{outletAddress(o)}</p><p className="mt-1 text-xs font-medium">GSTIN: {o.gstin || "Not added"}</p>
                </div>
                <Badge variant={o.isOpen ? "default" : "secondary"}>{o.isOpen ? "Open" : "Closed"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="grid grid-cols-3 gap-3 text-center">
                <Mini label="Sales" value={money(o.totalSales)} />
                <Mini label="Orders" value={o.orderCount ?? 0} />
                <Mini label="Low Stock" value={o.lowStockCount ?? 0} />
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4 text-primary" /> Best foods</div>
                {(o.topFoods || []).slice(0, 3).map((f: any) => <div key={f.productId} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2"><span>{f.productName}</span><span>{f.soldQuantity ?? 0}</span></div>)}
                <div className="flex items-center gap-2 pt-2 font-semibold"><TrendingDown className="h-4 w-4 text-destructive" /> Slow foods</div>
                {(o.slowFoods || []).slice(0, 3).map((f: any) => <div key={f.productId} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2"><span>{f.productName}</span><span>{f.soldQuantity ?? 0}</span></div>)}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:flex xl:flex-wrap">
                <Button size="sm" onClick={() => setDashboardOutletId(String(o.id || o.outletId || o._id))}>Full Dashboard</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(o)}><CalendarDays className="mr-2 h-4 w-4" />Quick Ledger</Button>
                <Button size="sm" variant="outline" onClick={() => setCredentialOutlet(o)}><KeyRound className="mr-2 h-4 w-4" />Login Credentials</Button>
                <Button size="sm" variant={selectedOutletId===String(o.id||o.outletId||o._id)?"default":"outline"} onClick={() => chooseOutlet.mutate(String(o.id||o.outletId||o._id))}><CheckCircle2 className="mr-2 h-4 w-4" />{selectedOutletId===String(o.id||o.outletId||o._id)?"Selected for seller app":"Use as own outlet"}</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(o)}><Package className="mr-2 h-4 w-4" />Stock</Button>
                <Button size="sm" variant="destructive" onClick={() => { if(window.confirm(`Delete ${o.name||o.outletName}? This cannot be undone.`)) deleteOutlet.mutate(String(o.id||o.outletId||o._id)); }}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-5xl"><OutletDetails outlet={selected} from={from} to={to} /></DialogContent>
      </Dialog>
      <Dialog open={!!credentialOutlet} onOpenChange={(v) => !v && setCredentialOutlet(null)}>
        <DialogContent><CredentialsForm outlet={credentialOutlet} /></DialogContent>
      </Dialog>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: any }) { return <Card className="rounded-3xl"><CardContent className="p-5"><p className="text-sm text-muted-foreground">{title}</p><p className="mt-2 text-2xl font-bold">{value}</p></CardContent></Card>; }
function Mini({ label, value }: { label: string; value: any }) { return <div className="rounded-2xl bg-muted/40 p-3"><div className="text-xs text-muted-foreground">{label}</div><div className="font-bold">{value}</div></div>; }

function OutletForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [data, setData] = useState<any>({ name: "Mr. Breado - ", serviceRadiusKm: 5, isOpen: false, logoUrl: "https://res.cloudinary.com/dty0zfd7g/image/upload/v1782468916/mr-breado/brands/file_nzsycz.jpg", featureToggles: { delivery: true, takeaway: true, cod: true, onlinePayment: true, riderAssignment: true, offers: true } });
  return <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
    <DialogHeader><DialogTitle>Add Mr. Breado Outlet</DialogTitle></DialogHeader>
    <div className="grid gap-3 sm:grid-cols-2">{[["name","Outlet Name"],["address","Address"],["city","City"],["pincode","Pincode"],["latitude","Latitude"],["longitude","Longitude"],["managerName","Manager Name"],["managerPhone","Manager Phone"],["managerEmail","Manager Email"],["gstin","GSTIN (15 characters)"],["invoiceLegalName","Invoice Legal Name"],["invoiceAddress","Invoice Address"]].map(([k,l]) => <div key={k} className={`space-y-1 ${["address","invoiceAddress"].includes(k) ? "sm:col-span-2" : ""}`}><Label>{l}</Label><Input value={data[k] ?? ""} onChange={(e) => setData((d:any) => ({...d,[k]: e.target.value}))} /></div>)}</div>
    <div className="space-y-2 rounded-2xl border bg-muted/20 p-3"><Label>Shared Mr. Breado logo</Label><div className="flex items-center gap-3"><img src={data.logoUrl} alt="Mr. Breado logo" className="h-14 w-14 rounded-xl border bg-white object-contain p-1"/><Input value={data.logoUrl} onChange={(e) => setData((d:any) => ({...d,logoUrl:e.target.value}))}/></div><p className="text-xs text-muted-foreground">Prefilled for every new outlet. You can replace it later from Branding.</p></div>
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm"><b>Safe default:</b> the outlet starts closed. The outlet manager can open it only after submitting stock.</div>
    <Button type="submit" className="min-h-11 w-full" onClick={() => haptic([18,20,18])}>Create Outlet</Button>
  </form>;
}

function CredentialsForm({ outlet }: { outlet: any }) {
  const id = String(outlet?._id || outlet?.mongoId || outlet?.outletId || outlet?.id || "");
  const previous = useQuery({ queryKey:["outlet-credentials",id], enabled:!!id, queryFn:()=>businessOutletsService.credentials(id) });
  const existing = previous.data?.data ?? previous.data ?? {};
  const [data, setData] = useState<any>({ name: outlet?.managerName || "Outlet Manager", username: "", phone: outlet?.managerPhone || "", email: outlet?.email || outlet?.managerEmail || "", password: "", confirmPassword: "" });
  const [showPassword,setShowPassword]=useState(false);
  useEffect(()=>{ if(previous.isSuccess) setData((d:any)=>({...d,name:existing.managerName||d.name,username:existing.username||d.username,phone:existing.phone||d.phone,email:existing.email||d.email})); },[previous.isSuccess]);
  const mutation = useMutation({
    mutationFn: () => businessOutletsService.setCredentials(id, {name:data.name,username:data.username,phone:data.phone,email:data.email,password:data.password}),
    onSuccess: (result: any) => { toast.success(`Outlet login saved. Use ${result?.loginWith || result?.data?.loginWith || data.username || data.email || data.phone} to sign in.`); setData((d:any)=>({...d,password:"",confirmPassword:""})); previous.refetch(); },
    onError: (error: any) => toast.error(error?.message || "Unable to save outlet credentials"),
  });
  const submit = (e: any) => { e.preventDefault(); if(!id)return toast.error("Outlet id is missing"); if (!String(data.username || data.email || data.phone).trim()) return toast.error("Enter a username, email or phone"); if (String(data.password || "").length < 8) return toast.error("Password must contain at least 8 characters"); if(data.password!==data.confirmPassword)return toast.error("Password and confirmation do not match"); mutation.mutate(); };
  return <form className="max-h-[82vh] space-y-3 overflow-y-auto pr-1" onSubmit={submit}>
    <DialogHeader><DialogTitle>Set Outlet Login - {outlet?.name}</DialogTitle></DialogHeader>
    <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">Previous login values are loaded below. Passwords are securely hashed and cannot be recovered; enter and confirm a new password to replace it.</div>
    {existing.configured && <div className="grid grid-cols-2 gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs"><div><b>Current username</b><br/>{existing.username||"—"}</div><div><b>Current email</b><br/>{existing.email||"—"}</div><div><b>Current phone</b><br/>{existing.phone||"—"}</div><div><b>Password</b><br/>{existing.passwordConfigured?"Configured securely":"Not configured"}</div></div>}
    {[['name','Manager Name'],['username','Username'],['phone','Phone'],['email','Email']].map(([k,l]) => <div key={k} className="space-y-1"><Label>{l}</Label><Input autoCapitalize="none" value={data[k] ?? ""} onChange={(e) => setData((d:any) => ({...d,[k]: e.target.value}))} /></div>)}
    {[['password','New Password'],['confirmPassword','Confirm Password']].map(([k,l])=><div key={k} className="space-y-1"><Label>{l}</Label><div className="relative"><Input type={showPassword?'text':'password'} value={data[k]??''} onChange={e=>setData((d:any)=>({...d,[k]:e.target.value}))} className="pr-11"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>)}
    <Button disabled={mutation.isPending} type="submit" className="w-full">{mutation.isPending ? "Saving credentials..." : "Save Login Credentials"}</Button>
  </form>;
}

function OutletDetails({ outlet, from, to }: { outlet: any; from: string; to: string }) {
  const id = outlet?.id || outlet?.outletId;
  const perf = useQuery({ queryKey: ["outlet-performance", id, from, to], enabled: !!id, queryFn: () => businessOutletsService.performance(id, { from, to }) });
  const cal = useQuery({ queryKey: ["outlet-calendar", id, from, to], enabled: !!id, queryFn: () => businessOutletsService.calendar(id, { from, to }) });
  return <div className="space-y-4">
    <DialogHeader><DialogTitle>{outlet?.name} business details</DialogTitle></DialogHeader>
    <div className="grid gap-4 md:grid-cols-3"><Metric title="Orders" value={perf.data?.orders ?? 0}/><Metric title="Total Sales" value={money(perf.data?.totalSales)}/><Metric title="Low Stock" value={(perf.data?.lowStock ?? []).length}/></div>
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Day Closing Calendar</CardTitle></CardHeader><CardContent className="space-y-2">{(cal.data?.calendar ?? []).map((d:any)=><div key={d.id} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm"><span>{String(d.closingDate || d.closing_date).slice(0,10)}</span><span>{money(d.totalSales || d.total_sales)}</span></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Low Stock</CardTitle></CardHeader><CardContent className="space-y-2">{(perf.data?.lowStock ?? []).map((s:any)=><div key={s.id} className="flex justify-between rounded-xl bg-muted/40 px-3 py-2 text-sm"><span>{s.productName}</span><span>{s.stockQuantity ?? s.stock_quantity}</span></div>)}</CardContent></Card>
    </div>
  </div>;
}
