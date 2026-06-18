import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { RefreshCcw, Building2, Phone, Store, PackagePlus, Mail, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { P as PageHeader, a as api, e as endpoints } from "./router-1xz68c6T.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const arr = (x) => Array.isArray(x) ? x : Array.isArray(x?.items) ? x.items : Array.isArray(x?.data) ? x.data : Array.isArray(x?.requests) ? x.requests : Array.isArray(x?.outlets) ? x.outlets : [];
const money = (v) => `₹${Number(v || 0).toFixed(2)}`;
function FranchisePage() {
  const [requests, setRequests] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [refills, setRefills] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    try {
      const [rq, out, rf] = await Promise.all([api.get(endpoints.admin.franchiseRequests).catch(() => ({
        data: {
          items: []
        }
      })), api.get(endpoints.admin.franchiseOutlets).catch(() => ({
        data: {
          items: []
        }
      })), api.get(endpoints.admin.franchiseRefillRequests).catch(() => ({
        data: {
          items: []
        }
      }))]);
      setRequests(arr(rq.data?.data ?? rq.data));
      setOutlets(arr(out.data?.data ?? out.data));
      setRefills(arr(rf.data?.data ?? rf.data));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function updateRequest(id, status) {
    try {
      await api.patch(endpoints.admin.franchiseRequestStatus(id), {
        status
      });
      toast.success(`Request marked ${status}`);
      load();
    } catch {
      toast.error("Could not update franchise request");
    }
  }
  async function markContacted(id) {
    try {
      await api.post(endpoints.admin.franchiseRequestContact(id), {
        note: "Contacted from admin panel"
      });
      toast.success("Marked as contacted");
      load();
    } catch {
      toast.error("Could not mark contacted");
    }
  }
  async function openInventory(o) {
    setSelectedOutlet(o);
    try {
      const r = await api.get(endpoints.admin.franchiseOutletInventory(o.id ?? o.restaurantId));
      setInventory(arr(r.data?.data ?? r.data));
    } catch {
      setInventory([]);
      toast.error("Inventory could not be loaded");
    }
  }
  const pending = useMemo(() => requests.filter((r) => String(r.status).toUpperCase() === "PENDING").length, [requests]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Franchise & Outlets", icon: /* @__PURE__ */ jsx(Building2, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Restaurant Management"
    }, {
      label: "Franchise & Outlets"
    }], actions: /* @__PURE__ */ jsxs("button", { onClick: load, className: "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-accent", children: [
      /* @__PURE__ */ jsx(RefreshCcw, { className: "h-4 w-4" }),
      " Refresh"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Stat, { label: "Franchise Requests", value: requests.length, icon: /* @__PURE__ */ jsx(Building2, {}) }),
      /* @__PURE__ */ jsx(Stat, { label: "Pending Leads", value: pending, icon: /* @__PURE__ */ jsx(Phone, {}) }),
      /* @__PURE__ */ jsx(Stat, { label: "Outlets", value: outlets.length, icon: /* @__PURE__ */ jsx(Store, {}) }),
      /* @__PURE__ */ jsx(Stat, { label: "Refill Requests", value: refills.length, icon: /* @__PURE__ */ jsx(PackagePlus, {}) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mt-5 rounded-2xl border border-orange-500/25 bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-extrabold", children: "Franchise business requests" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Seller app franchise enquiries appear here. Contact them, then approve or reject." })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-500", children: [
          pending,
          " pending"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: requests.length === 0 ? /* @__PURE__ */ jsx(Empty, { text: "No franchise requests yet" }) : requests.map((r) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/40 p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-base font-extrabold", children: r.ownerName || r.owner_name || r.name || "Franchise lead" }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              r.businessName || r.business_name || "Mr. Breado outlet enquiry",
              " · ",
              r.city || "—",
              " ",
              r.pincode ? `· ${r.pincode}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx(Badge, { status: r.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-3 md:grid-cols-3", children: [
          /* @__PURE__ */ jsx(Info, { icon: /* @__PURE__ */ jsx(Phone, {}), label: "Phone", value: r.phone || r.mobile || "—" }),
          /* @__PURE__ */ jsx(Info, { icon: /* @__PURE__ */ jsx(Mail, {}), label: "Email", value: r.email || "—" }),
          /* @__PURE__ */ jsx(Info, { icon: /* @__PURE__ */ jsx(MapPin, {}), label: "Location", value: [r.address, r.city, r.state, r.pincode].filter(Boolean).join(", ") || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-border bg-card p-3 text-sm", children: [
          /* @__PURE__ */ jsx("b", { children: "Query:" }),
          " ",
          r.query || r.message || "No query provided."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap justify-end gap-2", children: [
          r.email && /* @__PURE__ */ jsx("a", { href: `mailto:${r.email}?subject=Mr. Breado franchise enquiry`, className: "rounded-xl border border-info/40 px-4 py-2 text-sm font-bold text-info hover:bg-info/10", children: "Email" }),
          r.phone && /* @__PURE__ */ jsx("a", { href: `tel:${r.phone}`, className: "rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-bold text-emerald-500 hover:bg-emerald-500/10", children: "Call" }),
          /* @__PURE__ */ jsx("button", { onClick: () => markContacted(r.id), className: "rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-accent", children: "Mark contacted" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => updateRequest(r.id, "APPROVED"), className: "rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { className: "mr-1 inline h-4 w-4" }),
            "Approve"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => updateRequest(r.id, "REJECTED"), className: "rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white", children: [
            /* @__PURE__ */ jsx(XCircle, { className: "mr-1 inline h-4 w-4" }),
            "Reject"
          ] })
        ] })
      ] }, r.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mt-5 rounded-2xl border border-border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-extrabold", children: "Mr. Breado outlets" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "All restaurants/outlets under Mr. Breado brand. Track stock, orders, payable, and sent stock." }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3", children: outlets.length === 0 ? /* @__PURE__ */ jsx(Empty, { text: "No Mr. Breado outlets found" }) : outlets.map((o) => /* @__PURE__ */ jsxs("button", { onClick: () => openInventory(o), className: "rounded-2xl border border-border bg-background/40 p-4 text-left hover:border-orange-500/50", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold", children: o.name || o.outletName }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
              "#",
              o.id,
              " · ",
              o.city || "—"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Badge, { status: o.verificationStatus || "OUTLET" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-sm", children: [
          /* @__PURE__ */ jsx(Mini, { label: "Stock", value: o.totalStock ?? 0 }),
          /* @__PURE__ */ jsx(Mini, { label: "Orders", value: o.totalOrders ?? 0 }),
          /* @__PURE__ */ jsx(Mini, { label: "Sales", value: money(o.grossSales) })
        ] })
      ] }, o.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mt-5 rounded-2xl border border-border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-extrabold", children: "Franchise refill requests" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Track stock refill demand from franchise sellers and dispatch cost." }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-3", children: refills.length === 0 ? /* @__PURE__ */ jsx(Empty, { text: "No refill requests" }) : refills.map((r) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/40 p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-between gap-2", children: [
          /* @__PURE__ */ jsx("b", { children: r.restaurantName || `Outlet #${r.restaurantId || r.restaurant_id}` }),
          /* @__PURE__ */ jsx(Badge, { status: r.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
          "Estimated cost: ",
          money(r.estimatedCost || r.estimated_cost),
          " · Submitted: ",
          String(r.createdAt || r.created_at || "—").slice(0, 19)
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-2", children: (r.items || []).map((it, idx) => /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-muted px-3 py-1 text-xs font-bold", children: [
          it.name || it.title || it.productName || `Product #${it.productId || it.product_id}`,
          " × ",
          it.quantity || it.qty
        ] }, idx)) })
      ] }, r.id)) })
    ] }),
    selectedOutlet && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4", children: /* @__PURE__ */ jsxs("div", { className: "max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold", children: selectedOutlet.name }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Outlet inventory and current stock" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSelectedOutlet(null), className: "rounded-xl border border-border px-4 py-2 font-bold", children: "Close" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 grid gap-3 md:grid-cols-2", children: inventory.map((i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3", children: [
        /* @__PURE__ */ jsx("img", { src: i.image || i.imageUrl, className: "h-14 w-14 rounded-xl object-cover", onError: (e) => {
          e.currentTarget.style.display = "none";
        } }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx("b", { children: i.title || i.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Price ",
            money(i.price),
            " · Stock ",
            i.stockQuantity ?? 0
          ] })
        ] })
      ] }, i.productId || i.id)) })
    ] }) })
  ] });
}
function Stat({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4 shadow-card", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500", children: icon }),
    /* @__PURE__ */ jsx("div", { className: "text-2xl font-extrabold", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
function Info({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: "break-words font-semibold", children: value })
  ] });
}
function Mini({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-card p-2", children: [
    /* @__PURE__ */ jsx("div", { className: "font-extrabold", children: value }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase text-muted-foreground", children: label })
  ] });
}
function Badge({
  status
}) {
  const s = String(status || "PENDING").toUpperCase();
  const cls = s.includes("APPROV") || s.includes("VERIF") ? "bg-emerald-500/15 text-emerald-400" : s.includes("REJECT") ? "bg-red-500/15 text-red-400" : "bg-orange-500/15 text-orange-400";
  return /* @__PURE__ */ jsx("span", { className: `rounded-full px-3 py-1 text-xs font-extrabold ${cls}`, children: s });
}
function Empty({
  text
}) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground", children: text });
}
export {
  FranchisePage as component
};
