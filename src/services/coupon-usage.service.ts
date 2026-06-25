import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { CouponUsageRecord, CouponUsageSummary, PageResponse } from "@/types";

export interface CouponUsageQuery {
  page?: number;
  perPage?: number;
  code?: string;
  status?: string;
  outletId?: string;
}

export type CouponUsagePage = PageResponse<CouponUsageRecord> & { summary?: CouponUsageSummary };

export const couponUsageService = {
  list: (params: CouponUsageQuery = {}) => request<CouponUsagePage>({
    url: endpoints.admin.couponUsages,
    method: "GET",
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 20,
      ...(params.code ? { code: params.code } : {}),
      ...(params.status ? { status: params.status } : {}),
      ...(params.outletId ? { outletId: params.outletId } : {}),
    },
  }),
};
