import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PageResponse } from "@/types";

export interface CategoryResponse {
  id: number;
  title?: string;
  name?: string;
  slug?: string;
  image?: string;
  banner?: string;
  icon?: string;
  status?: string;
  productCount?: number | string;
  subCategoryCount?: number | string;
  enabled?: boolean;
  active?: boolean;
  createdAt?: string;
}

export interface CategorySummaryResponse {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalSubCategories: number;
}

export const categoriesService = {
  list: (page = 1, perPage = 50) =>
    request<PageResponse<CategoryResponse>>({
      url: endpoints.admin.categories,
      method: "GET",
      params: { page, per_page: perPage, perPage },
    }),

  summary: () =>
    request<CategorySummaryResponse>({
      url: endpoints.admin.categorySummary,
      method: "GET",
    }),

  subCategories: (page = 1, perPage = 50) =>
    request<PageResponse<CategoryResponse>>({
      url: endpoints.admin.publicSubCategories,
      method: "GET",
      params: { page, per_page: perPage, perPage },
    }),

  foodCategories: (page = 1, perPage = 50) =>
    request<PageResponse<CategoryResponse>>({
      url: endpoints.admin.foodCategoriesAdmin,
      method: "GET",
      params: { page, per_page: perPage, perPage },
    }),

  create: (payload: Partial<CategoryResponse>) =>
    request<CategoryResponse>({
      url: endpoints.admin.categories,
      method: "POST",
      data: payload,
    }),

  update: (id: number | string, payload: Partial<CategoryResponse>) =>
    request<CategoryResponse>({
      url: endpoints.admin.categoryById(id),
      method: "PUT",
      data: payload,
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
      data: { status, active: status === "ACTIVE", enabled: status === "ACTIVE" },
    }),
};
