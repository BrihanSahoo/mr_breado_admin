import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/api/client";
import { PageHeader } from "@/components/admin/page-header";
import { Palette, Plus, Pencil, Power, Link2 } from "lucide-react";
import { toast } from "sonner";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/brands")({
  head: () => ({ meta: [{ title: "Brands | Mr. Breado Admin" }] }),
  component: BrandsPage,
});

function listOf(value: any): any[] {
  const data = value?.data ?? value;
  return Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
}

function BrandsPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const query = useQuery({ queryKey: ["admin-brands"], queryFn: async () => listOf((await api.get("/admin/brands")).data) });
  const status = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => api.patch(`/admin/brands/${id}/status`, { active }),
    onSuccess: (_data, variables) => { toast.success(variables.active ? "Brand enabled for customer discovery and food assignment" : "Brand disabled"); qc.invalidateQueries({ queryKey: ["admin-brands"] }); },
    onError: () => toast.error("Brand status could not be updated."),
  });
  const brands = query.data || [];

  return <>
    <PageHeader title="Brands" icon={<Palette className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Menu Management" }, { label: "Brands" }]} actions={<button onClick={() => { haptic(); setEditing(null); setOpen(true); }} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground"><Plus className="h-4 w-4" />Add brand</button>} />
    <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">Only enabled brands appear in the admin food form and customer app. Every brand is linked by its unique slug, so selecting a brand in the user app returns only foods assigned to that brand, together with their outlet and distance.</div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {brands.map((brand: any) => {
        const id = String(brand.id || brand._id);
        const active = brand.active !== false;
        return <article key={id} className="rounded-2xl border bg-card p-4 shadow-card">
          <div className="relative"><img src={brand.imageUrl || brand.image} alt={brand.name} className="h-28 w-full rounded-xl bg-muted object-contain" /><span className={`absolute right-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-black ${active ? "bg-emerald-600 text-white" : "bg-black/70 text-white"}`}>{active ? "ENABLED" : "DISABLED"}</span></div>
          <div className="mt-3 font-black">{brand.name}</div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Link2 className="h-3.5 w-3.5" />/{brand.slug}</div>
          <div className="mt-4 flex gap-2"><button onClick={() => { haptic(); setEditing(brand); setOpen(true); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border p-2 text-sm font-bold"><Pencil className="h-4 w-4" />Edit</button><button disabled={status.isPending} onClick={() => { haptic(); status.mutate({ id, active: !active }); }} className={`rounded-xl border p-2 ${active ? "text-destructive" : "text-emerald-600"}`} title={active ? "Disable brand" : "Enable brand"}><Power className="h-4 w-4" /></button></div>
        </article>;
      })}
    </div>
    {open && <BrandModal brand={editing} onClose={() => setOpen(false)} onSaved={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["admin-brands"] }); }} />}
  </>;
}

function BrandModal({ brand, onClose, onSaved }: any) {
  const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const [name, setName] = useState(brand?.name || "");
  const [slug, setSlug] = useState(brand?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(brand?.slug));
  const [file, setFile] = useState<File | null>(null);
  const [active, setActive] = useState(brand?.active !== false);
  const save = useMutation({
    mutationFn: async () => {
      if (!name.trim()) throw new Error("NAME_REQUIRED");
      const form = new FormData();
      form.append("name", name.trim());
      form.append("slug", slugify(slug || name));
      form.append("active", String(active));
      if (file) form.append("image", file);
      return brand ? api.put(`/admin/brands/${brand.id || brand._id}`, form) : api.post("/admin/brands", form);
    },
    onSuccess: () => { haptic(35); toast.success("Brand saved and slug linked"); onSaved(); },
    onError: (error: Error) => toast.error(error.message === "NAME_REQUIRED" ? "Brand name is required." : "Brand could not be saved. Check that the slug is unique."),
  });
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-2xl"><h2 className="text-xl font-black">{brand ? "Edit" : "Add"} brand</h2><p className="mt-1 text-sm text-muted-foreground">The slug is used by the user app to filter brand foods.</p><label className="mt-4 block text-sm font-bold">Brand name<input value={name} onChange={(event) => { const value = event.target.value; setName(value); if (!slugTouched) setSlug(slugify(value)); }} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label><label className="mt-3 block text-sm font-bold">Unique slug<input value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} placeholder="auto-generated" className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label><label className="mt-3 block text-sm font-bold">Logo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} className="mt-1 w-full rounded-xl border p-2" /></label><label className="mt-3 flex items-center gap-2 rounded-xl border p-3 text-sm font-bold"><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />Enabled for food assignment and customer app</label><div className="mt-5 flex justify-end gap-2"><button onClick={() => { haptic(); onClose(); }} className="rounded-xl border px-4 py-2">Cancel</button><button disabled={save.isPending || !name.trim() || !slugify(slug || name)} onClick={() => { haptic(35); save.mutate(); }} className="rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50">{save.isPending ? "Saving…" : "Save brand"}</button></div></div></div>;
}
