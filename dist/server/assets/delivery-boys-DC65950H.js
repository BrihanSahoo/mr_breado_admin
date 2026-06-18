import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { u as useTableSearch, S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { Bike, Eye, CreditCard, CheckCircle2, X, ShieldCheck } from "lucide-react";
import { u as useDrivers, a as useVerifyDriverDeposit, d as driverKeys, b as driversService } from "./use-drivers-D7VbKiyT.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function hasPendingVerification(r) {
  return String(r.verificationStatus ?? "").toUpperCase() === "PENDING" || Boolean(r.pendingVerification || r.verificationRequestId);
}
function isDriverVerified(r) {
  const status = String(r.verificationStatus ?? "").toUpperCase();
  if (status) return status === "VERIFIED" || status === "APPROVED";
  return r.verified === true;
}
function driverActive(r) {
  return Boolean(r.online || r.available) && isDriverVerified(r) && !r.blocked;
}
function DriversPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const {
    search,
    setSearch,
    debounced
  } = useTableSearch();
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useDrivers({
    page,
    perPage: 20,
    search: debounced
  });
  const verify = useVerifyDriverDeposit();
  const verification = useMutation({
    mutationFn: ({
      driverId,
      status
    }) => driversService.setVerificationStatus(driverId, status),
    onSuccess: (_, v) => {
      toast.success(v.status === "VERIFIED" ? "Delivery partner verified" : "Delivery partner verification updated");
      qc.invalidateQueries({
        queryKey: driverKeys.all
      });
    },
    onError: () => toast.error("Driver verification could not be updated. Please try again.")
  });
  const cashSettlement = (r) => {
    const amount = Number(window.prompt(`Enter cash settlement amount for ${r.driverName || "Delivery Partner"}`, String(Number(r.cashInHand ?? 0).toFixed(2))) || 0);
    if (amount <= 0) return;
    verify.mutate({
      driverId: r.driverId,
      body: {
        amount,
        paymentMethod: "CASH",
        note: "Verified by admin panel"
      }
    });
  };
  const items = data?.items ?? [];
  const cols = [{
    key: "driver",
    header: "Driver",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full gradient-info text-xs font-bold text-primary-foreground", children: (r.driverName || "?").split(" ").map((x) => x[0]).slice(0, 2).join("") }),
        /* @__PURE__ */ jsx("span", { className: `absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card ${driverActive(r) ? "bg-success" : "bg-muted-foreground"}` })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: r.driverName || "Delivery Partner" }),
          hasPendingVerification(r) && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500", children: "PENDING DOCS" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "#",
          r.driverId
        ] })
      ] })
    ] })
  }, {
    key: "mobile",
    header: "Mobile",
    render: (r) => r.driverMobile || "—"
  }, {
    key: "online",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: driverActive(r) ? "Active" : "Inactive" })
  }, {
    key: "deliveries",
    header: "Deliveries",
    render: (r) => r.totalDeliveries ?? 0
  }, {
    key: "earnings",
    header: "Earnings",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
      "₹",
      Number(r.totalEarnings ?? 0).toFixed(2)
    ] })
  }, {
    key: "cash",
    header: "Cash in hand",
    render: (r) => /* @__PURE__ */ jsxs("span", { children: [
      "₹",
      Number(r.cashInHand ?? 0).toFixed(2),
      " / ₹",
      Number(r.cashLimit ?? 0).toFixed(2)
    ] })
  }, {
    key: "verified",
    header: "Verification",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx(StatusBadge, { status: isDriverVerified(r) ? "Verified" : r.verificationStatus || "Unverified" }),
      hasPendingVerification(r) && /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold text-amber-500", children: "Review pending request" })
    ] })
  }, {
    key: "actions",
    header: "Actions",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setSelected(r), className: "inline-flex items-center gap-1.5 rounded-lg border border-info/30 px-3 py-2 text-xs font-bold text-info hover:bg-info/10", children: [
        /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
        "View"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => cashSettlement(r), disabled: verify.isPending, className: "inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 px-3 py-2 text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }),
        "Cash Settlement"
      ] }),
      !isDriverVerified(r) && /* @__PURE__ */ jsxs("button", { onClick: () => verification.mutate({
        driverId: r.userId || r.driverId,
        status: "VERIFIED"
      }), disabled: verification.isPending, className: "inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
        "Verify"
      ] })
    ] })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Delivery Boys", icon: /* @__PURE__ */ jsx(Bike, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Delivery Management"
    }, {
      label: "Delivery Boys"
    }] }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} drivers`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, search, onSearchChange: (s) => {
      setSearch(s);
      setPage(1);
    }, searchPlaceholder: "Search drivers...", rowKey: (r) => r.driverId }),
    selected && /* @__PURE__ */ jsx(DriverModal, { driver: selected, onClose: () => setSelected(null), onCash: () => cashSettlement(selected), onVerify: () => verification.mutate({
      driverId: selected.driverId,
      status: "VERIFIED"
    }), onUnverify: () => verification.mutate({
      driverId: selected.driverId,
      status: "UNVERIFIED"
    }), busy: verify.isPending || verification.isPending })
  ] });
}
function DriverModal({
  driver,
  onClose,
  onCash,
  onVerify,
  onUnverify,
  busy
}) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-3xl rounded-2xl border border-border bg-card p-5 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold", children: driver.driverName || "Delivery Partner" }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Delivery partner #",
          driver.driverId
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg border border-border p-2 hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-3 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Info, { label: "Mobile", value: driver.driverMobile || "—" }),
      /* @__PURE__ */ jsx(Info, { label: "Email", value: driver.driverEmail || "—" }),
      /* @__PURE__ */ jsx(Info, { label: "Verification", value: hasPendingVerification(driver) ? "Pending documents" : isDriverVerified(driver) ? "Verified" : driver.verificationStatus || "Unverified" }),
      /* @__PURE__ */ jsx(Info, { label: "Status", value: driverActive(driver) ? "Active" : "Inactive" }),
      /* @__PURE__ */ jsx(Info, { label: "Deliveries", value: String(driver.totalDeliveries ?? 0) }),
      /* @__PURE__ */ jsx(Info, { label: "Rating", value: String(driver.rating ?? 0) }),
      /* @__PURE__ */ jsx(Info, { label: "Total earnings", value: `₹${Number(driver.totalEarnings ?? 0).toFixed(2)}` }),
      /* @__PURE__ */ jsx(Info, { label: "Cash in hand", value: `₹${Number(driver.cashInHand ?? 0).toFixed(2)}` }),
      /* @__PURE__ */ jsx(Info, { label: "Cash limit", value: `₹${Number(driver.cashLimit ?? 0).toFixed(2)}` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap justify-end gap-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick: onCash, disabled: busy, className: "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4" }),
        "Cash Settlement"
      ] }),
      hasPendingVerification(driver) && /* @__PURE__ */ jsx("a", { href: "/service-area-verifications", className: "rounded-xl border border-amber-500/40 px-5 py-3 text-sm font-bold text-amber-500 hover:bg-amber-500/10", children: "Open verification request" }),
      isDriverVerified(driver) ? /* @__PURE__ */ jsx("button", { onClick: onUnverify, disabled: busy, className: "rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-500 disabled:opacity-50", children: "Mark Unverified" }) : /* @__PURE__ */ jsxs("button", { onClick: onVerify, disabled: busy, className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }),
        "Verify Driver"
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
  DriversPage as component
};
