import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Download } from "lucide-react";
import { toast } from "sonner";
import { d as downloadBlob, s as saveBlob, r as request, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import "@tanstack/react-router";
import "react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function normalizeList(data) {
  const raw = Array.isArray(data) ? data : data?.items ?? data?.content ?? data?.transactions ?? data?.records ?? [];
  return Array.isArray(raw) ? raw : [];
}
const onlineTransactionsService = {
  async list() {
    return normalizeList(await request({ url: "/admin/online-transactions", method: "GET" }));
  },
  async downloadReceipt(id) {
    const blob = await downloadBlob({ url: `/admin/online-transactions/${id}/receipt.pdf`, method: "GET" });
    saveBlob(blob, `mr_breado_receipt_${id}.pdf`);
  }
};
function OnlineTransactionsPage() {
  const {
    data = [],
    isLoading
  } = useQuery({
    queryKey: ["online-transactions"],
    queryFn: onlineTransactionsService.list,
    staleTime: 15e3
  });
  const download = useMutation({
    mutationFn: onlineTransactionsService.downloadReceipt,
    onError: () => toast.error("Receipt could not be downloaded")
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Online Transactions", icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Online Transactions"
    }] }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border bg-card shadow-card overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-muted/50 text-left", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Txn" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Order" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Customer" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Seller" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Restaurant" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Razorpay" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Amount" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-3", children: "Receipt" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        isLoading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 9, className: "p-8 text-center", children: "Loading..." }) }) : data.map((t) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border", children: [
          /* @__PURE__ */ jsxs("td", { className: "p-3 font-bold", children: [
            "#",
            t.id
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: t.orderId || t.orderNumber || "-" }),
          /* @__PURE__ */ jsxs("td", { className: "p-3", children: [
            "#",
            t.customerId || "-",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: t.customerName || "" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "p-3", children: [
            "#",
            t.sellerId || "-",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: t.sellerName || "" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "p-3", children: [
            "#",
            t.restaurantId || "-",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: t.restaurantName || "" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "p-3", children: [
            /* @__PURE__ */ jsx("div", { children: t.razorpayOrderId || "-" }),
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: t.razorpayPaymentId || "-" })
          ] }),
          /* @__PURE__ */ jsxs("td", { className: "p-3 font-bold", children: [
            t.currency || "INR",
            " ",
            Number(t.amount || 0).toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsx(StatusBadge, { status: t.status || "UNKNOWN" }) }),
          /* @__PURE__ */ jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxs("button", { onClick: () => download.mutate(t.id), className: "inline-flex items-center gap-1 rounded-lg border px-3 py-2 font-bold hover:bg-muted", children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            "PDF"
          ] }) })
        ] }, t.id)),
        !isLoading && data.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 9, className: "p-8 text-center text-muted-foreground", children: "No online transactions found." }) })
      ] })
    ] }) })
  ] });
}
export {
  OnlineTransactionsPage as component
};
