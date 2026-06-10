import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  PageResponse,
  RestaurantReportResponse,
  AdminReportStatusRequest,
} from "@/types";

export interface ReportsQuery {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
}

export const reportsService = {
  list: (params: ReportsQuery = {}) =>
    request<PageResponse<RestaurantReportResponse>>({
      url: endpoints.admin.restaurantReports,
      method: "GET",
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 20,
        status: params.status,
        search: params.search,
      },
    }),

  detail: (id: number | string) =>
    request<RestaurantReportResponse>({
      url: `${endpoints.admin.restaurantReports}/${id}`,
      method: "GET",
    }),

  updateStatus: (id: number | string, data: AdminReportStatusRequest) =>
    request<RestaurantReportResponse>({
      url: endpoints.admin.reportStatus(id),
      method: "PATCH",
      data,
    }),

  approve: (id: number | string, reason?: string) =>
    request<RestaurantReportResponse>({
      url: endpoints.admin.reportStatus(id),
      method: "PATCH",
      data: { status: "APPROVED", reason },
    }),

  reject: (id: number | string, reason?: string) =>
    request<RestaurantReportResponse>({
      url: endpoints.admin.reportStatus(id),
      method: "PATCH",
      data: { status: "REJECTED", reason },
    }),

  resolve: (id: number | string, reason?: string) =>
    request<RestaurantReportResponse>({
      url: endpoints.admin.reportStatus(id),
      method: "PATCH",
      data: { status: "RESOLVED", reason },
    }),
};
