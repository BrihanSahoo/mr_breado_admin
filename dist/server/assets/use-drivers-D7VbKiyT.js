import { useQuery, keepPreviousData, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { r as request, e as endpoints, a as api } from "./router-1xz68c6T.js";
function normalizeDriverPage(payload, params) {
  const data = payload?.data ?? payload;
  const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : Array.isArray(data?.drivers) ? data.drivers : Array.isArray(data?.deliveryBoys) ? data.deliveryBoys : Array.isArray(data?.content) ? data.content : Array.isArray(data?.records) ? data.records : [];
  const perPage = Number(data?.perPage ?? data?.per_page ?? params.perPage ?? 20) || 20;
  const page = Number(data?.page ?? data?.currentPage ?? params.page ?? 1) || 1;
  return {
    items,
    page,
    per_page: perPage,
    perPage,
    total: Number(data?.total ?? data?.totalItems ?? data?.totalElements ?? items.length) || items.length,
    total_pages: Number(data?.total_pages ?? data?.totalPages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    totalPages: Number(data?.totalPages ?? data?.total_pages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    last: data?.last ?? true
  };
}
const driversService = {
  list: async (params = {}) => {
    const query = { page: params.page ?? 1, perPage: params.perPage ?? 20, search: params.search || void 0, _t: Date.now() };
    const urls = [endpoints.admin.drivers, "/admin/delivery-boys", "/delivery-boys", "/admin/riders"];
    let lastError = null;
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
  details: async (driverId) => {
    try {
      const res = await api.get(endpoints.admin.driverVerificationDetails(driverId));
      return res.data?.data ?? res.data;
    } catch {
      const res = await api.get(endpoints.admin.driverById(driverId));
      return res.data?.data ?? res.data;
    }
  },
  setVerificationStatus: async (driverId, status) => {
    try {
      const res = await api.patch(endpoints.admin.riderVerificationStatus(driverId), null, { params: { status } });
      return res.data?.data ?? res.data;
    } catch {
      const res = await api.post(status === "VERIFIED" ? endpoints.admin.driverApprove(driverId) : endpoints.admin.driverReject(driverId), { reason: status === "REJECTED" ? "Rejected by admin" : void 0 });
      return res.data?.data ?? res.data;
    }
  },
  verifyDeposit: (driverId, body) => request({
    url: endpoints.admin.verifyDriverCash(driverId),
    method: "POST",
    data: body
  }),
  transactions: (driverId, page = 1, perPage = 20) => request({
    url: endpoints.admin.driverCashTx(driverId),
    method: "GET",
    params: { page, perPage }
  })
};
const driverKeys = {
  all: ["drivers"],
  list: (q) => ["drivers", "list", q]
};
function useDrivers(query) {
  return useQuery({
    queryKey: driverKeys.list(query),
    queryFn: () => driversService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useVerifyDriverDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ driverId, body }) => driversService.verifyDeposit(driverId, body),
    onSuccess: () => {
      toast.success("Cash deposit verified");
      qc.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
export {
  useVerifyDriverDeposit as a,
  driversService as b,
  driverKeys as d,
  useDrivers as u
};
