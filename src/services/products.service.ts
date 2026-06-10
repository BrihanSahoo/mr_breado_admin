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

const isAdmin = (source?: string) => source === "admin";

export const productsService = {
  list: (params: ProductsQuery = {}) =>
    request<PageResponse<ProductResponse>>({
      url: isAdmin(params.source) ? endpoints.admin.mrBreado.products : endpoints.admin.products,
      method: "GET",
      params: {
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
        perPage: params.perPage ?? 20,
        search: params.search || undefined,
      },
    }),

  detail: (id: number | string, source?: "seller" | "admin") =>
    request<ProductResponse>({
      url: isAdmin(source) ? endpoints.admin.mrBreado.productById(id) : endpoints.admin.productDetails(id),
      method: "GET",
    }),

  create: (payload: Record<string, unknown> | FormData, source: "seller" | "admin" = "admin") =>
    request<ProductResponse>({
      url: isAdmin(source) ? endpoints.admin.mrBreado.products : endpoints.admin.products,
      method: "POST",
      data: toFormData(payload),
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id: number | string, payload: Record<string, unknown> | FormData, source: "seller" | "admin" = "admin") =>
    request<ProductResponse>({
      url: isAdmin(source) ? endpoints.admin.mrBreado.productById(id) : endpoints.admin.productById(id),
      method: "PUT",
      data: toFormData(payload),
      headers: { "Content-Type": "multipart/form-data" },
    }),

  remove: (id: number | string, source: "seller" | "admin" = "admin") =>
    request<null>({
      url: isAdmin(source) ? endpoints.admin.mrBreado.productById(id) : endpoints.admin.productById(id),
      method: "DELETE",
    }),

  setAvailability: (id: number | string, isAvailable: boolean, source: "seller" | "admin" = "admin") =>
    request<ProductResponse>({
      url: isAdmin(source) ? endpoints.admin.mrBreado.productAvailability(id) : endpoints.admin.productStock(id),
      method: "PATCH",
      data: { isAvailable, inStock: isAvailable, in_stock: isAvailable },
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
