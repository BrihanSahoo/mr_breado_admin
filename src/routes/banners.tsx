import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import {
  Image as ImageIcon, Plus, Pencil, Trash2, ChevronLeft, ChevronRight,
  Loader2, CalendarClock, Store, TicketPercent, Upload, CheckCircle2,
} from "lucide-react";
import {
  useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useToggleBannerStatus,
} from "@/hooks/queries/use-banners";
import { useCoupons } from "@/hooks/queries/use-coupons";
import { useRestaurants } from "@/hooks/queries/use-restaurants";
import type { BannerRequest, BannerResponse, Coupon } from "@/types";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/banners")({
  head: () => ({ meta: [{ title: "Banners | Mr. Breado Admin" }] }),
  component: BannersPage,
});

function emptyBanner(): BannerRequest {
  return {
    title: "", subtitle: "", description: "", image: "", couponCode: "",
    enabled: true, appliesToAllOutlets: true, outletIds: [], priority: 0,
  };
}

function itemsOf(value: any): any[] {
  if (Array.isArray(value)) return value;
  return Array.isArray(value?.items) ? value.items : [];
}

function BannersPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<BannerResponse | null>(null);
  const [isNew, setIsNew] = useState(false);
  const { data, isLoading, isFetching, error } = useBanners({ page, perPage: 12 });
  const { data: couponData } = useCoupons({ page: 1, perPage: 100 });
  const { data: outletData } = useRestaurants({ page: 1, perPage: 200 });
  const create = useCreateBanner();
  const update = useUpdateBanner();
  const del = useDeleteBanner();
  const toggle = useToggleBannerStatus();
  const coupons = itemsOf(couponData).filter((coupon: Coupon) => coupon.enabled !== false && !coupon.expired);
  const outlets = itemsOf(outletData);
  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? data?.totalPages ?? 1;

  return <>
    <PageHeader
      title="Outlet-targeted banners"
      icon={<ImageIcon className="h-5 w-5" />}
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Offer Management" }, { label: "Banners" }]}
      actions={<button onClick={() => { haptic(); setEditing({ ...(emptyBanner() as BannerResponse), id: "new" }); setIsNew(true); }} className="inline-flex items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow"><Plus className="h-4 w-4" />New banner</button>}
    />

    <div className="mb-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
      Banners can promote a normal offer or a validated coupon. Coupon banners automatically disappear from the customer app when the coupon expires, becomes inactive, or does not apply to the selected outlet.
    </div>

    {isLoading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-primary/5" />)}</div>
      : error ? <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">Banners could not be loaded. Please refresh.</div>
      : <>
        {isFetching && <div className="mb-2 text-xs text-muted-foreground"><Loader2 className="inline h-3 w-3 animate-spin" /> Refreshing…</div>}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.length === 0 ? <div className="col-span-full rounded-2xl border border-dashed p-12 text-center text-muted-foreground">No banners created yet.</div> : items.map((banner) => {
            const active = !!banner.enabled && !banner.expired;
            return <article key={String(banner.id)} className="overflow-hidden rounded-2xl border bg-card shadow-card">
              <div className="relative h-44 bg-muted">
                {banner.image ? <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center"><ImageIcon className="h-12 w-12 text-muted-foreground" /></div>}
                <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black ${active ? "bg-emerald-600 text-white" : "bg-black/70 text-white"}`}>{banner.expired ? "Expired" : active ? "Active" : "Inactive"}</span>
              </div>
              <div className="space-y-3 p-4">
                <div><h3 className="font-black">{banner.title}</h3>{banner.subtitle && <p className="text-sm text-muted-foreground">{banner.subtitle}</p>}</div>
                <div className="grid gap-2 text-xs">
                  <div className="flex items-center gap-2"><Store className="h-4 w-4 text-primary" /><span>{banner.scopeText || (banner.appliesToAllOutlets ? "All outlets" : `${banner.outletIds?.length || 0} selected outlets`)}</span></div>
                  <div className="flex items-center gap-2"><TicketPercent className="h-4 w-4 text-primary" /><span>{banner.couponCode ? `Coupon ${banner.couponCode}` : "No coupon attached"}</span></div>
                  <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-primary" /><span>{banner.endsAt ? `Ends ${new Date(banner.endsAt).toLocaleString()}` : "No expiry"}</span></div>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <label className="inline-flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={!!banner.enabled} disabled={toggle.isPending || !!banner.expired} onChange={(event) => { haptic(); toggle.mutate({ id: banner.id, enabled: event.target.checked }); }} />Visible</label>
                  <div className="flex gap-1"><button onClick={() => { haptic(); setEditing(banner); setIsNew(false); }} className="rounded-lg p-2 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button><button onClick={() => { haptic([20, 25, 20]); if (window.confirm("Deactivate this banner?")) del.mutate(banner.id); }} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button></div>
                </div>
              </div>
            </article>;
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-3"><button disabled={page <= 1} onClick={() => { haptic(); setPage((value) => value - 1); }} className="rounded-xl border p-2 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button><span className="text-sm font-bold">Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => { haptic(); setPage((value) => value + 1); }} className="rounded-xl border p-2 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button></div>
      </>}

    {editing && <BannerDialog
      banner={editing}
      coupons={coupons}
      outlets={outlets}
      isNew={isNew}
      submitting={create.isPending || update.isPending}
      onClose={() => setEditing(null)}
      onSubmit={(body) => {
        const action = isNew ? create.mutateAsync(body) : update.mutateAsync({ id: editing.id, body });
        action.then(() => setEditing(null)).catch(() => undefined);
      }}
    />}
  </>;
}

function BannerDialog({ banner, coupons, outlets, isNew, submitting, onClose, onSubmit }: {
  banner: BannerResponse;
  coupons: Coupon[];
  outlets: any[];
  isNew: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (body: BannerRequest) => void;
}) {
  const [form, setForm] = useState<BannerRequest>({
    title: banner.title || "", subtitle: banner.subtitle || "", description: banner.description || "",
    image: banner.image || "", couponCode: banner.couponCode || "", enabled: banner.enabled ?? true,
    priority: banner.priority ?? 0, startsAt: banner.startsAt, endsAt: banner.endsAt,
    appliesToAllOutlets: banner.appliesToAllOutlets ?? !(banner.outletIds?.length),
    outletIds: (banner.outletIds || []).map(String), imageFile: null,
  });
  const preview = useMemo(() => form.imageFile ? URL.createObjectURL(form.imageFile) : form.image || "", [form.imageFile, form.image]);
  const selectedIds = (form.outletIds || []).map(String);
  const invalidScope = !form.appliesToAllOutlets && selectedIds.length === 0;
  const invalidDates = !!form.startsAt && !!form.endsAt && new Date(form.startsAt) >= new Date(form.endsAt);

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
    <div className="mx-auto my-4 w-full max-w-3xl rounded-3xl border bg-card p-5 shadow-2xl sm:p-7">
      <div className="mb-5 flex items-start justify-between"><div><h2 className="text-2xl font-black">{isNew ? "Create banner" : "Edit banner"}</h2><p className="text-sm text-muted-foreground">Image, schedule, coupon and outlet eligibility are stored in the backend.</p></div><button onClick={onClose} className="rounded-xl border px-3 py-2">Close</button></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-2xl border bg-muted"><div className="h-48">{preview ? <img src={preview} className="h-full w-full object-cover" alt="Banner preview" /> : <div className="grid h-full place-items-center text-muted-foreground"><Upload className="h-10 w-10" /></div>}</div></div>
          <label className="block text-sm font-bold">Upload image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setForm({ ...form, imageFile: event.target.files?.[0] || null })} className="mt-1 w-full rounded-xl border p-2 text-sm" /></label>
          <label className="block text-sm font-bold">Or image URL<input value={form.image || ""} onChange={(event) => setForm({ ...form, image: event.target.value })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label>
        </div>
        <div className="space-y-3">
          <label className="block text-sm font-bold">Title<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label>
          <label className="block text-sm font-bold">Subtitle<input value={form.subtitle || ""} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label>
          <label className="block text-sm font-bold">Description<textarea value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 min-h-20 w-full rounded-xl border bg-background px-3 py-2" /></label>
          <label className="block text-sm font-bold">Attached coupon<select value={form.couponCode || ""} onChange={(event) => setForm({ ...form, couponCode: event.target.value })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2"><option value="">No coupon</option>{coupons.map((coupon) => <option key={String(coupon.id)} value={coupon.code}>{coupon.code} — {coupon.discountText || coupon.title || coupon.type}</option>)}</select></label>
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-bold">Starts<input type="datetime-local" value={form.startsAt ? form.startsAt.slice(0, 16) : ""} onChange={(event) => setForm({ ...form, startsAt: event.target.value ? new Date(event.target.value).toISOString() : undefined })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label><label className="block text-sm font-bold">Ends<input type="datetime-local" value={form.endsAt ? form.endsAt.slice(0, 16) : ""} onChange={(event) => setForm({ ...form, endsAt: event.target.value ? new Date(event.target.value).toISOString() : undefined })} className="mt-1 w-full rounded-xl border bg-background px-3 py-2" /></label></div>
          {invalidDates && <p className="text-sm font-bold text-destructive">End time must be later than start time.</p>}
          <label className="flex items-center gap-2 rounded-xl border p-3 text-sm font-bold"><input type="checkbox" checked={!!form.appliesToAllOutlets} onChange={(event) => setForm({ ...form, appliesToAllOutlets: event.target.checked, outletIds: event.target.checked ? [] : form.outletIds })} />Available at every outlet</label>
          {!form.appliesToAllOutlets && <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border p-3">{outlets.map((outlet) => { const id = String(outlet.id || outlet._id); const checked = selectedIds.includes(id); return <label key={id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checked} onChange={(event) => setForm({ ...form, outletIds: event.target.checked ? [...selectedIds, id] : selectedIds.filter((value) => value !== id) })} /><span>{outlet.name || outlet.outletName || "Outlet"}</span></label>; })}</div>}
          {invalidScope && <p className="text-sm font-bold text-destructive">Choose one or more outlets.</p>}
          <div className="flex flex-wrap gap-4"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={!!form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} />Active</label><label className="flex items-center gap-2 text-sm font-bold">Priority<input type="number" value={Number(form.priority || 0)} onChange={(event) => setForm({ ...form, priority: Number(event.target.value) })} className="w-24 rounded-lg border bg-background px-2 py-1" /></label></div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl border px-4 py-2">Cancel</button><button disabled={submitting || !form.title.trim() || (!form.imageFile && !form.image?.trim()) || invalidScope || invalidDates} onClick={() => onSubmit(form)} className="inline-flex items-center gap-2 rounded-xl gradient-primary px-5 py-2 font-black text-primary-foreground disabled:opacity-50">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Save banner</button></div>
    </div>
  </div>;
}
