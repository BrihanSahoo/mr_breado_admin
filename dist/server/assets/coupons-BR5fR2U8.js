import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { r as request, e as endpoints, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";
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
const couponsService = {
  list: (params = {}) => request({
    url: endpoints.admin.coupons,
    method: "GET",
    params: { page: params.page ?? 1, perPage: params.perPage ?? 20 }
  }),
  create: (body) => request({
    url: endpoints.admin.coupons,
    method: "POST",
    data: body
  }),
  update: (id, body) => request({
    url: endpoints.admin.couponById(id),
    method: "PUT",
    data: body
  }),
  remove: (id) => request({
    url: endpoints.admin.couponById(id),
    method: "DELETE"
  }),
  setStatus: (id, enabled) => request({
    url: endpoints.admin.couponStatus(id),
    method: "PATCH",
    data: { enabled }
  })
};
const couponKeys = {
  all: ["coupons"],
  list: (q) => ["coupons", "list", q]
};
function useCoupons(query) {
  return useQuery({
    queryKey: couponKeys.list(query),
    queryFn: () => couponsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => couponsService.create(body),
    onSuccess: () => {
      toast.success("Coupon created");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => couponsService.update(id, body),
    onSuccess: () => {
      toast.success("Coupon updated");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => couponsService.remove(id),
    onSuccess: () => {
      toast.success("Coupon deleted");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useToggleCouponStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }) => couponsService.setStatus(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: couponKeys.all }),
    onError: (e) => toast.error(e.message)
  });
}
function CouponsPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useCoupons({
    page,
    perPage: 20
  });
  const create = useCreateCoupon();
  const update = useUpdateCoupon();
  const del = useDeleteCoupon();
  const toggle = useToggleCouponStatus();
  const items = data?.items ?? [];
  const cols = [{
    key: "code",
    header: "Code",
    render: (r) => /* @__PURE__ */ jsx("span", { className: "rounded bg-primary/10 px-2 py-0.5 font-mono text-primary", children: r.code })
  }, {
    key: "title",
    header: "Title",
    render: (r) => r.title || "—"
  }, {
    key: "type",
    header: "Type",
    render: (r) => r.type || "—"
  }, {
    key: "value",
    header: "Value",
    render: (r) => Number(r.value ?? 0).toFixed(2)
  }, {
    key: "min",
    header: "Min Order",
    render: (r) => `₹${Number(r.minOrderAmount ?? 0).toFixed(2)}`
  }, {
    key: "used",
    header: "Used",
    render: (r) => `${r.usedCount ?? 0}/${r.usageLimit ?? "∞"}`
  }, {
    key: "expires",
    header: "Expires",
    render: (r) => r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—"
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx("button", { onClick: () => toggle.mutate({
      id: r.id,
      enabled: !r.enabled
    }), disabled: toggle.isPending, children: /* @__PURE__ */ jsx(StatusBadge, { status: r.enabled ? "Active" : "Inactive" }) })
  }, {
    key: "actions",
    header: "Actions",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => {
        setEditing(r);
        setIsNew(false);
      }, className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => {
        if (window.confirm("Delete this coupon?")) del.mutate(r.id);
      }, disabled: del.isPending, className: "rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Coupons", icon: /* @__PURE__ */ jsx(Tag, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Offer Management"
    }, {
      label: "Coupons"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setEditing({
        id: 0,
        code: "",
        value: 0
      });
      setIsNew(true);
    }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Add Coupon"
    ] }) }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} coupons`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, rowKey: (r) => r.id }),
    editing && /* @__PURE__ */ jsx(CouponDialog, { coupon: editing, isNew, submitting: create.isPending || update.isPending, onClose: () => setEditing(null), onSubmit: (body) => {
      const action = isNew ? create.mutateAsync(body) : update.mutateAsync({
        id: editing.id,
        body
      });
      action.then(() => setEditing(null)).catch(() => {
      });
    } })
  ] });
}
function CouponDialog({
  coupon,
  isNew,
  onClose,
  onSubmit,
  submitting
}) {
  const [form, setForm] = useState({
    code: coupon.code || "",
    title: coupon.title || "",
    description: coupon.description || "",
    type: coupon.type || "PERCENT",
    value: coupon.value ?? 0,
    minOrderAmount: coupon.minOrderAmount ?? 0,
    maxDiscountAmount: coupon.maxDiscountAmount ?? 0,
    usageLimit: coupon.usageLimit ?? 0,
    perUserLimit: coupon.perUserLimit ?? 0,
    expiresAt: coupon.expiresAt,
    enabled: coupon.enabled ?? true
  });
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-card", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-3 text-lg font-semibold", children: isNew ? "New Coupon" : "Edit Coupon" }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Code (e.g. SAVE10)", value: form.code, onChange: (e) => setForm({
        ...form,
        code: e.target.value.toUpperCase()
      }) }),
      /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Title", value: form.title || "", onChange: (e) => setForm({
        ...form,
        title: e.target.value
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs("select", { className: "rounded-md border border-border bg-background px-3 py-2 text-sm", value: form.type || "PERCENT", onChange: (e) => setForm({
          ...form,
          type: e.target.value
        }), children: [
          /* @__PURE__ */ jsx("option", { value: "PERCENT", children: "PERCENT" }),
          /* @__PURE__ */ jsx("option", { value: "FLAT", children: "FLAT" }),
          /* @__PURE__ */ jsx("option", { value: "DELIVERY", children: "DELIVERY" })
        ] }),
        /* @__PURE__ */ jsx("input", { type: "number", className: "rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Value", value: form.value, onChange: (e) => setForm({
          ...form,
          value: Number(e.target.value)
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsx("input", { type: "number", className: "rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Min order", value: form.minOrderAmount ?? 0, onChange: (e) => setForm({
          ...form,
          minOrderAmount: Number(e.target.value)
        }) }),
        /* @__PURE__ */ jsx("input", { type: "number", className: "rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Max discount", value: form.maxDiscountAmount ?? 0, onChange: (e) => setForm({
          ...form,
          maxDiscountAmount: Number(e.target.value)
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsx("input", { type: "number", className: "rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Usage limit", value: form.usageLimit ?? 0, onChange: (e) => setForm({
          ...form,
          usageLimit: Number(e.target.value)
        }) }),
        /* @__PURE__ */ jsx("input", { type: "number", className: "rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Per user limit", value: form.perUserLimit ?? 0, onChange: (e) => setForm({
          ...form,
          perUserLimit: Number(e.target.value)
        }) })
      ] }),
      /* @__PURE__ */ jsx("input", { type: "datetime-local", className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", value: form.expiresAt ? form.expiresAt.slice(0, 16) : "", onChange: (e) => setForm({
        ...form,
        expiresAt: e.target.value ? new Date(e.target.value).toISOString() : void 0
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
      /* @__PURE__ */ jsx("button", { disabled: submitting || !form.code, onClick: () => onSubmit(form), className: "rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50", children: submitting ? "Saving…" : "Save" })
    ] })
  ] }) });
}
export {
  CouponsPage as component
};
