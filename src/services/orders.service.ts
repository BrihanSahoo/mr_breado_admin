import { downloadBlob, request, saveBlob } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  PageResponse,
  SellerOrderDetailResponse,
  SellerOrderResponse,
} from "@/types";

export interface OrdersQuery {
  page?: number;
  perPage?: number;
  status?: string;
}

export const ordersService = {
  list: (params: OrdersQuery = {}) =>
    request<PageResponse<SellerOrderResponse>>({
      url: endpoints.admin.mrBreado.orders,
      method: "GET",
      params: { page: params.page ?? 1, perPage: params.perPage ?? 20, status: params.status },
    }),
  detail: (id: number | string) =>
    request<SellerOrderDetailResponse>({
      url: endpoints.admin.mrBreado.orderById(id),
      method: "GET",
    }),
  accept: (id: number | string) =>
    request<SellerOrderDetailResponse>({
      url: endpoints.admin.mrBreado.accept(id),
      method: "POST",
    }),
  preparing: (id: number | string) =>
    request<SellerOrderDetailResponse>({
      url: endpoints.admin.mrBreado.preparing(id),
      method: "POST",
    }),
  ready: (id: number | string) =>
    request<SellerOrderDetailResponse>({
      url: endpoints.admin.mrBreado.ready(id),
      method: "POST",
    }),
  reject: (id: number | string, reason: string) =>
    request<SellerOrderDetailResponse>({
      url: endpoints.admin.mrBreado.reject(id),
      method: "POST",
      data: { reason },
    }),
  downloadInvoice: async (id: number | string, orderNumber?: string) => {
    const blob = await downloadBlob({ url: endpoints.admin.mrBreado.invoicePdf(id), method: "GET" });
    const clean = String(orderNumber || id).replace(/[^a-zA-Z0-9_-]/g, "_");
    saveBlob(blob, `${clean}_invoice.pdf`);
  },
  sendInvoice: (id: number | string) =>
    request<void>({
      url: endpoints.admin.mrBreado.sendInvoice(id),
      method: "POST",
    }),
};
