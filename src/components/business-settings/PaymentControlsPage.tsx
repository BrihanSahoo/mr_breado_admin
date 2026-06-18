import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Save, ShieldCheck, Truck } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { request } from "@/api/client";
import { toast } from "sonner";

export function PaymentControlsPage(){
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey:["payment-controls"], queryFn:()=>request<any>({url:"/admin/payment-controls",method:"GET"}) });
  const [form,setForm] = useState<any>({ codEnabled:true, onlinePaymentEnabled:false, razorpayMode:"TEST", razorpayKeyId:"", razorpayKeySecret:"", razorpayWebhookSecret:"", mrBreadoTakeawayEnabled:false, takeawayAdvancePercentage:0 });
  useEffect(()=>{ if(data) setForm({ ...form, ...data, razorpayKeySecret:"" }); },[data]);
  const save = useMutation({ mutationFn:(payload:any)=>request<any>({url:"/admin/payment-controls",method:"PUT",data:payload}), onSuccess:()=>{toast.success("Payment controls saved"); qc.invalidateQueries({queryKey:["payment-controls"]});}, onError:(e:Error)=>toast.error(e.message) });
  const set=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v}));
  return <>
    <PageHeader title="Payment & Takeaway Controls" icon={<CreditCard className="h-5 w-5" />} breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Payment Controls"}]} />
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <div className="grid gap-4 lg:grid-cols-3">
        <Status title="COD" active={!!form.codEnabled} icon={<Truck className="h-5 w-5"/>}/>
        <Status title="Online Payment" active={!!form.onlinePaymentEnabled} icon={<CreditCard className="h-5 w-5"/>}/>
        <Status title="Razorpay Secret" active={!!form.razorpaySecretConfigured || !!form.razorpayKeySecret} icon={<ShieldCheck className="h-5 w-5"/>}/>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Toggle label="Cash on Delivery" value={!!form.codEnabled} onChange={(v)=>set("codEnabled",v)} />
        <Toggle label="Online Razorpay Payment" value={!!form.onlinePaymentEnabled} onChange={(v)=>set("onlinePaymentEnabled",v)} />
        <Toggle label="Mr. Breado Takeaway" value={!!form.mrBreadoTakeawayEnabled} onChange={(v)=>set("mrBreadoTakeawayEnabled",v)} />
        <Field label="Takeaway Advance Percentage" type="number" value={form.takeawayAdvancePercentage ?? 0} onChange={(v:string)=>set("takeawayAdvancePercentage",Math.max(0,Math.min(100,Number(v))))} />
        <label className="block text-sm font-semibold">Razorpay Mode<select value={form.razorpayMode ?? "TEST"} onChange={(e)=>set("razorpayMode",e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"><option value="TEST">TEST</option><option value="LIVE">LIVE</option></select></label>
        <Field label="Razorpay Key ID" value={form.razorpayKeyId ?? ""} onChange={(v:string)=>set("razorpayKeyId",v)} />
        <Field label="Razorpay Secret Key" type="password" value={form.razorpayKeySecret ?? ""} placeholder={form.razorpaySecretConfigured ? "Configured. Leave blank to keep old secret." : "Secret key"} onChange={(v:string)=>set("razorpayKeySecret",v)} />
      <Field label="Razorpay Webhook Secret" type="password" value={form.razorpayWebhookSecret ?? ""} placeholder={form.razorpayWebhookSecretConfigured ? "Configured. Leave blank to keep old secret." : "Webhook secret"} onChange={(v:string)=>set("razorpayWebhookSecret",v)} />
      </div>
      <button disabled={isLoading || save.isPending} onClick={()=>save.mutate(form)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"><Save className="h-4 w-4"/> Save Payment Controls</button>
    </section>
  </>;
}
function Field({label,value,onChange,type="text",placeholder=""}:any){return <label className="block text-sm font-semibold">{label}<input type={type} value={value ?? ""} placeholder={placeholder} onChange={(e)=>onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label>}
function Toggle({label,value,onChange}:any){return <label className="flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm font-semibold"><span>{label}</span><input type="checkbox" checked={value} onChange={(e)=>onChange(e.target.checked)} className="h-5 w-5 accent-primary" /></label>}
function Status({title,active,icon}:any){return <div className="rounded-xl border border-border bg-background p-4"><div className="mb-3 text-primary">{icon}</div><div className="font-bold">{title}</div><div className={`mt-1 text-sm ${active?'text-emerald-500':'text-muted-foreground'}`}>{active?'Enabled':'Disabled'}</div></div>}
