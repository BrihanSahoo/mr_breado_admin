import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AdminCouponRequest, Coupon, PageResponse } from "@/types";

export interface CouponsQuery {
  page?: number;
  perPage?: number;
}

export const couponsService = {
  list: (params: CouponsQuery = {}) =>
    request<PageResponse<Coupon>>({
      url: endpoints.admin.coupons,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 },
    }),
  create: (body: AdminCouponRequest) =>
    request<Coupon>({
      url: endpoints.admin.coupons,
      method: "POST",
      data: body,
    }),
  update: (id: number | string, body: AdminCouponRequest) =>
    request<Coupon>({
      url: endpoints.admin.couponById(id),
      method: "PUT",
      data: body,
    }),
  remove: (id: number | string) =>
    request<void>({
      url: endpoints.admin.couponById(id),
      method: "DELETE",
    }),
  setStatus: (id: number | string, enabled: boolean) =>
    request<Coupon>({
      url: endpoints.admin.couponStatus(id),
      method: "PATCH",
      data: { enabled },
    }),
};
