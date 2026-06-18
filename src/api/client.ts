import axios, { AxiosError, type AxiosInstance } from "axios";
import { toast } from "sonner";
import { API_BASE_URL } from "./endpoints";
import { authStore } from "@/store/auth";
import type { ApiResponse } from "@/types";

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeObject<T = any>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== "object") return obj as unknown as T;
  if (Array.isArray(obj)) return obj.map((v) => camelizeObject(v)) as unknown as T;
  const out: Record<string, any> = {};
  Object.entries(obj).forEach(([k, v]) => {
    const key = toCamel(k);
    out[key] = camelizeObject(v);
  });

  // MongoDB compatibility: expose stable string IDs under the legacy `id` field.
  if (Object.prototype.hasOwnProperty.call(obj, "_id") && obj._id != null) {
    out.id = String(obj._id);
    out._id = String(obj._id);
  } else if (out.Id != null && out.id == null) {
    out.id = String(out.Id);
  }

  // Keep both backend snake_case and frontend camelCase pagination aliases.
  if ("per_page" in obj && !("perPage" in out)) out.perPage = obj.per_page;
  if ("total_pages" in obj && !("totalPages" in out)) out.totalPages = obj.total_pages;
  if ("current_page" in obj && !("currentPage" in out)) out.currentPage = obj.current_page;
  if ("totalElements" in out && !("total" in out)) out.total = out.totalElements;
  if ("totalItems" in out && !("total" in out)) out.total = out.totalItems;

  // Admin backend compatibility: many Node routes return { success, message, orders/users/... }
  // while the web UI expects a standard PageResponse with { items, total, total_pages }.
  const collectionKeys = [
    "items", "content", "records", "rows", "results", "list",
    "orders", "users", "customers", "owners", "sellers", "restaurants",
    "drivers", "deliveryBoys", "products", "foods", "categories", "banners",
    "offers", "coupons", "reviews", "reports", "transactions", "payments",
    "settlements", "tickets", "messages", "notifications", "stories",
    "verificationRequests", "verifications",
  ];
  for (const key of collectionKeys) {
    if (!("items" in out) && Array.isArray(out[key])) {
      out.items = out[key];
      break;
    }
  }

  const pagination = out.pagination ?? out.pageable ?? {};
  if (!("page" in out)) out.page = out.currentPage ?? pagination.currentPage ?? pagination.page ?? 1;
  if (!("perPage" in out)) out.perPage = out.size ?? out.limit ?? pagination.perPage ?? pagination.limit ?? pagination.size ?? (Array.isArray(out.items) ? out.items.length : 20);
  if (!("per_page" in out)) out.per_page = out.perPage;
  if (!("total" in out)) out.total = out.totalCount ?? out.count ?? pagination.total ?? pagination.totalItems ?? (Array.isArray(out.items) ? out.items.length : 0);
  if (!("totalPages" in out)) out.totalPages = out.total_pages ?? pagination.totalPages ?? pagination.total_pages ?? Math.max(1, Math.ceil(Number(out.total || 0) / Math.max(1, Number(out.perPage || 20))));
  if (!("total_pages" in out)) out.total_pages = out.totalPages;

  return out as unknown as T;
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { Accept: "application/json" },
});

api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  config.headers = config.headers ?? {};

  const headers = config.headers as Record<string, string>;
  const responseType = String(config.responseType ?? "").toLowerCase();
  const isBinary = responseType === "blob" || responseType === "arraybuffer";

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Do not force JSON headers for PDF/CSV/Excel downloads.
  if (!isBinary && !headers.Accept) {
    headers.Accept = "application/json";
  }

  return config;
});

function isAuthenticationRequest(url: unknown): boolean {
  const value = String(url ?? "").toLowerCase();
  return (
    value.includes("/admin/login") ||
    value.includes("/admin/auth/login") ||
    value.includes("/auth/login") ||
    value.endsWith("/login")
  );
}

/** Map HTTP status to a user-safe message. Backend payloads are never rendered. */
function safeMessageFor(status: number | undefined, authRequest = false): string {
  if (status === 400) return authRequest ? "Please enter a valid admin email and password." : "The request was invalid. Please check your input.";
  if (status === 401) return authRequest ? "Invalid admin email or password." : "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return "This action conflicts with the current state.";
  if (status === 422) return "Some fields are invalid. Please review and try again.";
  if (status === 429) return "Too many requests. Please slow down and try again.";
  if (status && status >= 500) return "Server error. Please try again later.";
  return "Something went wrong. Please try again.";
}

api.interceptors.response.use(
  (response) => {
    // Normalize API envelope data keys from snake_case to camelCase
    try {
      if (response?.data && typeof response.data === "object") {
        // Standard envelope: { success, message, data }
        if (response.data.data) {
          response.data.data = camelizeObject(response.data.data);
        }
      }
    } catch (e) {
      // ignore transformation errors
    }
    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    const status = error.response?.status;
    const authRequest = isAuthenticationRequest(error.config?.url);
    const safeMessage = safeMessageFor(status, authRequest);

    // A failed login is not an expired session. Do not clear/redirect or show the
    // misleading session-expired message for authentication endpoints.
    if (status === 401 && !authRequest) {
      authStore.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        toast.error(safeMessage);
        window.location.href = "/login";
      }
    }
    // No global error toast for normal API failures. Pages/actions show friendly, contextual messages.
    // Log raw backend detail to console for developers only; never surface in UI.
    if (typeof console !== "undefined") {
      console.debug("[api]", status, error.response?.data?.message ?? error.message);
    }
    return Promise.reject(Object.assign(new Error(safeMessage), { status }));
  },
);

/**
 * Unwrap backend responses safely.
 * Supports Spring-style { success, message, data } and Node-style
 * { success, message, orders/users/restaurants/... }.
 */
export async function request<T>(
  config: Parameters<typeof api.request>[0],
): Promise<T> {
  const res = await api.request<ApiResponse<T> & Record<string, any>>(config);
  const body = camelizeObject<any>(res.data as any);

  if (body && Object.prototype.hasOwnProperty.call(body, "data") && body.data !== undefined && body.data !== null) {
    const payload = camelizeObject<any>(body.data);

    // If data is directly an array for a paged admin request, wrap it for table pages.
    const params = (config.params ?? {}) as Record<string, any>;
    const wantsPage = params && ("page" in params || "perPage" in params || "per_page" in params || "limit" in params);
    if (Array.isArray(payload) && wantsPage) {
      const perPage = Number(params.perPage ?? params.per_page ?? params.limit ?? payload.length ?? 20) || 20;
      const page = Number(params.page ?? 1) || 1;
      return {
        items: payload,
        page,
        per_page: perPage,
        perPage,
        total: payload.length,
        total_pages: Math.max(1, Math.ceil(payload.length / Math.max(1, perPage))),
        totalPages: Math.max(1, Math.ceil(payload.length / Math.max(1, perPage))),
        last: true,
      } as T;
    }

    return payload as T;
  }

  return body as T;
}


export async function downloadBlob(config: Parameters<typeof api.request>[0]): Promise<Blob> {
  const res = await api.request<Blob>({
    ...config,
    responseType: "blob",
    headers: {
      Accept: "application/pdf, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream",
      ...(config.headers ?? {}),
    },
  });
  return res.data;
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
