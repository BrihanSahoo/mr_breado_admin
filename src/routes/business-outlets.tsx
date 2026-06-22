import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Building2, CalendarDays, KeyRound, Package, TrendingDown, TrendingUp, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { businessOutletsService } from "@/services/business-outlets.service";
import { OutletCommandCenterPage } from "@/components/business-outlets/OutletCommandCenter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

function outletMongoId(outlet: any): string {
  const candidates = [outlet?._id, outlet?.mongoId, outlet?.outletMongoId, outlet?.outletId, outlet?.id];
  const mongoId = candidates.map((v) => String(v ?? "").trim()).find((v) => /^[a-f0-9]{24}$/i.test(v));
  return mongoId || "";
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

  const dashboard = useQuery({ queryKey: ["business-dashboard", from, to], queryFn: () => businessOutletsService.dashboard({ from, to }) });
  const outletListQuery = useQuery({ queryKey: ["business-outlets-list"], queryFn: () => businessOutletsService.list() });
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
          <p className="text-sm text-muted-foreground">Track every outlet's sales, stock, performance, credentials, and day-close ledger.</p>
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Card key={String(o.id || o.outletId || o._id || o.slug || o.name)} className="overflow-hidden rounded-3xl transition hover:border-primary/60 hover:shadow-lg">
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
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setDashboardOutletId(String(o.id || o.outletId || o._id))}>Full Dashboard</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(o)}><CalendarDays className="mr-2 h-4 w-4" />Quick Ledger</Button>
                <Button size="sm" variant="outline" onClick={() => setCredentialOutlet(o)}><KeyRound className="mr-2 h-4 w-4" />Login Credentials</Button>
                <Button size="sm" variant="outline" onClick={() => setSelected(o)}><Package className="mr-2 h-4 w-4" />Stock</Button>
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
  const [data, setData] = useState<any>({ name: "Mr. Breado - ", serviceRadiusKm: 5, isOpen: true });
  return <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit(data); }}>
    <DialogHeader><DialogTitle>Add Mr. Breado Outlet</DialogTitle></DialogHeader>
    {[["name","Outlet Name"],["address","Address"],["city","City"],["pincode","Pincode"],["latitude","Latitude"],["longitude","Longitude"],["managerName","Manager Name"],["managerPhone","Manager Phone"],["managerEmail","Manager Email"],["gstin","GSTIN (15 characters)"],["invoiceLegalName","Invoice Legal Name"],["invoiceAddress","Invoice Address"]].map(([k,l]) => <div key={k} className="space-y-1"><Label>{l}</Label><Input value={data[k] ?? ""} onChange={(e) => setData((d:any) => ({...d,[k]: e.target.value}))} /></div>)}
    <Button type="submit" className="w-full">Create Outlet</Button>
  </form>;
}

function CredentialsForm({ outlet }: { outlet: any }) {
  const outletId = outletMongoId(outlet);
  const [data, setData] = useState<any>({ name: outlet?.managerName || "Outlet Manager", username: outlet?.username || outlet?.outletCode || "", phone: outlet?.managerPhone || "", email: outlet?.managerEmail || outlet?.email || "", password: "" });
  const mutation = useMutation({
    mutationFn: () => {
      if (!outletId) throw Object.assign(new Error("Refresh the page: this outlet is missing its MongoDB id."), { backendMessage: "Refresh the page: this outlet is missing its MongoDB id." });
      return businessOutletsService.setCredentials(outletId, {
        name: String(data.name || "").trim(),
        username: String(data.username || "").trim().toLowerCase(),
        phone: String(data.phone || "").replace(/\s+/g, "").trim(),
        email: String(data.email || "").trim().toLowerCase(),
        password: String(data.password || ""),
      });
    },
    onSuccess: (result: any) => { toast.success(`Outlet login saved. Use ${result?.loginWith || data.username || data.email || data.phone} to sign in.`); setData((d:any)=>({...d,password:""})); },
    onError: (error: any) => toast.error(error?.backendMessage || error?.message || "Unable to save outlet credentials"),
  });
  const submit = (e: any) => {
    e.preventDefault();
    const username = String(data.username || "").trim().toLowerCase();
    const email = String(data.email || "").trim().toLowerCase();
    const phone = String(data.phone || "").replace(/\s+/g, "").trim();
    if (!outletId) return toast.error("Refresh the page: this outlet is missing its MongoDB id.");
    if (!username && !email && !phone) return toast.error("Enter a username, email or phone");
    if (username && !/^[a-z0-9._-]{3,40}$/.test(username)) return toast.error("Username must be 3-40 characters and use letters, numbers, dot, underscore or hyphen.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Enter a valid email address");
    if (phone && !/^\+?[0-9]{8,15}$/.test(phone)) return toast.error("Enter a valid phone number");
    if (String(data.password || "").length < 8) return toast.error("Password must contain at least 8 characters");
    mutation.mutate();
  };
  return <form className="max-h-[82vh] space-y-3 overflow-y-auto pr-1" onSubmit={submit}>
    <DialogHeader><DialogTitle>Set Outlet Login - {outlet?.name}</DialogTitle></DialogHeader>
    <div className="rounded-xl border bg-muted/30 p-3 text-sm text-muted-foreground">The seller can sign in with the username, email, or phone entered here. Saving replaces the old password for this outlet manager. Username, email, and phone must not belong to another admin, seller, rider, or customer account.</div>
    {[["name","Manager Name"],["username","Username"],["phone","Phone"],["email","Email"],["password","New Password"]].map(([k,l]) => <div key={k} className="space-y-1"><Label>{l}</Label><Input autoCapitalize="none" autoComplete={k === "password" ? "new-password" : "off"} type={k === "password" ? "password" : "text"} value={data[k] ?? ""} onChange={(e) => setData((d:any) => ({...d,[k]: e.target.value}))} /></div>)}
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
