import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { r as request, e as endpoints, P as PageHeader } from "./router-1xz68c6T.js";
import { Plus, Image, Loader2, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const bannersService = {
  list: (params = {}) => request({
    url: endpoints.admin.banners,
    method: "GET",
    params: { page: params.page ?? 1, perPage: params.perPage ?? 20 }
  }),
  create: (body) => request({
    url: endpoints.admin.banners,
    method: "POST",
    data: body
  }),
  update: (id, body) => request({
    url: endpoints.admin.bannerById(id),
    method: "PUT",
    data: body
  }),
  remove: (id) => request({
    url: endpoints.admin.bannerById(id),
    method: "DELETE"
  }),
  setStatus: (id, enabled) => request({
    url: endpoints.admin.bannerStatus(id),
    method: "PATCH",
    data: { enabled }
  })
};
const bannerKeys = {
  all: ["banners"],
  list: (q) => ["banners", "list", q]
};
function useBanners(query) {
  return useQuery({
    queryKey: bannerKeys.list(query),
    queryFn: () => bannersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => bannersService.create(body),
    onSuccess: () => {
      toast.success("Banner created");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => bannersService.update(id, body),
    onSuccess: () => {
      toast.success("Banner updated");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => bannersService.remove(id),
    onSuccess: () => {
      toast.success("Banner deleted");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useToggleBannerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }) => bannersService.setStatus(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: bannerKeys.all }),
    onError: (e) => toast.error(e.message)
  });
}
function emptyBanner() {
  return {
    title: "",
    subtitle: "",
    image: "",
    enabled: true
  };
}
function BannersPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useBanners({
    page,
    perPage: 12
  });
  const create = useCreateBanner();
  const update = useUpdateBanner();
  const del = useDeleteBanner();
  const toggle = useToggleBannerStatus();
  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Banner Management", icon: /* @__PURE__ */ jsx(Image, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Banners"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setEditing({
        ...emptyBanner(),
        id: 0
      });
      setIsNew(true);
    }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Upload Banner"
    ] }) }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({
      length: 6
    }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-56 animate-pulse rounded-xl bg-primary/5" }, i)) }) : error ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive", children: error.message }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      isFetching && /* @__PURE__ */ jsxs("div", { className: "mb-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "inline h-3 w-3 animate-spin" }),
        " Refreshing…"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground", children: "No banners yet" }) : items.map((b) => /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card shadow-card", children: [
        b.image ? /* @__PURE__ */ jsx("img", { src: b.image, alt: b.title, className: "h-40 w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-40 items-center justify-center gradient-primary text-6xl", children: "🎯" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: b.title }),
            b.subtitle && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: b.subtitle }),
            /* @__PURE__ */ jsxs("label", { className: "mt-2 inline-flex cursor-pointer items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!b.enabled, disabled: toggle.isPending, onChange: (e) => toggle.mutate({
                id: b.id,
                enabled: e.target.checked
              }) }),
              /* @__PURE__ */ jsx("span", { className: b.enabled ? "text-success" : "text-muted-foreground", children: b.enabled ? "Active" : "Inactive" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => {
              setEditing(b);
              setIsNew(false);
            }, className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              if (window.confirm("Delete this banner?")) del.mutate(b.id);
            }, disabled: del.isPending, className: "rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] })
      ] }, b.id)) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Page ",
          page,
          " of ",
          totalPages,
          " · ",
          data?.total ?? 0,
          " banners"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page <= 1 || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsx(BannerDialog, { banner: editing, isNew, onClose: () => setEditing(null), submitting: create.isPending || update.isPending, onSubmit: (body) => {
      const action = isNew ? create.mutateAsync(body) : update.mutateAsync({
        id: editing.id,
        body
      });
      action.then(() => setEditing(null)).catch(() => {
      });
    } })
  ] });
}
function BannerDialog({
  banner,
  isNew,
  onClose,
  onSubmit,
  submitting
}) {
  const [form, setForm] = useState({
    title: banner.title || "",
    subtitle: banner.subtitle || "",
    description: banner.description || "",
    image: banner.image || "",
    position: banner.position || "",
    enabled: banner.enabled ?? true
  });
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-card", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold", children: isNew ? "New Banner" : "Edit Banner" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Title", value: form.title, onChange: (e) => setForm({
        ...form,
        title: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Subtitle", value: form.subtitle || "", onChange: (e) => setForm({
        ...form,
        subtitle: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Image URL", value: form.image || "", onChange: (e) => setForm({
        ...form,
        image: e.target.value
      }) }),
      /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Position", value: form.position || "", onChange: (e) => setForm({
        ...form,
        position: e.target.value
      }) }),
      /* @__PURE__ */ jsx("textarea", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Description", rows: 3, value: form.description || "", onChange: (e) => setForm({
        ...form,
        description: e.target.value
      }) }),
      /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!form.enabled, onChange: (e) => setForm({
          ...form,
          enabled: e.target.checked
        }) }),
        "Enabled"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-md border border-border px-3 py-1.5 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { disabled: submitting || !form.title, onClick: () => onSubmit(form), className: "rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50", children: submitting ? "Saving…" : "Save" })
    ] })
  ] }) });
}
export {
  BannersPage as component
};
