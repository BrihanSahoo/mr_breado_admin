import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export const accountService = {
  profile: () => request<any>({ url: endpoints.admin.accountProfile, method: "GET" }),
  updateProfile: (data: any) => request<any>({ url: endpoints.admin.accountProfile, method: "PUT", data }),
  updateGstin: (data: any) => request<any>({ url: endpoints.admin.gstinUpdate, method: "PATCH", data }),
  sendPasswordOtp: () => request<any>({ url: endpoints.admin.updatePasswordOtp, method: "POST" }),
  updatePassword: (data: any) => request<any>({ url: endpoints.admin.updatePassword, method: "PUT", data }),
  sendEmailOtp: () => request<any>({ url: endpoints.admin.updateEmailOtp, method: "POST" }),
  updateEmail: (data: any) => request<any>({ url: endpoints.admin.updateEmail, method: "PUT", data }),
  updatePhone: (data: any) => request<any>({ url: endpoints.admin.updatePhone, method: "PUT", data }),
};
