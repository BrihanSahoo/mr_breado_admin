import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Gift, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer, useToggleOfferStatus,
} from "@/hooks/queries/use-offers";
import type { OfferRequest, OfferResponse } from "@/types";

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [{ title: "Offers | Go4Food Admin" }] }),
  component: OffersPage,
});

function OffersPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<OfferResponse | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data, isLoading, isFetching, error } = useOffers({ page, perPage: 12 });
  const create = useCreateOffer();
  const update = useUpdateOffer();
  const del = useDeleteOffer();
  const toggle = useToggleOfferStatus();

  // API may return a page envelope or an array – normalize.
  const raw = data as unknown;
  const items: OfferResponse[] = Array.isArray(raw)
    ? (raw as OfferResponse[])
    : ((raw as { items?: OfferResponse[] } | null)?.items ?? []);
  const totalPages = (raw as { total_pages?: number } | null)?.total_pages ?? 1;
  const total = (raw as { total?: number } | null)?.total ?? items.length;

  return (
    <>
      <PageHeader
        title="Offers"
        icon={<Gift className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Offer Management"},{label:"Offers"}]}
        actions={
          <button
            onClick={() => { setEditing({ id: 0 } as OfferResponse); setIsNew(true); }}
            className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Add Offer
          </button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl bg-primary/5" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
          {(error as Error).message}
        </div>
      ) : (
        <>
          {isFetching && <div className="mb-2 text-xs text-muted-foreground"><Loader2 className="inline h-3 w-3 animate-spin" /> Refreshing…</div>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.length === 0 ? (
              <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                No offers yet
              </div>
            ) : items.map((o) => {
              const img = o.imageUrl || o.image || o.banner;
              const enabled = o.enabled ?? o.active ?? true;
              return (
                <div key={o.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                  {img ? (
                    <img src={img} alt={o.title || o.name || ""} className="h-32 w-full object-cover" />
                  ) : (
                    <div className="flex h-32 items-center justify-center gradient-primary text-5xl">🎁</div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{o.title || o.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{o.description || o.subtitle}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={() => toggle.mutate(o.id)}
                        disabled={toggle.isPending}
                        className={`rounded-full px-2 py-0.5 text-xs ${enabled ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
                      >
                        {enabled ? "Active" : "Inactive"}
                      </button>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditing(o); setIsNew(false); }} className="rounded p-1.5 text-primary hover:bg-primary/10">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { if (window.confirm("Delete this offer?")) del.mutate(o.id); }}
                          disabled={del.isPending}
                          className="rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div>Page {page} of {totalPages} · {total} offers</div>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || isFetching}
                className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isFetching}
                className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {editing && (
        <OfferDialog
          offer={editing}
          isNew={isNew}
          submitting={create.isPending || update.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(body) => {
            const action = isNew
              ? create.mutateAsync(body)
              : update.mutateAsync({ id: editing.id, body });
            action.then(() => setEditing(null)).catch(() => {});
          }}
        />
      )}
    </>
  );
}

function OfferDialog({
  offer, isNew, onClose, onSubmit, submitting,
}: {
  offer: OfferResponse;
  isNew: boolean;
  onClose: () => void;
  onSubmit: (b: OfferRequest) => void;
  submitting?: boolean;
}) {
  const [form, setForm] = useState<OfferRequest>({
    title: offer.title || offer.name || "",
    subtitle: offer.subtitle || "",
    description: offer.description || "",
    imageUrl: offer.imageUrl || offer.image || "",
    discountType: offer.discountType || "PERCENT",
    discountValue: offer.discountValue ?? 0,
    minOrderAmount: offer.minOrderAmount ?? 0,
    enabled: offer.enabled ?? true,
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-lg font-semibold">{isNew ? "New Offer" : "Edit Offer"}</h3>
        <div className="space-y-3">
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Title" value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Subtitle" value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Image URL" value={form.imageUrl || ""}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          <textarea className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Description" rows={3} value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Discount value" value={form.discountValue ?? 0}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} />
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Min order amount" value={form.minOrderAmount ?? 0}
              onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Enabled
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-sm">Cancel</button>
          <button disabled={submitting || !form.title}
            onClick={() => onSubmit(form)}
            className="rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
