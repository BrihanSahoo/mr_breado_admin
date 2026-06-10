import { request } from "@/api/client";
import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AdminDriverCashDepositRequest,
  AdminDriverCashResponse,
  PageResponse,
} from "@/types";

export interface DriversQuery {
  page?: number;
  perPage?: number;
  search?: string;
}

export const driversService = {
  list: (params: DriversQuery = {}) =>
    request<PageResponse<AdminDriverCashResponse>>({
      url: endpoints.admin.driversCash,
      method: "GET",
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 20,
        search: params.search || undefined,
      },
    }),
  details: async (driverId: number | string) => {
    try {
      const res = await api.get(endpoints.admin.driverVerificationDetails(driverId));
      return (res.data?.data ?? res.data) as AdminDriverCashResponse;
    } catch {
      const res = await api.get(endpoints.admin.driverById(driverId));
      return (res.data?.data ?? res.data) as AdminDriverCashResponse;
    }
  },
  setVerificationStatus: async (driverId: number | string, status: "VERIFIED" | "UNVERIFIED" | "REJECTED") => {
    try {
      const res = await api.patch(endpoints.admin.riderVerificationStatus(driverId), null, { params: { status } });
      return (res.data?.data ?? res.data) as AdminDriverCashResponse;
    } catch {
      const res = await api.post(status === "VERIFIED" ? endpoints.admin.driverApprove(driverId) : endpoints.admin.driverReject(driverId), { reason: status === "REJECTED" ? "Rejected by admin" : undefined });
      return (res.data?.data ?? res.data) as AdminDriverCashResponse;
    }
  },
  verifyDeposit: (driverId: number | string, body: AdminDriverCashDepositRequest) =>
    request<AdminDriverCashResponse>({
      url: endpoints.admin.verifyDriverCash(driverId),
      method: "POST",
      data: body,
    }),
  transactions: (driverId: number | string, page = 1, perPage = 20) =>
    request<PageResponse<unknown>>({
      url: endpoints.admin.driverCashTx(driverId),
      method: "GET",
      params: { page, perPage },
    }),
};
