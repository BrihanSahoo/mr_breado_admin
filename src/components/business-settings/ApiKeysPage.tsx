import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MapPin, Save, KeyRound, Navigation, IndianRupee, AlertTriangle, BadgeCheck } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { request } from "@/api/client";
import { toast } from "sonner";

type ApiSettings = {
  googleMapKey?: string;
  googleMapsApiKey?: string;
  googleMapsApiKeyConfigured?: boolean;
  provider?: string;
  distanceProvider?: string;
  baseDeliveryCharge?: number;
  deliveryChargePerKm?: number;
  riderBasePay?: number;
  riderPayPerKm?: number;
  monthlySettlementDay?: number;
  googleMapsAdminActionRequired?: boolean;
  googleMapsStatusMessage?: string;
};

const defaults: ApiSettings = {
  provider: "GOOGLE",
  distanceProvider: "GOOGLE",
  baseDeliveryCharge: 20,
  deliveryChargePerKm: 8,
  riderBasePay: 25,
  riderPayPerKm: 7,
  monthlySettlementDay: 1,
};

export function ApiKeysPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<ApiSettings>(defaults);
  const { data, isLoading } = useQuery({ queryKey: ["api-keys"], queryFn: () => request<ApiSettings>({ url: "/admin/api-keys", method: "GET" }) });
  useEffect(() => {
    if (!data) return;
    setForm({ ...defaults, ...data, googleMapKey: data.googleMapKey ?? data.googleMapsApiKey ?? "", provider: data.distanceProvider === "GOOGLE" || data.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE" });
  }, [data]);
  const validateGoogle = useMutation({ mutationFn: () => request<any>({ url: "/admin/api-keys/validate-google", method: "POST" }), onSuccess: () => toast.success("Google Maps API key validated successfully"), onError: (e: Error) => toast.error(e.message) });
  const save = useMutation({ mutationFn: (payload: ApiSettings) => request<ApiSettings>({ url: "/admin/api-keys", method: "PUT", data: payload }), onSuccess: () => { toast.success("API and distance settings saved"); qc.invalidateQueries({ queryKey: ["api-keys"] }); }, onError: (e: Error) => toast.error(e.message) });
  const set = (key: keyof ApiSettings, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const onSave = () => {
    save.mutate({
      ...form,
      googleMapsApiKey: form.googleMapKey ?? form.googleMapsApiKey ?? "",
      distanceProvider: form.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE",
    });
  };
  return <>
    <PageHeader title="API Keys & Distance" icon={<KeyRound className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "API Keys" }]} />
    {!data?.googleMapsApiKeyConfigured && <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0"/><div><div className="font-bold">Google Maps setup required</div><div className="text-sm">Delivery discovery and radius validation remain unavailable until a valid key is saved and validated.</div></div></div>}
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-primary/15 p-3 text-primary"><MapPin className="h-5 w-5" /></div>
          <div><h2 className="text-xl font-bold">Google Maps Distance API</h2><p className="text-sm text-muted-foreground">Used by backend to find nearest Mr. Breado outlet and calculate accurate distance, delivery charge, and rider earning.</p></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field className="md:col-span-2" label="Google Maps API Key" value={form.googleMapKey ?? ""} onChange={(v)=>set("googleMapKey", v)} placeholder={form.googleMapsApiKeyConfigured ? "Key configured. Leave unchanged or paste new key." : "AIza..."} />
          <label className="block text-sm font-semibold">Distance Provider<select value={form.provider ?? "GOOGLE"} onChange={(e)=>set("provider", e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"><option value="GOOGLE">Google Distance Matrix</option><option value="HAVERSINE">Haversine fallback</option></select></label>
          <Field label="Monthly Rider Settlement Day" type="number" value={form.monthlySettlementDay ?? 1} onChange={(v)=>set("monthlySettlementDay", Number(v))} />
          <Field label="Base Delivery Charge (₹)" type="number" value={form.baseDeliveryCharge ?? 0} onChange={(v)=>set("baseDeliveryCharge", Number(v))} />
          <Field label="Customer Charge / KM (₹)" type="number" value={form.deliveryChargePerKm ?? 0} onChange={(v)=>set("deliveryChargePerKm", Number(v))} />
          <Field label="Rider Base Pay (₹)" type="number" value={form.riderBasePay ?? 0} onChange={(v)=>set("riderBasePay", Number(v))} />
          <Field label="Rider Pay / KM (₹)" type="number" value={form.riderPayPerKm ?? 0} onChange={(v)=>set("riderPayPerKm", Number(v))} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3"><button disabled={isLoading || save.isPending} onClick={onSave} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"><Save className="h-4 w-4" /> Save API Settings</button><button disabled={!data?.googleMapsApiKeyConfigured || validateGoogle.isPending} onClick={()=>validateGoogle.mutate()} className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold disabled:opacity-50"><BadgeCheck className="h-4 w-4"/> Validate Google Key</button></div>
      </section>
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="mb-4 text-lg font-bold">Business impact</h3>
        <Info icon={<Navigation className="h-4 w-4" />} title="Nearest outlet" text="Backend compares user lat/lng with every outlet lat/lng set by admin." />
        <Info icon={<IndianRupee className="h-4 w-4" />} title="Delivery fee" text="Customer delivery charge uses base fee + exact distance × charge/km." />
        <Info icon={<IndianRupee className="h-4 w-4" />} title="Rider payout" text="Rider popup and monthly payout use base pay + exact distance × rider pay/km." />
        <div className="mt-5 rounded-xl border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">The Google key stays on backend only. User and rider apps receive calculated values, not the key.</div>
      </section>
    </div>
  </>;
}
function Field({ label, value, onChange, type = "text", placeholder = "", className = "" }: any) { return <label className={`block text-sm font-semibold ${className}`}>{label}<input type={type} value={value ?? ""} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label>; }
function Info({ icon, title, text }: any) { return <div className="mb-3 rounded-xl border border-border bg-background p-4"><div className="flex items-center gap-2 font-bold text-foreground">{icon}{title}</div><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div>; }
