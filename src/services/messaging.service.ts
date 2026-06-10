import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  PageResponse,
  AdminSellerMessageResponse,
  AdminSellerMessageRequest,
} from "@/types";

export interface MessagingQuery {
  page?: number;
  perPage?: number;
  search?: string;
}

export const messagingService = {
  list: (params: MessagingQuery = {}) =>
    request<PageResponse<AdminSellerMessageResponse>>({
      url: endpoints.admin.sellerMessages,
      method: "GET",
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 20,
        search: params.search,
      },
    }),

  send: (data: AdminSellerMessageRequest) =>
    request<AdminSellerMessageResponse>({
      url: endpoints.admin.sellerMessages,
      method: "POST",
      data,
    }),

  markAsRead: (id: number | string) =>
    request<AdminSellerMessageResponse>({
      url: `${endpoints.admin.sellerMessages}/${id}/read`,
      method: "PATCH",
    }),
};
