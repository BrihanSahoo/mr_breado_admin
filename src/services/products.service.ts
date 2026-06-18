
function imageStringDeep(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value === '[object Object]' ? '' : value;
  if (Array.isArray(value)) return imageStringDeep(value[0]);
  if (typeof value === 'object') return imageStringDeep(value.secure_url ?? value.secureUrl ?? value.url ?? value.src ?? value.path ?? value.image ?? value.imageUrl ?? value.thumbnail);
  return '';
}
import { downloadBlob, request, saveBlob } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PageResponse, ProductResponse } from "@/types";

export interface ProductsQuery {
  page?: number;
  perPage?: number;
  search?: string;
  source?: "seller" | "admin";
}

function toFormData(payload: Record<string, unknown> | FormData): FormData {
  if (payload instanceof FormData) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (v instanceof File || v instanceof Blob) fd.append(k, v);
    else fd.append(k, typeof v === "string" ? v : JSON.stringify(v));
  });
  return fd;
}
function first(...vals: any[]) { for (const v of vals) if (v !== undefined && v !== null && String(v).trim() !== "") return v; return undefined; }
function asArray(payload: any): any[] {
  const d = payload?.data ?? payload;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.products)) return d.products;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.records)) return d.records;
  return [];
}
function normalizeProduct(raw: any): ProductResponse {
  const restaurant = typeof raw?.restaurant === "object" ? raw.restaurant : {};
  const category = typeof raw?.category === "object" ? raw.category : {};
  const title = first(raw?.title, raw?.name, raw?.productName, raw?.product_name, raw?.foodName, raw?.food_name, "Food item");
  const image = imageStringDeep(first(raw?.imageUrl, raw?.image_url, raw?.image, raw?.images, raw?.thumbnailUrl, raw?.thumbnail_url, raw?.primaryImageUrl, raw?.primary_image_url));
  const available = first(raw?.isAvailable, raw?.available, raw?.is_available, raw?.active, raw?.enabled, true);
  return {
    ...raw,
    title,
    name: title,
    productName: title,
    image,
    imageUrl: image,
    categoryName: first(raw?.categoryName, raw?.category_name, raw?.foodType, raw?.food_type, raw?.category, category?.name, category?.title, ""),
    restaurantName: first(raw?.restaurantName, raw?.restaurant_name, restaurant?.name, restaurant?.restaurantName, restaurant?.restaurant_name, raw?.storeName, "Mr. Breado"),
    price: Number(first(raw?.price, raw?.basePrice, raw?.base_price, raw?.sellingPrice, raw?.selling_price, 0)) || 0,
    effectivePrice: Number(first(raw?.effectivePrice, raw?.effective_price, raw?.discountPrice, raw?.discount_price, raw?.price, 0)) || 0,
    isAvailable: available === true || available === 1 || String(available).toLowerCase() === "true" || String(available).toUpperCase() === "ACTIVE",
    isFeatured: Boolean(first(raw?.isFeatured, raw?.featured, raw?.bestseller, raw?.is_bestseller, false)),
  } as ProductResponse;
}
function normalizePage(payload: any, params: ProductsQuery): PageResponse<ProductResponse> {
  const d = payload?.data ?? payload;
  const items = asArray(payload).map(normalizeProduct);
  const perPage = Number(d?.perPage ?? d?.per_page ?? params.perPage ?? 20) || 20;
  const page = Number(d?.page ?? d?.currentPage ?? params.page ?? 1) || 1;
  return {
    items,
    page,
    per_page: perPage,
    perPage,
    total: Number(d?.total ?? d?.totalItems ?? d?.totalElements ?? items.length) || items.length,
    total_pages: Number(d?.total_pages ?? d?.totalPages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    totalPages: Number(d?.totalPages ?? d?.total_pages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    last: d?.last ?? true,
  } as PageResponse<ProductResponse>;
}
const isMrBreadoStore = (source?: string) => source === "seller";
function normalizeProductPayload(payload: Record<string, unknown> | FormData): Record<string, unknown> | FormData {
  if (payload instanceof FormData) return payload;
  const raw = payload as Record<string, any>;
  const image = imageStringDeep(raw.imageUrl ?? raw.image ?? raw.images ?? raw.thumbnailUrl);
  const category = raw.categoryId ?? raw.category_id ?? (typeof raw.category === "object" ? raw.category?.id ?? raw.category?._id : raw.category);
  return {
    ...raw,
    name: raw.name ?? raw.title ?? raw.productName,
    basePrice: Number(raw.basePrice ?? raw.price ?? raw.sellingPrice ?? 0),
    offerPrice: Number(raw.offerPrice ?? raw.discountPrice ?? raw.effectivePrice ?? raw.basePrice ?? raw.price ?? 0),
    categoryId: category || undefined,
    images: Array.isArray(raw.images) ? raw.images : typeof image === "string" && image ? [{ url: image }] : [],
    active: raw.active ?? raw.isAvailable ?? true,
    featured: raw.featured ?? raw.isFeatured ?? false,
  };
}


export const productsService = {
  list: async (params: ProductsQuery = {}) => {
    const baseParams = {
      page: params.page ?? 1,
      per_page: params.perPage ?? 20,
      perPage: params.perPage ?? 20,
      search: params.search || undefined,
      _t: Date.now(),
    };
    const primaryUrl = endpoints.admin.mrBreado.products;
    let response = await request<any>({ url: primaryUrl, method: "GET", params: baseParams });
    let page = normalizePage(response, params);

    // Business-safe fallback: some deployed backend versions expose the master food catalog
    // on /admin/products/catalog while older admin pages use /admin/mr-breado/products.
    // Do not show an empty Mr. Breado Store if another official catalog endpoint has rows.
    if ((page.items?.length ?? 0) === 0 && isMrBreadoStore(params.source)) {
      try {
        response = await request<any>({ url: "/admin/products/catalog", method: "GET", params: baseParams });
        page = normalizePage(response, params);
      } catch (_) {
        // keep primary empty/error-normalized response
      }
    }
    return page;
  },

  detail: async (id: number | string, source?: "seller" | "admin") => {
    const response = await request<any>({
      url: endpoints.admin.mrBreado.productById(id),
      method: "GET",
    });
    return normalizeProduct(response?.data ?? response);
  },

  create: (payload: Record<string, unknown> | FormData, source: "seller" | "admin" = "admin") =>
    request<ProductResponse>({
      url: endpoints.admin.mrBreado.products,
      method: "POST",
      data: normalizeProductPayload(payload),
    }),

  update: (id: number | string, payload: Record<string, unknown> | FormData, source: "seller" | "admin" = "admin") =>
    request<ProductResponse>({
      url: endpoints.admin.mrBreado.productById(id),
      method: "PUT",
      data: normalizeProductPayload(payload),
    }),

  remove: (id: number | string, source: "seller" | "admin" = "admin") =>
    request<null>({
      url: endpoints.admin.mrBreado.productById(id),
      method: "DELETE",
    }),

  setAvailability: (id: number | string, isAvailable: boolean, source: "seller" | "admin" = "admin") =>
    request<ProductResponse>({
      url: endpoints.admin.mrBreado.productAvailability(id),
      method: "PATCH",
      data: { isAvailable, available: isAvailable, inStock: isAvailable, in_stock: isAvailable },
    }),

  downloadTemplate: async () => {
    const blob = await downloadBlob({ url: endpoints.admin.mrBreado.template, method: "GET" });
    saveBlob(blob, "mr-breado-products-template.xlsx");
  },

  exportAdminProducts: async () => {
    const blob = await downloadBlob({ url: endpoints.admin.mrBreado.export, method: "GET" });
    saveBlob(blob, "mr-breado-products.csv");
  },
};
