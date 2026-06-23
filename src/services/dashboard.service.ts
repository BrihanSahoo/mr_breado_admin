import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AdminDashboardResponse } from "@/types";

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeObject<T = any>(obj: any): T {
  if (!obj || typeof obj !== "object") return obj as T;
  if (Array.isArray(obj)) return obj.map((v) => camelizeObject(v)) as T;
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    out[toCamel(k)] = camelizeObject(v);
  });
  return out as T;
}

function n(v: unknown, fallback = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fallback;
}

function upper(v: unknown) {
  return String(v ?? "").trim().toUpperCase();
}

function itemsOf(data: any): any[] {
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

function hasUsefulStats(data: any) {
  return [
    data?.totalRevenue,
    data?.totalOrders,
    data?.totalCustomers,
    data?.totalUsers,
    data?.totalDrivers,
    data?.totalDeliveryBoys,
    data?.totalRestaurants,
    data?.totalAdminCommission,
    data?.totalRestaurantPayable,
  ].some((v) => n(v) > 0);
}

async function getList(url: string, params: Record<string, any> = {}) {
  try {
    return itemsOf(await request<any>({ url, method: "GET", params: { page: 1, perPage: 500, per_page: 500, ...params } }));
  } catch (e) {
    console.debug("[dashboard] list endpoint failed", url, e);
    return [];
  }
}

export const dashboardService = {
  get: async () => {
    let data: Record<string, any> = {};

    try {
      const res = await request<Record<string, any>>({
        url: "/admin/business-metrics",
        method: "GET",
        params: { from: new Date(Date.now() - 30 * 86400000).toISOString(), to: new Date().toISOString() },
      });
      data = camelizeObject<Record<string, any>>(res);
    } catch (e) {
      console.debug("[dashboard] /admin/dashboard failed", e);
      data = {};
    }

    // v12 backend /admin/dashboard returns { users, orders, revenue, restaurants, products }.
    // Older web code expected totalUsers/totalOrders/etc, which made real data show as zero.
    const base = {
      ...data,
      totalRevenue: n(data.totalRevenue ?? data.total_revenue ?? data.revenue ?? data.grandTotal ?? data.grand_total ?? data.grossMerchandiseValue ?? data.netCollected),
      totalOrders: n(data.totalOrders ?? data.total_orders ?? data.orders ?? data.ordersCount ?? data.orderCount ?? data.order_count),
      totalCustomers: n(data.totalCustomers ?? data.total_customers ?? data.customers ?? data.customerCount ?? data.customer_count),
      totalUsers: n(data.totalUsers ?? data.total_users ?? data.users ?? data.userCount ?? data.user_count),
      totalDrivers: n(data.totalDrivers ?? data.total_drivers ?? data.drivers ?? data.deliveryBoys ?? data.driverCount ?? data.driver_count),
      totalDeliveryBoys: n(data.totalDeliveryBoys ?? data.totalDeliveryBoys ?? data.deliveryBoys ?? data.drivers ?? data.totalDrivers ?? data.driverCount),
      totalRestaurants: n(data.totalRestaurants ?? data.total_restaurants ?? data.restaurants ?? data.restaurantCount ?? data.restaurant_count),
      totalProducts: n(data.totalProducts ?? data.products ?? data.productCount ?? data.product_count),
      deliveredOrdersCount: n(data.deliveredOrdersCount ?? data.deliveredOrders ?? data.delivered_orders),
      totalAdminCommission: n(data.totalAdminCommission ?? data.total_admin_commission ?? data.adminCommission ?? data.admin_commission),
      totalRestaurantPayable: n(data.totalRestaurantPayable ?? data.total_restaurant_payable ?? data.restaurantPayable ?? data.restaurant_payable),
    };

    // Even when /admin/dashboard is useful, still enrich missing fields from real endpoints.
    try {
      const [orders, users, restaurants, drivers, payments] = await Promise.all([
        getList(endpoints.admin.orders),
        getList(endpoints.admin.users),
        getList(endpoints.admin.restaurants),
        getList(endpoints.admin.drivers),
        getList(endpoints.admin.onlineTransactions),
      ]);

      const customerUsers = users.filter((u) => ["USER", "CUSTOMER"].includes(upper(u.role)));
      const driverUsers = drivers.length > 0
        ? drivers
        : users.filter((u) => ["RIDER", "DRIVER", "DELIVERY", "DELIVERY_PARTNER"].includes(upper(u.role)));

      const ordersRevenue = orders.reduce((sum, o) => sum + n(o.grandTotal ?? o.grand_total ?? o.total ?? o.totalAmount ?? o.total_amount ?? o.amount), 0);
      const onlineRevenue = payments.reduce((sum, p) => {
        const status = upper(p.status ?? p.paymentStatus ?? p.payment_status);
        if (status && !["SUCCESS", "CAPTURED", "PAID", "COMPLETED"].some((s) => status.includes(s))) return sum;
        return sum + n(p.amount ?? p.amountRupees ?? p.amount_rupees ?? p.total);
      }, 0);
      const delivered = orders.filter((o) => upper(o.status ?? o.orderStatus ?? o.order_status).includes("DELIVER")).length;

      const dailyMap = new Map<string, { date: string; revenue: number; orders: number; online: number; cod: number }>();
      const statusBreakdown: Record<string, number> = {};
      const paymentBreakdown: Record<string, number> = {};
      for (const order of orders) {
        const created = new Date(order.createdAt ?? order.created_at ?? order.orderDate ?? Date.now());
        if (!Number.isNaN(created.getTime())) {
          const date = created.toISOString().slice(0, 10);
          const row = dailyMap.get(date) ?? { date, revenue: 0, orders: 0, online: 0, cod: 0 };
          const amount = n(order.grandTotal ?? order.grand_total ?? order.total ?? order.totalAmount ?? order.amount);
          row.revenue += amount;
          row.orders += 1;
          const method = upper(order.paymentMethod ?? order.payment_method ?? order.paymentType ?? order.payment_type);
          if (method.includes("COD") || method.includes("CASH")) row.cod += amount;
          else if (method) row.online += amount;
          dailyMap.set(date, row);
        }
        const status = upper(order.status ?? order.orderStatus ?? order.order_status) || "UNKNOWN";
        statusBreakdown[status] = (statusBreakdown[status] ?? 0) + 1;
        const payment = upper(order.paymentMethod ?? order.payment_method ?? order.paymentType ?? order.payment_type) || "UNKNOWN";
        paymentBreakdown[payment] = (paymentBreakdown[payment] ?? 0) + 1;
      }
      const dailySales = [...dailyMap.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
      const productItems = await getList(endpoints.admin.products).catch(() => []);
      const lowStockProducts = productItems.filter((p) => {
        const available = n(p.availableStock ?? p.available_stock ?? p.stockQuantity ?? p.stock_quantity ?? p.stock);
        const threshold = n(p.lowStockThreshold ?? p.low_stock_threshold, 5);
        return available <= threshold;
      }).length;

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
        totalRestaurantPayable: base.totalRestaurantPayable || 0,
        dailySales,
        statusBreakdown,
        paymentBreakdown,
        lowStockProducts,
        generatedAt: new Date().toISOString(),
      } as AdminDashboardResponse & Record<string, any>;
    } catch (e) {
      console.debug("[dashboard] fallback aggregate failed", e);
      return base as AdminDashboardResponse;
    }
  },
};
