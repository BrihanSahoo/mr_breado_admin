import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { r as request, e as endpoints, c as cn, G as useOrders, u as useProducts, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { LayoutDashboard, FileText, Download, IndianRupee, ShoppingBag, Users, Bike, Store, Loader2, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { u as useRestaurants } from "./use-restaurants-Dgr4GgWu.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "./restaurants.service-Dw86oKrx.js";
function toCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function camelizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((v) => camelizeObject(v));
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    out[toCamel(k)] = camelizeObject(v);
  });
  return out;
}
function n(v, fallback = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}
function upper(v) {
  return String(v ?? "").trim().toUpperCase();
}
function itemsOf(data) {
  const d = data?.data ?? data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.orders)) return d.orders;
  if (Array.isArray(d?.users)) return d.users;
  if (Array.isArray(d?.customers)) return d.customers;
  if (Array.isArray(d?.restaurants)) return d.restaurants;
  if (Array.isArray(d?.drivers)) return d.drivers;
  if (Array.isArray(d?.products)) return d.products;
  if (Array.isArray(d?.transactions)) return d.transactions;
  return [];
}
async function getList(url, params = {}) {
  try {
    return itemsOf(await request({ url, method: "GET", params: { page: 1, perPage: 500, per_page: 500, ...params } }));
  } catch (e) {
    console.debug("[dashboard] list endpoint failed", url, e);
    return [];
  }
}
const dashboardService = {
  get: async () => {
    let data = {};
    try {
      const res = await request({
        url: "/admin/head-office/dashboard",
        method: "GET"
      });
      data = camelizeObject(res);
    } catch (e) {
      console.debug("[dashboard] /admin/dashboard failed", e);
      data = {};
    }
    const base = {
      ...data,
      totalRevenue: n(data.totalRevenue ?? data.total_revenue ?? data.revenue ?? data.grandTotal ?? data.grand_total),
      totalOrders: n(data.totalOrders ?? data.total_orders ?? data.orders ?? data.ordersCount ?? data.orderCount ?? data.order_count),
      totalCustomers: n(data.totalCustomers ?? data.total_customers ?? data.customers ?? data.customerCount ?? data.customer_count),
      totalUsers: n(data.totalUsers ?? data.total_users ?? data.users ?? data.userCount ?? data.user_count),
      totalDrivers: n(data.totalDrivers ?? data.total_drivers ?? data.drivers ?? data.deliveryBoys ?? data.driverCount ?? data.driver_count),
      totalDeliveryBoys: n(data.totalDeliveryBoys ?? data.totalDeliveryBoys ?? data.deliveryBoys ?? data.drivers ?? data.totalDrivers ?? data.driverCount),
      totalRestaurants: n(data.totalRestaurants ?? data.total_restaurants ?? data.restaurants ?? data.restaurantCount ?? data.restaurant_count),
      totalProducts: n(data.totalProducts ?? data.products ?? data.productCount ?? data.product_count),
      deliveredOrdersCount: n(data.deliveredOrdersCount ?? data.deliveredOrders ?? data.delivered_orders),
      totalAdminCommission: n(data.totalAdminCommission ?? data.total_admin_commission ?? data.adminCommission ?? data.admin_commission),
      totalRestaurantPayable: n(data.totalRestaurantPayable ?? data.total_restaurant_payable ?? data.restaurantPayable ?? data.restaurant_payable)
    };
    try {
      const [orders, users, restaurants, drivers, payments] = await Promise.all([
        getList(endpoints.admin.orders),
        getList(endpoints.admin.users),
        getList(endpoints.admin.restaurants),
        getList(endpoints.admin.drivers),
        getList(endpoints.admin.onlineTransactions)
      ]);
      const customerUsers = users.filter((u) => ["USER", "CUSTOMER"].includes(upper(u.role)));
      const driverUsers = drivers.length > 0 ? drivers : users.filter((u) => ["RIDER", "DRIVER", "DELIVERY", "DELIVERY_PARTNER"].includes(upper(u.role)));
      const ordersRevenue = orders.reduce((sum, o) => sum + n(o.grandTotal ?? o.grand_total ?? o.total ?? o.totalAmount ?? o.total_amount ?? o.amount), 0);
      const onlineRevenue = payments.reduce((sum, p) => {
        const status = upper(p.status ?? p.paymentStatus ?? p.payment_status);
        if (status && !["SUCCESS", "CAPTURED", "PAID", "COMPLETED"].some((s) => status.includes(s))) return sum;
        return sum + n(p.amount ?? p.amountRupees ?? p.amount_rupees ?? p.total);
      }, 0);
      const delivered = orders.filter((o) => upper(o.status ?? o.orderStatus ?? o.order_status).includes("DELIVER")).length;
      return {
        ...base,
        totalRevenue: base.totalRevenue || ordersRevenue || onlineRevenue,
        totalOrders: base.totalOrders || orders.length,
        totalCustomers: base.totalCustomers || customerUsers.length,
        totalUsers: base.totalUsers || users.length || customerUsers.length,
        totalRestaurants: base.totalRestaurants || restaurants.length,
        totalDrivers: base.totalDrivers || driverUsers.length,
        totalDeliveryBoys: base.totalDeliveryBoys || driverUsers.length,
        deliveredOrdersCount: base.deliveredOrdersCount || delivered,
        totalAdminCommission: base.totalAdminCommission || 0,
        totalRestaurantPayable: base.totalRestaurantPayable || 0
      };
    } catch (e) {
      console.debug("[dashboard] fallback aggregate failed", e);
      return base;
    }
  }
};
const dashboardKeys = { all: ["dashboard"] };
function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardService.get,
    staleTime: 3e4
  });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
function formatCurrency(value) {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "₹0";
  const opts = {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2
  };
  return num.toLocaleString(void 0, opts);
}
function useCounter(target, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}
function StatCard({
  label,
  value,
  prefix = "",
  icon: Icon,
  trend,
  gradient,
  loading
}) {
  const n2 = useCounter(loading ? 0 : Number(value) || 0);
  return /* @__PURE__ */ jsxs("div", { className: "group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow", children: [
    /* @__PURE__ */ jsx("div", { className: `absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl ${gradient}` }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex items-start justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-muted-foreground", children: label }),
        loading ? /* @__PURE__ */ jsx(Skeleton, { className: "mt-2 h-8 w-24" }) : /* @__PURE__ */ jsxs("p", { className: "mt-2 text-2xl font-bold", children: [
          prefix,
          n2.toLocaleString()
        ] }),
        trend != null && !loading && /* @__PURE__ */ jsxs("p", { className: "mt-1 inline-flex items-center gap-1 text-xs text-success", children: [
          /* @__PURE__ */ jsx(ArrowUpRight, { className: "h-3 w-3" }),
          " +",
          trend,
          "% this month"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-lg text-primary-foreground ${gradient}`, children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) })
    ] })
  ] });
}
function Dashboard() {
  const [greeting, setGreeting] = useState("Welcome");
  useEffect(() => {
    const h = (/* @__PURE__ */ new Date()).getHours();
    setGreeting(h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening");
  }, []);
  const {
    data: stats,
    isLoading
  } = useDashboard();
  const {
    data: recentOrders,
    isLoading: ordersLoading
  } = useOrders({
    page: 1,
    perPage: 6
  });
  const {
    data: allOrders,
    isLoading: allOrdersLoading
  } = useOrders({
    page: 1,
    perPage: 100
  });
  const {
    data: restaurants,
    isLoading: restaurantsLoading
  } = useRestaurants({
    page: 1,
    perPage: 5
  });
  const {
    data: trendingProducts,
    isLoading: trendingLoading
  } = useProducts({
    page: 1,
    perPage: 6
  });
  const {
    data: homeData
  } = useQuery({
    queryKey: ["home"],
    queryFn: async () => request({
      url: "/home",
      method: "GET"
    }),
    staleTime: 6e4
  });
  const chartData = recentOrders?.items?.slice(0, 7).map((o, i) => ({
    name: `Order ${i + 1}`,
    revenue: Number(o.grandTotal ?? 0),
    orders: 1
  })) ?? [];
  const statusCounts = (allOrders?.items ?? []).reduce((acc, o) => {
    const s = (o.status || "UNKNOWN").toString();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const pieData = [{
    name: "Completed",
    value: statusCounts["DELIVERED"] || 0,
    color: "#10B981"
  }, {
    name: "Pending",
    value: statusCounts["PENDING"] || 0,
    color: "#F59E0B"
  }, {
    name: "Cancelled",
    value: statusCounts["CANCELLED"] || 0,
    color: "#EF4444"
  }];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthMap = new Array(12).fill(0);
  (allOrders?.items ?? []).forEach((o) => {
    const d = new Date(o.createdAt || o.created_at || Date.now());
    monthMap[d.getMonth()] = (monthMap[d.getMonth()] || 0) + 1;
  });
  const growthData = months.map((m, i) => ({
    name: m,
    value: monthMap[i]
  }));
  const viewReport = () => {
    const el = document.getElementById("dashboard-report-section");
    el?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };
  const downloadReport = () => {
    const rows = [["Metric", "Value"], ["Total Revenue", stats?.totalRevenue ?? 0], ["Total Orders", stats?.totalOrders ?? 0], ["Total Customers", stats?.totalCustomers ?? 0], ["Delivery Boys", stats?.totalDeliveryBoys ?? stats?.totalDrivers ?? 0], ["Restaurants", stats?.totalRestaurants ?? 0], ["Total Users", stats?.totalUsers ?? 0], ["Admin Commission", stats?.totalAdminCommission ?? stats?.adminCommission ?? 0], ["Restaurant Payable", stats?.totalRestaurantPayable ?? stats?.restaurantPayable ?? 0]];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mr-breado-dashboard-report-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Dashboard", breadcrumbs: [{
      label: "Dashboard"
    }], icon: /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative mb-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full gradient-primary opacity-20 blur-3xl" }),
      /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Welcome back 👋" }),
          /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold tracking-tight md:text-3xl", children: [
            greeting,
            ", Admin"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-xl text-sm text-muted-foreground", children: "Here is what's happening with your food delivery platform today." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: viewReport, className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow", children: [
            /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }),
            " View Report"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: downloadReport, className: "inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-accent", children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            " Download"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Total Revenue", value: stats?.totalRevenue ?? 0, prefix: "₹", icon: IndianRupee, gradient: "gradient-primary", loading: isLoading }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: ShoppingBag, gradient: "gradient-info", loading: isLoading }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Customers", value: stats?.totalCustomers ?? 0, icon: Users, gradient: "gradient-success", loading: isLoading }),
      /* @__PURE__ */ jsx(StatCard, { label: "Delivery Boys", value: stats?.totalDeliveryBoys ?? 0, icon: Bike, gradient: "gradient-warning", loading: isLoading })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Restaurants", value: stats?.totalRestaurants ?? 0, icon: Store, gradient: "gradient-info", loading: isLoading }),
      /* @__PURE__ */ jsx(StatCard, { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, gradient: "gradient-primary", loading: isLoading }),
      /* @__PURE__ */ jsx(StatCard, { label: "Admin Commission", value: stats?.totalAdminCommission ?? 0, prefix: "₹", icon: IndianRupee, gradient: "gradient-success", loading: isLoading }),
      /* @__PURE__ */ jsx(StatCard, { label: "Restaurant Payable", value: stats?.totalRestaurantPayable ?? 0, prefix: "₹", icon: IndianRupee, gradient: "gradient-warning", loading: isLoading })
    ] }),
    /* @__PURE__ */ jsxs("div", { id: "dashboard-report-section", className: "mb-6 grid scroll-mt-20 gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Revenue Analytics" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Recent orders" })
        ] }),
        chartData.length > 0 ? /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxs(AreaChart, { data: chartData, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorRevenue", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#ff9100", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#ff9100", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2937" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#6b7280" }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#6b7280" }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "#ff9100", fillOpacity: 1, fill: "url(#colorRevenue)" })
        ] }) }) : /* @__PURE__ */ jsx("div", { className: "flex h-[250px] items-center justify-center", children: ordersLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No data available" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Order Analytics" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Status breakdown" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "w-full", style: {
            height: 160
          }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: 160, children: /* @__PURE__ */ jsx(PieChart, { children: /* @__PURE__ */ jsx(Pie, { dataKey: "value", data: pieData, innerRadius: 40, outerRadius: 70, paddingAngle: 4, children: pieData.map((entry, idx) => /* @__PURE__ */ jsx(Cell, { fill: entry.color }, `cell-${idx}`)) }) }) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-center justify-around text-xs", children: [
            /* @__PURE__ */ jsxs("a", { href: "/orders/delivered", className: "flex items-center gap-2 text-success", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block h-3 w-3 rounded-full bg-[#10B981]" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: pieData[0].value }),
                /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Completed" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "/orders/pending", className: "flex items-center gap-2 text-warning", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block h-3 w-3 rounded-full bg-[#F59E0B]" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: pieData[1].value }),
                /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Pending" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("a", { href: "/orders/cancelled", className: "flex items-center gap-2 text-destructive", children: [
              /* @__PURE__ */ jsx("span", { className: "inline-block h-3 w-3 rounded-full bg-[#EF4444]" }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold", children: pieData[2].value }),
                /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Cancelled" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Customer & Restaurant Growth" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Monthly growth" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-[220px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: growthData, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2937" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name", stroke: "#6b7280" }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#6b7280" }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "value", fill: "#ff9100" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Top Restaurants" }),
          /* @__PURE__ */ jsx("a", { href: "/restaurants", className: "text-xs text-primary hover:underline", children: "View all" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-1 lg:grid-cols-1", children: (restaurants?.items ?? []).slice(0, 4).sort((a, b) => (b.grossSales || 0) - (a.grossSales || 0)).map((r, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
              idx + 1,
              ". ",
              r.name
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
              r.productCount ?? 0,
              " orders"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-semibold", children: [
              "₹",
              formatCurrency(r.grossSales ?? r.restaurantPayable ?? 0)
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs text-success", children: [
              "+",
              r.adminCommission ?? 0,
              "%"
            ] })
          ] })
        ] }, r.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-xl border border-border bg-card p-5 shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Trending Menu" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Popular items" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6", children: (trendingProducts?.items ?? homeData?.featured_foods ?? []).slice(0, 6).map((p) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/50 bg-background/40 p-3 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "h-20 w-20 mx-auto rounded-md bg-muted overflow-hidden", children: p.image && /* @__PURE__ */ jsx("img", { src: p.image, alt: p.title || p.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium", children: p.title ?? p.name }),
        /* @__PURE__ */ jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
          "₹",
          formatCurrency(p.price ?? p.discountPrice ?? p.effectivePrice ?? 0),
          " • ",
          p.rating ?? 0,
          " ⭐"
        ] })
      ] }, p.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6 grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Popular Restaurants" }),
          /* @__PURE__ */ jsx("a", { href: "/restaurants", className: "text-xs text-primary hover:underline", children: "View all" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: (homeData?.popular_restaurants ?? restaurants?.items ?? []).slice(0, 6).map((r) => /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border/50 bg-background/40 p-3", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-medium", children: r.name }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: r.cuisineType ?? r.slug })
        ] }, r.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold", children: "Recent Orders" }),
          /* @__PURE__ */ jsx("a", { href: "/orders", className: "text-xs text-primary hover:underline", children: "View all" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: (recentOrders?.items ?? []).slice(0, 6).map((order) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium", children: [
              "Order #",
              order.id
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: new Date(order.createdAt ?? order.created_at ?? Date.now()).toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(StatusBadge, { status: order.status }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold", children: [
              "₹",
              formatCurrency(order.grandTotal ?? order.grand_total ?? order.payable_now ?? 0)
            ] })
          ] })
        ] }, order.id)) })
      ] })
    ] })
  ] });
}
export {
  Dashboard as component
};
