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

  // Keep both backend snake_case and frontend camelCase pagination aliases.
  if ("per_page" in obj && !("perPage" in out)) out.perPage = obj.per_page;
  if ("total_pages" in obj && !("totalPages" in out)) out.totalPages = obj.total_pages;
  if ("totalElements" in out && !("total" in out)) out.total = out.totalElements;
  if ("totalItems" in out && !("total" in out)) out.total = out.totalItems;
  if ("content" in out && !("items" in out)) out.items = out.content;

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

/** Map HTTP status to a user-safe message. Backend payloads are never rendered. */
function safeMessageFor(status: number | undefined): string {
  if (status === 400) return "The request was invalid. Please check your input.";
  if (status === 401) return "Your session has expired. Please sign in again.";
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
    const safeMessage = safeMessageFor(status);

    if (status === 401) {
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

/** Unwrap the standard { success, message, data } envelope. */
export async function request<T>(
  config: Parameters<typeof api.request>[0],
): Promise<T> {
  const res = await api.request<ApiResponse<T>>(config);
  return res.data?.data as T;
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
