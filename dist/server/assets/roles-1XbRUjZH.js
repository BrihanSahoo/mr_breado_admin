import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./router-1xz68c6T.js";
import { Plus, Shield, Pencil, Trash2 } from "lucide-react";
import { u as usersService } from "./users.service-6ZwfLhPd.js";
import { useQuery } from "@tanstack/react-query";
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
function RolesPage() {
  const roleDefs = [{
    key: "ADMIN",
    label: "Admins",
    color: "gradient-primary"
  }, {
    key: "SELLER",
    label: "Sellers",
    color: "gradient-warning"
  }, {
    key: "DELIVERY_PARTNER",
    label: "Delivery Partners",
    color: "gradient-info"
  }, {
    key: "CUSTOMER",
    label: "Customers",
    color: "gradient-success"
  }];
  const countsQuery = useQuery({
    queryKey: ["roles", "counts"],
    queryFn: async () => {
      const results = await Promise.all(roleDefs.map((r) => usersService.list({
        role: r.key,
        page: 1,
        perPage: 1
      })));
      return results.map((res, i) => ({
        key: roleDefs[i].key,
        total: res.total
      }));
    },
    staleTime: 3e4
  });
  const counts = Object.fromEntries((countsQuery.data ?? []).map((c) => [c.key, c.total]));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Roles", icon: /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Role Management"
    }, {
      label: "Roles"
    }], actions: /* @__PURE__ */ jsxs("button", { className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      " Add Role"
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: roleDefs.map((r) => /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-xl border border-border bg-card shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: `h-2 ${r.color}` }),
      /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: r.label }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { className: "rounded p-1.5 text-primary hover:bg-primary/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "rounded p-1.5 text-destructive hover:bg-destructive/10", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-background p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Users" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: counts[r.key] ?? (countsQuery.isLoading ? "…" : 0) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-background p-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Permissions" }),
            /* @__PURE__ */ jsx("div", { className: "text-xl font-bold", children: "—" })
          ] })
        ] })
      ] })
    ] }, r.key)) })
  ] });
}
export {
  RolesPage as component
};
