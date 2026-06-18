import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { D as DataTable } from "./data-table-CTmaB7WY.js";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { r as restaurantsService } from "./restaurants.service-Dw86oKrx.js";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Soup, Pencil, Trash2 } from "lucide-react";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const cuisineKeys = {
  all: ["cuisines"],
  list: (p) => ["cuisines", "list", p]
};
function useCuisines() {
  return useQuery({
    queryKey: cuisineKeys.list({ page: 1, perPage: 100 }),
    queryFn: async () => {
      const res = await restaurantsService.list({ page: 1, perPage: 100 });
      const items = res.items ?? [];
      const set = /* @__PURE__ */ new Set();
      items.forEach((r) => {
        if (Array.isArray(r.cuisines)) r.cuisines.forEach((c) => set.add(c));
        else if (r.cuisines) set.add(String(r.cuisines));
      });
      return Array.from(set).map((name, i) => ({ id: i + 1, name, status: "Active", img: "🍽️" }));
    },
    staleTime: 6e4
  });
}
function useCreateCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => payload,
    onSuccess: (newItem) => {
      toast.success("Cuisine created");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old) => {
        if (!old) return old;
        return [newItem, ...old ?? []];
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to create cuisine")
  });
}
function useUpdateCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v) => v,
    onSuccess: (v) => {
      toast.success("Cuisine updated");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old) => {
        if (!old) return old;
        return (old ?? []).map((it) => it.id === v.id ? { ...it, ...v.payload } : it);
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to update cuisine")
  });
}
function useDeleteCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => id,
    onSuccess: (id) => {
      toast.success("Cuisine deleted");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old) => {
        if (!old) return old;
        return (old ?? []).filter((it) => it.id !== id);
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to delete cuisine")
  });
}
function useToggleCuisineStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v) => v,
    onSuccess: (v) => {
      toast.success("Status updated");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old) => {
        if (!old) return old;
        return (old ?? []).map((it) => it.id === v.id ? { ...it, status: v.status } : it);
      });
    },
    onError: (e) => toast.error(e?.message ?? "Failed to update status")
  });
}
const SplitComponent = () => {
  const {
    data,
    isLoading,
    error
  } = useCuisines();
  const items = data ?? [];
  const cols = [{
    key: "img",
    header: "Image",
    render: (r) => /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xl", children: r.img })
  }, {
    key: "name",
    header: "Cuisine Name",
    render: (r) => /* @__PURE__ */ jsx("span", { className: "font-medium", children: r.name })
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.status })
  }, {
    key: "actions",
    header: "Action",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("label", { className: "inline-flex cursor-pointer items-center", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: r.status === "Active", onChange: (e) => toggle.mutate({
          id: r.id,
          status: e.target.checked ? "Active" : "Inactive"
        }), className: "peer sr-only" }),
        /* @__PURE__ */ jsx("div", { className: "relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        setEditing(r);
        setName(r.name);
        setImg(r.img ?? "🍽️");
        setStatus(r.status ?? "Active");
        setIsOpen(true);
      }, className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => del.mutate(r.id), className: "rounded p-1.5 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  }];
  const create = useCreateCuisine();
  const update = useUpdateCuisine();
  const del = useDeleteCuisine();
  const toggle = useToggleCuisineStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [img, setImg] = useState("🍽️");
  const [status, setStatus] = useState("Active");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Cuisine", icon: /* @__PURE__ */ jsx(Soup, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Cuisine"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setEditing(null);
      setName("");
      setImg("🍽️");
      setStatus("Active");
      setIsOpen(true);
    }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Add Cuisine"
    ] }) }),
    /* @__PURE__ */ jsx(DataTable, { data: items, columns: cols, searchableKeys: ["name"], title: "All Cuisines", loading: isLoading }),
    isOpen ? /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded bg-card p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold", children: editing ? "Edit Cuisine" : "Add Cuisine" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Name",
          /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "mt-1 w-full rounded border px-2 py-1" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Emoji/Icon",
          /* @__PURE__ */ jsx("input", { value: img, onChange: (e) => setImg(e.target.value), className: "mt-1 w-full rounded border px-2 py-1" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "text-sm", children: [
          "Status",
          /* @__PURE__ */ jsxs("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "mt-1 w-full rounded border px-2 py-1", children: [
            /* @__PURE__ */ jsx("option", { children: "Active" }),
            /* @__PURE__ */ jsx("option", { children: "Inactive" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "rounded-md px-3 py-1", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            const payload = {
              name,
              img,
              status
            };
            if (editing) update.mutate({
              id: editing.id,
              payload
            });
            else create.mutate({
              id: Date.now(),
              name,
              img,
              status
            });
            setIsOpen(false);
          }, className: "rounded-md bg-primary px-3 py-1 text-white", children: "Save" })
        ] })
      ] })
    ] }) }) : null
  ] });
};
export {
  SplitComponent as component
};
