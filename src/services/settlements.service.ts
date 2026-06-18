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

function normalizePage(payload: any): PageResponse<AdminRestaurantPayoutResponse> {
  const root = payload?.data ?? payload;
  const rawItems = Array.isArray(root) ? root : Array.isArray(root?.items) ? root.items : Array.isArray(root?.data) ? root.data : Array.isArray(root?.content) ? root.content : [];
  const items = rawItems.map((x: any) => ({
    ...x,
    id: x.id,
    restaurantId: x.restaurantId ?? x.restaurant_id,
    restaurantName: x.restaurantName ?? x.restaurant_name ?? x.restaurant ?? "—",
    sellerName: x.sellerName ?? x.seller_name ?? "—",
    totalOrders: x.totalOrders ?? x.total_orders ?? x.orders ?? 0,
    grossAmount: x.grossAmount ?? x.gross_amount ?? x.gross_food_amount ?? x.gross ?? 0,
    commissionAmount: x.commissionAmount ?? x.commission_amount ?? 0,
    payableAmount: x.payableAmount ?? x.payable_amount ?? x.net_payable ?? x.payable ?? 0,
    status: x.status ?? x.settlement_status ?? "PENDING",
    periodStart: x.periodStart ?? x.period_start ?? x.created_at,
    periodEnd: x.periodEnd ?? x.period_end ?? x.settled_at,
  }));
  return { items, content: items, data: items, total: Number(root?.total ?? items.length), page: Number(root?.page ?? 1), per_page: Number(root?.perPage ?? root?.per_page ?? 20), total_pages: Number(root?.totalPages ?? root?.total_pages ?? 1), last: true } as any;
}

export const settlementsService = {
  list: async (params: SettlementsQuery = {}) => {
    const payload = await request<any>({
      url: endpoints.admin.settlements,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20 },
    });
    return normalizePage(payload);
  },
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
