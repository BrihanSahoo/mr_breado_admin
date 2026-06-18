import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { r as request, e as endpoints } from "./router-1xz68c6T.js";
const supportService = {
  dashboard: () => request({ url: endpoints.admin.supportDashboard, method: "GET" }),
  today: (page = 1, perPage = 10) => request({ url: endpoints.admin.supportTicketToday, method: "GET", params: { page, per_page: perPage, perPage } }),
  list: (params = {}) => request({
    url: endpoints.admin.supportTickets,
    method: "GET",
    params: { page: params.page ?? 1, per_page: params.perPage ?? 10, perPage: params.perPage ?? 10, status: params.status || void 0, type: params.type || void 0, search: params.search || void 0 }
  }),
  detail: (id) => request({ url: endpoints.admin.supportTicketById(id), method: "GET" }),
  accept: (id) => request({ url: endpoints.admin.supportTicketAccept(id), method: "PATCH" }),
  reply: (id, message) => request({ url: endpoints.admin.supportTicketReply(id), method: "POST", data: { description: message, message } }),
  setStatus: (id, status) => request({ url: endpoints.admin.supportTicketStatus(id), method: "PATCH", data: { status } }),
  remove: (id) => request({ url: endpoints.admin.supportTicketById(id), method: "DELETE" })
};
const supportKeys = {
  all: ["support"],
  dashboard: () => ["support", "dashboard"],
  list: (q) => ["support", "tickets", q]
};
function useSupportDashboard() {
  return useQuery({ queryKey: supportKeys.dashboard(), queryFn: supportService.dashboard, staleTime: 15e3 });
}
function useSupportTickets(query = {}) {
  return useQuery({ queryKey: supportKeys.list(query), queryFn: () => supportService.list(query), placeholderData: keepPreviousData, staleTime: 1e4 });
}
export {
  supportService as a,
  useSupportDashboard as b,
  supportKeys as s,
  useSupportTickets as u
};
