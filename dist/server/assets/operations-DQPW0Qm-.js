import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { r as request, e as endpoints, P as PageHeader, B as Button, S as StatusBadge } from "./router-1xz68c6T.js";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { Activity, Send, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
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
const reportsService = {
  list: (params = {}) => request({
    url: endpoints.admin.restaurantReports,
    method: "GET",
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 20,
      status: params.status,
      search: params.search
    }
  }),
  detail: (id) => request({
    url: `${endpoints.admin.restaurantReports}/${id}`,
    method: "GET"
  }),
  updateStatus: (id, data) => request({
    url: endpoints.admin.reportStatus(id),
    method: "PATCH",
    data
  }),
  approve: (id, reason) => request({
    url: endpoints.admin.reportStatus(id),
    method: "PATCH",
    data: { status: "APPROVED", reason }
  }),
  reject: (id, reason) => request({
    url: endpoints.admin.reportStatus(id),
    method: "PATCH",
    data: { status: "REJECTED", reason }
  }),
  resolve: (id, reason) => request({
    url: endpoints.admin.reportStatus(id),
    method: "PATCH",
    data: { status: "RESOLVED", reason }
  })
};
const messagingService = {
  list: (params = {}) => request({
    url: endpoints.admin.sellerMessages,
    method: "GET",
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 20,
      search: params.search
    }
  }),
  send: (data) => request({
    url: endpoints.admin.sellerMessages,
    method: "POST",
    data
  }),
  markAsRead: (id) => request({
    url: `${endpoints.admin.sellerMessages}/${id}/read`,
    method: "PATCH"
  })
};
const asItems = (data) => data?.items ?? data?.content ?? data?.records ?? data?.accounts ?? data?.transactions ?? data?.reports ?? data?.messages ?? [];
function OperationsPage() {
  const qc = useQueryClient();
  const [sellerId, setSellerId] = useState("");
  const [messageTitle, setMessageTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const paymentSummary = useQuery({
    queryKey: ["ops", "payment-summary"],
    queryFn: paymentsService.summary
  });
  const mrBreadoPayments = useQuery({
    queryKey: ["ops", "mr-breado-payments"],
    queryFn: paymentsService.mrBreado
  });
  const reports = useQuery({
    queryKey: ["ops", "reports"],
    queryFn: () => reportsService.list({
      page: 1,
      perPage: 50
    })
  });
  const messages = useQuery({
    queryKey: ["ops", "seller-messages"],
    queryFn: () => messagingService.list({
      page: 1,
      perPage: 50
    })
  });
  const payoutAccounts = useQuery({
    queryKey: ["ops", "payout-accounts"],
    queryFn: () => request({
      url: endpoints.admin.sellerPayoutAccounts,
      method: "GET",
      params: {
        page: 1,
        perPage: 50
      }
    })
  });
  const sendSellerMessage = useMutation({
    mutationFn: () => messagingService.send({
      sellerId: Number(sellerId),
      title: messageTitle.trim(),
      message: messageBody.trim()
    }),
    onSuccess: () => {
      toast.success("Seller message sent");
      setSellerId("");
      setMessageTitle("");
      setMessageBody("");
      qc.invalidateQueries({
        queryKey: ["ops", "seller-messages"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const verifyPayout = useMutation({
    mutationFn: ({
      id,
      approved
    }) => request({
      url: endpoints.admin.verifySellerPayout(id),
      method: "PATCH",
      data: {
        approved,
        verified: approved,
        status: approved ? "VERIFIED" : "REJECTED"
      }
    }),
    onSuccess: () => {
      toast.success("Payout account updated");
      qc.invalidateQueries({
        queryKey: ["ops", "payout-accounts"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const updateReport = useMutation({
    mutationFn: ({
      id,
      status
    }) => reportsService.updateStatus(id, {
      status
    }),
    onSuccess: () => {
      toast.success("Report status updated");
      qc.invalidateQueries({
        queryKey: ["ops", "reports"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const payouts = asItems(payoutAccounts.data);
  const reportItems = asItems(reports.data);
  const messageItems = asItems(messages.data);
  const paymentRows = asItems(mrBreadoPayments.data);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Real World Operations", icon: /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Operations"
    }] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(MetricCard, { title: "Total Payments", value: money(paymentSummary.data?.totalAmount ?? paymentSummary.data?.totalPayments) }),
      /* @__PURE__ */ jsx(MetricCard, { title: "Online Payments", value: money(paymentSummary.data?.onlineAmount ?? paymentSummary.data?.onlinePayments) }),
      /* @__PURE__ */ jsx(MetricCard, { title: "COD / Pending", value: money(paymentSummary.data?.codAmount ?? paymentSummary.data?.pendingAmount) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]", children: [
      /* @__PURE__ */ jsxs(Panel, { title: "Seller Message Center", subtitle: "Same admin-to-seller messaging flow as the app.", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-[120px_1fr]", children: [
          /* @__PURE__ */ jsx("input", { value: sellerId, onChange: (e) => setSellerId(e.target.value), placeholder: "Seller ID", className: "rounded-md border border-input bg-background px-3 py-2 text-sm" }),
          /* @__PURE__ */ jsx("input", { value: messageTitle, onChange: (e) => setMessageTitle(e.target.value), placeholder: "Message title", className: "rounded-md border border-input bg-background px-3 py-2 text-sm" })
        ] }),
        /* @__PURE__ */ jsx("textarea", { value: messageBody, onChange: (e) => setMessageBody(e.target.value), placeholder: "Write message to seller", className: "mt-3 min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" }),
        /* @__PURE__ */ jsx("div", { className: "mt-3 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { disabled: !sellerId || !messageTitle.trim() || !messageBody.trim() || sendSellerMessage.isPending, onClick: () => sendSellerMessage.mutate(), children: [
          /* @__PURE__ */ jsx(Send, { className: "mr-2 h-4 w-4" }),
          " Send Message"
        ] }) })
      ] }),
      /* @__PURE__ */ jsx(Panel, { title: "Recent Seller Messages", subtitle: "Backend connected message history.", children: /* @__PURE__ */ jsx(MiniList, { loading: messages.isLoading, empty: "No seller messages", rows: messageItems.map((m) => ({
        title: m.title ?? m.subject ?? "Message",
        sub: [m.sellerName ?? m.seller?.name, m.createdAt].filter(Boolean).join(" · "),
        right: m.status ?? "sent"
      })) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-5 xl:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Panel, { title: "Restaurant Reports", subtitle: "Review, resolve, approve, or reject seller/customer reports.", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b text-left text-xs uppercase text-muted-foreground", children: [
          /* @__PURE__ */ jsx("th", { className: "py-2", children: "Report" }),
          /* @__PURE__ */ jsx("th", { children: "Status" }),
          /* @__PURE__ */ jsx("th", { children: "Action" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: reports.isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "py-8 text-muted-foreground", colSpan: 3, children: "Loading reports..." }) }) : reportItems.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { className: "py-8 text-muted-foreground", colSpan: 3, children: "No reports found" }) }) : reportItems.map((r) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/60", children: [
          /* @__PURE__ */ jsxs("td", { className: "py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: r.restaurantName ?? r.restaurant?.name ?? r.title ?? `Report #${r.id}` }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: r.reason ?? r.message ?? r.description ?? "—" })
          ] }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsx(StatusBadge, { status: r.status ?? "PENDING" }) }),
          /* @__PURE__ */ jsx("td", { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => updateReport.mutate({
              id: r.id,
              status: "RESOLVED"
            }), children: "Resolve" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => updateReport.mutate({
              id: r.id,
              status: "REJECTED"
            }), children: "Reject" })
          ] }) })
        ] }, r.id)) })
      ] }) }) }),
      /* @__PURE__ */ jsx(Panel, { title: "Seller Payout Accounts", subtitle: "Verify or reject bank/UPI payout accounts.", children: /* @__PURE__ */ jsx("div", { className: "space-y-3", children: payoutAccounts.isLoading ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Loading payout accounts..." }) : payouts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "No payout accounts found" }) : payouts.map((a) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border p-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: a.accountHolderName ?? a.sellerName ?? `Account #${a.id}` }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: [a.bankName, a.upiId, a.ifscCode].filter(Boolean).join(" · ") || "Bank details available in backend" })
          ] }),
          /* @__PURE__ */ jsx(StatusBadge, { status: a.status ?? (a.verified ? "VERIFIED" : "PENDING") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex gap-2", children: [
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => verifyPayout.mutate({
            id: a.id,
            approved: true
          }), children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "mr-1 h-4 w-4" }),
            "Verify"
          ] }),
          /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => verifyPayout.mutate({
            id: a.id,
            approved: false
          }), children: [
            /* @__PURE__ */ jsx(XCircle, { className: "mr-1 h-4 w-4" }),
            "Reject"
          ] })
        ] })
      ] }, a.id)) }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-5", children: /* @__PURE__ */ jsx(Panel, { title: "Mr. Breado Payment Ledger", subtitle: "Admin-side store payment records from backend.", children: /* @__PURE__ */ jsx(MiniList, { loading: mrBreadoPayments.isLoading, empty: "No payment ledger rows", rows: paymentRows.map((p) => ({
      title: p.orderNumber ?? p.paymentId ?? p.razorpayPaymentId ?? `Payment #${p.id ?? ""}`,
      sub: [p.customerName, p.paymentType, p.paymentStatus, p.createdAt].filter(Boolean).join(" · "),
      right: money(p.amount ?? p.grandTotal ?? p.totalAmount)
    })) }) }) })
  ] });
}
function MetricCard({
  title,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-card", children: [
    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: title }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-2xl font-semibold", children: value })
  ] });
}
function Panel({
  title,
  subtitle,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-border bg-card p-4 shadow-card", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: subtitle })
    ] }),
    children
  ] });
}
function MiniList({
  rows,
  loading,
  empty
}) {
  if (loading) return /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Loading..." });
  if (!rows.length) return /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: empty });
  return /* @__PURE__ */ jsx("div", { className: "divide-y divide-border", children: rows.slice(0, 8).map((row, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 py-2", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: row.title }),
      row.sub && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: row.sub })
    ] }),
    row.right && /* @__PURE__ */ jsx("div", { className: "text-xs font-semibold text-primary", children: row.right })
  ] }, i)) });
}
function money(value) {
  const n = Number(value ?? 0);
  return `₹${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
}
export {
  OperationsPage as component
};
