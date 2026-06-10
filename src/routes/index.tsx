import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  LayoutDashboard, IndianRupee, ShoppingBag, Users, Bike, ArrowUpRight, Store, Loader2, FileText, Download,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDashboard } from "@/hooks/queries/use-dashboard";
import { useOrders } from "@/hooks/queries/use-orders";
import { useRestaurants } from "@/hooks/queries/use-restaurants";
import { useProducts } from "@/hooks/queries/use-products";
import { request } from "@/api/client";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(value: number | string | null | undefined) {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return "₹0";
  const opts: Intl.NumberFormatOptions = {
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: num % 1 === 0 ? 0 : 2,
  };
  return num.toLocaleString(undefined, opts);
}

export const Route = createFileRoute("/")(
  {
    head: () => ({ meta: [{ title: "Dashboard | Go4Food Admin" }] }),
    component: Dashboard,
  }
);

function useCounter(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function StatCard({ label, value, prefix = "", icon: Icon, trend, gradient, loading }: any) {
  const n = useCounter(loading ? 0 : Number(value) || 0);
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl ${gradient}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 text-2xl font-bold">{prefix}{n.toLocaleString()}</p>
          )}
          {trend != null && !loading && (
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-success">
              <ArrowUpRight className="h-3 w-3" /> +{trend}% this month
            </p>
          )}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg text-primary-foreground ${gradient}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [greeting, setGreeting] = useState("Welcome");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening"
    );
  }, []);

  const { data: stats, isLoading } = useDashboard();
  const { data: recentOrders, isLoading: ordersLoading } = useOrders({
    page: 1,
    perPage: 6,
  });
  // fetch more orders for analytics (last 100)
  const { data: allOrders, isLoading: allOrdersLoading } = useOrders({
    page: 1,
    perPage: 100,
  });
  const { data: restaurants, isLoading: restaurantsLoading } = useRestaurants({
    page: 1,
    perPage: 5,
  });
  const { data: trendingProducts, isLoading: trendingLoading } = useProducts({ page: 1, perPage: 6 });

  const { data: homeData } = useQuery({
    queryKey: ["home"],
    queryFn: async () => request<any>({ url: "/home", method: "GET" }),
    staleTime: 60_000,
  });

  const chartData =
    recentOrders?.items
      ?.slice(0, 7)
      .map((o, i) => ({
        name: `Order ${i + 1}`,
        revenue: Number(o.grandTotal ?? 0),
        orders: 1,
      })) ?? [];

  // Order analytics (status breakdown)
  const statusCounts = (allOrders?.items ?? []).reduce((acc: Record<string, number>, o: any) => {
    const s = (o.status || "UNKNOWN").toString();
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const pieData = [
    { name: "Completed", value: statusCounts["DELIVERED"] || 0, color: "#10B981" },
    { name: "Pending", value: statusCounts["PENDING"] || 0, color: "#F59E0B" },
    { name: "Cancelled", value: statusCounts["CANCELLED"] || 0, color: "#EF4444" },
  ];

  // Monthly growth (orders per month)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthMap = new Array(12).fill(0);
  (allOrders?.items ?? []).forEach((o: any) => {
    const d = new Date(o.createdAt || o.created_at || Date.now());
    monthMap[d.getMonth()] = (monthMap[d.getMonth()] || 0) + 1;
  });
  const growthData = months.map((m, i) => ({ name: m, value: monthMap[i] }));

  const viewReport = () => {
    const el = document.getElementById("dashboard-report-section");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const downloadReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Revenue", stats?.totalRevenue ?? 0],
      ["Total Orders", stats?.totalOrders ?? 0],
      ["Total Customers", stats?.totalCustomers ?? 0],
      ["Delivery Boys", stats?.totalDeliveryBoys ?? stats?.totalDrivers ?? 0],
      ["Restaurants", stats?.totalRestaurants ?? 0],
      ["Total Users", stats?.totalUsers ?? 0],
      ["Admin Commission", stats?.totalAdminCommission ?? stats?.adminCommission ?? 0],
      ["Restaurant Payable", stats?.totalRestaurantPayable ?? stats?.restaurantPayable ?? 0],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mr-breado-dashboard-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Dashboard"
        breadcrumbs={[{ label: "Dashboard" }]}
        icon={<LayoutDashboard className="h-5 w-5" />}
      />

      <div className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back 👋</p>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              {greeting}, Admin
            </h2>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Here is what's happening with your food delivery platform today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={viewReport} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow">
              <FileText className="h-4 w-4" /> View Report
            </button>
            <button onClick={downloadReport} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-accent">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={stats?.totalRevenue ?? 0}
          prefix="₹"
          icon={IndianRupee}
          gradient="gradient-primary"
          loading={isLoading}
        />
        <StatCard
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingBag}
          gradient="gradient-info"
          loading={isLoading}
        />
        <StatCard
          label="Total Customers"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          gradient="gradient-success"
          loading={isLoading}
        />
        <StatCard
          label="Delivery Boys"
          value={stats?.totalDeliveryBoys ?? 0}
          icon={Bike}
          gradient="gradient-warning"
          loading={isLoading}
        />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Restaurants"
          value={stats?.totalRestaurants ?? 0}
          icon={Store}
          gradient="gradient-info"
          loading={isLoading}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          gradient="gradient-primary"
          loading={isLoading}
        />
        <StatCard
          label="Admin Commission"
          value={stats?.totalAdminCommission ?? 0}
          prefix="₹"
          icon={IndianRupee}
          gradient="gradient-success"
          loading={isLoading}
        />
        <StatCard
          label="Restaurant Payable"
          value={stats?.totalRestaurantPayable ?? 0}
          prefix="₹"
          icon={IndianRupee}
          gradient="gradient-warning"
          loading={isLoading}
        />
      </div>

      <div id="dashboard-report-section" className="mb-6 grid scroll-mt-20 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Revenue Analytics</h3>
            <p className="text-xs text-muted-foreground">Recent orders</p>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9100" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff9100" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ff9100"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center">
              {ordersLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Order Analytics</h3>
            <p className="text-xs text-muted-foreground">Status breakdown</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="w-full" style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie dataKey="value" data={pieData} innerRadius={40} outerRadius={70} paddingAngle={4}>
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex w-full items-center justify-around text-xs">
              <a href="/orders/delivered" className="flex items-center gap-2 text-success">
                <span className="inline-block h-3 w-3 rounded-full bg-[#10B981]" />
                <div>
                  <div className="font-semibold">{pieData[0].value}</div>
                  <div className="text-muted-foreground">Completed</div>
                </div>
              </a>
              <a href="/orders/pending" className="flex items-center gap-2 text-warning">
                <span className="inline-block h-3 w-3 rounded-full bg-[#F59E0B]" />
                <div>
                  <div className="font-semibold">{pieData[1].value}</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
              </a>
              <a href="/orders/cancelled" className="flex items-center gap-2 text-destructive">
                <span className="inline-block h-3 w-3 rounded-full bg-[#EF4444]" />
                <div>
                  <div className="font-semibold">{pieData[2].value}</div>
                  <div className="text-muted-foreground">Cancelled</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Customer & Restaurant Growth</h3>
            <p className="text-xs text-muted-foreground">Monthly growth</p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" fill="#ff9100" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Top Restaurants</h3>
            <a href="/restaurants" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-1">
            {(restaurants?.items ?? [])
              .slice(0, 4)
              .sort((a: any, b: any) => (b.grossSales || 0) - (a.grossSales || 0))
              .map((r: any, idx: number) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3">
                  <div>
                    <p className="text-sm font-medium">{idx + 1}. {r.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.productCount ?? 0} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{formatCurrency(r.grossSales ?? r.restaurantPayable ?? 0)}</p>
                    <p className="text-xs text-success">+{r.adminCommission ?? 0}%</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Trending Menu */}
      <div className="mb-6 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="mb-4">
          <h3 className="text-sm font-semibold">Trending Menu</h3>
          <p className="text-xs text-muted-foreground">Popular items</p>
        </div>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
          {(trendingProducts?.items ?? homeData?.featured_foods ?? [])
            .slice(0, 6)
            .map((p: any) => (
              <div key={p.id} className="rounded-lg border border-border/50 bg-background/40 p-3 text-center">
                <div className="h-20 w-20 mx-auto rounded-md bg-muted overflow-hidden">
                  {p.image && <img src={p.image} alt={p.title || p.name} className="h-full w-full object-cover" />}
                </div>
                <p className="mt-2 text-sm font-medium">{p.title ?? p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">₹{formatCurrency(p.price ?? p.discountPrice ?? p.effectivePrice ?? 0)} • {p.rating ?? 0} ⭐</p>
              </div>
            ))}
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Popular Restaurants</h3>
            <a href="/restaurants" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(homeData?.popular_restaurants ?? restaurants?.items ?? [])
              .slice(0, 6)
              .map((r: any) => (
                <div key={r.id} className="rounded-lg border border-border/50 bg-background/40 p-3">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.cuisineType ?? r.slug}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Orders</h3>
            <a href="/orders" className="text-xs text-primary hover:underline">View all</a>
          </div>
          <div className="space-y-2">
            {(recentOrders?.items ?? []).slice(0, 6).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3">
                <div>
                  <p className="text-sm font-medium">Order #{order.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt ?? order.created_at ?? Date.now()).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-semibold">₹{formatCurrency(order.grandTotal ?? order.grand_total ?? order.payable_now ?? 0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
