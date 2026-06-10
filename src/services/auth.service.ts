import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { AuthResponse, LoginRequest } from "@/types";

type RawAuthResponse = AuthResponse & {
  access_token?: string;
  token_type?: string;
};

const normalizeAuthResponse = (raw: RawAuthResponse): AuthResponse => ({
  accessToken: raw.accessToken ?? raw.access_token ?? "",
  tokenType: raw.tokenType ?? raw.token_type ?? "ADMIN",
  data: raw.data,
});

export const authService = {
  login: (payload: LoginRequest) =>
    request<RawAuthResponse>({
      url: endpoints.auth.login,
      method: "POST",
      data: { deviceType: "ADMIN", emailOrMobile: payload.email ?? payload.mobile, ...payload },
    }).then(normalizeAuthResponse),
  logout: () =>
    request<null>({ url: endpoints.auth.logout, method: "POST" }).catch(() => null),
};
