import { r as request, e as endpoints } from "./router-1xz68c6T.js";
const usersService = {
  list: (params = {}) => request({
    url: endpoints.admin.users,
    method: "GET",
    params: {
      page: params.page ?? 1,
      per_page: params.perPage ?? 20,
      // Normalize role to lowercase to match backend expectations (safe no-op if already correct)
      role: params.role ? String(params.role).toLowerCase() : void 0,
      search: params.search || void 0
    }
  }),
  get: (id) => request({ url: endpoints.admin.userById(id), method: "GET" }),
  setStatus: (id, data) => request({ url: endpoints.admin.userStatus(id), method: "PUT", data }),
  update: (id, data) => request({ url: endpoints.admin.userById(id), method: "PUT", data })
};
export {
  usersService as u
};
