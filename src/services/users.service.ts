import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AdminUserResponse, PageResponse, UserRole } from "@/types";

export interface UsersQuery {
  page?: number;
  perPage?: number;
  role?: UserRole | string;
  search?: string;
}

export const usersService = {
  list: (params: UsersQuery = {}) =>
    request<PageResponse<AdminUserResponse>>({
      url: endpoints.admin.users,
      method: "GET",
      params: {
        page: params.page ?? 1,
        per_page: params.perPage ?? 20,
        // Normalize role to lowercase to match backend expectations (safe no-op if already correct)
        role: params.role ? String(params.role).toLowerCase() : undefined,
        search: params.search || undefined,
      },
    }),
  get: (id: number | string) =>
    request<AdminUserResponse>({ url: endpoints.admin.userById(id), method: "GET" }),
  setStatus: (id: number | string, data: { enabled?: boolean; blocked?: boolean }) =>
    request<AdminUserResponse>({ url: endpoints.admin.userStatus(id), method: "PUT", data }),
  update: (id: number | string, data: { name?: string; email?: string; mobile?: string; phoneNumber?: string }) =>
    request<AdminUserResponse>({ url: endpoints.admin.userById(id), method: "PUT", data }),
};
