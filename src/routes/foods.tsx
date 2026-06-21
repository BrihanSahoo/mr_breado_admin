import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Utensils, Plus, Pencil, Trash2, Star, Loader2, ChevronLeft, ChevronRight, Download, FileSpreadsheet } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { useProducts } from "@/hooks/queries/use-products";
import { productsService } from "@/services/products.service";
import {
  useDeleteProduct,
  useToggleProductAvailability,
  useCreateProduct,
  useUpdateProduct,
} from "@/hooks/mutations/use-product-mutations";

export const Route = createFileRoute("/foods")({
  head: () => ({ meta: [{ title: "Foods | Mr. Breado Admin" }] }),
  component: () => <FoodsPage title="Global Foods" source="admin" />,
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
  const categoriesQuery = useQuery({ queryKey: ["admin-food-categories-for-form"], queryFn: async () => {
    const res = await api.get("/admin/categories", { params: { page: 1, perPage: 200, _t: Date.now() } });
    const d = res.data?.data ?? res.data;
    const arr = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.categories) ? d.categories : [];
    return arr
      .filter((x:any) => x.active !== false && String(x.status ?? "ACTIVE").toUpperCase() !== "INACTIVE")
      .map((x:any) => ({ id: String(x._id ?? x.mongoId ?? x.id), name: x.name ?? x.title ?? x.categoryName ?? x.category_name }))
      .filter((x:any) => x.id && x.name);
  }, staleTime: 30000 });
  const [editing, setEditing] = useState<any | null>(null);
  const cuisinesQuery = useQuery({ queryKey:["admin-cuisines-for-form"], queryFn: async()=>{ const res=await api.get("/admin/cuisines"); const d=res.data?.data??res.data; return (Array.isArray(d)?d:(d?.items??[])).filter((x:any)=>x.active!==false&&String(x.status??'Active')!=='Inactive').map((x:any)=>({id:String(x.id??x._id),name:x.name??x.title,slug:x.slug})); }});
  const brandsQuery = useQuery({ queryKey:["admin-brands-for-form"], queryFn: async()=>{ const res=await api.get("/admin/brands"); const d=res.data?.data??res.data; return (Array.isArray(d)?d:(d?.items??[])).filter((x:any)=>x.active!==false).map((x:any)=>({id:String(x.id??x._id),name:x.name,slug:x.slug})); }});
  const blankForm = { cuisineId: "", cuisineName: "", brandId: "", brandName: "", title: "", subtitle: "", description: "", price: "", discountPrice: "", categoryId: "", categoryName: "", foodType: "VEG", stockQuantity: "", isVeg: true, isAvailable: true, isBestseller: false, smallSizeExtra: "", mediumSizeExtra: "", largeSizeExtra: "", cake500gmExtra: "", cake1kgExtra: "", cake15kgExtra: "", cake2kgExtra: "", cakeMessageEnabled: false, cakeMessageCharge: "", customWeightEnabled: false, image: null as File | null };
  const [form, setForm] = useState(blankForm);

  const applyProductToForm = (product: any) => {
    const pick = (...vals: any[]) => vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "") ?? "";
    setForm({
      ...blankForm,
      cuisineId: String(pick(product.cuisineId?._id,product.cuisineId,product.cuisine_id,product.cuisine?.id,product.cuisine?._id)),
      cuisineName: pick(product.cuisineName,product.cuisine_name,product.cuisine?.name),
      brandId: String(pick(product.brandId?._id,product.brandId,product.brand_id,product.brand?.id,product.brand?._id)),
      brandName: pick(product.brandName,product.brand_name,product.brand?.name),
      title: pick(product.title, product.name, product.productName, product.product_name, product.foodName, product.food_name),
      subtitle: pick(product.subtitle, product.shortDescription, product.short_description),
      description: pick(product.description, product.details, product.subtitle),
      price: String(pick(product.price, product.basePrice, product.base_price, product.sellingPrice, product.selling_price)),
      discountPrice: String(pick(product.discountPrice, product.discount_price, product.discountedPrice, product.discounted_price, product.effectivePrice, product.effective_price)),
      categoryId: String(pick(product.categoryId?._id, product.categoryId, product.category_id, product.category?.id, product.category?._id)),
      categoryName: pick(product.categoryName, product.category_name, product.foodCategoryName, product.menuCategoryName, product.category?.name, product.category?.title),
      foodType: pick(product.foodType, product.food_type, product.type, product.categoryName, product.category_name),
      stockQuantity: String(pick(product.stockQuantity, product.stock_quantity, product.stock, product.quantity)),
      isVeg: Boolean(product.isVeg ?? product.veg ?? product.is_veg ?? true),
      isAvailable: Boolean(product.isAvailable ?? product.available ?? product.is_available ?? true),
      isBestseller: Boolean(product.isBestseller ?? product.bestseller ?? product.is_bestseller ?? product.isFeatured ?? product.featured ?? false),
      smallSizeExtra: String(pick(product.smallSizeExtra, product.small_size_extra, product.smallPrice, product.small_price)),
      mediumSizeExtra: String(pick(product.mediumSizeExtra, product.medium_size_extra, product.mediumPrice, product.medium_price)),
      largeSizeExtra: String(pick(product.largeSizeExtra, product.large_size_extra, product.largePrice, product.large_price)),
      cake500gmExtra: String(pick(product.cake500gmExtra, product.cake_500gm_extra, product.cake500gmPrice, product.cake_500gm_price)),
      cake1kgExtra: String(pick(product.cake1kgExtra, product.cake_1kg_extra, product.cake1kgPrice, product.cake_1kg_price)),
      cake15kgExtra: String(pick(product.cake15kgExtra, product.cake1_5kgExtra, product.cake_1_5kg_extra, product.cake15kgPrice, product.cake_1_5kg_price)),
      cake2kgExtra: String(pick(product.cake2kgExtra, product.cake_2kg_extra, product.cake2kgPrice, product.cake_2kg_price)),
      cakeMessageEnabled: Boolean(product.cakeMessageEnabled ?? product.cake_message_enabled ?? false),
      cakeMessageCharge: String(pick(product.cakeMessageCharge, product.cake_message_charge)),
      customWeightEnabled: Boolean(product.customWeightEnabled ?? product.custom_weight_enabled ?? false),
      image: null,
    });
  };

  useEffect(() => {
    let cancelled = false;
    if (editing) {
      applyProductToForm(editing);
      productsService.detail(editing.id, source).then((detail) => {
        if (!cancelled) applyProductToForm({ ...editing, ...detail });
      }).catch(() => {});
    } else {
      setForm(blankForm);
    }
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        {(p.image || p.imageUrl) ? (
                          <img src={p.image || p.imageUrl} alt={p.title} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">🍽️</div>
                        )}
                        <div>
                          <div className="font-medium">{p.title} {p.isFeatured && <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Featured</span>}</div>
                          <div className="text-xs text-muted-foreground">#{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.restaurantName ?? p.restaurant_name ?? (typeof p.restaurant === 'object' ? (p.restaurant?.name ?? '—') : (p.restaurant ?? '—'))}</td>
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
                        <button
                          onClick={() => { setEditing(p); setShowForm(true); }}
                          className="inline-flex items-center gap-1 rounded-md border border-primary/30 px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10"
                          title="Edit food item"
                        >
                          <Pencil className="h-4 w-4" /> Edit
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
        categories={categoriesQuery.data ?? []}
        brands={brandsQuery.data ?? []}
        cuisines={cuisinesQuery.data ?? []}
        onSave={async () => {
          const categoryText = String(form.categoryName || "").toLowerCase();
          const isPizza = categoryText.includes("pizza");
          const isCake = categoryText.includes("cake");
          if (!form.title.trim()) { toast.error("Food title is required."); return; }
          if (!form.categoryId) { toast.error("Select an Admin-created category."); return; }
          if (!form.cuisineId) { toast.error("Select a cuisine."); return; }
          if (isPizza && (!form.smallSizeExtra || !form.mediumSizeExtra || !form.largeSizeExtra)) { toast.error("Enter Small, Medium and Large pizza prices."); return; }
          if (isCake && (!form.cake500gmExtra || !form.cake1kgExtra || !form.cake15kgExtra || !form.cake2kgExtra)) { toast.error("Enter all cake prices from 500gm to 2kg."); return; }
          if (!isPizza && !isCake && !form.price) { toast.error("Enter the food price."); return; }
          if (!editing && !form.image) { toast.error("Select a food image from your device."); return; }
          const positive=(value:any)=>Number(value)>0;
          if (form.discountPrice && (!positive(form.discountPrice) || Number(form.discountPrice)>=Number(isPizza?form.smallSizeExtra:isCake?form.cake500gmExtra:form.price))) { toast.error("Offer price must be positive and lower than the base price."); return; }
          const fd = new FormData();
          fd.append("name", form.title.trim());
          fd.append("title", form.title.trim());
          fd.append("description", form.description.trim());
          fd.append("subtitle", form.subtitle.trim());
          fd.append("categoryId", form.categoryId);
          fd.append("categoryName", form.categoryName);
          fd.append("cuisineId", form.cuisineId);
          fd.append("cuisineName", form.cuisineName);
          if(form.brandId) fd.append("brandId",form.brandId);
          fd.append("foodType", form.isVeg ? "VEG" : "NON_VEG");
          fd.append("active", String(form.isAvailable));
          fd.append("featured", String(form.isBestseller));
          if (form.discountPrice) fd.append("offerPrice", form.discountPrice);
          if (isPizza) {
            fd.append("smallSizePrice", form.smallSizeExtra);
            fd.append("mediumSizePrice", form.mediumSizeExtra);
            fd.append("largeSizePrice", form.largeSizeExtra);
            fd.append("basePrice", form.smallSizeExtra);
          } else if (isCake) {
            fd.append("cake500gmPrice", form.cake500gmExtra);
            fd.append("cake1kgPrice", form.cake1kgExtra);
            fd.append("cake15kgPrice", form.cake15kgExtra);
            fd.append("cake2kgPrice", form.cake2kgExtra);
            fd.append("basePrice", form.cake500gmExtra);
            fd.append("cakeMessageEnabled", String(form.cakeMessageEnabled));
            fd.append("cakeMessageCharge", form.cakeMessageCharge || "0");
            fd.append("customWeightEnabled", String(form.customWeightEnabled));
          } else {
            fd.append("basePrice", form.price);
          }
          if (form.image) fd.append("image", form.image);
          try {
            if (editing) {
              await update.mutateAsync({ id: editing.id, payload: fd, source });
            } else {
              await create.mutateAsync({ payload: fd, source });
            }
            setShowForm(false);
            setEditing(null);
          } catch (e) {
            console.error(e); toast.error((e as any)?.response?.data?.message || (e as any)?.message || "Food could not be saved");
          }
        }}
      />
    </>
  );
}

// Simple modal form (kept inline to keep changes minimal)
function ModalForm({ open, onClose, form, setForm, onSave, editing, categories = [], brands = [], cuisines = [] }: any) {
  if (!open) return null;
  const set = (key: string, value: any) => setForm((s:any) => ({ ...s, [key]: value }));
  const categoryText = String(form.categoryName || "").toLowerCase();
  const isPizza = categoryText.includes("pizza");
  const isCake = categoryText.includes("cake");
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 p-3 pt-[max(12px,env(safe-area-inset-top))] sm:items-center sm:p-4">
      <div className="my-auto max-h-[calc(100dvh-24px)] w-full max-w-4xl overflow-y-auto rounded-xl border border-border bg-card p-4 shadow-card sm:p-5">
        <h3 className="mb-4 text-lg font-semibold">{editing ? "Edit Food" : "Add Item"}</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Title" value={form.title} onChange={(v:any)=>set("title", v)} />
          <Field label="Subtitle" value={form.subtitle} onChange={(v:any)=>set("subtitle", v)} />
          <label className="block text-sm font-medium">Admin Category<select value={form.categoryId} onChange={(e)=>{ const c=categories.find((x:any)=>String(x.id)===e.target.value); setForm((v:any)=>({...v,categoryId:e.target.value,categoryName:c?.name??"",price:"",smallSizeExtra:"",mediumSizeExtra:"",largeSizeExtra:"",cake500gmExtra:"",cake1kgExtra:"",cake15kgExtra:"",cake2kgExtra:""})); }} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"><option value="">Select category</option>{categories.map((c:any) => <option key={c.id} value={c.id}>{c.name}</option>)}</select><span className="mt-1 block text-xs text-muted-foreground">Only categories created by Admin are available.</span></label>
          <label className="block text-sm font-medium">Cuisine<select value={form.cuisineId} onChange={(e)=>{const c=cuisines.find((x:any)=>String(x.id)===e.target.value);setForm((v:any)=>({...v,cuisineId:e.target.value,cuisineName:c?.name??""}));}} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"><option value="">Select cuisine</option>{cuisines.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="block text-sm font-medium">Brand (optional)<select value={form.brandId} onChange={(e)=>{const b=brands.find((x:any)=>String(x.id)===e.target.value);setForm((v:any)=>({...v,brandId:e.target.value,brandName:b?.name??""}));}} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"><option value="">No brand</option>{brands.map((b:any)=><option key={b.id} value={b.id}>{b.name}</option>)}</select><span className="mt-1 block text-xs text-muted-foreground">Brand products appear under this brand in the customer app.</span></label>
          <label className="block text-sm font-medium">Food Type<select value={form.isVeg ? "VEG" : "NON_VEG"} onChange={(e)=>set("isVeg",e.target.value==="VEG")} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"><option value="VEG">Veg</option><option value="NON_VEG">Non-Veg</option></select></label>
          {!isPizza && !isCake && <Field label="Price (₹)" type="number" value={form.price} onChange={(v:any)=>set("price", v)} />}
          <Field label="Offer Price (₹, optional)" type="number" value={form.discountPrice} onChange={(v:any)=>set("discountPrice", v)} />
          {isPizza && <>
            <Field label="Small Price (₹) — Default" type="number" value={form.smallSizeExtra} onChange={(v:any)=>set("smallSizeExtra", v)} />
            <Field label="Medium Price (₹)" type="number" value={form.mediumSizeExtra} onChange={(v:any)=>set("mediumSizeExtra", v)} />
            <Field label="Large Price (₹)" type="number" value={form.largeSizeExtra} onChange={(v:any)=>set("largeSizeExtra", v)} />
          </>}
          {isCake && <>
            <Field label="500gm Price (₹) — Default" type="number" value={form.cake500gmExtra} onChange={(v:any)=>set("cake500gmExtra", v)} />
            <Field label="1kg Price (₹)" type="number" value={form.cake1kgExtra} onChange={(v:any)=>set("cake1kgExtra", v)} />
            <Field label="1.5kg Price (₹)" type="number" value={form.cake15kgExtra} onChange={(v:any)=>set("cake15kgExtra", v)} />
            <Field label="2kg Price (₹)" type="number" value={form.cake2kgExtra} onChange={(v:any)=>set("cake2kgExtra", v)} />
            <Field label="Cake Message Charge (₹)" type="number" value={form.cakeMessageCharge} onChange={(v:any)=>set("cakeMessageCharge", v)} />
          </>}
          <label className="block text-sm font-medium">Image<input type="file" accept="image/*" onChange={(e:any) => set("image", e.target.files?.[0] ?? null)} className="mt-1 w-full rounded-md border border-input px-3 py-2" /></label>
        </div>
        {(isPizza || isCake) && <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm"><strong>{isPizza ? "Pizza size pricing" : "Cake weight pricing"}</strong><div className="mt-1 text-muted-foreground">{isPizza ? "Customer sees Small, Medium and Large. Small is selected by default." : "Customer sees 500gm, 1kg, 1.5kg and 2kg. 500gm is selected by default."}</div></div>}
        <label className="mt-3 block text-sm font-medium">Description<textarea value={form.description} onChange={(e)=>set("description", e.target.value)} className="mt-1 min-h-24 w-full rounded-md border border-input px-3 py-2" /></label>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <Toggle label="Veg" value={form.isVeg} onChange={(v:any)=>set("isVeg", v)} />
          <Toggle label="Available" value={form.isAvailable} onChange={(v:any)=>set("isAvailable", v)} />
          <Toggle label="Bestseller" value={form.isBestseller} onChange={(v:any)=>set("isBestseller", v)} />
          {isCake && <Toggle label="Cake Message" value={form.cakeMessageEnabled} onChange={(v:any)=>set("cakeMessageEnabled", v)} />}
          {isCake && <Toggle label="Custom Weight" value={form.customWeightEnabled} onChange={(v:any)=>set("customWeightEnabled", v)} />}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
          <button onClick={onSave} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
}
function Field({ label, value, onChange, type = "text" }: any) { return <label className="block text-sm font-medium">{label}<input type={type} min={type === "number" ? 0 : undefined} step={type === "number" ? "0.01" : undefined} value={value ?? ""} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2" /></label>; }
function Toggle({ label, value, onChange }: any) { return <label className="flex items-center justify-between rounded-lg border border-border p-3 text-sm font-medium"><span>{label}</span><input type="checkbox" checked={!!value} onChange={(e)=>onChange(e.target.checked)} /></label>; }
