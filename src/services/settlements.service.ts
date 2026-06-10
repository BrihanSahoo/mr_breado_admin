import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AdminRestaurantPayoutPaidRequest,
  AdminRestaurantPayoutResponse,
  PageResponse,
} from "@/types";

export interface SettlementsQuery {
  page?: number;
  perPage?: number;
}

export const settlementsService = {
  list: (params: SettlementsQuery = {}) =>
    request<PageResponse<AdminRestaurantPayoutResponse>>({
      url: endpoints.admin.settlements,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 },
    }),
  generateWeekly: (restaurantId: number | string) =>
    request<AdminRestaurantPayoutResponse>({
      url: endpoints.admin.generateWeeklySettlement(restaurantId),
      method: "POST",
    }),
  markPaid: (
    settlementId: number | string,
    body: AdminRestaurantPayoutPaidRequest,
  ) =>
    request<AdminRestaurantPayoutResponse>({
      url: endpoints.admin.markSettlementPaid(settlementId),
      method: "POST",
      data: body,
    }),
};
