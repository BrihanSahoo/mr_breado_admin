import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { u as useTableSearch, S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { UserCog, Eye } from "lucide-react";
import { u as useUsers } from "./use-users-CR2kNOo7.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "./users.service-6ZwfLhPd.js";
function OwnersPage() {
  const [page, setPage] = useState(1);
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
  } = useUsers({
    page,
    perPage: 20,
    role: "SELLER",
    search: debounced
  });
  const items = data?.items ?? [];
  const cols = [{
    key: "name",
    header: "Owner",
    render: (r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      r.profileImage ? /* @__PURE__ */ jsx("img", { src: r.profileImage, alt: r.name, className: "h-9 w-9 rounded-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground", children: (r.name || "?").split(" ").map((x) => x[0]).slice(0, 2).join("") }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: r.name }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "#",
          r.id
        ] })
      ] })
    ] })
  }, {
    key: "email",
    header: "Email",
    render: (r) => r.email || "—"
  }, {
    key: "mobile",
    header: "Phone",
    render: (r) => r.mobile || "—"
  }, {
    key: "orders",
    header: "Orders",
    render: (r) => r.totalOrders ?? 0
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.blocked ? "Blocked" : r.enabled ? "Active" : "Inactive" })
  }, {
    key: "actions",
    header: "Actions",
    render: () => /* @__PURE__ */ jsx("button", { className: "rounded p-1.5 text-info hover:bg-info/10", children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Restaurant Owners", icon: /* @__PURE__ */ jsx(UserCog, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Restaurant Management"
    }, {
      label: "Owners"
    }] }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} owners`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, search, onSearchChange: (s) => {
      setSearch(s);
      setPage(1);
    }, searchPlaceholder: "Search owners...", rowKey: (r) => r.id })
  ] });
}
export {
  OwnersPage as component
};
