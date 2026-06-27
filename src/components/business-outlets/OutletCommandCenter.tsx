import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Download, MapPin, Package, Phone, TrendingDown, TrendingUp, WalletCards, ShoppingBag, IndianRupee, Activity, UserRound, Clock3, Plus, Image as ImageIcon, FileText, SlidersHorizontal, Truck, ShoppingCart, CreditCard, Bike, Tags } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { businessOutletsV41Service } from "@/services/business-outlets.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { haptic } from "@/lib/haptics";
import { OutletMapPicker } from "@/components/maps/OutletMapPicker";

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
  return Array.from(new Set([direct, ...extra].filter(Boolean))).join(", ") || "Address not configured";
}


export function OutletCommandCenterPage({ outletId, onBack }: { outletId: string; onBack?: () => void }) {
  const qc = useQueryClient();
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [locationOpen, setLocationOpen] = useState(false);
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [gstinOpen, setGstinOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState<any | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const query = useQuery({ queryKey: ["outlet-v41-dashboard", outletId, from, to], queryFn: () => businessOutletsV41Service.fullDashboard(outletId, { from, to }), refetchInterval: 15000, refetchOnWindowFocus: true });
  const ordersQuery = useQuery({ queryKey: ["outlet-order-history", outletId], queryFn: () => businessOutletsV41Service.orders(outletId), refetchInterval: 10000, refetchOnWindowFocus: true });
  const exportCsv = useMutation({ mutationFn: () => businessOutletsV41Service.exportOutletAccounting(outletId, from, to) });
  const data = query.data ?? {};
  const outlet = data.outlet ?? {};
  const summary = data.summary ?? {};
  const outletOrders = Array.isArray((ordersQuery.data as any)?.items) ? (ordersQuery.data as any).items : Array.isArray((ordersQuery.data as any)?.orders) ? (ordersQuery.data as any).orders : [];
  if (query.isLoading) return <Card className="rounded-3xl"><CardContent className="p-10 text-center">Loading outlet dashboard...</CardContent></Card>;
  if (query.isError) return <Card className="rounded-3xl border-destructive/30"><CardContent className="p-10 text-center"><p className="text-xl font-bold">Outlet dashboard unavailable</p><p className="mt-2 text-sm text-muted-foreground">The backend did not return this outlet dashboard. The page is protected from crashing.</p><div className="mt-4 flex justify-center gap-2">{onBack ? <Button variant="outline" onClick={onBack}>Back to outlets</Button> : <Button variant="outline" asChild><Link to="/business-outlets">Back to outlets</Link></Button>}<Button onClick={() => query.refetch()}>Try again</Button></div></CardContent></Card>;
  return <div className="space-y-6">
    <div className="overflow-hidden rounded-3xl border bg-card shadow-card">
      {outlet.bannerImage || outlet.banner_image ? <img src={outlet.bannerImage || outlet.banner_image} alt="Outlet banner" className="h-44 w-full object-cover" /> : null}
      <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          {onBack ? (
            <Button variant="ghost" size="sm" className="mb-2" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back to Outlets</Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="mb-2"><Link to="/business-outlets"><ArrowLeft className="mr-2 h-4 w-4" />Back to Outlets</Link></Button>
          )}
          <div className="flex flex-wrap items-center gap-3">{outlet.profileImage || outlet.profile_image ? <img src={outlet.profileImage || outlet.profile_image} alt="Outlet profile" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/30" /> : null}<h1 className="text-3xl font-bold tracking-tight">{outlet.name || "Outlet Command Center"}</h1><Badge>{outlet.isOpen ? "Open" : "Closed"}</Badge></div>
          <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{outletAddress(outlet)}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">Code: {outlet.outletCode || outlet.outlet_code || outletId}</span>
            <span className="rounded-full bg-muted px-3 py-1">Radius: {outlet.serviceRadiusKm ?? outlet.service_radius_km ?? outlet.deliveryRadiusKm ?? 0} km</span>
            <span className="rounded-full bg-muted px-3 py-1">Manager: {outlet.manager_name || outlet.managerName || "Not set"}</span><span className="rounded-full bg-muted px-3 py-1">GSTIN: {outlet.gstin || "Not added"}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-40" />
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-40" />
          <Button variant="outline" onClick={() => exportCsv.mutate()}><Download className="mr-2 h-4 w-4" />Export</Button>
          <Dialog open={assignOpen} onOpenChange={setAssignOpen}><DialogTrigger asChild><Button variant="outline"><Plus className="mr-2 h-4 w-4" />Add Items</Button></DialogTrigger><DialogContent className="max-w-5xl"><AssignOutletItemsForm outletId={outletId} onDone={() => { setAssignOpen(false); qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] }); }} /></DialogContent></Dialog>
          <Dialog open={brandingOpen} onOpenChange={setBrandingOpen}><DialogTrigger asChild><Button variant="outline"><ImageIcon className="mr-2 h-4 w-4" />Branding</Button></DialogTrigger><DialogContent className="max-w-2xl"><BrandingForm outlet={outlet} outletId={outletId} onDone={() => { setBrandingOpen(false); qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] }); }} /></DialogContent></Dialog>
          <Dialog open={gstinOpen} onOpenChange={setGstinOpen}><DialogTrigger asChild><Button variant={outlet.gstin ? "outline" : "destructive"}><FileText className="mr-2 h-4 w-4" />{outlet.gstin ? "Edit GSTIN" : "Add GSTIN"}</Button></DialogTrigger><DialogContent><GstinForm outlet={outlet} outletId={outletId} onDone={() => { setGstinOpen(false); qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] }); }} /></DialogContent></Dialog>
          <Dialog open={controlsOpen} onOpenChange={setControlsOpen}><DialogTrigger asChild><Button variant="outline" onClick={() => haptic()}><SlidersHorizontal className="mr-2 h-4 w-4" />Outlet Controls</Button></DialogTrigger><DialogContent className="max-w-2xl"><OutletControlsForm outlet={outlet} outletId={outletId} onDone={() => { setControlsOpen(false); qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] }); }} /></DialogContent></Dialog>
          <Dialog open={locationOpen} onOpenChange={setLocationOpen}><DialogTrigger asChild><Button><MapPin className="mr-2 h-4 w-4" />Set Location</Button></DialogTrigger><DialogContent><LocationForm outlet={outlet} outletId={outletId} onDone={() => { setLocationOpen(false); qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] }); }} /></DialogContent></Dialog>
        </div>
      </div>
    </div>

    {!outlet.gstin && <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">GSTIN required for outlet invoices</p><p className="text-sm text-muted-foreground">Add this outlet GSTIN before issuing customer tax invoices.</p></div><Button variant="destructive" onClick={()=>setGstinOpen(true)}>Add GSTIN now</Button></div>}

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric title="Total Sales" value={money(summary.totalSales)} icon={<WalletCards className="h-5 w-5" />} />
      <Metric title="Online Sales" value={money(summary.onlineSales)} />
      <Metric title="COD Sales" value={money(summary.codSales)} />
      <Metric title="Offline Sales" value={money(summary.offlineSales)} />
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric title="Total Orders" value={summary.totalOrders ?? summary.orders ?? 0} />
      <Metric title="Active Orders" value={summary.activeOrders ?? 0} icon={<Activity className="h-5 w-5" />} />
      <Metric title="Delivered" value={summary.deliveredOrders ?? 0} icon={<TrendingUp className="h-5 w-5" />} />
      <Metric title="Cancelled" value={summary.cancelledOrders ?? 0} icon={<TrendingDown className="h-5 w-5" />} />
    </div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <Metric title="Average Order" value={money(summary.averageOrderValue)} />
      <Metric title="Available Stock" value={summary.availableStock ?? 0} />
      <Metric title="Reserved Stock" value={summary.reservedStock ?? 0} />
      <Metric title="Low Stock Items" value={summary.lowStock ?? 0} />
    </div>

    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Outlet sales graph</CardTitle></CardHeader>
        <CardContent><SimpleBarChart rows={data.salesByDay ?? data.closingCalendar ?? []} valueKey="totalSales" labelKey="date" emptyText="No sales ledger yet. Sales will appear after online/COD/offline daily closing." /></CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Stock health</CardTitle></CardHeader>
        <CardContent><StockHealth summary={summary} /></CardContent>
      </Card>
    </div>

    <div className="grid gap-4 xl:grid-cols-3">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" />Manager Control</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row k="Manager Name" v={outlet.manager_name || outlet.managerName} />
          <Row k="Phone" v={outlet.manager_phone || outlet.managerPhone || outlet.contactPhone || outlet.contact_phone} />
          <Row k="Email" v={outlet.manager_email || outlet.managerEmail || outlet.contactEmail || outlet.contact_email} />
          <Row k="Outlet Code" v={outlet.outletCode || outlet.outlet_code || outletId} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" />Product Availability</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row k="Available Products" v={summary.availableProducts ?? summary.stockItems ?? 0} />
          <Row k="Out of Stock" v={summary.outOfStock ?? 0} />
          <Row k="Low Stock" v={summary.lowStock ?? 0} />
          <Row k="Stock Value" v={money(summary.stockValue ?? 0)} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5" />Daily Activity</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row k="Orders" v={summary.orders ?? 0} />
          <Row k="Bookings" v={summary.bookings ?? 0} />
          <Row k="Online Transaction" v={money(summary.onlineSales)} />
          <Row k="Offline Transaction" v={money(summary.offlineSales)} />
        </CardContent>
      </Card>
    </div>


    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Outlet order history</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {outletOrders.length === 0 && <Empty text="No orders have been routed to this outlet yet." />}
        {outletOrders.slice(0, 100).map((order: any) => (
          <div key={order.id} className="rounded-2xl border bg-muted/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><b>{order.order_number || order.orderNumber || `Order #${order.id}`}</b><p className="text-xs text-muted-foreground">{String(order.created_at || order.createdAt || '').replace('T',' ').slice(0,19)}</p></div>
              <div className="text-right"><Badge variant="outline">{order.status}</Badge><p className="mt-1 font-bold">{money(order.total || order.grand_total)}</p></div>
            </div>
            <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
              <Row k="Customer" v={order.customerName || order.delivery_name || '--'} />
              <Row k="Customer phone" v={order.customerMobile || order.delivery_mobile || '--'} />
              <Row k="Rider" v={order.riderName || 'Not assigned'} />
            </div>
            <div className="mt-3 space-y-1">
              {(order.items || []).map((item: any) => <div key={`${order.id}-${item.id}`} className="flex justify-between rounded-xl bg-background px-3 py-2 text-sm"><span>{item.quantity || 1} × {item.productName || item.title || `Food #${item.product_id}`}</span><b>{money(item.total_price || (Number(item.unit_price || 0) * Number(item.quantity || 1)))}</b></div>)}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>

    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2"><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5" /> Daily business ledger</CardTitle></CardHeader><CardContent className="space-y-2">
        {(data.closingCalendar ?? []).length === 0 && <Empty text="No day closing submitted for this date range." />}
        {(data.closingCalendar ?? []).map((d: any) => <div key={d.id} className="grid gap-2 rounded-2xl border bg-muted/30 p-3 text-sm md:grid-cols-6"><b>{String(d.closing_date || d.closingDate).slice(0,10)}</b><span>Online {money(d.online_sales)}</span><span>COD {money(d.cod_sales)}</span><span>Offline {money(d.offline_sales)}</span><span>Total {money(d.total_sales)}</span><span>Net Cash {money(d.net_cash)}</span></div>)}
      </CardContent></Card>
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" /> Manager & contact</CardTitle></CardHeader><CardContent className="space-y-3 text-sm">
        <Row k="Manager" v={outlet.manager_name || outlet.managerName} />
        <Row k="Phone" v={outlet.contactPhone || outlet.contact_phone || outlet.manager_phone} />
        <Row k="Email" v={outlet.contactEmail || outlet.contact_email || outlet.manager_email} />
        <Row k="WhatsApp" v={outlet.whatsappNumber || outlet.whatsapp_number} />
        <Row k="Hours" v={`${outlet.openingTime || outlet.opening_time || "--"} - ${outlet.closingTime || outlet.closing_time || "--"}`} />
      </CardContent></Card>
    </div>

    <div className="grid gap-4 xl:grid-cols-2">
      <FoodCard title="Best selling foods" icon={<TrendingUp className="h-5 w-5 text-primary" />} rows={data.topFoods ?? data.bestFoods ?? []} />
      <FoodCard title="Foods not selling well" icon={<TrendingDown className="h-5 w-5 text-destructive" />} rows={data.slowFoods ?? []} />
    </div>

    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5" /> Current stock and money control</CardTitle></CardHeader><CardContent className="space-y-2">
      {(data.stock ?? []).length === 0 && <Empty text="No outlet stock added yet." />}
      {(data.stock ?? []).map((s: any) => <div key={s.id || s.productId} className="grid gap-2 rounded-2xl border bg-muted/20 p-3 text-sm sm:grid-cols-2 xl:grid-cols-7 xl:items-center"><b className="sm:col-span-2 xl:col-span-2">{s.productName}</b><span>Stock: {s.stockQuantity ?? s.stock_quantity ?? 0}</span><span>Available: {s.availableStock ?? Math.max(0, Number(s.stockQuantity || 0) - Number(s.reservedQuantity || 0))}</span><span>Low alert: {s.lowStockAlert ?? s.low_stock_alert}</span><span>Price: {money(s.price)}</span><Button size="sm" variant="outline" onClick={() => setStockOpen(s)}>Update</Button></div>)}
    </CardContent></Card>

    <Card><CardHeader><CardTitle>Recent stock movements and outlet activity</CardTitle></CardHeader><CardContent className="space-y-2">
      {(data.stockMovements ?? []).slice(0, 30).map((m: any) => <div key={m.id} className="grid gap-2 rounded-xl bg-muted/30 px-3 py-2 text-sm md:grid-cols-5"><span>{String(m.created_at).slice(0,16)}</span><b>{m.productName}</b><span>{m.movement_type}</span><span>{m.before_stock} → {m.after_stock}</span><span>{m.note}</span></div>)}
      {(data.stockMovements ?? []).length === 0 && <Empty text="No stock movements yet." />}
    </CardContent></Card>

    <Dialog open={!!stockOpen} onOpenChange={(v) => !v && setStockOpen(null)}><DialogContent><StockUpdateForm outletId={outletId} item={stockOpen} onDone={() => { setStockOpen(null); qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] }); }} /></DialogContent></Dialog>
  </div>;
}
function SimpleBarChart({ rows, valueKey, labelKey, emptyText }: { rows: any[]; valueKey: string; labelKey: string; emptyText: string }) {
  const clean = (rows || []).slice(-14).map((r:any) => ({ label: String(r[labelKey] || r.closingDate || r.closing_date || '').slice(5,10), value: Number(r[valueKey] ?? r.total_sales ?? 0) || 0 }));
  const max = Math.max(1, ...clean.map(x => x.value));
  if (!clean.length) return <Empty text={emptyText} />;
  return <div className="space-y-3">
    <div className="flex h-56 items-end gap-2 rounded-2xl border bg-muted/20 p-4">
      {clean.map((x, i) => <div key={`${x.label}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
        <div className="w-full rounded-t-xl bg-primary/80" style={{ height: `${Math.max(8, (x.value / max) * 185)}px` }} title={`${x.label}: ${money(x.value)}`} />
        <span className="truncate text-[10px] text-muted-foreground">{x.label}</span>
      </div>)}
    </div>
    <div className="grid gap-2 text-sm md:grid-cols-3"><Row k="Peak day" v={money(Math.max(...clean.map(x => x.value)))} /><Row k="Days tracked" v={clean.length} /><Row k="Range sales" v={money(clean.reduce((a,x)=>a+x.value,0))} /></div>
  </div>;
}
function StockHealth({ summary }: { summary: any }) {
  const total = Math.max(1, Number(summary.stockItems || 0));
  const available = Number(summary.availableProducts || 0);
  const low = Number(summary.lowStock || 0);
  const out = Number(summary.outOfStock || 0);
  return <div className="space-y-4">
    {[{k:'Available',v:available},{k:'Low stock',v:low},{k:'Out of stock',v:out}].map(x => <div key={x.k} className="space-y-1"><div className="flex justify-between text-sm"><span>{x.k}</span><b>{x.v}</b></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, (x.v/total)*100)}%` }} /></div></div>)}
    <Row k="Stock value" v={money(summary.stockValue || 0)} />
  </div>;
}
function Metric({ title, value, icon }: { title: string; value: any; icon?: any }) { return <Card className="min-w-0 rounded-2xl"><CardContent className="p-4 sm:p-5"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">{title}</p>{icon}</div><p className="mt-2 break-words text-xl font-bold sm:text-2xl">{value}</p></CardContent></Card>; }
function Row({ k, v }: { k: string; v: any }) { return <div className="flex justify-between gap-4 rounded-xl bg-muted/30 px-3 py-2"><span className="text-muted-foreground">{k}</span><b className="text-right">{v || "--"}</b></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">{text}</div>; }
function FoodCard({ title, icon, rows }: { title: string; icon: any; rows: any[] }) { return <Card><CardHeader><CardTitle className="flex items-center gap-2">{icon}{title}</CardTitle></CardHeader><CardContent className="space-y-2">{rows.length === 0 && <Empty text="No sales data yet." />}{rows.slice(0,10).map((f:any)=><div key={`${title}-${f.productId}`} className="flex justify-between rounded-xl bg-muted/30 px-3 py-2 text-sm"><span>{f.productName}</span><b>{f.soldQuantity ?? 0} sold · {money(f.revenue)}</b></div>)}</CardContent></Card>; }

function OutletControlsForm({ outlet, outletId, onDone }: { outlet: any; outletId: string; onDone: () => void }) {
  const query = useQuery({
    queryKey: ["outlet-controls", outletId],
    queryFn: () => businessOutletsV41Service.controls(outletId),
  });
  const payload = (query.data as any)?.data ?? query.data ?? {};
  const [form, setForm] = useState<any>({
    delivery: true,
    takeaway: true,
    cod: true,
    onlinePayment: true,
    riderAssignment: true,
    offers: true,
    serviceRadiusKm: outlet.serviceRadiusKm ?? outlet.deliveryRadiusKm ?? outlet.service_radius_km ?? 5,
  });
  useEffect(() => {
    if (!query.isSuccess) return;
    const toggles = payload.featureToggles ?? payload.feature_toggles ?? {};
    setForm((current: any) => ({
      ...current,
      delivery: toggles.delivery !== false,
      takeaway: toggles.takeaway !== false,
      cod: toggles.cod !== false,
      onlinePayment: toggles.onlinePayment !== false && toggles.online_payment !== false,
      riderAssignment: toggles.riderAssignment !== false && toggles.rider_assignment !== false,
      offers: toggles.offers !== false,
      serviceRadiusKm: payload.serviceRadiusKm ?? current.serviceRadiusKm,
    }));
  }, [query.isSuccess, query.data]);
  const mutation = useMutation({
    mutationFn: () => businessOutletsV41Service.saveControls(outletId, {
      featureToggles: {
        delivery: !!form.delivery,
        takeaway: !!form.takeaway,
        cod: !!form.cod,
        onlinePayment: !!form.onlinePayment,
        riderAssignment: !!form.riderAssignment,
        offers: !!form.offers,
      },
      serviceRadiusKm: Number(form.serviceRadiusKm || 0),
    }),
    onSuccess: () => { haptic([18, 25, 18]); toast.success("Outlet-specific controls saved"); onDone(); },
    onError: (error: any) => toast.error(error?.message || "Unable to save outlet controls"),
  });
  const rows = [
    { key: "delivery", icon: Truck, title: "Home delivery", note: "Allow customers within this outlet service radius to order delivery." },
    { key: "takeaway", icon: ShoppingCart, title: "Takeaway", note: "Allow pickup orders from this outlet." },
    { key: "cod", icon: IndianRupee, title: "Cash on delivery", note: "Show COD only for this outlet." },
    { key: "onlinePayment", icon: CreditCard, title: "Online payment", note: "Use the admin Razorpay credentials for this outlet." },
    { key: "riderAssignment", icon: Bike, title: "Rider assignment", note: "Allow verified online riders to receive this outlet orders." },
    { key: "offers", icon: Tags, title: "Offers and coupons", note: "Allow outlet-targeted offers and coupons." },
  ];
  return <form className="max-h-[82vh] space-y-4 overflow-y-auto pr-1" onSubmit={(event) => { event.preventDefault(); haptic(); mutation.mutate(); }}>
    <DialogHeader><DialogTitle>Outlet-specific business controls</DialogTitle></DialogHeader>
    <p className="text-sm text-muted-foreground">These values override global settings only for <b>{outlet.name || "this outlet"}</b>. Customer checkout, seller operations and rider assignment read the same backend record.</p>
    {query.isLoading ? <div className="rounded-2xl border p-5 text-center text-sm text-muted-foreground">Loading outlet controls…</div> : <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((row) => { const Icon = row.icon; const enabled = !!form[row.key]; return <button type="button" key={row.key} onClick={() => { haptic(); setForm((current: any) => ({ ...current, [row.key]: !current[row.key] })); }} className={`min-h-28 rounded-2xl border p-4 text-left transition ${enabled ? "border-primary/40 bg-primary/5 shadow-sm" : "bg-muted/20 opacity-70"}`}>
        <div className="flex items-center justify-between gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-background"><Icon className={`h-5 w-5 ${enabled ? "text-primary" : "text-muted-foreground"}`} /></span><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${enabled ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{enabled ? "Enabled" : "Disabled"}</span></div>
        <p className="mt-3 font-bold">{row.title}</p><p className="mt-1 text-xs text-muted-foreground">{row.note}</p>
      </button>; })}
    </div>}
    <div className="space-y-2 rounded-2xl border bg-muted/20 p-4"><Label>Outlet delivery service radius (km)</Label><Input type="number" min="0" step="0.1" value={form.serviceRadiusKm} onChange={(event) => setForm((current: any) => ({ ...current, serviceRadiusKm: event.target.value }))} /><p className="text-xs text-muted-foreground">Foods from this outlet become out of range when the customer is beyond this radius.</p></div>
    <Button disabled={query.isLoading || mutation.isPending} type="submit" className="min-h-11 w-full">{mutation.isPending ? "Saving outlet controls…" : "Save outlet controls"}</Button>
  </form>;
}

function LocationForm({ outlet, outletId, onDone }: { outlet: any; outletId: string; onDone: () => void }) {
  const [data,setData]=useState<any>({ latitude: outlet.latitude || "", longitude: outlet.longitude || "", serviceRadiusKm: outlet.serviceRadiusKm ?? outlet.service_radius_km ?? outlet.deliveryRadiusKm ?? 5, address: outletAddress(outlet) === "Address not configured" ? "" : outletAddress(outlet), city: outlet.city || outlet.address?.city || "", state: outlet.state || outlet.address?.state || "", pincode: outlet.pincode || outlet.address?.pincode || "" });
  const m=useMutation({
    mutationFn:()=>businessOutletsV41Service.setLocation(outletId,data),
    onSuccess:()=>{haptic([18,25,18]);toast.success("Outlet location updated");onDone();},
    onError:(error:any)=>toast.error(error?.message || "Unable to save outlet location"),
  });
  const set=(key:string,value:any)=>setData((current:any)=>({...current,[key]:value}));
  return <form className="max-h-[86vh] space-y-4 overflow-y-auto pr-1" onSubmit={(e)=>{e.preventDefault();haptic();m.mutate();}}>
    <DialogHeader><DialogTitle>Set exact outlet location</DialogTitle></DialogHeader>
    <p className="text-sm text-muted-foreground">Drop the pin on the outlet entrance. The selected coordinates and formatted address are stored in the backend and used for nearest-outlet discovery, service range and delivery pricing.</p>
    <OutletMapPicker latitude={data.latitude} longitude={data.longitude} onChange={(point)=>setData((current:any)=>({...current,...point,address:point.address || current.address,city:point.city || current.city,state:point.state || current.state,pincode:point.pincode || current.pincode}))}/>
    <div className="grid gap-3 sm:grid-cols-2"><div><Label>Latitude</Label><Input inputMode="decimal" value={data.latitude} onChange={(e)=>set("latitude",e.target.value)}/></div><div><Label>Longitude</Label><Input inputMode="decimal" value={data.longitude} onChange={(e)=>set("longitude",e.target.value)}/></div></div>
    <div><Label>Delivery radius (km)</Label><Input type="number" min="0.1" max="100" step="0.1" value={data.serviceRadiusKm} onChange={(e)=>set("serviceRadiusKm",e.target.value)}/></div>
    <div><Label>Full outlet address</Label><Textarea rows={3} value={data.address} onChange={(e)=>set("address",e.target.value)} placeholder="Building, road, area and landmark"/></div>
    <div className="grid gap-3 sm:grid-cols-3"><div><Label>City</Label><Input value={data.city} onChange={(e)=>set("city",e.target.value)}/></div><div><Label>State</Label><Input value={data.state} onChange={(e)=>set("state",e.target.value)}/></div><div><Label>Pincode</Label><Input inputMode="numeric" value={data.pincode} onChange={(e)=>set("pincode",e.target.value)}/></div></div>
    <Button disabled={m.isPending} className="min-h-11 w-full" type="submit">{m.isPending ? "Saving location…" : "Save outlet location"}</Button>
  </form>;
}
function StockUpdateForm({ outletId, item, onDone }: { outletId: string; item: any; onDone: () => void }) { const [data,setData]=useState<any>({ productId:item?.productId || item?.product_id, stockQuantity:item?.stockQuantity ?? item?.stock_quantity ?? 0, lowStockAlert:item?.lowStockAlert ?? item?.low_stock_alert ?? 5, preparationMinutes:item?.preparation_minutes ?? 15, note:"Admin stock correction" }); const m=useMutation({ mutationFn:()=>businessOutletsV41Service.updateStock(outletId,[data]), onSuccess:()=>{toast.success("Stock updated");onDone();} }); return <form className="space-y-3" onSubmit={(e)=>{e.preventDefault();m.mutate();}}><DialogHeader><DialogTitle>Update stock - {item?.productName}</DialogTitle></DialogHeader><Label>Stock quantity</Label><Input value={data.stockQuantity} onChange={(e)=>setData((d:any)=>({...d,stockQuantity:e.target.value}))}/><Label>Low stock alert</Label><Input value={data.lowStockAlert} onChange={(e)=>setData((d:any)=>({...d,lowStockAlert:e.target.value}))}/><Label>Preparation minutes</Label><Input value={data.preparationMinutes} onChange={(e)=>setData((d:any)=>({...d,preparationMinutes:e.target.value}))}/><Label>Note</Label><Textarea value={data.note} onChange={(e)=>setData((d:any)=>({...d,note:e.target.value}))}/><Button className="w-full" type="submit">Save stock</Button></form>; }


function GstinForm({ outlet, outletId, onDone }: { outlet: any; outletId: string; onDone: () => void }) {
  const [data, setData] = useState<any>({ gstin: outlet.gstin || "", invoiceLegalName: outlet.invoiceLegalName || outlet.invoice_legal_name || outlet.name || "Mr. Breado", invoiceAddress: safeText(outlet.invoiceAddress || outlet.invoice_address) || (outletAddress(outlet) === "Address not configured" ? "" : outletAddress(outlet)) });
  const m = useMutation({ mutationFn: () => businessOutletsV41Service.saveGstin(outletId, data), onSuccess: () => { toast.success("Outlet GSTIN saved"); onDone(); } });
  return <form className="space-y-3" onSubmit={(e)=>{e.preventDefault(); if(data.gstin && String(data.gstin).trim().length !== 15){toast.error("GSTIN must be exactly 15 characters"); return;} m.mutate();}}>
    <DialogHeader><DialogTitle>Outlet GSTIN & invoice identity</DialogTitle></DialogHeader>
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm">This GSTIN will appear on invoices generated for orders placed at this outlet.</div>
    <Label>GSTIN Number</Label><Input maxLength={15} value={data.gstin} onChange={(e)=>setData((d:any)=>({...d,gstin:e.target.value.toUpperCase()}))} placeholder="19ABCDE1234F1Z5"/>
    <Label>Invoice Legal Name</Label><Input value={data.invoiceLegalName} onChange={(e)=>setData((d:any)=>({...d,invoiceLegalName:e.target.value}))}/>
    <Label>Invoice Address</Label><Textarea value={data.invoiceAddress} onChange={(e)=>setData((d:any)=>({...d,invoiceAddress:e.target.value}))}/>
    <Button className="w-full" type="submit">Save GSTIN & invoice details</Button>
  </form>;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || "")); reader.readAsDataURL(file); });
}
function BrandingForm({ outlet, outletId, onDone }: { outlet: any; outletId: string; onDone: () => void }) {
  const [data, setData] = useState<any>({ bannerImage: outlet.bannerImage || outlet.banner_image || "", profileImage: outlet.profileImage || outlet.profile_image || "", phone: outlet.phone || "", email: outlet.email || "", address: outletAddress(outlet) === "Address not configured" ? "" : outletAddress(outlet) });
  const m = useMutation({ mutationFn: () => businessOutletsV41Service.saveBranding(outletId, data), onSuccess: () => { toast.success("Outlet branding saved"); onDone(); } });
  return <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
    <DialogHeader><DialogTitle>Outlet banner, profile and contact</DialogTitle></DialogHeader>
    <div className="grid gap-4 md:grid-cols-2">
      <label className="rounded-2xl border border-dashed p-4 text-sm">Banner image<input type="file" accept="image/*" className="mt-2 block w-full" onChange={async(e)=>{ const f=e.target.files?.[0]; if(f){ const url = await fileToDataUrl(f); setData((d:any)=>({...d,bannerImage: url})); } }} />{data.bannerImage && <img src={data.bannerImage} className="mt-3 h-32 w-full rounded-xl object-cover" />}</label>
      <label className="rounded-2xl border border-dashed p-4 text-sm">Profile/logo image<input type="file" accept="image/*" className="mt-2 block w-full" onChange={async(e)=>{ const f=e.target.files?.[0]; if(f){ const url = await fileToDataUrl(f); setData((d:any)=>({...d,profileImage: url})); } }} />{data.profileImage && <img src={data.profileImage} className="mt-3 h-32 w-full rounded-xl object-cover" />}</label>
    </div>
    <Label>Outlet phone</Label><Input value={data.phone} onChange={(e)=>setData((d:any)=>({...d,phone:e.target.value}))}/>
    <Label>Outlet email</Label><Input value={data.email} onChange={(e)=>setData((d:any)=>({...d,email:e.target.value}))}/>
    <Label>Outlet address</Label><Textarea value={data.address} onChange={(e)=>setData((d:any)=>({...d,address:e.target.value}))}/>
    <Button className="w-full" type="submit">Save outlet branding</Button>
  </form>;
}

function outletImageValue(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value === '[object Object]' ? '' : value;
  if (Array.isArray(value)) return outletImageValue(value[0]);
  if (typeof value === 'object') return outletImageValue(value.secure_url ?? value.secureUrl ?? value.url ?? value.src ?? value.path ?? value.image ?? value.imageUrl ?? value.thumbnail);
  return '';
}
function AssignOutletItemsForm({ outletId, onDone }: { outletId: string; onDone: () => void }) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["outlet-assignable-products", outletId],
    queryFn: () => businessOutletsV41Service.availableProducts(outletId),
  });
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => {
    const data: any = query.data ?? {};
    const assigned = Array.isArray(data.assigned) ? data.assigned : [];
    const all = Array.isArray(data.all) ? data.all : [];
    const assignedById = new Map(assigned.map((x: any) => [String(x.productId ?? x.product_id ?? x.id), x]));
    return all.map((product: any) => {
      const key = String(product.productId ?? product.id);
      const saved: any = assignedById.get(key) ?? {};
      return {
        ...product,
        ...saved,
        productId: product.productId ?? product.id,
        productName: product.productName ?? product.title ?? product.name ?? `Food #${key}`,
        imageUrl: outletImageValue(product.imageUrl ?? product.image ?? product.images ?? saved.imageUrl ?? saved.image),
        categoryName: product.categoryName ?? product.foodType ?? saved.categoryName ?? "Uncategorised",
        isVeg: String(product.foodType ?? product.food_type ?? '').toUpperCase() === 'VEG' || (product.isVeg ?? product.veg ?? saved.isVeg) === true,
      };
    });
  }, [query.data]);

  useEffect(() => {
    if (!rows.length) return;
    const nextDraft: Record<string, any> = {};
    const nextSelected: Record<string, boolean> = {};
    for (const p of rows) {
      const key = String(p.productId);
      const alreadyAssigned = p.assigned === true || p.enabled === true || p.outletInventory != null;
      nextSelected[key] = alreadyAssigned;
      nextDraft[key] = {
        productId: p.productId,
        stockQuantity: p.stockQuantity ?? p.stock_quantity ?? p.stock_qty ?? p.outletInventory?.stockQuantity ?? "",
        isAvailable: (p.available ?? p.outletInventory?.available) === true || Number(p.stockQuantity ?? p.stock_quantity ?? p.stock_qty ?? p.outletInventory?.stockQuantity ?? 0) > 0,
        note: alreadyAssigned ? "Admin updated outlet stock" : "Admin added item to outlet",
      };
    }
    setDraft(nextDraft);
    setSelected(nextSelected);
  }, [rows]);

  const mutation = useMutation({
    mutationFn: (items: any[]) => businessOutletsV41Service.updateStock(outletId, items),
    onSuccess: () => {
      toast.success("Outlet inventory saved successfully");
      qc.invalidateQueries({ queryKey: ["outlet-assignable-products", outletId] });
      qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard", outletId] });
      onDone();
    },
    onError: (error: any) => toast.error(error?.message || "Unable to save outlet inventory"),
  });

  const update = (key: string, field: string, value: any) => {
    setDraft((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };

  const save = () => {
    const selectedCount = rows.filter((p: any) => selected[String(p.productId)]).length;
    if (!selectedCount) return toast.error("Select at least one food item");
    const items = rows
      .map((p: any) => {
        const key = String(p.productId);
        const item = draft[key] ?? { productId: p.productId, stockQuantity: 0 };
        const enabled = !!selected[key];
        const stockQuantity = Number(item.stockQuantity || 0);
        return { ...item, productId: p.productId, enabled, selected: enabled, stockQuantity, isAvailable: enabled && stockQuantity > 0 };
      })
      .filter((item: any) => item?.productId);

    const invalid = items.find((item: any) => item.enabled && (!Number.isInteger(item.stockQuantity) || item.stockQuantity < 0));
    if (invalid) return toast.error("Stock quantity must be a whole number equal to or above zero");
    haptic([16, 30, 16]);
    mutation.mutate(items);
  };

  return <div className="space-y-5">
    <DialogHeader>
      <DialogTitle>Manage outlet food inventory</DialogTitle>
    </DialogHeader>
    <div className="rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground">
      Select foods for this outlet and set only the current stock quantity. Prices, images, category and food type always come from the Admin master food catalog. Stock changes are reflected in the customer app immediately.
    </div>

    <div className="hidden grid-cols-[52px_minmax(280px,1fr)_150px] gap-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
      <span>Select</span><span>Food details</span><span>Current stock</span>
    </div>

    <div className="max-h-[62vh] space-y-3 overflow-y-auto pr-2">
      {query.isLoading && <Empty text="Loading admin-created foods..." />}
      {query.isError && <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm"><b>Unable to load the master food catalog.</b><p className="mt-1 text-muted-foreground">Check the backend connection, then try again.</p><Button className="mt-3" size="sm" variant="outline" onClick={() => query.refetch()}>Try again</Button></div>}
      {rows.map((p: any) => {
        const key = String(p.productId);
        const d = draft[key] ?? {};
        const checked = !!selected[key];
        return <div key={key} className={`rounded-2xl border p-3 transition ${checked ? "border-primary/50 bg-primary/5" : "bg-muted/10"}`}>
          <div className="grid gap-3 lg:grid-cols-[52px_minmax(280px,1fr)_150px] lg:items-center">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={checked} onChange={(e) => { haptic(); setSelected((x) => ({ ...x, [key]: e.target.checked })); }} />
              <span className="lg:hidden">Use</span>
            </label>

            <div className="flex min-w-0 items-center gap-3">
              {p.imageUrl ? <img src={p.imageUrl} className="h-14 w-14 shrink-0 rounded-xl object-cover" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xs">No image</div>}
              <div className="min-w-0">
                <div className="truncate font-semibold">{p.productName}</div>
                <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                  <Badge variant="outline">{p.categoryName}</Badge>
                  <Badge variant="outline">{p.isVeg ? "Veg" : "Non-Veg"}</Badge>
                  <span>Base {money(p.price)}</span>
                </div>
              </div>
            </div>

            <div><Label className="mb-1 block lg:hidden">Quantity</Label><Input disabled={!checked} min={0} placeholder="0" type="number" value={d.stockQuantity ?? ""} onChange={(e)=>update(key,"stockQuantity",e.target.value)}/></div>
          </div>
        </div>;
      })}
      {!query.isLoading && rows.length === 0 && <Empty text="No admin foods found. Create foods first from Mr. Breado Store." />}
    </div>

    <div className="flex justify-end gap-2 border-t pt-4">
      <Button variant="outline" onClick={onDone}>Cancel</Button>
      <Button onClick={save} disabled={mutation.isPending}>{mutation.isPending ? "Saving inventory..." : "Save outlet inventory"}</Button>
    </div>
  </div>;
}
