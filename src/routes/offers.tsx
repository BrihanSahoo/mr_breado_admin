import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useRestaurants } from "@/hooks/queries/use-restaurants";
import { PageHeader } from "@/components/admin/page-header";
import {
  Gift,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  TicketPercent,
  Truck,
} from "lucide-react";
import {
  useOffers,
  useCreateOffer,
  useUpdateOffer,
  useDeleteOffer,
  useToggleOfferStatus,
} from "@/hooks/queries/use-offers";
import type { OfferRequest, OfferResponse } from "@/types";

export const Route = createFileRoute("/offers")({
  head: () => ({ meta: [{ title: "Offers | Mr. Breado Admin" }] }),
  component: OffersPage,
});

function OffersPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<OfferResponse | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data, isLoading, isFetching, error } = useOffers({
    page,
    perPage: 12,
  });
  const { data: outletData } = useRestaurants({ page: 1, perPage: 200 });
  const outlets: any[] = Array.isArray(outletData)
    ? (outletData as any[])
    : ((outletData as any)?.items ?? []);
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
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Offer Management" },
          { label: "Offers" },
        ]}
        actions={
          <button
            onClick={() => {
              setEditing({ id: 0 } as OfferResponse);
              setIsNew(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Add Offer
          </button>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-xl bg-primary/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive">
          {(error as Error).message}
        </div>
      ) : (
        <>
          {isFetching && (
            <div className="mb-2 text-xs text-muted-foreground">
              <Loader2 className="inline h-3 w-3 animate-spin" /> Refreshing…
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.length === 0 ? (
              <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
                No offers yet
              </div>
            ) : (
              items.map((o) => {
                const img = o.imageUrl || o.image || o.banner;
                const enabled = o.enabled ?? o.active ?? true;
                return (
                  <div
                    key={o.id}
                    className="overflow-hidden rounded-xl border border-border bg-card shadow-card"
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={o.title || o.name || ""}
                        className="h-32 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center gradient-primary text-5xl">
                        🎁
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold">{o.title || o.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {o.description || o.subtitle}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          onClick={() => toggle.mutate(o.id)}
                          disabled={toggle.isPending}
                          className={`rounded-full px-2 py-0.5 text-xs ${enabled ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}
                        >
                          {enabled ? "Active" : "Inactive"}
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditing(o);
                              setIsNew(false);
                            }}
                            className="rounded p-1.5 text-primary hover:bg-primary/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this offer?"))
                                del.mutate(o.id);
                            }}
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
              })
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div>
              Page {page} of {totalPages} · {total} offers
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isFetching}
                className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"
              >
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
          outlets={outlets}
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
  offer,
  isNew,
  onClose,
  onSubmit,
  submitting,
  outlets,
}: {
  offer: OfferResponse;
  isNew: boolean;
  onClose: () => void;
  onSubmit: (b: OfferRequest) => void;
  submitting?: boolean;
  outlets: any[];
}) {
  const [form, setForm] = useState<any>({
    title: offer.title || offer.name || "",
    subtitle: offer.subtitle || "",
    description: offer.description || "",
    imageUrl: offer.imageUrl || offer.image || offer.banner || "",
    couponEnabled:
      (offer as any).couponEnabled ?? Boolean((offer as any).couponCode),
    couponCode: (offer as any).couponCode || "",
    discountType: offer.discountType || "PERCENT",
    discountValue: offer.discountValue ?? 0,
    minOrderAmount: offer.minOrderAmount ?? 0,
    maxDiscount: (offer as any).maxDiscount ?? 0,
    validFrom: (offer as any).validFrom || "",
    validTo: (offer as any).validTo || "",
    enabled: offer.enabled ?? true,
    appliesToAllOutlets:
      (offer as any).appliesToAllOutlets ?? !(offer as any).outletIds?.length,
    outletIds: ((offer as any).outletIds || []).map((x: any) =>
      String(x?.id || x?._id || x),
    ),
    imageFile: undefined,
  });
  const readFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    setForm((f: any) => ({ ...f, imageFile: file }));
  };
  const previewUrl = useMemo(
    () =>
      form.imageFile
        ? URL.createObjectURL(form.imageFile)
        : form.imageUrl || "",
    [form.imageFile, form.imageUrl],
  );
  useEffect(
    () => () => {
      if (form.imageFile && previewUrl.startsWith("blob:"))
        URL.revokeObjectURL(previewUrl);
    },
    [form.imageFile, previewUrl],
  );
  const isFreeDelivery = form.discountType === "FREE_DELIVERY";
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[96dvh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-primary/25 bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-h-[92vh] sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">
              {isNew ? "Create Business Offer" : "Edit Business Offer"}
            </h3>
            <p className="text-sm text-muted-foreground">
              One practical offer section with banner, optional coupon, duration
              and free-delivery support.
            </p>
          </div>
          <Gift className="h-7 w-7 text-primary" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Offer title"
              value={form.title || ""}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Short subtitle"
              value={form.subtitle || ""}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
            <textarea
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Offer description"
              rows={4}
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-4 text-sm font-medium text-primary hover:bg-primary/10">
              <Upload className="h-4 w-4" /> Select offer image from device
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => readFile(e.target.files?.[0])}
              />
            </label>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Offer preview"
                className="h-40 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-40 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                No offer image selected
              </div>
            )}
          </div>
          <div className="space-y-3 rounded-2xl border bg-muted/20 p-4">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={!!form.enabled}
                onChange={(e) =>
                  setForm({ ...form, enabled: e.target.checked })
                }
              />{" "}
              Offer enabled
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={!!form.couponEnabled}
                onChange={(e) =>
                  setForm({ ...form, couponEnabled: e.target.checked })
                }
              />{" "}
              <TicketPercent className="h-4 w-4" /> Attach coupon code
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={!!form.appliesToAllOutlets}
                onChange={(e) =>
                  setForm({
                    ...form,
                    appliesToAllOutlets: e.target.checked,
                    outletIds: e.target.checked ? [] : form.outletIds,
                  })
                }
              />{" "}
              Apply to all outlets
            </label>
            {!form.appliesToAllOutlets && (
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Select one or multiple outlets
                </p>
                {outlets.map((o: any) => {
                  const id = String(o.id || o._id);
                  const selected = (form.outletIds || []).includes(id);
                  return (
                    <label key={id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            outletIds: e.target.checked
                              ? [...(form.outletIds || []), id]
                              : (form.outletIds || []).filter(
                                  (x: string) => x !== id,
                                ),
                          })
                        }
                      />
                      <span>{o.name || o.outletName}</span>
                    </label>
                  );
                })}
                {!outlets.length && (
                  <p className="text-xs text-destructive">
                    Create an outlet first.
                  </p>
                )}
              </div>
            )}
            {form.couponEnabled && (
              <input
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm uppercase"
                placeholder="Coupon code e.g. FREEDEL"
                value={form.couponCode || ""}
                onChange={(e) =>
                  setForm({ ...form, couponCode: e.target.value.toUpperCase() })
                }
              />
            )}
            <select
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
            >
              <option value="PERCENT">Percentage discount</option>
              <option value="FLAT">Flat discount</option>
              <option value="FREE_DELIVERY">Free delivery charge</option>
            </select>
            {isFreeDelivery ? (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">
                <Truck className="mr-2 inline h-4 w-4" /> This coupon will set
                user delivery fee to ₹0 when valid.
              </div>
            ) : (
              <input
                type="number"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="Discount value"
                value={form.discountValue ?? 0}
                onChange={(e) =>
                  setForm({ ...form, discountValue: Number(e.target.value) })
                }
              />
            )}
            <input
              type="number"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Minimum order amount"
              value={form.minOrderAmount ?? 0}
              onChange={(e) =>
                setForm({ ...form, minOrderAmount: Number(e.target.value) })
              }
            />
            <input
              type="number"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Max discount cap"
              value={form.maxDiscount ?? 0}
              onChange={(e) =>
                setForm({ ...form, maxDiscount: Number(e.target.value) })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-muted-foreground">
                Valid from
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.validFrom || ""}
                  onChange={(e) =>
                    setForm({ ...form, validFrom: e.target.value })
                  }
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Valid till
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={form.validTo || ""}
                  onChange={(e) =>
                    setForm({ ...form, validTo: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 -mx-4 mt-5 flex justify-end gap-2 border-t bg-card/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <button
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={
              submitting ||
              !form.title ||
              (!form.appliesToAllOutlets && !(form.outletIds || []).length)
            }
            onClick={() => onSubmit(form as OfferRequest)}
            className="rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}
