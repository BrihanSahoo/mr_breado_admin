import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/page-header";
import { settingsService } from "@/services/settings.service";
import {
  Settings as SettingsIcon,
  Store,
  Bike,
  MapPin,
  Percent,
  Grid2X2,
  CreditCard,
  Save,
  ShieldCheck,
  Truck,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings | Mr Breado Admin" }] }),
  component: SettingsPage,
});

type Tab = "restaurant" | "driver" | "map" | "commission" | "platform" | "payment";

const tabs: { key: Tab; label: string; icon: any; description?: string }[] = [
  { key: "restaurant", label: "Restaurant Settings", icon: Store },
  { key: "driver", label: "Driver Settings", icon: Bike },
  { key: "map", label: "Map Settings", icon: MapPin },
  { key: "commission", label: "Admin Commission", icon: Percent },
  { key: "platform", label: "Platform Fee", icon: Grid2X2 },
  { key: "payment", label: "Payment & Takeaway", icon: CreditCard },
];

const platformDefaults = {
  codEnabled: true,
  onlinePaymentEnabled: false,
  razorpayMode: "TEST",
  razorpayKeyId: "",
  razorpayKeySecret: "",
  razorpaySecretConfigured: false,
  mrBreadoTakeawayEnabled: false,
  takeawayBookingFeePercent: 20,
  deliveryChargePerKm: 8,
  minimumDeliveryCharge: 25,
  maximumDeliveryCharge: 120,
  riderDeliveryPayPerKm: 6,
  minimumRiderDeliveryPay: 20,
  supportEmail: "",
  supportPhone: "",
  businessAddress: "",
  businessLatitude: "",
  businessLongitude: "",
};

function SettingsPage() {
  const [tab, setTab] = useState<Tab>("payment");
  return (
    <>
      <PageHeader title="Settings" icon={<SettingsIcon className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Settings" }]} />
      <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-xl border border-border bg-card p-3 shadow-card">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${tab === t.key ? "bg-primary/15 text-primary" : "hover:bg-accent"}`}>
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </aside>
        <section className="min-w-0 rounded-xl border border-border bg-card p-4 shadow-card md:p-6">
          {tab === "restaurant" && <RestaurantSettings />}
          {tab === "driver" && <DriverSettings />}
          {tab === "map" && <MapSettings />}
          {tab === "commission" && <CommissionSettings />}
          {tab === "platform" && <PlatformSettings />}
          {tab === "payment" && <PaymentAndTakeawaySettings />}
        </section>
      </div>
    </>
  );
}

function useSettingsQuery(key: string, fn: () => Promise<any>) {
  return useQuery({ queryKey: ["settings", key], queryFn: fn, staleTime: 30_000 });
}
function useSave(key: string, fn: (data: any) => Promise<any>) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: fn, onSuccess: () => { toast.success("Settings saved successfully"); qc.invalidateQueries({ queryKey: ["settings", key] }); }, onError: (e: Error) => toast.error(e.message) });
}

function RestaurantSettings() {
  const { data } = useSettingsQuery("restaurant", settingsService.restaurant);
  const save = useSave("restaurant", settingsService.updateRestaurant);
  const [form, setForm] = useState<any>({});
  useEffect(() => setForm(data ?? {}), [data]);
  return <Panel title="Restaurant Settings"><Toggle label="Subscription Plan" value={!!form.subscriptionPlanEnabled} onChange={(v)=>setForm({...form, subscriptionPlanEnabled:v})}/><Toggle label="Vendor Document Verification" value={!!form.vendorDocumentVerificationEnabled} onChange={(v)=>setForm({...form, vendorDocumentVerificationEnabled:v})}/><Toggle label="Self Delivery" value={!!form.selfDeliveryEnabled} onChange={(v)=>setForm({...form, selfDeliveryEnabled:v})}/><Field label="Restaurant Location Radius" value={form.restaurantLocationRadius ?? ""} onChange={(v)=>setForm({...form, restaurantLocationRadius:Number(v)})}/><SaveButton loading={save.isPending} onClick={()=>save.mutate(form)} /></Panel>;
}
function DriverSettings() {
  const { data } = useSettingsQuery("driver", settingsService.driver);
  const save = useSave("driver", settingsService.updateDriver);
  const [form, setForm] = useState<any>({});
  useEffect(() => setForm(data ?? {}), [data]);
  return <Panel title="Driver Settings"><Toggle label="Driver Document Verification" value={!!form.driverDocumentVerificationEnabled} onChange={(v)=>setForm({...form, driverDocumentVerificationEnabled:v})}/><div className="grid gap-3 md:grid-cols-2"><Field label="Driver Radius" value={form.driverRadiusKm ?? ""} onChange={(v)=>setForm({...form, driverRadiusKm:Number(v)})}/><Field label="Driver Location Update" value={form.driverLocationUpdateSeconds ?? ""} onChange={(v)=>setForm({...form, driverLocationUpdateSeconds:Number(v)})}/><Field label="Fare per KM" value={form.farePerKm ?? ""} onChange={(v)=>setForm({...form, farePerKm:Number(v)})}/><Field label="Fare MinCharge With KM" value={form.fareMinChargeWithKm ?? ""} onChange={(v)=>setForm({...form, fareMinChargeWithKm:Number(v)})}/><Field label="Fare Minimum Charge" value={form.fareMinimumCharge ?? ""} onChange={(v)=>setForm({...form, fareMinimumCharge:Number(v)})}/></div><Toggle label="Delivery Charges" value={!!form.deliveryChargeEnabled} onChange={(v)=>setForm({...form, deliveryChargeEnabled:v})}/><SaveButton loading={save.isPending} onClick={()=>save.mutate(form)} /></Panel>;
}
function MapSettings() {
  const { data } = useSettingsQuery("map", settingsService.map);
  const save = useSave("map", settingsService.updateMap);
  const [form, setForm] = useState<any>({});
  useEffect(() => setForm(data ?? {}), [data]);
  return <Panel title="Map Settings"><Field label="Google Map Key" value={form.googleMapKey ?? ""} onChange={(v)=>setForm({...form, googleMapKey:v})}/><SelectField label="Type" value={form.provider ?? "OSM"} onChange={(v)=>setForm({...form, provider:v})} options={["OSM", "GOOGLE"]}/><SaveButton loading={save.isPending} onClick={()=>save.mutate(form)} /></Panel>;
}
function CommissionSettings() {
  const { data } = useSettingsQuery("commission", settingsService.commission);
  const vendorSave = useSave("commission", settingsService.updateVendorCommission);
  const driverSave = useSave("commission", settingsService.updateDriverCommission);
  const [vendor, setVendor] = useState<any>({}); const [driver, setDriver] = useState<any>({});
  useEffect(()=>{setVendor({type:data?.["vendor.type"]??data?.vendor?.type??"FIXED", value:data?.["vendor.value"]??data?.vendor?.value??15, active:data?.["vendor.active"]??data?.vendor?.active??true}); setDriver({type:data?.["driver.type"]??data?.driver?.type??"PERCENTAGE", value:data?.["driver.value"]??data?.driver?.value??20, active:data?.["driver.active"]??data?.driver?.active??true});},[data]);
  return <Panel title="Admin Commission Settings"><h3 className="font-semibold">Vendor Admin Commission</h3><div className="grid gap-3 md:grid-cols-2"><SelectField label="Commission Type" value={vendor.type} onChange={(v)=>setVendor({...vendor,type:v})} options={["FIXED","PERCENTAGE"]}/><Field label="Admin Commission" value={vendor.value??""} onChange={(v)=>setVendor({...vendor,value:Number(v)})}/></div><Toggle label="Status" value={!!vendor.active} onChange={(v)=>setVendor({...vendor,active:v})}/><SaveButton loading={vendorSave.isPending} onClick={()=>vendorSave.mutate(vendor)} /><hr className="border-border"/><h3 className="font-semibold">Driver Admin Commission</h3><div className="grid gap-3 md:grid-cols-2"><SelectField label="Commission Type" value={driver.type} onChange={(v)=>setDriver({...driver,type:v})} options={["FIXED","PERCENTAGE"]}/><Field label="Admin Commission" value={driver.value??""} onChange={(v)=>setDriver({...driver,value:Number(v)})}/></div><Toggle label="Status" value={!!driver.active} onChange={(v)=>setDriver({...driver,active:v})}/><SaveButton loading={driverSave.isPending} onClick={()=>driverSave.mutate(driver)} /></Panel>;
}
function PlatformSettings() {
  const { data } = useSettingsQuery("platform", settingsService.platformFee);
  const save = useSave("platform", settingsService.updatePlatformFee);
  const [form, setForm] = useState<any>({}); useEffect(()=>setForm(data??{}),[data]);
  return <Panel title="Platform Fee Settings"><Field label="Platform Fee" value={form.platformFee ?? ""} onChange={(v)=>setForm({...form,platformFee:Number(v)})}/><Toggle label="Platform Fee Status" value={!!form.platformFeeActive} onChange={(v)=>setForm({...form,platformFeeActive:v})}/><Toggle label="Packaging Fee" value={!!form.packagingFeeActive} onChange={(v)=>setForm({...form,packagingFeeActive:v})}/><SaveButton loading={save.isPending} onClick={()=>save.mutate(form)} /></Panel>;
}

function PaymentAndTakeawaySettings() {
  const { data, isLoading } = useSettingsQuery("platform-payment", settingsService.platformAdmin);
  const save = useSave("platform-payment", settingsService.updatePlatformAdmin);
  const [form, setForm] = useState<any>(platformDefaults);
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      ...platformDefaults,
      ...data,
      razorpayKeySecret: "",
      supportEmail: data.supportEmail ?? "",
      supportPhone: data.supportPhone ?? "",
      businessAddress: data.businessAddress ?? "",
      businessLatitude: data.businessLatitude ?? "",
      businessLongitude: data.businessLongitude ?? "",
    });
  }, [data]);

  const razorpayReady = useMemo(() => Boolean(form.razorpayKeyId) && (Boolean(form.razorpayKeySecret) || Boolean(form.razorpaySecretConfigured)), [form.razorpayKeyId, form.razorpayKeySecret, form.razorpaySecretConfigured]);

  const set = (key: string, value: any) => setForm((current: any) => ({ ...current, [key]: value }));
  const numberSet = (key: string, value: string) => set(key, value === "" ? "" : Number(value));

  const payload = () => ({
    codEnabled: Boolean(form.codEnabled),
    onlinePaymentEnabled: Boolean(form.onlinePaymentEnabled),
    razorpayMode: form.razorpayMode || "TEST",
    razorpayKeyId: optionalText(form.razorpayKeyId),
    razorpayKeySecret: optionalText(form.razorpayKeySecret),
    mrBreadoTakeawayEnabled: Boolean(form.mrBreadoTakeawayEnabled),
    takeawayBookingFeePercent: moneyNumber(form.takeawayBookingFeePercent, 20),
    deliveryChargePerKm: moneyNumber(form.deliveryChargePerKm, 8),
    minimumDeliveryCharge: moneyNumber(form.minimumDeliveryCharge, 25),
    maximumDeliveryCharge: moneyNumber(form.maximumDeliveryCharge, 120),
    riderDeliveryPayPerKm: moneyNumber(form.riderDeliveryPayPerKm, 6),
    minimumRiderDeliveryPay: moneyNumber(form.minimumRiderDeliveryPay, 20),
    supportEmail: optionalText(form.supportEmail),
    supportPhone: optionalText(form.supportPhone),
    businessAddress: optionalText(form.businessAddress),
    businessLatitude: optionalNumber(form.businessLatitude),
    businessLongitude: optionalNumber(form.businessLongitude),
  });

  const onSave = () => {
    if (!form.codEnabled && !form.onlinePaymentEnabled) {
      toast.error("Keep at least one payment method enabled.");
      return;
    }
    if (form.mrBreadoTakeawayEnabled && !form.onlinePaymentEnabled) {
      toast.error("Enable online payment before enabling takeaway.");
      return;
    }
    if (form.onlinePaymentEnabled && !razorpayReady) {
      toast.error("Add Razorpay Key ID and Secret Key before enabling online payment.");
      return;
    }
    save.mutate(payload());
  };

  if (isLoading) {
    return <Panel title="Payment & Takeaway Settings"><div className="grid gap-3 md:grid-cols-2"><div className="h-24 animate-pulse rounded-xl bg-muted"/><div className="h-24 animate-pulse rounded-xl bg-muted"/><div className="h-44 animate-pulse rounded-xl bg-muted md:col-span-2"/></div></Panel>;
  }

  return (
    <Panel title="Payment & Takeaway Settings">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="font-semibold">Production payment control</div>
        <p className="mt-1 text-xs leading-5">These settings are used by the customer app checkout flow. Online payment is available only when it is enabled and Razorpay credentials are configured. Secret key is never shown after saving; enter a new secret only when you want to replace it.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatusCard icon={<CreditCard className="h-5 w-5"/>} title="Online Payment" active={!!form.onlinePaymentEnabled && razorpayReady} activeText="Enabled" inactiveText={form.onlinePaymentEnabled ? "Credentials needed" : "Disabled"} />
        <StatusCard icon={<ShieldCheck className="h-5 w-5"/>} title="Razorpay Secret" active={!!form.razorpaySecretConfigured || !!form.razorpayKeySecret} activeText="Configured" inactiveText="Not configured" />
        <StatusCard icon={<Truck className="h-5 w-5"/>} title="Mr Breado Takeaway" active={!!form.mrBreadoTakeawayEnabled} activeText="Enabled" inactiveText="Disabled" />
      </div>

      <Gateway title="Payment Availability">
        <Toggle label="Cash on Delivery" value={!!form.codEnabled} onChange={(v)=>set("codEnabled",v)}/>
        <Toggle label="Online Payment" value={!!form.onlinePaymentEnabled} onChange={(v)=>set("onlinePaymentEnabled",v)}/>
        <Toggle label="Mr Breado Takeaway" value={!!form.mrBreadoTakeawayEnabled} onChange={(v)=>set("mrBreadoTakeawayEnabled",v)}/>
        <SelectField label="Razorpay Mode" value={form.razorpayMode ?? "TEST"} onChange={(v)=>set("razorpayMode",v)} options={["TEST","LIVE"]}/>
      </Gateway>

      <Gateway title="Razorpay Credentials">
        <Field label="Razorpay Key ID" value={form.razorpayKeyId ?? ""} onChange={(v)=>set("razorpayKeyId",v)} placeholder="rzp_test_xxxxx or rzp_live_xxxxx" />
        <SecretField label="Razorpay Secret Key" value={form.razorpayKeySecret ?? ""} visible={showSecret} configured={!!form.razorpaySecretConfigured} onToggle={()=>setShowSecret(!showSecret)} onChange={(v)=>set("razorpayKeySecret",v)} />
      </Gateway>

      <Gateway title="Takeaway & Delivery Charges">
        <Field label="Takeaway Booking Fee (%)" type="number" value={form.takeawayBookingFeePercent ?? ""} onChange={(v)=>numberSet("takeawayBookingFeePercent",v)} />
        <Field label="Customer Delivery Charge / KM (₹)" type="number" value={form.deliveryChargePerKm ?? ""} onChange={(v)=>numberSet("deliveryChargePerKm",v)} />
        <Field label="Minimum Delivery Charge (₹)" type="number" value={form.minimumDeliveryCharge ?? ""} onChange={(v)=>numberSet("minimumDeliveryCharge",v)} />
        <Field label="Maximum Delivery Charge (₹)" type="number" value={form.maximumDeliveryCharge ?? ""} onChange={(v)=>numberSet("maximumDeliveryCharge",v)} />
        <Field label="Rider Pay / KM (₹)" type="number" value={form.riderDeliveryPayPerKm ?? ""} onChange={(v)=>numberSet("riderDeliveryPayPerKm",v)} />
        <Field label="Minimum Rider Pay (₹)" type="number" value={form.minimumRiderDeliveryPay ?? ""} onChange={(v)=>numberSet("minimumRiderDeliveryPay",v)} />
      </Gateway>

      <Gateway title="Business Support Details">
        <Field label="Support Email" value={form.supportEmail ?? ""} onChange={(v)=>set("supportEmail",v)} />
        <Field label="Support Phone" value={form.supportPhone ?? ""} onChange={(v)=>set("supportPhone",v)} placeholder="10 digit mobile number" />
        <Field label="Business Latitude" type="number" value={form.businessLatitude ?? ""} onChange={(v)=>set("businessLatitude",v)} />
        <Field label="Business Longitude" type="number" value={form.businessLongitude ?? ""} onChange={(v)=>set("businessLongitude",v)} />
        <label className="block text-sm font-medium md:col-span-2 xl:col-span-3">Business Address<textarea value={form.businessAddress ?? ""} onChange={(e)=>set("businessAddress",e.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>
      </Gateway>

      <SaveButton loading={save.isPending} onClick={onSave} label="Save Payment Settings" />
    </Panel>
  );
}

function optionalText(value: any) {
  const text = value == null ? "" : String(value).trim();
  return text.length ? text : null;
}
function optionalNumber(value: any) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function moneyNumber(value: any, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function Panel({ title, children }: any) { return <div className="space-y-5"><h2 className="text-xl font-bold">{title}</h2>{children}</div>; }
function Gateway({ title, children }: any) { return <div className="space-y-4 border-b border-border pb-5 last:border-0"><h3 className="text-lg font-bold">{title}</h3><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div></div>; }
function Field({ label, value, onChange, type="text", placeholder="" }: any) { return <label className="block text-sm font-medium">{label}<input type={type} value={value ?? ""} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>; }
function SecretField({ label, value, onChange, visible, onToggle, configured }: any) { return <label className="block text-sm font-medium">{label}<div className="mt-1 flex overflow-hidden rounded-md border border-border bg-background focus-within:border-primary"><input type={visible ? "text" : "password"} value={value ?? ""} placeholder={configured ? "Secret already configured. Leave blank to keep existing." : "Enter Razorpay secret key"} onChange={(e)=>onChange(e.target.value)} className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"/><button type="button" onClick={onToggle} className="border-l border-border px-3 text-muted-foreground hover:text-foreground">{visible ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}</button></div></label>; }
function SelectField({ label, value, onChange, options }: any) { return <label className="block text-sm font-medium">{label}<select value={value ?? ""} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">{options.map((o:string)=><option key={o} value={o}>{o}</option>)}</select></label>; }
function Toggle({ label, value, onChange }: any) { return <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3"><span className="text-sm font-medium">{label}</span><label className="inline-flex cursor-pointer items-center"><input type="checkbox" checked={value} onChange={(e)=>onChange(e.target.checked)} className="peer sr-only"/><div className="relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4"/></label></div>; }
function SaveButton({ onClick, loading, label = "Save" }: any) { return <div className="flex justify-end"><button disabled={loading} onClick={onClick} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-60"><Save className="h-4 w-4"/>{loading ? "Saving..." : label}</button></div>; }
function StatusCard({ icon, title, active, activeText, inactiveText }: any) { return <div className={`rounded-xl border p-4 ${active ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-border bg-background text-muted-foreground"}`}><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-semibold">{icon}{title}</div><span className={`rounded-full px-2 py-1 text-xs font-bold ${active ? "bg-emerald-600 text-white" : "bg-muted text-foreground"}`}>{active ? activeText : inactiveText}</span></div></div>; }
