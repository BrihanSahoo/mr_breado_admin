import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AdminMrBreadoPaymentsResponse,
  AdminPaymentSummaryResponse,
} from "@/types";

export const paymentsService = {
  summary: () =>
    request<AdminPaymentSummaryResponse>({
      url: endpoints.admin.paymentsSummary,
      method: "GET",
    }),
  mrBreado: () =>
    request<AdminMrBreadoPaymentsResponse>({
      url: endpoints.admin.mrBreadoPayments,
      method: "GET",
    }),
};
