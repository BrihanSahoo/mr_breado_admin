import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, BadgeCheck, Eye, EyeOff, KeyRound, Mail, MapPin, Navigation, Save, Send } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { request } from "@/api/client";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";

type ApiSettings = {
  googleMapKey?: string;
  googleMapsApiKey?: string;
  googleMapsApiKeyConfigured?: boolean;
  provider?: string;
  distanceProvider?: string;
  googleMapsAdminActionRequired?: boolean;
  googleMapsStatusMessage?: string;
};

const defaults: ApiSettings = {
  provider: "GOOGLE",
  distanceProvider: "GOOGLE",
};

export function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ApiSettings>(defaults);
  const { data, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: () => request<ApiSettings>({ url: "/admin/api-keys", method: "GET" }),
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      ...defaults,
      ...data,
      googleMapKey: "",
      provider: data.distanceProvider === "GOOGLE" || data.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE",
    });
  }, [data]);

  const validateGoogle = useMutation({
    mutationFn: () => request<any>({ url: "/admin/api-keys/validate-google", method: "POST" }),
    onSuccess: () => toast.success("Google Maps API key validated successfully"),
    onError: (error: Error) => toast.error(error.message),
  });

  const save = useMutation({
    mutationFn: (payload: ApiSettings) => request<ApiSettings>({ url: "/admin/api-keys", method: "PUT", data: payload }),
    onSuccess: () => {
      toast.success("API key settings saved");
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (key: keyof ApiSettings, value: any) => setForm((current) => ({ ...current, [key]: value }));
  const onSave = () => save.mutate({
    googleMapsApiKey: form.googleMapKey ?? form.googleMapsApiKey ?? "",
    distanceProvider: form.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE",
  });

  return (
    <>
      <PageHeader title="API Keys & Distance" icon={<KeyRound className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "API Keys" }]} />
      {!data?.googleMapsApiKeyConfigured && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div><div className="font-bold">Google Maps setup required</div><div className="text-sm">Delivery discovery and road-distance calculation require a valid backend key.</div></div>
        </div>
      )}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-primary/15 p-3 text-primary"><MapPin className="h-5 w-5" /></div>
            <div><h2 className="text-xl font-bold">Google Maps Distance API</h2><p className="text-sm text-muted-foreground">Stores the server-side key used for geocoding, nearest-outlet selection, delivery radius, and road distance.</p></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field className="md:col-span-2" label="Google Maps API Key" value={form.googleMapKey ?? ""} onChange={(value) => set("googleMapKey", value)} placeholder={form.googleMapsApiKeyConfigured ? "Key configured. Leave unchanged or paste a replacement." : "AIza..."} />
            <label className="block text-sm font-semibold">Distance Provider<select value={form.provider ?? "GOOGLE"} onChange={(event) => set("provider", event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"><option value="GOOGLE">Google Distance Matrix</option><option value="HAVERSINE">Haversine fallback</option></select></label>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={isLoading || save.isPending} onClick={onSave} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"><Save className="h-4 w-4" /> Save API Settings</button>
            <button disabled={!data?.googleMapsApiKeyConfigured || validateGoogle.isPending} onClick={() => validateGoogle.mutate()} className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold disabled:opacity-50"><BadgeCheck className="h-4 w-4" /> Validate Google Key</button>
          </div>
        </section>
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 text-lg font-bold">Distance responsibilities</h3>
          <Info icon={<Navigation className="h-4 w-4" />} title="Nearest outlet" text="Backend compares customer location with active outlet coordinates." />
          <Info icon={<Navigation className="h-4 w-4" />} title="Road distance" text="The resulting distance is passed to the separate Delivery Pricing configuration." />
          <div className="mt-5 rounded-xl border border-border bg-background p-4 text-xs leading-5 text-muted-foreground">Delivery charges and rider rates have moved to the dedicated Delivery Pricing page in the sidebar.</div>
        </section>
        <div className="xl:col-span-2"><SmtpSettingsCard /></div>
      </div>
    </>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "", className = "" }: any) {
  return <label className={`block text-sm font-semibold ${className}`}>{label}<input type={type} value={value ?? ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label>;
}
function Info({ icon, title, text }: any) {
  return <div className="mb-3 rounded-xl border border-border bg-background p-4"><div className="flex items-center gap-2 font-bold text-foreground">{icon}{title}</div><p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p></div>;
}


type SmtpForm = { host:string; port:number|string; secure:boolean; user:string; password:string; fromName:string; fromEmail:string; replyTo:string; enabled:boolean; configured?:boolean; userConfigured?:boolean; passwordConfigured?:boolean };
const smtpDefaults:SmtpForm={host:"smtp.gmail.com",port:587,secure:false,user:"",password:"",fromName:"Mr. Breado",fromEmail:"",replyTo:"",enabled:true};
function SmtpSettingsCard(){
  const queryClient=useQueryClient();
  const [form,setForm]=useState<SmtpForm>(smtpDefaults);
  const [showPassword,setShowPassword]=useState(false);
  const query=useQuery({queryKey:["smtp-settings"],queryFn:()=>request<any>({url:"/admin/email/settings",method:"GET"})});
  useEffect(()=>{if(!query.data)return;setForm({...smtpDefaults,...query.data,user:"",password:""});},[query.data]);
  const save=useMutation({mutationFn:()=>request<any>({url:"/admin/email/settings",method:"PUT",data:form}),onSuccess:()=>{haptic([18,30,18]);toast.success("SMTP email settings saved");queryClient.invalidateQueries({queryKey:["smtp-settings"]});queryClient.invalidateQueries({queryKey:["integration-health"]});},onError:(error:Error)=>toast.error(error.message)});
  const validate=useMutation({mutationFn:()=>request<any>({url:"/admin/email/settings/validate",method:"POST"}),onSuccess:()=>{haptic([18,30,18]);toast.success("SMTP login and connection verified");},onError:(error:Error)=>toast.error(error.message)});
  const set=(key:keyof SmtpForm,value:any)=>setForm(current=>({...current,[key]:value}));
  const ready=Boolean(query.data?.configured || (form.host&&form.user&&form.password&&form.fromEmail));
  return <section className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-primary/15 p-3 text-primary"><Mail className="h-5 w-5"/></div><div><h2 className="text-xl font-bold">SMTP Email Delivery</h2><p className="text-sm text-muted-foreground">Use your own Gmail, Zoho, Outlook or business SMTP account. Credentials are encrypted in MongoDB and used for customer, rider and password-recovery emails.</p></div></div><span className={`w-fit rounded-full px-3 py-1 text-xs font-black ${ready?"bg-emerald-500/15 text-emerald-600":"animate-pulse bg-amber-500/15 text-amber-700"}`}>{ready?"Configured":"Action required"}</span></div>
    {!ready&&<div className="mb-5 flex gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900"><AlertTriangle className="h-5 w-5 shrink-0"/><div><b>Email sending is disabled</b><p className="mt-1">Enter SMTP host, port, login email, app password and sender email. For Gmail, use an App Password instead of your normal Google password.</p></div></div>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Field label="SMTP Host" value={form.host} onChange={(v:string)=>set("host",v)} placeholder="smtp.gmail.com"/>
      <Field label="SMTP Port" type="number" value={form.port} onChange={(v:string)=>set("port",Number(v))} placeholder="587"/>
      <label className="block text-sm font-semibold">Connection security<select value={form.secure?"SSL":"STARTTLS"} onChange={e=>{const ssl=e.target.value==="SSL";set("secure",ssl);if(ssl&&Number(form.port)===587)set("port",465);if(!ssl&&Number(form.port)===465)set("port",587);}} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"><option value="STARTTLS">STARTTLS (usually port 587)</option><option value="SSL">SSL/TLS (usually port 465)</option></select></label>
      <Field label="SMTP Username / Email" value={form.user} onChange={(v:string)=>set("user",v)} placeholder={query.data?.userConfigured?"Login configured — enter only to replace":"orders@mrbreado.com"}/>
      <label className="block text-sm font-semibold">SMTP Password / App Password<div className="relative mt-2"><input type={showPassword?"text":"password"} value={form.password} placeholder={query.data?.passwordConfigured?"Password configured — enter only to replace":"Enter app password"} onChange={e=>set("password",e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-3 pr-12 outline-none focus:border-primary"/><button type="button" onClick={()=>{haptic();setShowPassword(v=>!v);}} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground">{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></label>
      <Field label="Sender Name" value={form.fromName} onChange={(v:string)=>set("fromName",v)} placeholder="Mr. Breado"/>
      <Field label="Sender Email" value={form.fromEmail} onChange={(v:string)=>set("fromEmail",v)} placeholder="orders@mrbreado.com"/>
      <Field label="Reply-to Email" value={form.replyTo} onChange={(v:string)=>set("replyTo",v)} placeholder="support@mrbreado.com"/>
      <label className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background px-4 text-sm font-bold"><input type="checkbox" checked={form.enabled} onChange={e=>set("enabled",e.target.checked)}/>Enable SMTP emails</label>
    </div>
    <div className="mt-6 flex flex-wrap gap-3"><button disabled={save.isPending} onClick={()=>{haptic();save.mutate();}} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"><Save className="h-4 w-4"/>{save.isPending?"Saving…":"Save SMTP Settings"}</button><button disabled={!ready||validate.isPending} onClick={()=>{haptic();validate.mutate();}} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold disabled:opacity-50"><Send className="h-4 w-4"/>{validate.isPending?"Testing…":"Test SMTP Connection"}</button></div>
  </section>;
}
