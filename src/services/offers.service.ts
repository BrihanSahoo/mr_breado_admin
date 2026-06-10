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
  create: (body: OfferRequest) =>
    request<OfferResponse>({
      url: endpoints.admin.offers,
      method: "POST",
      data: body,
    }),
  update: (id: number | string, body: OfferRequest) =>
    request<OfferResponse>({
      url: endpoints.admin.offerById(id),
      method: "PUT",
      data: body,
    }),
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
