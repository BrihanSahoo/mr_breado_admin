import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { u as useTableSearch, S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { Store, Star, Eye, ShieldCheck, X, Power } from "lucide-react";
import { u as useRestaurants, r as restaurantKeys } from "./use-restaurants-Dgr4GgWu.js";
import { r as restaurantsService } from "./restaurants.service-Dw86oKrx.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function isRestaurantVerified(r) {
  const s = String(r.verificationStatus ?? "").toUpperCase();
  return s === "VERIFIED" || s === "APPROVED";
}
function RestaurantsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const {
    search,
    setSearch,
    debounced
  } = useTableSearch();
  const [verification, setVerification] = useState("");
  const [selected, setSelected] = useState(null);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useRestaurants({
    page,
    perPage: 20,
    search: debounced,
    verificationStatus: verification || void 0
  });
  const verifyMutation = useMutation({
    mutationFn: ({
      id,
      status
    }) => restaurantsService.setVerificationStatus(id, status),
    onSuccess: (_, v) => {
      toast.success(v.status === "VERIFIED" ? "Restaurant verified successfully" : "Restaurant verification updated");
      qc.invalidateQueries({
        queryKey: restaurantKeys.all
      });
    },
    onError: () => toast.error("Restaurant verification could not be updated. Please try again.")
  });
  const items = data?.items ?? [];
  const cols = [{
    key: "name",
    header: "Restaurant",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      r.logo ? /* @__PURE__ */ jsx("img", { src: r.logo, alt: r.name, className: "h-10 w-10 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg", children: "🏪" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: r.name }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "#",
          r.id,
          " · ",
          r.city || "—"
        ] })
      ] })
    ] })
  }, {
    key: "verification",
    header: "Verification",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.verificationStatus || "UNVERIFIED" })
  }, {
    key: "rating",
    header: "Rating",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-warning", children: [
      /* @__PURE__ */ jsx(Star, { className: "h-3 w-3 fill-current" }),
      r.rating ?? 0
    ] })
  }, {
    key: "products",
    header: "Products",
    render: (r) => r.productCount ?? 0
  }, {
    key: "revenue",
    header: "Gross Sales",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
      "₹",
      Number(r.grossSales ?? 0).toFixed(2)
    ] })
  }, {
    key: "payable",
    header: "Payable",
    render: (r) => /* @__PURE__ */ jsxs("span", { children: [
      "₹",
      Number(r.restaurantPayable ?? 0).toFixed(2)
    ] })
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.open ? "Active" : "Inactive" })
  }, {
    key: "actions",
    header: "Actions",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setSelected(r), className: "inline-flex items-center gap-1.5 rounded-lg border border-info/30 px-3 py-2 text-xs font-bold text-info hover:bg-info/10", children: [
        /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
        "View"
      ] }),
      !isRestaurantVerified(r) && /* @__PURE__ */ jsxs("button", { onClick: () => verifyMutation.mutate({
        id: r.id,
        status: "VERIFIED"
      }), disabled: verifyMutation.isPending, className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }),
        "Verify"
      ] })
    ] })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Restaurants", icon: /* @__PURE__ */ jsx(Store, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Restaurant Management"
    }, {
      label: "Restaurants"
    }] }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} restaurants`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, search, onSearchChange: (s) => {
      setSearch(s);
      setPage(1);
    }, searchPlaceholder: "Search restaurants...", rowKey: (r) => r.id, filters: /* @__PURE__ */ jsxs("select", { value: verification, onChange: (e) => {
      setVerification(e.target.value);
      setPage(1);
    }, className: "rounded-md border border-border bg-background px-2 py-1.5 text-sm", children: [
      /* @__PURE__ */ jsx("option", { value: "", children: "All verifications" }),
      /* @__PURE__ */ jsx("option", { value: "UNVERIFIED", children: "Unverified" }),
      /* @__PURE__ */ jsx("option", { value: "PENDING", children: "Pending" }),
      /* @__PURE__ */ jsx("option", { value: "VERIFIED", children: "Verified" }),
      /* @__PURE__ */ jsx("option", { value: "REJECTED", children: "Rejected" })
    ] }) }),
    selected && /* @__PURE__ */ jsx(RestaurantModal, { restaurant: selected, onClose: () => setSelected(null), onVerify: () => verifyMutation.mutate({
      id: selected.id,
      status: "VERIFIED"
    }), onUnverify: () => verifyMutation.mutate({
      id: selected.id,
      status: "UNVERIFIED"
    }), busy: verifyMutation.isPending })
  ] });
}
function RestaurantModal({
  restaurant,
  onClose,
  onVerify,
  onUnverify,
  busy
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4", children: /* @__PURE__ */ jsxs("div", { className: "max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold", children: restaurant.name }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Restaurant #",
          restaurant.id,
          " · ",
          restaurant.city || "—"
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg border border-border p-2 hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Info, { label: "Verification", value: restaurant.verificationStatus || "UNVERIFIED" }),
      /* @__PURE__ */ jsx(Info, { label: "Visibility", value: restaurant.visibilityStatus || "—" }),
      /* @__PURE__ */ jsx(Info, { label: "Open state", value: restaurant.open ? "Open" : "Closed" }),
      /* @__PURE__ */ jsx(Info, { label: "Status", value: restaurant.status || "—" }),
      /* @__PURE__ */ jsx(Info, { label: "Rating", value: String(restaurant.rating ?? 0) }),
      /* @__PURE__ */ jsx(Info, { label: "Products", value: String(restaurant.productCount ?? 0) }),
      /* @__PURE__ */ jsx(Info, { label: "Gross sales", value: `₹${Number(restaurant.grossSales ?? 0).toFixed(2)}` }),
      /* @__PURE__ */ jsx(Info, { label: "Admin commission", value: `₹${Number(restaurant.adminCommission ?? 0).toFixed(2)}` }),
      /* @__PURE__ */ jsx(Info, { label: "Payable", value: `₹${Number(restaurant.restaurantPayable ?? 0).toFixed(2)}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl border border-border bg-background/50 p-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Address" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm", children: restaurant.address || "No address returned by backend." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap justify-end gap-2", children: [
      /* @__PURE__ */ jsxs("button", { disabled: true, className: "inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-muted-foreground disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(Power, { className: "h-4 w-4" }),
        "Open/Close from Mr. Breado Restaurant page"
      ] }),
      isRestaurantVerified(restaurant) ? /* @__PURE__ */ jsx("button", { onClick: onUnverify, disabled: busy, className: "rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-500 disabled:opacity-50", children: "Mark Unverified" }) : /* @__PURE__ */ jsxs("button", { onClick: onVerify, disabled: busy, className: "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }),
        "Verify Restaurant"
      ] })
    ] })
  ] }) });
}
function Info({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background/50 p-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 break-words font-semibold", children: value })
  ] });
}
export {
  RestaurantsPage as component
};
