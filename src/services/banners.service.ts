import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { BannerRequest, BannerResponse, PageResponse } from "@/types";

export interface BannersQuery {
  page?: number;
  perPage?: number;
}

function payload(body: BannerRequest): BannerRequest | FormData {
  if (!body.imageFile) return body;
  const form = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (key === "imageFile" || value === undefined || value === null) return;
    if (Array.isArray(value)) form.append(key, JSON.stringify(value));
    else form.append(key, String(value));
  });
  form.append("imageFile", body.imageFile);
  return form;
}

export const bannersService = {
  list: (params: BannersQuery = {}) =>
    request<PageResponse<BannerResponse>>({
      url: endpoints.admin.banners,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 },
    }),
  create: (body: BannerRequest) =>
    request<BannerResponse>({
      url: endpoints.admin.banners,
      method: "POST",
      data: payload(body),
    }),
  update: (id: number | string, body: BannerRequest) =>
    request<BannerResponse>({
      url: endpoints.admin.bannerById(id),
      method: "PUT",
      data: payload(body),
    }),
  remove: (id: number | string) =>
    request<void>({
      url: endpoints.admin.bannerById(id),
      method: "DELETE",
    }),
  setStatus: (id: number | string, enabled: boolean) =>
    request<BannerResponse>({
      url: endpoints.admin.bannerStatus(id),
      method: "PATCH",
      data: { enabled },
    }),
};
