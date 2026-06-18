import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./router-1xz68c6T.js";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const SplitComponent = () => {
  const zones = [{
    name: "Downtown",
    charge: 2.5,
    restaurants: 24,
    status: "Active"
  }, {
    name: "Uptown",
    charge: 3,
    restaurants: 18,
    status: "Active"
  }, {
    name: "Eastside",
    charge: 3.5,
    restaurants: 12,
    status: "Active"
  }, {
    name: "Westside",
    charge: 4,
    restaurants: 9,
    status: "Inactive"
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Zone Management", icon: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Zones"
    }], actions: /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Add Zone"
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-3 font-semibold", children: "Delivery Map" }),
        /* @__PURE__ */ jsxs("div", { className: "relative flex h-96 items-center justify-center overflow-hidden rounded-lg bg-background", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-30", style: {
            backgroundImage: "radial-gradient(circle at 30% 40%, var(--color-primary) 0%, transparent 30%), radial-gradient(circle at 70% 60%, var(--color-info) 0%, transparent 30%)"
          } }),
          /* @__PURE__ */ jsxs("div", { className: "relative text-center", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "mx-auto h-12 w-12 text-primary" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Google Maps integration · Draw zone polygons" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: zones.map((z) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-semibold", children: z.name }),
          /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-0.5 text-xs ${z.status === "Active" ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: z.status })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 grid grid-cols-2 gap-2 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Delivery" }),
            /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
              "₹",
              z.charge
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Restaurants" }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: z.restaurants })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex justify-end gap-1", children: [
          /* @__PURE__ */ jsx("button", { className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { className: "rounded p-1.5 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }, z.name)) })
    ] })
  ] });
};
export {
  SplitComponent as component
};
