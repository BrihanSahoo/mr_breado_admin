import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Save, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { mrBreadoService } from "@/services/mr-breado.service";

export const Route = createFileRoute("/mr-breado-restaurant")({
  head: () => ({ meta: [{ title: "Mr. Breado Restaurant | Admin" }] }),
  component: MrBreadoRestaurantPage,
});

const empty = {
  name: "", description: "", contactNumber: "", contactEmail: "", address: "", city: "", state: "", country: "India", zipcode: "",
  latitude: "", longitude: "", gstin: "", cuisines: "", priceForTwo: "", orderPreparationTime: "", minDeliveryTime: "", maxDeliveryTime: "",
  logo: null as File | null, banner: null as File | null, image: null as File | null,
};

function MrBreadoRestaurantPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["mr-breado", "restaurant"], queryFn: mrBreadoService.restaurant });
  const [form, setForm] = useState<any>(empty);
  useEffect(() => {
    if (!data) return;
    setForm({
      ...empty,
      name: data.name ?? "", description: data.description ?? "", contactNumber: data.contactNumber ?? data.contact_number ?? "",
      contactEmail: data.contactEmail ?? data.contact_email ?? "", address: data.address ?? "", city: data.city ?? "", state: data.state ?? "",
      country: data.country ?? "India", zipcode: data.zipcode ?? data.zipCode ?? "", latitude: data.latitude ?? "", longitude: data.longitude ?? "",
      gstin: data.gstin ?? data.gstinNumber ?? data.gstin_number ?? "", cuisines: data.cuisines ?? "", priceForTwo: data.priceForTwo ?? data.price_for_two ?? "",
      orderPreparationTime: data.orderPreparationTime ?? data.order_preparation_time ?? "", minDeliveryTime: data.minDeliveryTime ?? data.min_delivery_time ?? "",
      maxDeliveryTime: data.maxDeliveryTime ?? data.max_delivery_time ?? "",
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "") return;
        fd.append(k, v as any);
        const snake = k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
        if (snake !== k) fd.append(snake, v as any);
      });
      return mrBreadoService.updateRestaurant(fd);
    },
    onSuccess: () => { toast.success("Mr. Breado restaurant updated"); qc.invalidateQueries({ queryKey: ["mr-breado", "restaurant"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const status = useMutation({
    mutationFn: (patch: any) => mrBreadoService.updateRestaurantStatus(patch),
    onSuccess: () => { toast.success("Restaurant status updated"); qc.invalidateQueries({ queryKey: ["mr-breado", "restaurant"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }));
  const isOpen = !!(data?.open ?? data?.isOpen ?? data?.is_open);
  const isVisible = String(data?.visibilityStatus ?? data?.visibility_status ?? "VISIBLE").toUpperCase() !== "HIDDEN";

  return <>
    <PageHeader title="Mr. Breado Restaurant" icon={<Building2 className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Mr. Breado Restaurant" }]} />
    <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
      <section className="rounded-xl border border-border bg-card p-4 shadow-card md:p-6">
        {isLoading ? <div className="h-96 animate-pulse rounded-lg bg-primary/10" /> : <>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Restaurant Name" value={form.name} onChange={(v)=>set("name", v)} />
            <Field label="GSTIN" value={form.gstin} onChange={(v)=>set("gstin", v)} />
            <Field label="Contact Number" value={form.contactNumber} onChange={(v)=>set("contactNumber", v)} />
            <Field label="Contact Email" value={form.contactEmail} onChange={(v)=>set("contactEmail", v)} />
            <Field label="Cuisines" value={form.cuisines} onChange={(v)=>set("cuisines", v)} />
            <Field label="Price For Two" value={form.priceForTwo} onChange={(v)=>set("priceForTwo", v)} />
            <Field label="Preparation Time (min)" value={form.orderPreparationTime} onChange={(v)=>set("orderPreparationTime", v)} />
            <Field label="Delivery Time Min" value={form.minDeliveryTime} onChange={(v)=>set("minDeliveryTime", v)} />
            <Field label="Delivery Time Max" value={form.maxDeliveryTime} onChange={(v)=>set("maxDeliveryTime", v)} />
            <Field label="Zipcode" value={form.zipcode} onChange={(v)=>set("zipcode", v)} />
          </div>
          <TextArea label="Description" value={form.description} onChange={(v)=>set("description", v)} />
          <TextArea label="Address" value={form.address} onChange={(v)=>set("address", v)} />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="City" value={form.city} onChange={(v)=>set("city", v)} />
            <Field label="State" value={form.state} onChange={(v)=>set("state", v)} />
            <Field label="Latitude" value={form.latitude} onChange={(v)=>set("latitude", v)} />
            <Field label="Longitude" value={form.longitude} onChange={(v)=>set("longitude", v)} />
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <FileField label="Logo" onChange={(f)=>set("logo", f)} />
            <FileField label="Banner" onChange={(f)=>set("banner", f)} />
            <FileField label="Image" onChange={(f)=>set("image", f)} />
          </div>
          <div className="mt-5 flex justify-end"><button onClick={()=>save.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"><Save className="h-4 w-4" />Save Restaurant</button></div>
        </>}
      </section>
      <aside className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-card">
        <h3 className="text-base font-semibold">Live Controls</h3>
        <Info label="Verification" value={<StatusBadge status={data?.verificationStatus ?? data?.verification_status ?? "PENDING"} />} />
        <Info label="Visibility" value={<StatusBadge status={data?.visibilityStatus ?? data?.visibility_status ?? "VISIBLE"} />} />
        <Info label="Current Open State" value={<StatusBadge status={isOpen ? "OPEN" : "CLOSED"} />} />
        <button onClick={()=>status.mutate({ open: !isOpen, isOpen: !isOpen, is_open: !isOpen })} className="flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent">{isOpen ? <ToggleRight className="h-4 w-4"/> : <ToggleLeft className="h-4 w-4"/>}{isOpen ? "Close Store" : "Open Store"}</button>
        <button onClick={()=>status.mutate({ visibilityStatus: isVisible ? "HIDDEN" : "VISIBLE", visibility_status: isVisible ? "HIDDEN" : "VISIBLE" })} className="w-full rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent">{isVisible ? "Hide From App" : "Show In App"}</button>
      </aside>
    </div>
  </>;
}

function Field({ label, value, onChange }: any) { return <label className="block text-sm font-medium">{label}<input value={value ?? ""} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>; }
function TextArea({ label, value, onChange }: any) { return <label className="mt-4 block text-sm font-medium">{label}<textarea value={value ?? ""} onChange={(e)=>onChange(e.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>; }
function FileField({ label, onChange }: any) { return <label className="block text-sm font-medium">{label}<input type="file" accept="image/*" onChange={(e)=>onChange(e.target.files?.[0] ?? null)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" /></label>; }
function Info({ label, value }: any) { return <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>; }
