import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { r as request, e as endpoints, P as PageHeader } from "./router-1xz68c6T.js";
import { Plus, Gift, Loader2, Pencil, Trash2, ChevronLeft, ChevronRight, Upload, TicketPercent, Truck } from "lucide-react";
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
const offersService = {
  list: (params = {}) => request({
    url: endpoints.admin.offers,
    method: "GET",
    params: { page: params.page ?? 1, perPage: params.perPage ?? 20 }
  }),
  create: (body) => request({
    url: endpoints.admin.offers,
    method: "POST",
    data: body
  }),
  update: (id, body) => request({
    url: endpoints.admin.offerById(id),
    method: "PUT",
    data: body
  }),
  remove: (id) => request({
    url: endpoints.admin.offerById(id),
    method: "DELETE"
  }),
  toggleStatus: (id) => request({
    url: endpoints.admin.offerStatus(id),
    method: "PATCH"
  })
};
const offerKeys = {
  all: ["offers"],
  list: (q) => ["offers", "list", q]
};
function useOffers(query) {
  return useQuery({
    queryKey: offerKeys.list(query),
    queryFn: () => offersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => offersService.create(body),
    onSuccess: () => {
      toast.success("Offer created");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => offersService.update(id, body),
    onSuccess: () => {
      toast.success("Offer updated");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => offersService.remove(id),
    onSuccess: () => {
      toast.success("Offer deleted");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useToggleOfferStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => offersService.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: offerKeys.all }),
    onError: (e) => toast.error(e.message)
  });
}
function OffersPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useOffers({
    page,
    perPage: 12
  });
  const create = useCreateOffer();
  const update = useUpdateOffer();
  const del = useDeleteOffer();
  const toggle = useToggleOfferStatus();
  const raw = data;
  const items = Array.isArray(raw) ? raw : raw?.items ?? [];
  const totalPages = raw?.total_pages ?? 1;
  const total = raw?.total ?? items.length;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Offers", icon: /* @__PURE__ */ jsx(Gift, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Offer Management"
    }, {
      label: "Offers"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: () => {
      setEditing({
        id: 0
      });
      setIsNew(true);
    }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Add Offer"
    ] }) }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: Array.from({
      length: 8
    }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-56 animate-pulse rounded-xl bg-primary/5" }, i)) }) : error ? /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-destructive", children: error.message }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      isFetching && /* @__PURE__ */ jsxs("div", { className: "mb-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "inline h-3 w-3 animate-spin" }),
        " Refreshing…"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: items.length === 0 ? /* @__PURE__ */ jsx("div", { className: "col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground", children: "No offers yet" }) : items.map((o) => {
        const img = o.imageUrl || o.image || o.banner;
        const enabled = o.enabled ?? o.active ?? true;
        return /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card shadow-card", children: [
          img ? /* @__PURE__ */ jsx("img", { src: img, alt: o.title || o.name || "", className: "h-32 w-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-32 items-center justify-center gradient-primary text-5xl", children: "🎁" }),
          /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: o.title || o.name }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 line-clamp-2 text-xs text-muted-foreground", children: o.description || o.subtitle }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => toggle.mutate(o.id), disabled: toggle.isPending, className: `rounded-full px-2 py-0.5 text-xs ${enabled ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: enabled ? "Active" : "Inactive" }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  setEditing(o);
                  setIsNew(false);
                }, className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (window.confirm("Delete this offer?")) del.mutate(o.id);
                }, disabled: del.isPending, className: "rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] })
            ] })
          ] })
        ] }, o.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Page ",
          page,
          " of ",
          totalPages,
          " · ",
          total,
          " offers"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page <= 1 || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    editing && /* @__PURE__ */ jsx(OfferDialog, { offer: editing, isNew, submitting: create.isPending || update.isPending, onClose: () => setEditing(null), onSubmit: (body) => {
      const action = isNew ? create.mutateAsync(body) : update.mutateAsync({
        id: editing.id,
        body
      });
      action.then(() => setEditing(null)).catch(() => {
      });
    } })
  ] });
}
function OfferDialog({
  offer,
  isNew,
  onClose,
  onSubmit,
  submitting
}) {
  const [form, setForm] = useState({
    title: offer.title || offer.name || "",
    subtitle: offer.subtitle || "",
    description: offer.description || "",
    imageUrl: offer.imageUrl || offer.image || offer.banner || "",
    couponEnabled: offer.couponEnabled ?? Boolean(offer.couponCode),
    couponCode: offer.couponCode || "",
    discountType: offer.discountType || "PERCENT",
    discountValue: offer.discountValue ?? 0,
    minOrderAmount: offer.minOrderAmount ?? 0,
    maxDiscount: offer.maxDiscount ?? 0,
    validFrom: offer.validFrom || "",
    validTo: offer.validTo || "",
    enabled: offer.enabled ?? true
  });
  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({
      ...f,
      imageUrl: String(reader.result || "")
    }));
    reader.readAsDataURL(file);
  };
  const isFreeDelivery = form.discountType === "FREE_DELIVERY";
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/25 bg-card p-6 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold", children: isNew ? "Create Business Offer" : "Edit Business Offer" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "One practical offer section with banner, optional coupon, duration and free-delivery support." })
      ] }),
      /* @__PURE__ */ jsx(Gift, { className: "h-7 w-7 text-primary" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Offer title", value: form.title || "", onChange: (e) => setForm({
          ...form,
          title: e.target.value
        }) }),
        /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Short subtitle", value: form.subtitle || "", onChange: (e) => setForm({
          ...form,
          subtitle: e.target.value
        }) }),
        /* @__PURE__ */ jsx("textarea", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Offer description", rows: 4, value: form.description || "", onChange: (e) => setForm({
          ...form,
          description: e.target.value
        }) }),
        /* @__PURE__ */ jsxs("label", { className: "flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-4 text-sm font-medium text-primary hover:bg-primary/10", children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-4 w-4" }),
          " Select offer image from device",
          /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "hidden", onChange: (e) => readFile(e.target.files?.[0]) })
        ] }),
        form.imageUrl ? /* @__PURE__ */ jsx("img", { src: form.imageUrl, alt: "Offer preview", className: "h-40 w-full rounded-xl object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-40 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground", children: "No offer image selected" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 rounded-2xl border bg-muted/20 p-4", children: [
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!form.enabled, onChange: (e) => setForm({
            ...form,
            enabled: e.target.checked
          }) }),
          " Offer enabled"
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!form.couponEnabled, onChange: (e) => setForm({
            ...form,
            couponEnabled: e.target.checked
          }) }),
          " ",
          /* @__PURE__ */ jsx(TicketPercent, { className: "h-4 w-4" }),
          " Attach coupon code"
        ] }),
        form.couponEnabled && /* @__PURE__ */ jsx("input", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm uppercase", placeholder: "Coupon code e.g. FREEDEL", value: form.couponCode || "", onChange: (e) => setForm({
          ...form,
          couponCode: e.target.value.toUpperCase()
        }) }),
        /* @__PURE__ */ jsxs("select", { className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", value: form.discountType, onChange: (e) => setForm({
          ...form,
          discountType: e.target.value
        }), children: [
          /* @__PURE__ */ jsx("option", { value: "PERCENT", children: "Percentage discount" }),
          /* @__PURE__ */ jsx("option", { value: "FLAT", children: "Flat discount" }),
          /* @__PURE__ */ jsx("option", { value: "FREE_DELIVERY", children: "Free delivery charge" })
        ] }),
        isFreeDelivery ? /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm", children: [
          /* @__PURE__ */ jsx(Truck, { className: "mr-2 inline h-4 w-4" }),
          " This coupon will set user delivery fee to ₹0 when valid."
        ] }) : /* @__PURE__ */ jsx("input", { type: "number", className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Discount value", value: form.discountValue ?? 0, onChange: (e) => setForm({
          ...form,
          discountValue: Number(e.target.value)
        }) }),
        /* @__PURE__ */ jsx("input", { type: "number", className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Minimum order amount", value: form.minOrderAmount ?? 0, onChange: (e) => setForm({
          ...form,
          minOrderAmount: Number(e.target.value)
        }) }),
        /* @__PURE__ */ jsx("input", { type: "number", className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm", placeholder: "Max discount cap", value: form.maxDiscount ?? 0, onChange: (e) => setForm({
          ...form,
          maxDiscount: Number(e.target.value)
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-muted-foreground", children: [
            "Valid from",
            /* @__PURE__ */ jsx("input", { type: "date", className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm", value: form.validFrom || "", onChange: (e) => setForm({
              ...form,
              validFrom: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "text-xs text-muted-foreground", children: [
            "Valid till",
            /* @__PURE__ */ jsx("input", { type: "date", className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm", value: form.validTo || "", onChange: (e) => setForm({
              ...form,
              validTo: e.target.value
            }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { disabled: submitting || !form.title, onClick: () => onSubmit(form), className: "rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50", children: submitting ? "Saving…" : "Save Offer" })
    ] })
  ] }) });
}
export {
  OffersPage as component
};
