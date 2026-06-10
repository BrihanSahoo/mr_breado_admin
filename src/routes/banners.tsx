import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { Image as ImageIcon, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner, useToggleBannerStatus,
} from "@/hooks/queries/use-banners";
import type { BannerRequest, BannerResponse } from "@/types";

export const Route = createFileRoute("/banners")({
  head: () => ({ meta: [{ title: "Banners | Go4Food Admin" }] }),
  component: BannersPage,
});

function emptyBanner(): BannerRequest {
  return { title: "", subtitle: "", image: "", enabled: true };
}

function BannersPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<BannerResponse | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data, isLoading, isFetching, error } = useBanners({ page, perPage: 12 });
  const create = useCreateBanner();
  const update = useUpdateBanner();
  const del = useDeleteBanner();
  const toggle = useToggleBannerStatus();

  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <>
      <PageHeader
        title="Banner Management"
        icon={<ImageIcon className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Banners" }]}
        actions={
          <button
            onClick={() => { setEditing({ ...(emptyBanner() as unknown as BannerResponse), id: 0 }); setIsNew(true); }}
            className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Upload Banner
          </button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.length === 0 ? (
              <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                No banners yet
              </div>
            ) : items.map((b) => (
              <div key={b.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="h-40 w-full object-cover" />
                ) : (
                  <div className="flex h-40 items-center justify-center gradient-primary text-6xl">🎯</div>
                )}
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-semibold">{b.title}</h4>
                    {b.subtitle && <p className="text-xs text-muted-foreground">{b.subtitle}</p>}
                    <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={!!b.enabled}
                        disabled={toggle.isPending}
                        onChange={(e) => toggle.mutate({ id: b.id, enabled: e.target.checked })}
                      />
                      <span className={b.enabled ? "text-success" : "text-muted-foreground"}>
                        {b.enabled ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(b); setIsNew(false); }} className="rounded p-1.5 text-primary hover:bg-primary/10">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { if (window.confirm("Delete this banner?")) del.mutate(b.id); }}
                      disabled={del.isPending}
                      className="rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div>Page {page} of {totalPages} · {data?.total ?? 0} banners</div>
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
        <BannerDialog
          banner={editing}
          isNew={isNew}
          onClose={() => setEditing(null)}
          submitting={create.isPending || update.isPending}
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

function BannerDialog({
  banner, isNew, onClose, onSubmit, submitting,
}: {
  banner: BannerResponse;
  isNew: boolean;
  onClose: () => void;
  onSubmit: (b: BannerRequest) => void;
  submitting?: boolean;
}) {
  const [form, setForm] = useState<BannerRequest>({
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    description: banner.description || "",
    image: banner.image || "",
    position: banner.position || "",
    enabled: banner.enabled ?? true,
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-lg font-semibold">{isNew ? "New Banner" : "Edit Banner"}</h3>
        <div className="space-y-3">
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Title" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Subtitle" value={form.subtitle || ""}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Image URL" value={form.image || ""}
            onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Position" value={form.position || ""}
            onChange={(e) => setForm({ ...form, position: e.target.value })} />
          <textarea className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Description" rows={3} value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
