import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

const unwrapList = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  const data = value?.data ?? value?.items ?? value?.content ?? value?.notifications ?? value?.results;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return unwrapList(data);
  return [];
};

export type AdminNotification = {
  id: number | string;
  title?: string;
  message?: string;
  body?: string;
  type?: string;
  targetType?: string;
  target_type?: string;
  status?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  created_at?: string;
};

export const notificationsService = {
  async list(): Promise<AdminNotification[]> {
    const candidates = [
      "/admin/notifications",
      "/admin/notifications/list",
      "/admin/notifications/all",
      "/admin/reports/notifications",
      endpoints.admin.supportTicketToday,
    ];

    for (const url of candidates) {
      try {
        const response = await request<any>({ url, method: "GET", params: { page: 1, per_page: 50, perPage: 50 } });
        const list = unwrapList(response);
        if (list.length || url === candidates[candidates.length - 1]) {
          return list.map((item: any, index: number) => ({
            id: item.id ?? item.ticketId ?? item.ticket_id ?? index,
            title: item.title ?? item.subject ?? item.issue ?? "Admin notification",
            message: item.message ?? item.body ?? item.description ?? item.issue ?? "New platform activity needs attention.",
            type: item.type ?? item.targetType ?? item.target_type ?? item.userType ?? "SYSTEM",
            status: item.status ?? "UNREAD",
            read: item.read ?? item.isRead ?? false,
            createdAt: item.createdAt ?? item.created_at ?? item.createdDate ?? item.created_at,
          }));
        }
      } catch (_) {
        // Try the next compatible endpoint. Older backends expose different admin notification URLs.
      }
    }

    return [];
  },

  async markRead(id: number | string): Promise<void> {
    const candidates = [
      `/admin/notifications/${id}/read`,
      `/admin/notifications/${id}/mark-read`,
    ];
    for (const url of candidates) {
      try {
        await request<any>({ url, method: "PATCH" });
        return;
      } catch (_) {}
    }
  },
};
