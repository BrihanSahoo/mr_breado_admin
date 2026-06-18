import { a as api, e as endpoints, r as request } from "./router-1xz68c6T.js";
const restaurantsService = {
  list: (params = {}) => request({
    url: endpoints.admin.franchiseOutlets,
    method: "GET",
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 20,
      search: params.search || void 0,
      verificationStatus: params.verificationStatus || void 0
    }
  }),
  details: async (id) => {
    const res = await api.get(`/admin/outlets/${id}`);
    return res.data?.data ?? res.data;
  },
  setVerificationStatus: async (id, status) => {
    try {
      const res = await api.put(`/admin/outlets/${id}`, { isActive: status === "VERIFIED" });
      return res.data?.data ?? res.data;
    } catch {
      const res = await api.post(status === "VERIFIED" ? endpoints.admin.restaurantJoinApprove(id) : endpoints.admin.restaurantJoinReject(id), { reason: status === "REJECTED" ? "Rejected by admin" : void 0 });
      return res.data?.data ?? res.data;
    }
  }
};
export {
  restaurantsService as r
};
