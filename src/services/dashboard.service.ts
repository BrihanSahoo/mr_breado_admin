import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AdminDashboardResponse } from "@/types";

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeObject<T = any>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== "object") return obj as unknown as T;
  if (Array.isArray(obj)) return obj.map((v) => camelizeObject(v)) as unknown as T;
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    const key = toCamel(k);
    out[key] = camelizeObject(v);
  });
  return out as unknown as T;
}

export const dashboardService = {
  get: async () => {
    const res = await request<Record<string, any>>({
      url: endpoints.admin.dashboard,
      method: "GET",
    });
    const data = camelizeObject<Record<string, any>>(res);
    // Provide explicit aliases expected by the UI
    return {
      ...data,
      totalRevenue: data.totalRevenue ?? Number(data.total_revenue) ?? 0,
      totalOrders: data.totalOrders ?? Number(data.total_orders) ?? 0,
      totalCustomers: data.totalCustomers ?? Number(data.total_customers) ?? 0,
      totalUsers: data.totalUsers ?? Number(data.total_users) ?? 0,
      totalDrivers: data.totalDrivers ?? Number(data.total_drivers) ?? 0,
      totalDeliveryBoys: data.totalDeliveryBoys ?? data.totalDrivers ?? 0,
      deliveredOrdersCount: data.deliveredOrdersCount ?? data.deliveredOrders ?? 0,
      totalAdminCommission: data.totalAdminCommission ?? data.adminCommission ?? 0,
      totalRestaurantPayable: data.totalRestaurantPayable ?? data.restaurantPayable ?? 0,
    } as AdminDashboardResponse;
  },
};
