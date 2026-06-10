import { downloadBlob, request, saveBlob } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export type ListQuery = {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sort?: string;
  role?: string;
  type?: string;
  restaurantId?: number | string;
  driverId?: number | string;
  paymentStatus?: string;
  verificationStatus?: string;
  inStock?: boolean;
};

const listParams = (q: ListQuery = {}) => ({
  page: q.page ?? 1,
  per_page: q.perPage ?? 10,
  perPage: q.perPage ?? 10,
  status: q.status || undefined,
  search: q.search || undefined,
  sort: q.sort || undefined,
  role: q.role || undefined,
  type: q.type || undefined,
  restaurant_id: q.restaurantId || undefined,
  restaurantId: q.restaurantId || undefined,
  driver_id: q.driverId || undefined,
  driverId: q.driverId || undefined,
  payment_status: q.paymentStatus || undefined,
  paymentStatus: q.paymentStatus || undefined,
  verification_status: q.verificationStatus || undefined,
  verificationStatus: q.verificationStatus || undefined,
  in_stock: q.inStock,
  inStock: q.inStock,
});

export const adminPanelService = {
  dashboardOverview: () => request<any>({ url: endpoints.admin.dashboardOverview, method: "GET" }),
  dashboardRevenue: () => request<any>({ url: endpoints.admin.dashboardRevenue, method: "GET" }),
  dashboardPayments: () => request<any>({ url: endpoints.admin.dashboardPayments, method: "GET" }),
  dashboardRecentOrders: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.dashboardRecentOrders, method: "GET", params: listParams(q) }),
  dashboardTrendingMenu: () => request<any>({ url: endpoints.admin.dashboardTrendingMenu, method: "GET" }),
  dashboardPopularRestaurants: () => request<any>({ url: endpoints.admin.dashboardPopularRestaurants, method: "GET" }),
  dashboardTopRestaurants: () => request<any>({ url: endpoints.admin.dashboardTopRestaurants, method: "GET" }),

  customers: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.customers, method: "GET", params: listParams(q) }),
  customer: (id: string | number) => request<any>({ url: endpoints.admin.customerById(id), method: "GET" }),
  updateCustomer: (id: string | number, data: any) => request<any>({ url: endpoints.admin.customerById(id), method: "PUT", data }),
  deleteCustomer: (id: string | number) => request<any>({ url: endpoints.admin.customerById(id), method: "DELETE" }),
  setCustomerStatus: (id: string | number, enabled: boolean) => request<any>({ url: endpoints.admin.userStatus(id), method: "PUT", data: { enabled } }),

  owners: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.owners, method: "GET", params: listParams(q) }),
  owner: (id: string | number) => request<any>({ url: endpoints.admin.ownerById(id), method: "GET" }),
  setOwnerStatus: (id: string | number, enabled: boolean) => request<any>({ url: endpoints.admin.ownerStatus(id), method: "PATCH", data: { enabled } }),
  setOwnerVerification: (id: string | number, verified: boolean) => request<any>({ url: endpoints.admin.ownerVerification(id), method: "PATCH", data: { verified } }),

  restaurants: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.restaurants, method: "GET", params: listParams(q) }),
  restaurant: (id: string | number) => request<any>({ url: endpoints.admin.restaurantDetails(id), method: "GET" }),
  createRestaurant: (data: any) => request<any>({ url: endpoints.admin.restaurants, method: "POST", data }),
  updateRestaurant: (id: string | number, data: any) => request<any>({ url: endpoints.admin.restaurantById(id), method: "PUT", data }),
  setRestaurantStatus: (id: string | number, enabled: boolean) => request<any>({ url: endpoints.admin.restaurantStatus(id), method: "PATCH", data: { enabled } }),
  setRestaurantOnline: (id: string | number, online: boolean) => request<any>({ url: endpoints.admin.restaurantOnlineStatus(id), method: "PATCH", data: { online } }),

  drivers: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.drivers, method: "GET", params: listParams(q) }),
  driver: (id: string | number) => request<any>({ url: endpoints.admin.driverById(id), method: "GET" }),
  setDriverStatus: (id: string | number, enabled: boolean) => request<any>({ url: endpoints.admin.driverStatus(id), method: "PATCH", data: { enabled } }),
  setDriverVerification: (id: string | number, verified: boolean) => request<any>({ url: endpoints.admin.driverVerification(id), method: "PATCH", data: { verified } }),
  driverVerificationRequests: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.driverVerificationRequests, method: "GET", params: listParams(q) }),
  driverVerificationDetails: (id: string | number) => request<any>({ url: endpoints.admin.driverVerificationDetails(id), method: "GET" }),

  products: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.products, method: "GET", params: listParams(q) }),
  product: (id: string | number) => request<any>({ url: endpoints.admin.productDetails(id), method: "GET" }),
  setProductStock: (id: string | number, inStock: boolean) => request<any>({ url: endpoints.admin.productStock(id), method: "PATCH", data: { in_stock: inStock, inStock } }),
  deleteProduct: (id: string | number) => request<any>({ url: endpoints.admin.productById(id), method: "DELETE" }),

  adminProducts: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.mrBreado.products, method: "GET", params: listParams(q) }),
  adminProduct: (id: string | number) => request<any>({ url: endpoints.admin.mrBreado.productById(id), method: "GET" }),
  setAdminProductStock: (id: string | number, inStock: boolean) => request<any>({ url: endpoints.admin.mrBreado.productAvailability(id), method: "PATCH", data: { isAvailable: inStock, in_stock: inStock, inStock } }),
  downloadAdminProductTemplate: async () => saveBlob(await downloadBlob({ url: endpoints.admin.mrBreado.template, method: "GET" }), "mr-breado-products-template.xlsx"),
  exportAdminProducts: async () => saveBlob(await downloadBlob({ url: endpoints.admin.mrBreado.export, method: "GET" }), "mr-breado-products.csv"),

  orders: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.mrBreado.orders, method: "GET", params: listParams(q) }),
  downloadInvoice: async (id: string | number) => saveBlob(await downloadBlob({ url: endpoints.admin.mrBreado.invoicePdf(id), method: "GET" }), `invoice-${id}.pdf`),
  sendInvoice: (id: string | number) => request<any>({ url: endpoints.admin.mrBreado.sendInvoice(id), method: "POST" }),

  categories: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.categories, method: "GET", params: listParams(q) }),
  categorySummary: () => request<any>({ url: endpoints.admin.categorySummary, method: "GET" }),
  createCategory: (data: any) => request<any>({ url: endpoints.admin.categories, method: "POST", data }),
  updateCategory: (id: string | number, data: any) => request<any>({ url: endpoints.admin.categoryById(id), method: "PUT", data }),
  setCategoryStatus: (id: string | number, active: boolean) => request<any>({ url: endpoints.admin.categoryStatus(id), method: "PATCH", data: { active, enabled: active, status: active ? "ACTIVE" : "INACTIVE" } }),
  deleteCategory: (id: string | number) => request<any>({ url: endpoints.admin.categoryById(id), method: "DELETE" }),

  supportDashboard: () => request<any>({ url: endpoints.admin.supportDashboard, method: "GET" }),
  supportTickets: (q: ListQuery = {}) => request<any>({ url: endpoints.admin.supportTickets, method: "GET", params: listParams(q) }),
  supportTicket: (id: string | number) => request<any>({ url: endpoints.admin.supportTicketById(id), method: "GET" }),
  acceptSupportTicket: (id: string | number) => request<any>({ url: endpoints.admin.supportTicketAccept(id), method: "PATCH" }),
  updateSupportTicketStatus: (id: string | number, status: string) => request<any>({ url: endpoints.admin.supportTicketStatus(id), method: "PATCH", data: { status } }),

  sendNotification: (target: "all" | "customers" | "sellers" | "drivers", data: any) => {
    const url = target === "all" ? endpoints.admin.notifications.sendToAll : target === "customers" ? endpoints.admin.notifications.sendToCustomers : target === "sellers" ? endpoints.admin.notifications.sendToSellers : endpoints.admin.notifications.sendToDrivers;
    return request<any>({ url, method: "POST", data });
  },

  restaurantSettings: () => request<any>({ url: endpoints.admin.restaurantSettings, method: "GET" }),
  updateRestaurantSettings: (data: any) => request<any>({ url: endpoints.admin.restaurantSettings, method: "PUT", data }),
  driverSettings: () => request<any>({ url: endpoints.admin.driverSettings, method: "GET" }),
  updateDriverSettings: (data: any) => request<any>({ url: endpoints.admin.driverSettings, method: "PUT", data }),
  mapSettings: () => request<any>({ url: endpoints.admin.mapSettings, method: "GET" }),
  updateMapSettings: (data: any) => request<any>({ url: endpoints.admin.mapSettings, method: "PUT", data }),
  commissionSettings: () => request<any>({ url: endpoints.admin.commissionSettings, method: "GET" }),
  updateVendorCommission: (data: any) => request<any>({ url: endpoints.admin.vendorCommissionSettings, method: "PUT", data }),
  updateDriverCommission: (data: any) => request<any>({ url: endpoints.admin.driverCommissionSettings, method: "PUT", data }),
  platformFeeSettings: () => request<any>({ url: endpoints.admin.platformFeeSettings, method: "GET" }),
  updatePlatformFeeSettings: (data: any) => request<any>({ url: endpoints.admin.platformFeeSettings, method: "PUT", data }),
  paymentGateways: () => request<any>({ url: endpoints.admin.paymentGatewaySettings, method: "GET" }),
  updatePaymentGateways: (data: any) => request<any>({ url: endpoints.admin.paymentGatewaySettings, method: "PUT", data }),
};
