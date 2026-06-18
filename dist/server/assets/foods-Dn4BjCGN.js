import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { u as useProducts, h as useDeleteProduct, i as useToggleProductAvailability, j as useCreateProduct, k as useUpdateProduct, a as api, p as productsService, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { Plus, FileSpreadsheet, Download, Utensils, Loader2, Star, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function FoodsPage({
  title,
  source = "admin"
}) {
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useProducts({
    page,
    perPage: 20,
    source
  });
  const del = useDeleteProduct();
  const toggle = useToggleProductAvailability();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;
  const [showForm, setShowForm] = useState(false);
  const categoriesQuery = useQuery({
    queryKey: ["admin-food-categories-for-form"],
    queryFn: async () => {
      const res = await api.get("/admin/categories", {
        params: {
          page: 1,
          perPage: 200,
          _t: Date.now()
        }
      });
      const d = res.data?.data ?? res.data;
      const arr = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.categories) ? d.categories : [];
      return arr.filter((x) => x.active !== false && String(x.status ?? "ACTIVE").toUpperCase() !== "INACTIVE").map((x) => ({
        id: String(x._id ?? x.mongoId ?? x.id),
        name: x.name ?? x.title ?? x.categoryName ?? x.category_name
      })).filter((x) => x.id && x.name);
    },
    staleTime: 3e4
  });
  const [editing, setEditing] = useState(null);
  const blankForm = {
    title: "",
    subtitle: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    categoryName: "",
    foodType: "VEG",
    stockQuantity: "",
    isVeg: true,
    isAvailable: true,
    isBestseller: false,
    smallSizeExtra: "",
    mediumSizeExtra: "",
    largeSizeExtra: "",
    cake500gmExtra: "",
    cake1kgExtra: "",
    cake15kgExtra: "",
    cake2kgExtra: "",
    cakeMessageEnabled: false,
    cakeMessageCharge: "",
    customWeightEnabled: false,
    image: null
  };
  const [form, setForm] = useState(blankForm);
  const applyProductToForm = (product) => {
    const pick = (...vals) => vals.find((v) => v !== void 0 && v !== null && String(v).trim() !== "") ?? "";
    setForm({
      ...blankForm,
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
      image: null
    });
  };
  useEffect(() => {
    let cancelled = false;
    if (editing) {
      applyProductToForm(editing);
      productsService.detail(editing.id, source).then((detail) => {
        if (!cancelled) applyProductToForm({
          ...editing,
          ...detail
        });
      }).catch(() => {
      });
    } else {
      setForm(blankForm);
    }
    return () => {
      cancelled = true;
    };
  }, [editing]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title, icon: /* @__PURE__ */ jsx(Utensils, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Menu Management"
    }, {
      label: title
    }], actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => {
        setEditing(null);
        setShowForm(true);
      }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Add Item"
      ] }),
      source === "admin" && /* @__PURE__ */ jsxs("button", { onClick: () => productsService.downloadTemplate(), className: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent", children: [
        /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-4 w-4" }),
        "Template"
      ] }),
      source === "admin" && /* @__PURE__ */ jsxs("button", { onClick: () => productsService.exportAdminProducts(), className: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        "Export"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-border p-4", children: /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold", children: [
        data?.total ?? 0,
        " products ",
        isFetching && /* @__PURE__ */ jsx(Loader2, { className: "ml-1 inline h-3 w-3 animate-spin" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Food" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Restaurant" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Price" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Availability" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: isLoading ? Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-4", children: /* @__PURE__ */ jsx("div", { className: "h-10 w-full animate-pulse rounded bg-primary/10" }) }) }, i)) : error ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-16 text-center text-destructive", children: error.message }) }) : items.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-16 text-center text-muted-foreground", children: "No products yet" }) }) : items.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/60 hover:bg-accent/30", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            p.image || p.imageUrl ? /* @__PURE__ */ jsx("img", { src: p.image || p.imageUrl, alt: p.title, className: "h-10 w-10 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-accent", children: "🍽️" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
                p.title,
                " ",
                p.isFeatured && /* @__PURE__ */ jsx("span", { className: "ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800", children: "Featured" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "#",
                p.id
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: p.restaurantName ?? p.restaurant_name ?? (typeof p.restaurant === "object" ? p.restaurant?.name ?? "—" : p.restaurant ?? "—") }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 font-semibold", children: [
            "₹",
            Number(p.effectivePrice ?? p.effective_price ?? p.price ?? 0).toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("button", { onClick: () => toggle.mutate({
            id: p.id,
            isAvailable: !p.isAvailable,
            source
          }), disabled: toggle.isPending, children: /* @__PURE__ */ jsx(StatusBadge, { status: p.isAvailable ? "Active" : "Inactive" }) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => update.mutate({
              id: p.id,
              payload: {
                featured: !p.isFeatured
              },
              source
            }), className: "rounded p-1.5 text-amber-600 hover:bg-amber-100", title: p.isFeatured ? "Unfeature" : "Mark as featured", children: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("button", { onClick: () => {
              setEditing(p);
              setShowForm(true);
            }, className: "inline-flex items-center gap-1 rounded-md border border-primary/30 px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10", title: "Edit food item", children: [
              /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
              " Edit"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              if (window.confirm(`Delete "${p.title}"?`)) del.mutate({
                id: p.id,
                source
              });
            }, disabled: del.isPending, className: "rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, p.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Page ",
          data?.page ?? page,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ModalForm, { open: showForm, onClose: () => {
      setShowForm(false);
      setEditing(null);
    }, form, setForm, editing, categories: categoriesQuery.data ?? [], onSave: async () => {
      const categoryText = String(form.categoryName || "").toLowerCase();
      const isPizza = categoryText.includes("pizza");
      const isCake = categoryText.includes("cake");
      if (!form.title.trim()) return window.alert("Food title is required.");
      if (!form.categoryId) return window.alert("Select an Admin-created category.");
      if (isPizza && (!form.smallSizeExtra || !form.mediumSizeExtra || !form.largeSizeExtra)) return window.alert("Enter Small, Medium and Large pizza prices.");
      if (isCake && (!form.cake500gmExtra || !form.cake1kgExtra || !form.cake15kgExtra || !form.cake2kgExtra)) return window.alert("Enter all cake prices from 500gm to 2kg.");
      if (!isPizza && !isCake && !form.price) return window.alert("Enter the food price.");
      const fd = new FormData();
      fd.append("name", form.title.trim());
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("subtitle", form.subtitle.trim());
      fd.append("categoryId", form.categoryId);
      fd.append("categoryName", form.categoryName);
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
          await update.mutateAsync({
            id: editing.id,
            payload: fd,
            source
          });
        } else {
          await create.mutateAsync({
            payload: fd,
            source
          });
        }
        setShowForm(false);
        setEditing(null);
      } catch (e) {
        console.error(e);
      }
    } })
  ] });
}
function ModalForm({
  open,
  onClose,
  form,
  setForm,
  onSave,
  editing,
  categories = []
}) {
  if (!open) return null;
  const set = (key, value) => setForm((s) => ({
    ...s,
    [key]: value
  }));
  const categoryText = String(form.categoryName || "").toLowerCase();
  const isPizza = categoryText.includes("pizza");
  const isCake = categoryText.includes("cake");
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl rounded-xl border border-border bg-card p-5 shadow-card", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold", children: editing ? "Edit Food" : "Add Item" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Title", value: form.title, onChange: (v) => set("title", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Subtitle", value: form.subtitle, onChange: (v) => set("subtitle", v) }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
        "Admin Category",
        /* @__PURE__ */ jsxs("select", { value: form.categoryId, onChange: (e) => {
          const c = categories.find((x) => String(x.id) === e.target.value);
          setForm((v) => ({
            ...v,
            categoryId: e.target.value,
            categoryName: c?.name ?? "",
            price: "",
            smallSizeExtra: "",
            mediumSizeExtra: "",
            largeSizeExtra: "",
            cake500gmExtra: "",
            cake1kgExtra: "",
            cake15kgExtra: "",
            cake2kgExtra: ""
          }));
        }, className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select category" }),
          categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-muted-foreground", children: "Only categories created by Admin are available." })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
        "Food Type",
        /* @__PURE__ */ jsxs("select", { value: form.isVeg ? "VEG" : "NON_VEG", onChange: (e) => set("isVeg", e.target.value === "VEG"), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2", children: [
          /* @__PURE__ */ jsx("option", { value: "VEG", children: "Veg" }),
          /* @__PURE__ */ jsx("option", { value: "NON_VEG", children: "Non-Veg" })
        ] })
      ] }),
      !isPizza && !isCake && /* @__PURE__ */ jsx(Field, { label: "Price (₹)", type: "number", value: form.price, onChange: (v) => set("price", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Offer Price (₹, optional)", type: "number", value: form.discountPrice, onChange: (v) => set("discountPrice", v) }),
      isPizza && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Field, { label: "Small Price (₹) — Default", type: "number", value: form.smallSizeExtra, onChange: (v) => set("smallSizeExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "Medium Price (₹)", type: "number", value: form.mediumSizeExtra, onChange: (v) => set("mediumSizeExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "Large Price (₹)", type: "number", value: form.largeSizeExtra, onChange: (v) => set("largeSizeExtra", v) })
      ] }),
      isCake && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Field, { label: "500gm Price (₹) — Default", type: "number", value: form.cake500gmExtra, onChange: (v) => set("cake500gmExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "1kg Price (₹)", type: "number", value: form.cake1kgExtra, onChange: (v) => set("cake1kgExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "1.5kg Price (₹)", type: "number", value: form.cake15kgExtra, onChange: (v) => set("cake15kgExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "2kg Price (₹)", type: "number", value: form.cake2kgExtra, onChange: (v) => set("cake2kgExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "Cake Message Charge (₹)", type: "number", value: form.cakeMessageCharge, onChange: (v) => set("cakeMessageCharge", v) })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
        "Image",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: (e) => set("image", e.target.files?.[0] ?? null), className: "mt-1 w-full rounded-md border border-input px-3 py-2" })
      ] })
    ] }),
    (isPizza || isCake) && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm", children: [
      /* @__PURE__ */ jsx("strong", { children: isPizza ? "Pizza size pricing" : "Cake weight pricing" }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-muted-foreground", children: isPizza ? "Customer sees Small, Medium and Large. Small is selected by default." : "Customer sees 500gm, 1kg, 1.5kg and 2kg. 500gm is selected by default." })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "mt-3 block text-sm font-medium", children: [
      "Description",
      /* @__PURE__ */ jsx("textarea", { value: form.description, onChange: (e) => set("description", e.target.value), className: "mt-1 min-h-24 w-full rounded-md border border-input px-3 py-2" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-2 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Veg", value: form.isVeg, onChange: (v) => set("isVeg", v) }),
      /* @__PURE__ */ jsx(Toggle, { label: "Available", value: form.isAvailable, onChange: (v) => set("isAvailable", v) }),
      /* @__PURE__ */ jsx(Toggle, { label: "Bestseller", value: form.isBestseller, onChange: (v) => set("isBestseller", v) }),
      isCake && /* @__PURE__ */ jsx(Toggle, { label: "Cake Message", value: form.cakeMessageEnabled, onChange: (v) => set("cakeMessageEnabled", v) }),
      isCake && /* @__PURE__ */ jsx(Toggle, { label: "Custom Weight", value: form.customWeightEnabled, onChange: (v) => set("customWeightEnabled", v) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm hover:bg-accent", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { onClick: onSave, className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Save" })
    ] })
  ] }) });
}
function Field({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("input", { type, min: type === "number" ? 0 : void 0, step: type === "number" ? "0.01" : void 0, value: value ?? "", onChange: (e) => onChange(e.target.value), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2" })
  ] });
}
function Toggle({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between rounded-lg border border-border p-3 text-sm font-medium", children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!value, onChange: (e) => onChange(e.target.checked) })
  ] });
}
const SplitComponent = () => /* @__PURE__ */ jsx(FoodsPage, { title: "Global Foods", source: "admin" });
export {
  FoodsPage,
  SplitComponent as component
};
