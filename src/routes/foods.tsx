import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Utensils, Plus, Pencil, Trash2, Star, Loader2, ChevronLeft, ChevronRight, Download, FileSpreadsheet } from "lucide-react";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/queries/use-products";
import { productsService } from "@/services/products.service";
import {
  useDeleteProduct,
  useToggleProductAvailability,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/mutations/use-product-mutations";

export const Route = createFileRoute("/foods")({
  head: () => ({ meta: [{ title: "Foods | Go4Food Admin" }] }),
  component: () => <FoodsPage title="Foods" source="seller" />,
});

export function FoodsPage({ title, source = "admin" }: { title: string; source?: "seller" | "admin" }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useProducts({ page, perPage: 20, source });
  const del = useDeleteProduct();
  const toggle = useToggleProductAvailability();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const blankForm = { title: "", subtitle: "", description: "", price: "", discountPrice: "", categoryName: "", foodType: "", stockQuantity: "", isVeg: true, isAvailable: true, isBestseller: false, smallSizeExtra: "", mediumSizeExtra: "", largeSizeExtra: "", cake500gmExtra: "", cake1kgExtra: "", cake15kgExtra: "", cake2kgExtra: "", cakeMessageEnabled: false, cakeMessageCharge: "", customWeightEnabled: false, image: null as File | null };
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    if (editing) {
      setForm({ ...blankForm, title: editing.title ?? editing.name ?? "", subtitle: editing.subtitle ?? "", description: editing.description ?? "", price: String(editing.price ?? ""), discountPrice: String(editing.discountPrice ?? editing.discount_price ?? ""), categoryName: editing.categoryName ?? editing.category_name ?? editing.category ?? "", foodType: editing.foodType ?? editing.food_type ?? "", stockQuantity: String(editing.stockQuantity ?? editing.stock_quantity ?? ""), isVeg: Boolean(editing.isVeg ?? editing.veg ?? editing.is_veg ?? true), isAvailable: Boolean(editing.isAvailable ?? editing.available ?? editing.is_available ?? true), isBestseller: Boolean(editing.isBestseller ?? editing.bestseller ?? editing.is_bestseller ?? false), smallSizeExtra: String(editing.smallSizeExtra ?? editing.small_size_extra ?? ""), mediumSizeExtra: String(editing.mediumSizeExtra ?? editing.medium_size_extra ?? ""), largeSizeExtra: String(editing.largeSizeExtra ?? editing.large_size_extra ?? ""), cake500gmExtra: String(editing.cake500gmExtra ?? editing.cake_500gm_extra ?? ""), cake1kgExtra: String(editing.cake1kgExtra ?? editing.cake_1kg_extra ?? ""), cake15kgExtra: String(editing.cake15kgExtra ?? editing.cake1_5kgExtra ?? editing.cake_1_5kg_extra ?? ""), cake2kgExtra: String(editing.cake2kgExtra ?? editing.cake_2kg_extra ?? ""), cakeMessageEnabled: Boolean(editing.cakeMessageEnabled ?? editing.cake_message_enabled ?? false), cakeMessageCharge: String(editing.cakeMessageCharge ?? editing.cake_message_charge ?? ""), customWeightEnabled: Boolean(editing.customWeightEnabled ?? editing.custom_weight_enabled ?? false), image: null });
    } else {
      setForm(blankForm);
    }
  }, [editing]);

  return (
    <>
      <PageHeader
        title={title}
        icon={<Utensils className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Menu Management" }, { label: title }]}
        actions={
          <>
            <button onClick={() => { setEditing(null); setShowForm(true); }} className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow">
              <Plus className="h-4 w-4" /> Add Item
            </button>
            {source === "admin" && <button onClick={() => productsService.downloadTemplate()} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"><FileSpreadsheet className="h-4 w-4" />Template</button>}
            {source === "admin" && <button onClick={() => productsService.exportAdminProducts()} className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"><Download className="h-4 w-4" />Export</button>}
          </>
        }
      />

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-base font-semibold">
            {data?.total ?? 0} products {isFetching && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Food</th>
                <th className="px-4 py-3 font-medium">Restaurant</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Availability</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-10 w-full animate-pulse rounded bg-primary/10" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-destructive">
                    {(error as Error).message}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-muted-foreground">
                    No products yet
                  </td>
                </tr>
              ) : (
                items.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 hover:bg-accent/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">🍽️</div>
                        )}
                        <div>
                          <div className="font-medium">{p.title} {p.isFeatured && <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Featured</span>}</div>
                          <div className="text-xs text-muted-foreground">#{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{typeof p.restaurant === 'object' ? (p.restaurant?.name ?? '—') : (p.restaurant ?? '—')}</td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{Number(p.effectivePrice ?? p.effective_price ?? p.price ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggle.mutate({ id: p.id, isAvailable: !p.isAvailable, source })}
                        disabled={toggle.isPending}
                      >
                        <StatusBadge status={p.isAvailable ? "Active" : "Inactive"} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => update.mutate({ id: p.id, payload: { featured: !p.isFeatured }, source })}
                          className="rounded p-1.5 text-amber-600 hover:bg-amber-100"
                          title={p.isFeatured ? "Unfeature" : "Mark as featured"}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-primary hover:bg-primary/10">
                          <Pencil className="h-4 w-4" onClick={() => { setEditing(p); setShowForm(true); }} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${p.title}"?`)) del.mutate({ id: p.id, source });
                          }}
                          disabled={del.isPending}
                          className="rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <div>Page {data?.page ?? page} of {totalPages}</div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
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
      </div>
      <ModalForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        form={form}
        setForm={setForm}
        editing={editing}
        onSave={async () => {
          const fd = new FormData();
          Object.entries(form).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") return;
            if (key === "image" && value) fd.append("image", value as File);
            else if (key !== "image") {
              fd.append(key, String(value));
              const snake = key.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
              if (snake !== key) fd.append(snake, String(value));
            }
          });
          try {
            if (editing) {
              await update.mutateAsync({ id: editing.id, payload: fd, source });
            } else {
              await create.mutateAsync({ payload: fd, source });
            }
            setShowForm(false);
            setEditing(null);
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </>
  );
}

// Simple modal form (kept inline to keep changes minimal)
function ModalForm({ open, onClose, form, setForm, onSave, editing }: any) {
  if (!open) return null;
  const set = (key: string, value: any) => setForm((s:any) => ({ ...s, [key]: value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-4xl rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 text-lg font-semibold">{editing ? "Edit Food" : "Add Item"}</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Title" value={form.title} onChange={(v:any)=>set("title", v)} />
          <Field label="Subtitle" value={form.subtitle} onChange={(v:any)=>set("subtitle", v)} />
          <Field label="Category" value={form.categoryName} onChange={(v:any)=>set("categoryName", v)} />
          <Field label="Food Type" value={form.foodType} onChange={(v:any)=>set("foodType", v)} />
          <Field label="Price" value={form.price} onChange={(v:any)=>set("price", v)} />
          <Field label="Discount Price" value={form.discountPrice} onChange={(v:any)=>set("discountPrice", v)} />
          <Field label="Stock Quantity" value={form.stockQuantity} onChange={(v:any)=>set("stockQuantity", v)} />
          <Field label="Small Size Extra" value={form.smallSizeExtra} onChange={(v:any)=>set("smallSizeExtra", v)} />
          <Field label="Medium Size Extra" value={form.mediumSizeExtra} onChange={(v:any)=>set("mediumSizeExtra", v)} />
          <Field label="Large Size Extra" value={form.largeSizeExtra} onChange={(v:any)=>set("largeSizeExtra", v)} />
          <Field label="Cake 500gm Extra" value={form.cake500gmExtra} onChange={(v:any)=>set("cake500gmExtra", v)} />
          <Field label="Cake 1kg Extra" value={form.cake1kgExtra} onChange={(v:any)=>set("cake1kgExtra", v)} />
          <Field label="Cake 1.5kg Extra" value={form.cake15kgExtra} onChange={(v:any)=>set("cake15kgExtra", v)} />
          <Field label="Cake 2kg Extra" value={form.cake2kgExtra} onChange={(v:any)=>set("cake2kgExtra", v)} />
          <Field label="Cake Message Charge" value={form.cakeMessageCharge} onChange={(v:any)=>set("cakeMessageCharge", v)} />
          <label className="block text-sm font-medium">Image<input type="file" accept="image/*" onChange={(e:any) => set("image", e.target.files?.[0] ?? null)} className="mt-1 w-full rounded-md border border-input px-3 py-2" /></label>
        </div>
        <label className="mt-3 block text-sm font-medium">Description<textarea value={form.description} onChange={(e)=>set("description", e.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-input px-3 py-2" /></label>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <Toggle label="Veg" value={form.isVeg} onChange={(v:any)=>set("isVeg", v)} />
          <Toggle label="Available" value={form.isAvailable} onChange={(v:any)=>set("isAvailable", v)} />
          <Toggle label="Bestseller" value={form.isBestseller} onChange={(v:any)=>set("isBestseller", v)} />
          <Toggle label="Cake Message" value={form.cakeMessageEnabled} onChange={(v:any)=>set("cakeMessageEnabled", v)} />
          <Toggle label="Custom Weight" value={form.customWeightEnabled} onChange={(v:any)=>set("customWeightEnabled", v)} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
          <button onClick={onSave} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, onChange }: any) { return <label className="block text-sm font-medium">{label}<input value={value ?? ""} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" /></label>; }
function Toggle({ label, value, onChange }: any) { return <label className="flex items-center justify-between rounded-lg border border-border p-3 text-sm font-medium"><span>{label}</span><input type="checkbox" checked={!!value} onChange={(e)=>onChange(e.target.checked)} /></label>; }
