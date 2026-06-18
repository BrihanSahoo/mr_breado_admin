import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { r as request, e as endpoints, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { D as DataTable } from "./data-table-CTmaB7WY.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Layers, Tag, Pencil, Trash2 } from "lucide-react";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function imageString(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const row = value;
    return String(row.url ?? row.secureUrl ?? row.secure_url ?? row.path ?? "");
  }
  return "";
}
function normalizeCategory(row) {
  const image = imageString(row?.imageUrl ?? row?.image ?? row?.icon ?? row?.banner);
  return {
    ...row,
    id: String(row?.id ?? row?._id ?? ""),
    title: row?.title ?? row?.name ?? "Category",
    name: row?.name ?? row?.title ?? "Category",
    image,
    imageUrl: image,
    icon: image,
    status: row?.status ?? (row?.active === false ? "INACTIVE" : "ACTIVE"),
    active: row?.active ?? row?.enabled ?? row?.status !== "INACTIVE",
    enabled: row?.enabled ?? row?.active ?? row?.status !== "INACTIVE"
  };
}
async function normalizePage(promise) {
  const data = await promise;
  const rows = Array.isArray(data) ? data : data?.items ?? data?.categories ?? [];
  return { ...data, items: rows.map(normalizeCategory), total: data?.total ?? rows.length };
}
function normalizeCategoryPayload(payload) {
  const imageValue2 = imageString(payload.imageUrl ?? payload.image ?? payload.icon ?? payload.banner);
  return {
    ...payload,
    name: payload.name ?? payload.title,
    image: typeof imageValue2 === "string" && imageValue2 ? { url: imageValue2 } : imageValue2,
    active: payload.active ?? payload.enabled ?? payload.status === "ACTIVE"
  };
}
const categoriesService = {
  list: (page = 1, perPage = 50) => normalizePage(request({
    url: endpoints.admin.categories,
    method: "GET",
    params: { page, per_page: perPage, perPage }
  })),
  summary: () => request({
    url: endpoints.admin.categorySummary,
    method: "GET"
  }),
  subCategories: (page = 1, perPage = 50) => normalizePage(request({
    url: endpoints.admin.publicSubCategories,
    method: "GET",
    params: { page, per_page: perPage, perPage }
  })),
  foodCategories: (page = 1, perPage = 50) => normalizePage(request({
    url: endpoints.admin.foodCategoriesAdmin,
    method: "GET",
    params: { page, per_page: perPage, perPage }
  })),
  create: (payload) => request({
    url: endpoints.admin.categories,
    method: "POST",
    data: normalizeCategoryPayload(payload)
  }),
  update: (id, payload) => request({
    url: endpoints.admin.categoryById(id),
    method: "PUT",
    data: normalizeCategoryPayload(payload)
  }),
  remove: (id) => request({
    url: endpoints.admin.categoryById(id),
    method: "DELETE"
  }),
  setStatus: (id, status) => request({
    url: endpoints.admin.categoryStatus(id),
    method: "PATCH",
    data: { status, active: status === "ACTIVE", enabled: status === "ACTIVE" }
  })
};
const categoryKeys = {
  all: ["categories"],
  list: (p) => ["categories", "list", p],
  summary: () => ["categories", "summary"]
};
function useCategories(page = 1, perPage = 50) {
  return useQuery({
    queryKey: categoryKeys.list({ page, perPage }),
    queryFn: () => categoriesService.list(page, perPage),
    staleTime: 3e4
  });
}
function useCategorySummary() {
  return useQuery({
    queryKey: categoryKeys.summary(),
    queryFn: categoriesService.summary,
    staleTime: 3e4
  });
}
function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => categoriesService.create(payload),
    onSuccess: () => {
      toast.success("Category created");
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => categoriesService.update(id, payload),
    onSuccess: () => {
      toast.success("Category updated");
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoriesService.remove(id),
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useToggleCategoryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => categoriesService.setStatus(id, status),
    onSuccess: () => {
      toast.success("Category status updated");
      qc.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function imageValue(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") return String(value.url ?? value.secureUrl ?? "");
  return "";
}
function CategoriesPage() {
  const {
    data,
    isLoading,
    error
  } = useCategories();
  const {
    data: summary
  } = useCategorySummary();
  const items = data?.items ?? [];
  const del = useDeleteCategory();
  const toggle = useToggleCategoryStatus();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [slug, setSlug] = useState("");
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const readImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result || "");
      setIcon(value);
      setPreview(value);
    };
    reader.readAsDataURL(file);
  };
  const cols = [{
    key: "img",
    header: "Image",
    render: (r) => {
      const img = imageValue(r.imageUrl ?? r.image ?? r.icon);
      return img && (img.startsWith("http") || img.startsWith("data:")) ? /* @__PURE__ */ jsx("img", { src: img, className: "h-10 w-10 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xl", children: img || "🍽️" });
    }
  }, {
    key: "name",
    header: "Name",
    render: (r) => /* @__PURE__ */ jsx("span", { className: "font-medium", children: r.title ?? r.name })
  }, {
    key: "sub",
    header: "Sub Categories",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-info/15 px-2 py-0.5 text-xs text-info", children: [
      /* @__PURE__ */ jsx(Tag, { className: "h-3 w-3" }),
      r.subCategoryCount ?? r.productCount ?? 0
    ] })
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.status })
  }, {
    key: "actions",
    header: "Action",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("label", { className: "inline-flex cursor-pointer items-center", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: r.status === "ACTIVE" || r.active === true || r.enabled === true, onChange: (e) => toggle.mutate({
          id: r.id,
          status: e.target.checked ? "ACTIVE" : "INACTIVE"
        }), className: "peer sr-only" }),
        /* @__PURE__ */ jsx("div", { className: "relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        setEditing(r);
        setTitle(r.title ?? r.name ?? "");
        setSlug(r.slug ?? "");
        setIcon(imageValue(r.imageUrl ?? r.image ?? r.icon));
        setPreview(imageValue(r.imageUrl ?? r.image ?? r.icon));
        setStatus(r.status ?? "ACTIVE");
        setIsOpen(true);
      }, className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => del.mutate(r.id), className: "rounded p-1.5 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Categories", icon: /* @__PURE__ */ jsx(Layers, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Categories"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setEditing(null);
      setTitle("");
      setSlug("");
      setIcon("");
      setPreview("");
      setStatus("ACTIVE");
      setIsOpen(true);
    }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Add Category"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [{
      label: "Total Categories",
      value: summary?.totalCategories ?? data?.total ?? items.length,
      color: "bg-primary/15 text-primary"
    }, {
      label: "Active",
      value: summary?.activeCategories ?? items.filter((i) => i.active || i.enabled || i.status === "ACTIVE").length,
      color: "bg-success/15 text-success"
    }, {
      label: "Inactive",
      value: summary?.inactiveCategories ?? items.filter((i) => i.status === "INACTIVE" || i.active === false || i.enabled === false).length,
      color: "bg-destructive/15 text-destructive"
    }, {
      label: "Sub Categories",
      value: summary?.totalSubCategories ?? items.reduce((sum, i) => sum + Number(i.subCategoryCount ?? i.productCount ?? 0), 0),
      color: "bg-info/15 text-info"
    }].map((s) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: `flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`, children: /* @__PURE__ */ jsx(Layers, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.label }),
        /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: s.value })
      ] })
    ] }, s.label)) }),
    /* @__PURE__ */ jsx(DataTable, { data: items, columns: cols, searchableKeys: ["name"], title: "All Categories", subtitle: `${data?.total ?? 0} categories`, loading: isLoading }),
    isOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded bg-card p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold", children: editing ? "Edit Category" : "Add Category" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Name",
          /* @__PURE__ */ jsx("input", { value: title, onChange: (e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
          }, className: "mt-1 w-full rounded border px-2 py-1" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Slug",
          /* @__PURE__ */ jsx("input", { value: slug, onChange: (e) => setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")), className: "mt-1 w-full rounded border px-2 py-1", placeholder: "pizza, cakes, sandwiches" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Category Image from device",
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: readImageFile, className: "mt-1 w-full rounded border px-2 py-1" })
        ] }),
        preview ? /* @__PURE__ */ jsx("img", { src: preview, className: "h-24 w-24 rounded-xl object-cover border" }) : null,
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Image fallback URL or emoji",
          /* @__PURE__ */ jsx("input", { value: icon && !icon.startsWith("data:") ? icon : "", onChange: (e) => {
            setIcon(e.target.value);
            setPreview(e.target.value);
          }, className: "mt-1 w-full rounded border px-2 py-1", placeholder: "optional fallback only" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Status",
          /* @__PURE__ */ jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "mt-1 w-full rounded border px-2 py-1", children: [
            /* @__PURE__ */ jsx("option", { value: "ACTIVE", children: "ACTIVE" }),
            /* @__PURE__ */ jsx("option", { value: "INACTIVE", children: "INACTIVE" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "rounded-md px-3 py-1", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            const payload = {
              title,
              name: title,
              slug,
              icon,
              image: icon,
              imageUrl: icon,
              dataUrl: icon,
              status,
              active: status === "ACTIVE",
              enabled: status === "ACTIVE"
            };
            if (editing) {
              update.mutate({
                id: editing.id,
                payload
              });
            } else {
              create.mutate(payload);
            }
            setIsOpen(false);
          }, className: "rounded-md bg-primary px-3 py-1 text-white", children: "Save" })
        ] })
      ] })
    ] }) }) : null
  ] });
}
export {
  CategoriesPage as component
};
