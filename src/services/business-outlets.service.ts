import { request, downloadBlob, saveBlob } from "@/api/client";

export type Outlet = {
  id: string;
  outletId: string;
  outletCode?: string;
  name: string;
  outletName?: string;
  address?: string;
  city?: string;
  pincode?: string;
  isOpen?: boolean;
  serviceRadiusKm?: number;
  gstin?: string;
  invoiceLegalName?: string;
  invoiceAddress?: string;
  totalSales?: number;
  onlineSales?: number;
  codSales?: number;
  orderCount?: number;
  lowStockCount?: number;
  productCount?: number;
  topFoods?: any[];
  slowFoods?: any[];
};

async function tryRequest<T = any>(configs: Array<Record<string, any>>, fallback: T): Promise<T> {
  let lastError: any;
  for (const config of configs) {
    try { return await request<T>(config); }
    catch (error: any) { lastError = error; if (error?.status !== 404) break; }
  }
  if (lastError?.status && lastError.status !== 404) throw lastError;
  return fallback;
}

function deepImage(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value === '[object Object]' ? '' : value;
  if (Array.isArray(value)) return deepImage(value[0]);
  if (typeof value === 'object') return deepImage(value.secure_url ?? value.secureUrl ?? value.url ?? value.src ?? value.path ?? value.image ?? value.imageUrl ?? value.thumbnail);
  return '';
}

function rowsFrom(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  return payload?.items ?? payload?.outlets ?? payload?.restaurants ?? payload?.data?.items ?? payload?.data?.outlets ?? [];
}

export const businessOutletsService = {
  ensureSchema: () => Promise.resolve({ success: true }),
  dashboard: async (params?: Record<string, any>) => {
    const direct = await tryRequest<any>([
      { url: "/admin/business/dashboard", params },
      { url: "/admin/outlets/dashboard", params },
    ], null);
    if (direct) return direct;
    const listing = await tryRequest<any>([
      { url: "/admin/outlets" },
      { url: "/admin/restaurants" },
    ], { items: [] });
    const outlets = rowsFrom(listing);
    return { outlets, totalOutlets: outlets.length, totalOrders: 0, totalSales: 0, onlineSales: 0 };
  },
  list: () => tryRequest<any>([
    { url: "/admin/outlets" },
    { url: "/admin/restaurants" },
    { url: "/admin/mr-breado/restaurant" },
  ], { items: [] }).then((payload: any) => {
    const rows = rowsFrom(payload);
    if (rows.length) return { ...payload, items: rows, outlets: rows };
    const single = payload?.outlet ?? payload?.restaurant ?? payload?.data;
    return single && !Array.isArray(single) ? { items: [single], outlets: [single] } : { items: [], outlets: [] };
  }),
  createOutlet: (data: Record<string, any>) => request<any>({ method: "POST", url: "/admin/outlets", data }),
  updateOutlet: (id: number | string, data: Record<string, any>) => request<any>({ method: "PUT", url: `/admin/outlets/${id}`, data }),
  getGstin: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/gstin` }),
  saveGstin: (id: number | string, data: Record<string, any>) => request<any>({ method: "PUT", url: `/admin/outlets/${id}/gstin`, data }),
  businessAudit: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/business-audit` }),
  stockSubmissions: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/stock-submissions` }),
  setCredentials: (id: number | string, data: Record<string, any>) => request<any>({ method: "POST", url: `/admin/outlets/${id}/credentials`, data }),
  calendar: (id: number | string, params?: Record<string, any>) => request<any>({ url: `/admin/outlets/${id}/calendar`, params }),
  performance: (id: number | string, params?: Record<string, any>) => request<any>({ url: `/admin/outlets/${id}/performance`, params }),
  updateStock: (id: number | string, items: any[]) => request<any>({ method: "POST", url: `/admin/outlets/${id}/stock`, data: { items } }),
  availableProducts: async (id: number | string) => {
    const data = await request<any>({ url: `/admin/outlets/${id}/available-products` });
    const allRaw = data?.all ?? data?.products ?? [];
    const assignedRaw = data?.assigned ?? data?.items ?? [];
    const normalize = (row: any) => ({ ...row, id: row.id ?? row._id ?? row.productId, productId: row.productId?._id ?? row.productId ?? row.id ?? row._id, title: row.title ?? row.name ?? row.productName, productName: row.productName ?? row.title ?? row.name, imageUrl: deepImage(row.imageUrl ?? row.image ?? row.images ?? row.productId?.images), image: deepImage(row.imageUrl ?? row.image ?? row.images ?? row.productId?.images), foodType: row.foodType ?? row.food_type ?? row.productId?.foodType, isVeg: String(row.foodType ?? row.food_type ?? row.productId?.foodType ?? '').toUpperCase() === 'VEG' || row.isVeg === true, categoryName: row.categoryName ?? row.categoryId?.name ?? row.productId?.categoryId?.name ?? '' });
    return { ...data, all: allRaw.map(normalize), assigned: assignedRaw.map(normalize) };
  },
  productCatalog: () => request<any>({ url: "/admin/products/catalog" }),
  saveBranding: (id: number | string, data: Record<string, any>) => request<any>({ method: "POST", url: `/admin/outlets/${id}/branding`, data }),
  exportAccounting: async (from: string, to: string) => {
    const blob = await downloadBlob({ url: "/admin/reports/accounting-export.csv", params: { from, to } });
    saveBlob(blob, `mr_breado_accounting_${from}_${to}.csv`);
  },
};

export const businessOutletsV41Service = {
  ensureSchema: () => Promise.resolve({ success: true }),
  fullDashboard: async (id: number | string, params?: Record<string, any>) => {
    const data = await tryRequest<any>([
      { url: `/admin/outlets/${id}/full-dashboard`, params },
      { url: `/admin/outlets/${id}/dashboard`, params },
      { url: `/admin/outlets/${id}`, params },
    ], null);
    if (!data) throw Object.assign(new Error("Outlet endpoint not found"), { status: 404 });
    const inventory = (data?.inventory ?? []).map((row: any) => ({
      ...row,
      productId: row.productId?.id ?? row.productId?._id ?? row.productId,
      productName: row.productId?.name ?? row.productName ?? "Food item",
      imageUrl: row.productId?.images?.[0]?.url ?? row.imageUrl ?? "",
      categoryName: row.productId?.categoryId?.name ?? row.categoryName ?? "Uncategorised",
      sellingPrice: row.priceOverride ?? row.productId?.offerPrice ?? row.productId?.basePrice ?? 0,
      lowStockAlert: row.lowStockThreshold ?? 5,
      isAvailable: row.available ?? row.enabled ?? false,
    }));
    return { ...data, inventory, stock: inventory, products: inventory, ...(data?.metrics ?? {}) };
  },
  getGstin: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/gstin` }),
  saveGstin: (id: number | string, data: Record<string, any>) => request<any>({ method: "PUT", url: `/admin/outlets/${id}/gstin`, data }),
  businessAudit: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/business-audit` }),
  stockSubmissions: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/stock-submissions` }),
  setLocation: (id: number | string, data: Record<string, any>) => request<any>({ method: "POST", url: `/admin/outlets/${id}/set-location`, data }),
  saveBranding: (id: number | string, data: Record<string, any>) => request<any>({ method: "POST", url: `/admin/outlets/${id}/branding`, data }),
  availableProducts: async (id: number | string) => {
    const data = await request<any>({ url: `/admin/outlets/${id}/available-products` });
    const allRaw = data?.all ?? data?.products ?? [];
    const assignedRaw = data?.assigned ?? data?.items ?? [];
    const normalize = (row: any) => ({ ...row, id: row.id ?? row._id ?? row.productId, productId: row.productId?._id ?? row.productId ?? row.id ?? row._id, title: row.title ?? row.name ?? row.productName, productName: row.productName ?? row.title ?? row.name, imageUrl: deepImage(row.imageUrl ?? row.image ?? row.images ?? row.productId?.images), image: deepImage(row.imageUrl ?? row.image ?? row.images ?? row.productId?.images), foodType: row.foodType ?? row.food_type ?? row.productId?.foodType, isVeg: String(row.foodType ?? row.food_type ?? row.productId?.foodType ?? '').toUpperCase() === 'VEG' || row.isVeg === true, categoryName: row.categoryName ?? row.categoryId?.name ?? row.productId?.categoryId?.name ?? '' });
    return { ...data, all: allRaw.map(normalize), assigned: assignedRaw.map(normalize) };
  },
  productCatalog: () => request<any>({ url: "/admin/products/catalog" }),
  stockLedger: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/stock-ledger` }),
  orders: (id: number | string) => request<any>({ url: `/admin/outlets/${id}/orders` }),
  updateStock: (id: number | string, items: any[]) => request<any>({ method: "POST", url: `/admin/outlets/${id}/stock`, data: { items } }),
  exportOutletAccounting: async (id: number | string, from: string, to: string) => {
    const blob = await downloadBlob({ url: "/admin/reports/outlet-accounting.csv", params: { outletId: id, from, to } });
    saveBlob(blob, `mr_breado_outlet_${id}_accounting_${from}_${to}.csv`);
  },
};
