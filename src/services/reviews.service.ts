import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { OrderReviewResponse, PageResponse } from "@/types";

export interface ReviewsQuery {
  page?: number;
  perPage?: number;
}

export const reviewsService = {
  list: (params: ReviewsQuery = {}) =>
    request<PageResponse<OrderReviewResponse>>({
      url: endpoints.admin.reviews,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 },
    }),
};
