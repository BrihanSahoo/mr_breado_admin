import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PageResponse } from "@/types";

export interface CategoryResponse {
  id: string;
  title?: string;
  name?: string;
  slug?: string;
  image?: string | { url?: string };
  imageUrl?: string;
  banner?: string;
  icon?: string;
  status?: string;
  productCount?: number | string;
  subCategoryCount?: number | string;
  enabled?: boolean;
  active?: boolean;
  createdAt?: string;
  imageFile?: File | null;
}

export interface CategorySummaryResponse {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalSubCategories: number;
}

function imageString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    return String(row.url ?? row.secureUrl ?? row.secure_url ?? row.path ?? "");
  }
  return "";
}

function normalizeCategory(row: any): CategoryResponse {
  const image = imageString(
    row?.imageUrl ?? row?.image ?? row?.icon ?? row?.banner,
  );
  return {
    ...row,
    id: String(row?.id ?? row?._id ?? ""),
    title: row?.title ?? row?.name ?? "Category",
    name: row?.name ?? row?.title ?? "Category",
    image,
    imageUrl: image,
    icon: image,
    status: row?.status ?? (row?.active === false ? "INACTIVE" : "ACTIVE"),
    active: row?.active ?? row?.enabled ?? row?.status !== "INACTIVE",
    enabled: row?.enabled ?? row?.active ?? row?.status !== "INACTIVE",
  };
}

async function normalizePage(
  promise: Promise<any>,
): Promise<PageResponse<CategoryResponse>> {
  const data = await promise;
  const rows = Array.isArray(data)
    ? data
    : (data?.items ?? data?.categories ?? []);
  return {
    ...data,
    items: rows.map(normalizeCategory),
    total: data?.total ?? rows.length,
  } as PageResponse<CategoryResponse>;
}

function normalizeCategoryPayload(
  payload: Partial<CategoryResponse>,
): Partial<CategoryResponse> | FormData {
  if (payload.imageFile instanceof File) {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "imageFile" || value === undefined || value === null) return;
      if (typeof value === "object") {
        const image = imageString(value);
        if (image) form.append(key, image);
        return;
      }
      form.append(key, String(value));
    });
    form.append("image", payload.imageFile);
    return form;
  }
  const imageValue = imageString(
    payload.imageUrl ?? payload.image ?? payload.icon ?? payload.banner,
  );
  return {
    ...payload,
    name: payload.name ?? payload.title,
    image: imageValue || undefined,
    imageUrl: imageValue || undefined,
    active: payload.active ?? payload.enabled ?? payload.status === "ACTIVE",
  };
}

export const categoriesService = {
  list: (page = 1, perPage = 50) =>
    normalizePage(
      request<PageResponse<CategoryResponse>>({
        url: endpoints.admin.categories,
        method: "GET",
        params: { page, per_page: perPage, perPage },
      }),
    ),

  summary: () =>
    request<CategorySummaryResponse>({
      url: endpoints.admin.categorySummary,
      method: "GET",
    }),

  subCategories: (page = 1, perPage = 50) =>
    normalizePage(
      request<PageResponse<CategoryResponse>>({
        url: endpoints.admin.publicSubCategories,
        method: "GET",
        params: { page, per_page: perPage, perPage },
      }),
    ),

  foodCategories: (page = 1, perPage = 50) =>
    normalizePage(
      request<PageResponse<CategoryResponse>>({
        url: endpoints.admin.foodCategoriesAdmin,
        method: "GET",
        params: { page, per_page: perPage, perPage },
      }),
    ),

  create: (payload: Partial<CategoryResponse>) =>
    request<CategoryResponse>({
      url: endpoints.admin.categories,
      method: "POST",
      data: normalizeCategoryPayload(payload),
    }),

  update: (id: number | string, payload: Partial<CategoryResponse>) =>
    request<CategoryResponse>({
      url: endpoints.admin.categoryById(id),
      method: "PUT",
      data: normalizeCategoryPayload(payload),
    }),

  remove: (id: number | string) =>
    request<void>({
      url: endpoints.admin.categoryById(id),
      method: "DELETE",
    }),

  setStatus: (id: number | string, status: "ACTIVE" | "INACTIVE") =>
    request<CategoryResponse>({
      url: endpoints.admin.categoryStatus(id),
      method: "PATCH",
      data: {
        status,
        active: status === "ACTIVE",
        enabled: status === "ACTIVE",
      },
    }),
};
