import { request } from "@/api/client";
import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  AdminDriverCashDepositRequest,
  AdminDriverCashResponse,
  PageResponse,
} from "@/types";


function driverRef(raw: any): string | number {
  const value = raw?.driverId ?? raw?.mongoId ?? raw?.userId ?? raw?.profileId ?? raw?._id ?? raw?.id;
  return value == null ? "" : value;
}

function normalizeDriver(raw: any): AdminDriverCashResponse {
  const source = raw?.data ?? raw ?? {};
  const ref = driverRef(source);
  const request = source.verificationRequest ?? source.verification_request ?? null;
  return {
    ...source,
    driverId: ref,
    mongoId: source.mongoId ?? source.userId ?? source._id,
    userId: source.userId ?? source.mongoId ?? source._id,
    driverName: source.driverName ?? source.riderName ?? source.applicantName ?? source.name ?? "Rider",
    driverEmail: source.driverEmail ?? source.email ?? source.user?.email ?? "",
    driverMobile: source.driverMobile ?? source.contactMobile ?? source.phone ?? source.mobile ?? source.user?.phone ?? "",
    verificationStatus: source.verificationStatus ?? source.status ?? request?.status ?? "UNVERIFIED",
    verificationRequest: request ? {
      ...request,
      documents: Array.isArray(request.documents) ? request.documents.map((d: any, i: number) => ({
        ...d,
        url: d?.url ?? d?.fileUrl ?? d?.viewUrl ?? d?.downloadUrl ?? "",
        downloadUrl: d?.downloadUrl ?? d?.url ?? d?.fileUrl ?? d?.viewUrl ?? "",
        alt: d?.alt ?? d?.name ?? d?.fileName ?? `Document ${i + 1}`,
      })) : [],
    } : null,
  } as AdminDriverCashResponse;
}
export interface DriversQuery {
  page?: number;
  perPage?: number;
  search?: string;
}

function normalizeDriverPage(payload: any, params: DriversQuery): PageResponse<AdminDriverCashResponse> {
  const data = payload?.data ?? payload;
  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.drivers)
        ? data.drivers
        : Array.isArray(data?.deliveryBoys)
          ? data.deliveryBoys
          : Array.isArray(data?.content)
            ? data.content
            : Array.isArray(data?.records)
              ? data.records
              : [];
  const perPage = Number(data?.perPage ?? data?.per_page ?? params.perPage ?? 20) || 20;
  const page = Number(data?.page ?? data?.currentPage ?? params.page ?? 1) || 1;
  return {
    items: items.map(normalizeDriver) as AdminDriverCashResponse[],
    page,
    per_page: perPage,
    perPage,
    total: Number(data?.total ?? data?.totalItems ?? data?.totalElements ?? items.length) || items.length,
    total_pages: Number(data?.total_pages ?? data?.totalPages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    totalPages: Number(data?.totalPages ?? data?.total_pages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    last: data?.last ?? true,
  } as PageResponse<AdminDriverCashResponse>;
}

export const driversService = {
  list: async (params: DriversQuery = {}) => {
    const query = { page: params.page ?? 1, perPage: params.perPage ?? 20, search: params.search || undefined, _t: Date.now() };
    const urls = [endpoints.admin.drivers, "/admin/delivery-boys", "/delivery-boys", "/admin/riders"];
    let lastError: unknown = null;
    for (const url of urls) {
      try {
        const res = await api.get(url, { params: query });
        const page = normalizeDriverPage(res.data, params);
        if (page.items.length > 0 || url === urls[urls.length - 1]) return page;
      } catch (e) {
        lastError = e;
      }
    }
    if (lastError) throw lastError;
    return normalizeDriverPage({ items: [] }, params);
  },
  details: async (driverId: number | string) => {
    if (driverId === undefined || driverId === null || String(driverId).trim() === "") {
      throw new Error("Rider identifier is missing. Refresh the rider list and try again.");
    }
    try {
      const res = await api.get(endpoints.admin.driverById(driverId), { params: { _t: Date.now() } });
      return normalizeDriver(res.data?.data ?? res.data);
    } catch {
      const res = await api.get(endpoints.admin.driverVerificationDetails(driverId), { params: { _t: Date.now() } });
      return normalizeDriver(res.data?.data ?? res.data);
    }
  },
  setVerificationStatus: async (driverId: number | string, status: "VERIFIED" | "UNVERIFIED" | "REJECTED") => {
    try {
      const res = await api.patch(endpoints.admin.riderVerificationStatus(driverId), null, { params: { status } });
      return normalizeDriver(res.data?.data ?? res.data);
    } catch {
      const res = await api.post(status === "VERIFIED" ? endpoints.admin.driverApprove(driverId) : endpoints.admin.driverReject(driverId), { reason: status === "REJECTED" ? "Rejected by admin" : undefined });
      return normalizeDriver(res.data?.data ?? res.data);
    }
  },
  verifyDeposit: (driverId: number | string, body: AdminDriverCashDepositRequest) =>
    request<AdminDriverCashResponse>({
      url: endpoints.admin.verifyDriverCash(driverId),
      method: "POST",
      data: body,
    }),
  payout: (driverId: number | string, body: { amount?: number; upiId?: string; paymentReference?: string; periodStart?: string; periodEnd?: string; note?: string }) =>
    request<AdminDriverCashResponse>({ url: endpoints.admin.driverPayout(driverId), method: 'POST', data: body }),
  requestUpi: (driverId: number | string, message?: string) =>
    request<{ sent: boolean }>({ url: endpoints.admin.driverRequestUpi(driverId), method: 'POST', data: { message } }),
  transactions: (driverId: number | string, page = 1, perPage = 20) =>
    request<PageResponse<unknown>>({
      url: endpoints.admin.driverCashTx(driverId),
      method: "GET",
      params: { page, perPage },
    }),
};
