import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { r as request, e as endpoints, P as PageHeader } from "./router-1xz68c6T.js";
import { S as ServerTable } from "./server-table-DGG5E-Fc.js";
import { MessageSquare, Star } from "lucide-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const reviewsService = {
  list: (params = {}) => request({
    url: endpoints.admin.reviews,
    method: "GET",
    params: { page: params.page ?? 1, perPage: params.perPage ?? 20 }
  })
};
const reviewKeys = {
  all: ["reviews"],
  list: (q) => ["reviews", "list", q]
};
function useReviews(query) {
  return useQuery({
    queryKey: reviewKeys.list(query),
    queryFn: () => reviewsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function Rating({
  value
}) {
  const v = Math.round(value ?? 0);
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-0.5 text-warning", children: [
    Array.from({
      length: 5
    }).map((_, i) => /* @__PURE__ */ jsx(Star, { className: `h-3 w-3 ${i < v ? "fill-current" : "opacity-30"}` }, i)),
    /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs text-foreground", children: value ?? 0 })
  ] });
}
function ReviewsPage() {
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useReviews({
    page,
    perPage: 20
  });
  const items = data?.items ?? [];
  const cols = [{
    key: "order",
    header: "Order",
    render: (r) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "font-mono text-primary", children: r.orderNumber }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
        "#",
        r.orderId
      ] })
    ] })
  }, {
    key: "restaurantRating",
    header: "Restaurant",
    render: (r) => /* @__PURE__ */ jsx(Rating, { value: r.restaurantRating })
  }, {
    key: "restaurantComment",
    header: "Restaurant comment",
    render: (r) => /* @__PURE__ */ jsx("span", { className: "line-clamp-2 max-w-md text-xs text-muted-foreground", children: r.restaurantComment || "—" })
  }, {
    key: "driverRating",
    header: "Driver",
    render: (r) => /* @__PURE__ */ jsx(Rating, { value: r.driverRating })
  }, {
    key: "driverComment",
    header: "Driver comment",
    render: (r) => /* @__PURE__ */ jsx("span", { className: "line-clamp-2 max-w-md text-xs text-muted-foreground", children: r.driverComment || "—" })
  }, {
    key: "createdAt",
    header: "Date",
    render: (r) => r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Reviews", icon: /* @__PURE__ */ jsx(MessageSquare, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Reviews"
    }] }),
    /* @__PURE__ */ jsx(ServerTable, { title: `${data?.total ?? 0} reviews`, columns: cols, items, page, totalPages: data?.total_pages ?? 1, total: data?.total ?? 0, isLoading, isFetching, error, onPageChange: setPage, rowKey: (r) => r.id })
  ] });
}
export {
  ReviewsPage as component
};
