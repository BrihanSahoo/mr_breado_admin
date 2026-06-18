import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { r as request, e as endpoints, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { Wallet, Check } from "lucide-react";
import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { p as paymentsService } from "./payments.service-fZ8wg2NC.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function normalizePage(payload) {
  const root = payload?.data ?? payload;
  const rawItems = Array.isArray(root) ? root : Array.isArray(root?.items) ? root.items : Array.isArray(root?.data) ? root.data : Array.isArray(root?.content) ? root.content : [];
  const items = rawItems.map((x) => ({
    ...x,
    id: x.id,
    restaurantId: x.restaurantId ?? x.restaurant_id,
    restaurantName: x.restaurantName ?? x.restaurant_name ?? x.restaurant ?? "—",
    sellerName: x.sellerName ?? x.seller_name ?? "—",
    totalOrders: x.totalOrders ?? x.total_orders ?? x.orders ?? 0,
    grossAmount: x.grossAmount ?? x.gross_amount ?? x.gross_food_amount ?? x.gross ?? 0,
    commissionAmount: x.commissionAmount ?? x.commission_amount ?? 0,
    payableAmount: x.payableAmount ?? x.payable_amount ?? x.net_payable ?? x.payable ?? 0,
    status: x.status ?? x.settlement_status ?? "PENDING",
    periodStart: x.periodStart ?? x.period_start ?? x.created_at,
    periodEnd: x.periodEnd ?? x.period_end ?? x.settled_at
  }));
  return { items, content: items, data: items, total: Number(root?.total ?? items.length), page: Number(root?.page ?? 1), per_page: Number(root?.perPage ?? root?.per_page ?? 20), total_pages: Number(root?.totalPages ?? root?.total_pages ?? 1), last: true };
}
const settlementsService = {
  list: async (params = {}) => {
    const payload = await request({
      url: endpoints.admin.settlements,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 }
    });
    return normalizePage(payload);
  },
  generateWeekly: (restaurantId) => request({
    url: endpoints.admin.generateWeeklySettlement(restaurantId),
    method: "POST"
  }),
  markPaid: (settlementId, body) => request({
    url: endpoints.admin.markSettlementPaid(settlementId),
    method: "POST",
    data: body
  })
};
const settlementKeys = {
  all: ["settlements"],
  list: (q) => ["settlements", "list", q]
};
function useSettlements(query) {
  return useQuery({
    queryKey: settlementKeys.list(query),
    queryFn: () => settlementsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useMarkSettlementPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => settlementsService.markPaid(id, body),
    onSuccess: () => {
      toast.success("Settlement marked as paid");
      qc.invalidateQueries({ queryKey: settlementKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function usePaymentsSummary() {
  return useQuery({
    queryKey: ["payments", "summary"],
    queryFn: () => paymentsService.summary(),
    staleTime: 3e4
  });
}
function PayoutsPage() {
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useSettlements({
    page,
    perPage: 20
  });
  const {
    data: summary
  } = usePaymentsSummary();
  const markPaid = useMarkSettlementPaid();
  const items = data?.items ?? [];
  const cols = [{
    key: "id",
    header: "Settlement #",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "font-mono text-primary", children: [
      "#",
      r.id
    ] })
  }, {
    key: "restaurant",
    header: "Restaurant",
    render: (r) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "font-medium", children: r.restaurantName }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "#",
        r.restaurantId
      ] })
    ] })
  }, {
    key: "period",
    header: "Period",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "text-xs", children: [
      r.periodStart ? new Date(r.periodStart).toLocaleDateString() : "—",
      " → ",
      r.periodEnd ? new Date(r.periodEnd).toLocaleDateString() : "—"
    ] })
  }, {
    key: "orders",
    header: "Orders",
    render: (r) => r.totalOrders ?? 0
  }, {
    key: "gross",
    header: "Gross",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "font-semibold", children: [
      "₹",
      Number(r.grossAmount ?? 0).toFixed(2)
    ] })
  }, {
    key: "commission",
    header: "Commission",
    render: (r) => `₹${Number(r.commissionAmount ?? 0).toFixed(2)}`
  }, {
    key: "payable",
    header: "Payable",
    render: (r) => /* @__PURE__ */ jsxs("span", { className: "font-semibold text-success", children: [
      "₹",
      Number(r.payableAmount ?? 0).toFixed(2)
    ] })
  }, {
    key: "status",
    header: "Status",
    render: (r) => /* @__PURE__ */ jsx(StatusBadge, { status: r.status || "PENDING" })
  }, {
    key: "actions",
    header: "Actions",
    render: (r) => /* @__PURE__ */ jsx("button", { onClick: () => {
      const ref = window.prompt("Payment reference (txn id)?") || "";
      if (ref) markPaid.mutate({
        id: r.id,
        body: {
          paymentMethod: "BANK",
          paymentReference: ref
        }
      });
    }, disabled: markPaid.isPending || r.status === "PAID", className: "rounded p-1.5 text-success hover:bg-success/10 disabled:opacity-40", title: "Mark paid", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Restaurant Settlements", icon: /* @__PURE__ */ jsx(Wallet, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Service Management"
    }, {
      label: "Settlements"
    }] }),
    summary && /* @__PURE__ */ jsx("div", { className: "mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [{
      label: "Total Collected",
      value: `₹${Number(summary.totalCollected ?? 0).toFixed(2)}`
    }, {
      label: "Platform Fee",
      value: `₹${Number(summary.platformFee ?? 0).toFixed(2)}`
    }, {
      label: "Restaurant Payable",
      value: `₹${Number(summary.restaurantPayable ?? 0).toFixed(2)}`
    }, {
      label: "Admin Commission",
      value: `₹${Number(summary.adminCommission ?? 0).toFixed(2)}`
    }].map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.label }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-xl font-bold", children: s.value })
    ] }, s.label)) }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} settlements`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, rowKey: (r) => r.id })
  ] });
}
export {
  PayoutsPage as component
};
