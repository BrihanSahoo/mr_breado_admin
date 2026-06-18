import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./router-1xz68c6T.js";
import { KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function PermissionsPage() {
  const modules = ["Dashboard", "Orders", "Customers", "Restaurants", "Delivery", "Foods", "Categories", "Offers", "Tickets", "Settings"];
  const roleDefs = ["ADMIN", "SELLER", "DELIVERY_PARTNER", "CUSTOMER"];
  const storageKey = "admin_permissions_config";
  const [state, setState] = useState({});
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setState(JSON.parse(raw));
        return;
      } catch (e) {
      }
    }
    const initial = {};
    modules.forEach((m, i) => {
      initial[m] = {};
      roleDefs.forEach((r, j) => {
        initial[m][r] = (i + j) % 3 !== 0;
      });
    });
    setState(initial);
  }, []);
  function toggle(module, role) {
    setState((s) => ({
      ...s,
      [module]: {
        ...s[module] || {},
        [role]: !(s[module]?.[role] ?? false)
      }
    }));
  }
  function handleSave() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      toast.success("Permissions saved (local only).");
    } catch (e) {
      toast.error("Failed to save permissions.");
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Permissions", icon: /* @__PURE__ */ jsx(KeyRound, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Role Management"
    }, {
      label: "Permissions"
    }] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex items-center justify-end", children: /* @__PURE__ */ jsx("button", { onClick: handleSave, className: "rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground", children: "Save" }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Module" }),
          roleDefs.map((r) => /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-center", children: r.replace("_", " ") }, r))
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: modules.map((m) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/60", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium", children: m }),
          roleDefs.map((r) => /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex cursor-pointer items-center", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!state[m]?.[r], onChange: () => toggle(m, r), className: "peer sr-only" }),
            /* @__PURE__ */ jsx("div", { className: "relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" })
          ] }) }, r))
        ] }, m)) })
      ] }) })
    ] })
  ] });
}
export {
  PermissionsPage as component
};
