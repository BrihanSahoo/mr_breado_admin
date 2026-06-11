import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { PageResponse } from "@/types";

export type TicketStatus = "PENDING" | "ACTIVE" | "IN_PROGRESS" | "COMPLETED" | "RESOLVED" | string;

export interface SupportDashboardResponse {
  allTickets: number;
  allPending: number;
  todayPending: number;
  todayActive: number;
  todayTickets?: SupportTicketResponse[];
}

export interface SupportTicketResponse {
  id: number | string;
  ticketNumber?: string;
  userName?: string;
  employeeName?: string;
  userType?: string;
  type?: string;
  issue?: string;
  subject?: string;
  description?: string;
  createdAt?: string;
  status?: TicketStatus;
  user?: { name?: string; email?: string; phone?: string; type?: string };
  assignedEmployee?: { name?: string; email?: string; phone?: string };
}

export const supportService = {
  dashboard: () => request<SupportDashboardResponse>({ url: endpoints.admin.supportDashboard, method: "GET" }),
  today: (page = 1, perPage = 10) => request<PageResponse<SupportTicketResponse>>({ url: endpoints.admin.supportTicketToday, method: "GET", params: { page, per_page: perPage, perPage } }),
  list: (params: { page?: number; perPage?: number; status?: string; type?: string; search?: string } = {}) => request<PageResponse<SupportTicketResponse>>({
    url: endpoints.admin.supportTickets,
    method: "GET",
    params: { page: params.page ?? 1, per_page: params.perPage ?? 10, perPage: params.perPage ?? 10, status: params.status || undefined, type: params.type || undefined, search: params.search || undefined },
  }),
  detail: (id: number | string) => request<SupportTicketResponse>({ url: endpoints.admin.supportTicketById(id), method: "GET" }),
  accept: (id: number | string) => request<SupportTicketResponse>({ url: endpoints.admin.supportTicketAccept(id), method: "PATCH" }),
  reply: (id: number | string, message: string) => request<SupportTicketResponse>({ url: endpoints.admin.supportTicketReply(id), method: "POST", data: { description: message, message } }),
  setStatus: (id: number | string, status: string) => request<SupportTicketResponse>({ url: endpoints.admin.supportTicketStatus(id), method: "PATCH", data: { status } }),
  remove: (id: number | string) => request<void>({ url: endpoints.admin.supportTicketById(id), method: "DELETE" }),
};
