import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { P as PageHeader, D as Dialog, l as DialogContent, n as DialogHeader, o as DialogTitle, q as DialogDescription, S as StatusBadge } from "./router-1xz68c6T.js";
import { u as useTableSearch, S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { Users, Eye } from "lucide-react";
import { u as useUsers, a as userKeys } from "./use-users-CR2kNOo7.js";
import { useQueryClient } from "@tanstack/react-query";
import { u as usersService } from "./users.service-6ZwfLhPd.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function CustomersPage() {
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
    role: "CUSTOMER",
    search: debounced
  });
  const queryClient = useQueryClient();
  const items = data?.items ?? [];
  const cols = [{
    key: "name",
    header: "Customer",
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
    key: "mobile",
    header: "Phone",
    render: (r) => r.mobile || "—"
  }, {
    key: "email",
    header: "Email",
    render: (r) => r.email || "—"
  }, {
    key: "orders",
    header: "Orders",
    render: (r) => r.totalOrders ?? 0
  }, {
    key: "wallet",
    header: "Wallet",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
      "₹",
      Number(r.walletBalance ?? 0).toFixed(2)
    ] })
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.blocked ? "Blocked" : r.enabled ? "Active" : "Inactive" })
  }, {
    key: "actions",
    header: "Actions",
    render: (r) => /* @__PURE__ */ jsx("button", { onClick: () => setSelectedCustomer(r), className: "rounded p-1.5 text-info hover:bg-info/10", "aria-label": `View ${r.name} details`, children: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
  }];
  async function handleToggleStatus(user, patch) {
    try {
      await usersService.setStatus(user.id, patch);
      queryClient.invalidateQueries({
        queryKey: userKeys.list({
          page,
          perPage: 20,
          role: "CUSTOMER",
          search: debounced
        })
      });
      const updated = await usersService.get(user.id);
      setSelectedCustomer(updated);
    } catch (e) {
      console.error(e);
    }
  }
  async function handleSave(userId, values) {
    try {
      await usersService.update(userId, values);
      queryClient.invalidateQueries({
        queryKey: userKeys.list({
          page,
          perPage: 20,
          role: "CUSTOMER",
          search: debounced
        })
      });
      const updated = await usersService.get(userId);
      setSelectedCustomer(updated);
    } catch (e) {
      console.error(e);
    }
  }
  const [editValues, setEditValues] = useState({
    name: "",
    email: "",
    mobile: "",
    phoneNumber: ""
  });
  useEffect(() => {
    if (selectedCustomer) {
      setEditValues({
        name: selectedCustomer.name ?? "",
        email: selectedCustomer.email ?? "",
        mobile: selectedCustomer.mobile ?? "",
        phoneNumber: selectedCustomer.phoneNumber ?? ""
      });
    } else {
      setEditValues({
        name: "",
        email: "",
        mobile: "",
        phoneNumber: ""
      });
    }
  }, [selectedCustomer]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Customers", icon: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Customers"
    }] }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} customers`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, search, onSearchChange: (s) => {
      setSearch(s);
      setPage(1);
    }, searchPlaceholder: "Search customers...", rowKey: (r) => r.id }),
    /* @__PURE__ */ jsx(Dialog, { open: Boolean(selectedCustomer), onOpenChange: (open) => {
      if (!open) setSelectedCustomer(null);
    }, children: /* @__PURE__ */ jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Customer details" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Review the selected customer profile and account status." })
      ] }),
      selectedCustomer ? /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 p-4", children: [
          selectedCustomer.profileImage ? /* @__PURE__ */ jsx("img", { src: selectedCustomer.profileImage, alt: selectedCustomer.name, className: "h-16 w-16 rounded-full object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-lg font-bold text-primary-foreground", children: (selectedCustomer.name || "?").split(" ").map((x) => x[0]).slice(0, 2).join("") }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-xl font-semibold", children: selectedCustomer.name }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "#",
              selectedCustomer.id
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: selectedCustomer.role || "Customer" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => handleToggleStatus(selectedCustomer, {
              enabled: !selectedCustomer.enabled
            }), className: "rounded-md border border-border px-3 py-1 text-sm hover:bg-accent", children: selectedCustomer.enabled ? "Disable" : "Enable" }),
            /* @__PURE__ */ jsx("button", { onClick: () => handleToggleStatus(selectedCustomer, {
              blocked: !selectedCustomer.blocked
            }), className: "rounded-md border border-border px-3 py-1 text-sm hover:bg-accent", children: selectedCustomer.blocked ? "Unblock" : "Block" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-xl border border-border bg-card p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Contact" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", children: selectedCustomer.email || "—" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", children: selectedCustomer.mobile || "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 rounded-xl border border-border bg-card p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Account" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              "Orders: ",
              selectedCustomer.totalOrders ?? 0
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              "Wallet: ₹",
              Number(selectedCustomer.walletBalance ?? 0).toFixed(2)
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
              "Status: ",
              /* @__PURE__ */ jsx(StatusBadge, { status: selectedCustomer.blocked ? "Blocked" : selectedCustomer.enabled ? "Active" : "Inactive" })
            ] })
          ] })
        ] }),
        selectedCustomer.createdAt && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-muted-foreground", children: "Joined" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm", children: new Date(selectedCustomer.createdAt).toLocaleDateString() })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "mb-2 text-xs uppercase tracking-wide text-muted-foreground", children: "Edit Customer" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-2 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsx("input", { value: editValues.name, onChange: (e) => setEditValues((v) => ({
              ...v,
              name: e.target.value
            })), placeholder: "Name", className: "rounded-md border border-input px-3 py-2" }),
            /* @__PURE__ */ jsx("input", { value: editValues.email, onChange: (e) => setEditValues((v) => ({
              ...v,
              email: e.target.value
            })), placeholder: "Email", className: "rounded-md border border-input px-3 py-2" }),
            /* @__PURE__ */ jsx("input", { value: editValues.mobile, onChange: (e) => setEditValues((v) => ({
              ...v,
              mobile: e.target.value
            })), placeholder: "Mobile", className: "rounded-md border border-input px-3 py-2" }),
            /* @__PURE__ */ jsx("input", { value: editValues.phoneNumber, onChange: (e) => setEditValues((v) => ({
              ...v,
              phoneNumber: e.target.value
            })), placeholder: "Phone number", className: "rounded-md border border-input px-3 py-2" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ jsx("button", { onClick: () => handleSave(selectedCustomer.id, editValues), className: "rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground", children: "Save" }) })
        ] })
      ] }) : /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "No customer selected." })
    ] }) })
  ] });
}
export {
  CustomersPage as component
};
