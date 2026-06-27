import { request } from "@/api/client";

type Config = Omit<Parameters<typeof request<any>>[0], "url">;

async function requestFallback<T>(paths: string[], config: Config): Promise<T> {
  let lastError: unknown;
  for (const url of paths) {
    try {
      return await request<T>({ ...config, url });
    } catch (error: any) {
      lastError = error;
      const status = Number(error?.status ?? 0);
      if ([400, 401, 403, 409, 422, 429].includes(status)) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("The backend does not support this account operation.");
}

const PROFILE_PATHS = ["/admin/account/profile", "/admin/profile", "/admin/me"];
const EMAIL_PATHS = ["/admin/account/email", "/admin/profile/email", "/admin/change-email"];
const PASSWORD_PATHS = ["/admin/account/password", "/admin/profile/password", "/admin/change-password"];

export const accountService = {
  forgotPassword: (email: string) => request<any>({
    url: "/admin/auth/forgot-password",
    method: "POST",
    data: { email },
  }),
  resetPassword: (data: { email: string; code?: string; recoveryKey?: string; newPassword: string; confirmPassword: string }) => request<any>({
    url: "/admin/auth/reset-password",
    method: "POST",
    data,
  }),
  profile: () => requestFallback<any>(PROFILE_PATHS, { method: "GET" }),
  updateProfile: (data: any) => requestFallback<any>(PROFILE_PATHS, { method: "PUT", data }),
  updateGstin: (data: any) => requestFallback<any>(["/admin/account/profile/gstin", "/admin/profile/gstin"], { method: "PATCH", data }),
  sendPasswordOtp: () => requestFallback<any>(["/admin/account/password/otp", "/admin/profile/password/otp"], { method: "POST" }),
  updatePassword: (data: any) => requestFallback<any>(PASSWORD_PATHS, {
    method: "PUT",
    data: {
      ...data,
      current_password: data.currentPassword,
      oldPassword: data.currentPassword,
      password: data.newPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    },
  }),
  sendEmailOtp: () => requestFallback<any>(["/admin/account/email/otp", "/admin/profile/email/otp"], { method: "POST" }),
  updateEmail: (data: any) => requestFallback<any>(EMAIL_PATHS, {
    method: "PUT",
    data: {
      ...data,
      email: data.newEmail ?? data.email,
      newEmail: data.newEmail ?? data.email,
      new_email: data.newEmail ?? data.email,
      current_password: data.currentPassword,
      password: data.currentPassword,
    },
  }),
  updatePhone: (data: any) => requestFallback<any>(["/admin/account/phone", "/admin/profile/phone"], { method: "PUT", data }),
};
