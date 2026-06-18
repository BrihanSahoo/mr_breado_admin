import { request } from "@/api/client";
import { authStore } from "@/store/auth";
import type { AuthResponse, LoginRequest } from "@/types";

type AnyRecord = Record<string, any>;

type RawAuthResponse = AuthResponse & AnyRecord & {
  access_token?: string;
  token_type?: string;
  token?: string;
  jwt?: string;
  jwtToken?: string;
  authToken?: string;
  bearerToken?: string;
  user?: AnyRecord;
  data?: AnyRecord;
};

const LOGIN_PATHS = ["/admin/login", "/auth/login", "/admin/auth/login"] as const;
const LOGOUT_PATHS = ["/admin/logout", "/auth/logout", "/admin/auth/logout"] as const;

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return "";
};

const normalizeAuthResponse = (raw: RawAuthResponse | null | undefined): AuthResponse => {
  const root: AnyRecord = raw && typeof raw === "object" ? raw : {};
  const nested: AnyRecord = root.data && typeof root.data === "object" ? root.data : {};
  const user: AnyRecord = root.user && typeof root.user === "object"
    ? root.user
    : nested.user && typeof nested.user === "object"
      ? nested.user
      : {};

  const accessToken = firstString(
    root.accessToken,
    root.access_token,
    root.token,
    root.jwt,
    root.jwtToken,
    root.authToken,
    root.bearerToken,
    nested.accessToken,
    nested.access_token,
    nested.token,
    nested.jwt,
    nested.jwtToken,
    nested.authToken,
    nested.bearerToken,
  );

  const role = firstString(user.role, nested.role, root.role, root.tokenType, root.token_type).toUpperCase();
  if (role && !["ADMIN", "SUPER_ADMIN", "SUPERADMIN"].includes(role)) {
    throw new Error("This account is not authorized for the Admin Dashboard.");
  }

  return {
    accessToken,
    tokenType: role || "ADMIN",
    data: root.data ?? root.user ?? root,
  };
};

async function tryPaths<T>(paths: readonly string[], config: Omit<Parameters<typeof request<T>>[0], "url">): Promise<T> {
  let lastError: unknown;
  for (const url of paths) {
    try {
      return await request<T>({ ...config, url });
    } catch (error: any) {
      lastError = error;
      const status = Number(error?.status ?? 0);
      // Invalid credentials or validation must not be retried against other aliases.
      if ([400, 401, 403, 422, 429].includes(status)) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unable to connect to the backend.");
}

export const authService = {
  login: async (payload: LoginRequest) => {
    // Never send a stale bearer token with a fresh login request.
    authStore.clear();
    const raw = await tryPaths<RawAuthResponse>(LOGIN_PATHS, {
      method: "POST",
      data: {
        email: payload.email,
        password: payload.password,
        emailOrMobile: payload.email ?? payload.mobile,
        username: payload.email,
        deviceType: payload.deviceType ?? "ADMIN",
        role: "ADMIN",
      },
    });
    const normalized = normalizeAuthResponse(raw);
    if (!normalized.accessToken) throw new Error("The backend did not return an authentication token.");
    return normalized;
  },
  logout: async () => {
    try {
      return await tryPaths<null>(LOGOUT_PATHS, { method: "POST" });
    } catch {
      return null;
    }
  },
};
