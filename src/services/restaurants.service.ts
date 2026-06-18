import { request } from "@/api/client";
import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AdminRestaurantResponse, PageResponse } from "@/types";

export interface RestaurantsQuery {
  page?: number;
  perPage?: number;
  search?: string;
  verificationStatus?: string;
}

export const restaurantsService = {
  list: (params: RestaurantsQuery = {}) =>
    request<PageResponse<AdminRestaurantResponse>>({
      url: endpoints.admin.franchiseOutlets || "/admin/outlets",
      method: "GET",
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 20,
        search: params.search || undefined,
        verificationStatus: params.verificationStatus || undefined,
      },
    }),
  details: async (id: number | string) => {
    const res = await api.get(`/admin/outlets/${id}`);
    return (res.data?.data ?? res.data) as AdminRestaurantResponse;
  },
  setVerificationStatus: async (id: number | string, status: "VERIFIED" | "UNVERIFIED" | "REJECTED") => {
    try {
      const res = await api.put(`/admin/outlets/${id}`, { isActive: status === "VERIFIED" });
      return (res.data?.data ?? res.data) as AdminRestaurantResponse;
    } catch {
      const res = await api.post(status === "VERIFIED" ? endpoints.admin.restaurantJoinApprove(id) : endpoints.admin.restaurantJoinReject(id), { reason: status === "REJECTED" ? "Rejected by admin" : undefined });
      return (res.data?.data ?? res.data) as AdminRestaurantResponse;
    }
  },
};
