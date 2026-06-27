import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { OfferRequest, OfferResponse, PageResponse } from "@/types";

export interface OffersQuery {
  page?: number;
  perPage?: number;
}

export const offersService = {
  list: (params: OffersQuery = {}) =>
    request<PageResponse<OfferResponse> | OfferResponse[]>({
      url: endpoints.admin.offers,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 },
    }),
  create: (body: OfferRequest & { imageFile?: File }) => {
    const fd = new FormData();
    Object.entries(body as any).forEach(([k, v]) => {
      if (k === "imageFile" && v instanceof File) fd.append("image", v);
      else if (body.imageFile instanceof File && k === "imageUrl") return;
      else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
      else if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    return request<OfferResponse>({
      url: endpoints.admin.offers,
      method: "POST",
      data: fd,
    });
  },
  update: (id: number | string, body: OfferRequest & { imageFile?: File }) => {
    const fd = new FormData();
    Object.entries(body as any).forEach(([k, v]) => {
      if (k === "imageFile" && v instanceof File) fd.append("image", v);
      else if (body.imageFile instanceof File && k === "imageUrl") return;
      else if (Array.isArray(v)) fd.append(k, JSON.stringify(v));
      else if (v !== undefined && v !== null) fd.append(k, String(v));
    });
    return request<OfferResponse>({
      url: endpoints.admin.offerById(id),
      method: "PUT",
      data: fd,
    });
  },
  remove: (id: number | string) =>
    request<void>({
      url: endpoints.admin.offerById(id),
      method: "DELETE",
    }),
  toggleStatus: (id: number | string) =>
    request<OfferResponse>({
      url: endpoints.admin.offerStatus(id),
      method: "PATCH",
    }),
};
