import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Building2, Save, ToggleRight, ToggleLeft } from "lucide-react";
import { toast } from "sonner";
import { m as mrBreadoService, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const empty = {
  name: "",
  description: "",
  contactNumber: "",
  contactEmail: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  zipcode: "",
  latitude: "",
  longitude: "",
  gstin: "",
  cuisines: "",
  priceForTwo: "",
  orderPreparationTime: "",
  minDeliveryTime: "",
  maxDeliveryTime: "",
  logo: null,
  banner: null,
  image: null
};
function MrBreadoRestaurantPage() {
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["mr-breado", "restaurant"],
    queryFn: mrBreadoService.restaurant
  });
  const [form, setForm] = useState(empty);
  useEffect(() => {
    if (!data) return;
    setForm({
      ...empty,
      name: data.name ?? "",
      description: data.description ?? "",
      contactNumber: data.contactNumber ?? data.contact_number ?? "",
      contactEmail: data.contactEmail ?? data.contact_email ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      state: data.state ?? "",
      country: data.country ?? "India",
      zipcode: data.zipcode ?? data.zipCode ?? "",
      latitude: data.latitude ?? "",
      longitude: data.longitude ?? "",
      gstin: data.gstin ?? data.gstinNumber ?? data.gstin_number ?? "",
      cuisines: data.cuisines ?? "",
      priceForTwo: data.priceForTwo ?? data.price_for_two ?? "",
      orderPreparationTime: data.orderPreparationTime ?? data.order_preparation_time ?? "",
      minDeliveryTime: data.minDeliveryTime ?? data.min_delivery_time ?? "",
      maxDeliveryTime: data.maxDeliveryTime ?? data.max_delivery_time ?? ""
    });
  }, [data]);
  const save = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v === void 0 || v === null || v === "") return;
        fd.append(k, v);
        const snake = k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
        if (snake !== k) fd.append(snake, v);
      });
      return mrBreadoService.updateRestaurant(fd);
    },
    onSuccess: () => {
      toast.success("Mr. Breado restaurant updated");
      qc.invalidateQueries({
        queryKey: ["mr-breado", "restaurant"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const status = useMutation({
    mutationFn: (patch) => mrBreadoService.updateRestaurantStatus(patch),
    onSuccess: () => {
      toast.success("Restaurant status updated");
      qc.invalidateQueries({
        queryKey: ["mr-breado", "restaurant"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const set = (k, v) => setForm((s) => ({
    ...s,
    [k]: v
  }));
  const isOpen = !!(data?.open ?? data?.isOpen ?? data?.is_open);
  const isVisible = String(data?.visibilityStatus ?? data?.visibility_status ?? "VISIBLE").toUpperCase() !== "HIDDEN";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Mr. Breado Restaurant", icon: /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Mr. Breado Restaurant"
    }] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[1fr_320px]", children: [
      /* @__PURE__ */ jsx("section", { className: "rounded-xl border border-border bg-card p-4 shadow-card md:p-6", children: isLoading ? /* @__PURE__ */ jsx("div", { className: "h-96 animate-pulse rounded-lg bg-primary/10" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Field, { label: "Restaurant Name", value: form.name, onChange: (v) => set("name", v) }),
          /* @__PURE__ */ jsx(Field, { label: "GSTIN", value: form.gstin, onChange: (v) => set("gstin", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Contact Number", value: form.contactNumber, onChange: (v) => set("contactNumber", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Contact Email", value: form.contactEmail, onChange: (v) => set("contactEmail", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Cuisines", value: form.cuisines, onChange: (v) => set("cuisines", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Price For Two", value: form.priceForTwo, onChange: (v) => set("priceForTwo", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Preparation Time (min)", value: form.orderPreparationTime, onChange: (v) => set("orderPreparationTime", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Delivery Time Min", value: form.minDeliveryTime, onChange: (v) => set("minDeliveryTime", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Delivery Time Max", value: form.maxDeliveryTime, onChange: (v) => set("maxDeliveryTime", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Zipcode", value: form.zipcode, onChange: (v) => set("zipcode", v) })
        ] }),
        /* @__PURE__ */ jsx(TextArea, { label: "Description", value: form.description, onChange: (v) => set("description", v) }),
        /* @__PURE__ */ jsx(TextArea, { label: "Address", value: form.address, onChange: (v) => set("address", v) }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [
          /* @__PURE__ */ jsx(Field, { label: "City", value: form.city, onChange: (v) => set("city", v) }),
          /* @__PURE__ */ jsx(Field, { label: "State", value: form.state, onChange: (v) => set("state", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Latitude", value: form.latitude, onChange: (v) => set("latitude", v) }),
          /* @__PURE__ */ jsx(Field, { label: "Longitude", value: form.longitude, onChange: (v) => set("longitude", v) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-4 md:grid-cols-3", children: [
          /* @__PURE__ */ jsx(FileField, { label: "Logo", onChange: (f) => set("logo", f) }),
          /* @__PURE__ */ jsx(FileField, { label: "Banner", onChange: (f) => set("banner", f) }),
          /* @__PURE__ */ jsx(FileField, { label: "Image", onChange: (f) => set("image", f) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsxs("button", { onClick: () => save.mutate(), className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          "Save Restaurant"
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("aside", { className: "space-y-4 rounded-xl border border-border bg-card p-4 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: "Live Controls" }),
        /* @__PURE__ */ jsx(Info, { label: "Verification", value: /* @__PURE__ */ jsx(StatusBadge, { status: data?.verificationStatus ?? data?.verification_status ?? "PENDING" }) }),
        /* @__PURE__ */ jsx(Info, { label: "Visibility", value: /* @__PURE__ */ jsx(StatusBadge, { status: data?.visibilityStatus ?? data?.visibility_status ?? "VISIBLE" }) }),
        /* @__PURE__ */ jsx(Info, { label: "Current Open State", value: /* @__PURE__ */ jsx(StatusBadge, { status: isOpen ? "OPEN" : "CLOSED" }) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => status.mutate({
          open: !isOpen,
          isOpen: !isOpen,
          is_open: !isOpen
        }), className: "flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent", children: [
          isOpen ? /* @__PURE__ */ jsx(ToggleRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "h-4 w-4" }),
          isOpen ? "Close Store" : "Open Store"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => status.mutate({
          visibilityStatus: isVisible ? "HIDDEN" : "VISIBLE",
          visibility_status: isVisible ? "HIDDEN" : "VISIBLE"
        }), className: "w-full rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent", children: isVisible ? "Hide From App" : "Show In App" })
      ] })
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("input", { value: value ?? "", onChange: (e) => onChange(e.target.value), className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" })
  ] });
}
function TextArea({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "mt-4 block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("textarea", { value: value ?? "", onChange: (e) => onChange(e.target.value), className: "mt-1 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" })
  ] });
}
function FileField({
  label,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: (e) => onChange(e.target.files?.[0] ?? null), className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" })
  ] });
}
function Info({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { children: value })
  ] });
}
export {
  MrBreadoRestaurantPage as component
};
