import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export type EmailCategory = "PROMOTIONAL" | "ALERT" | "PAYMENT_REQUEST" | "DOCUMENT" | "GENERAL";

export interface CustomerDetailsResponse {
  customer: any;
  orders: any[];
  analytics: {
    categories: Array<{ category: string; quantity: number; spend: number; orders: number }>;
    products: Array<{ productName: string; quantity: number; spend: number }>;
    favouriteCategory?: any;
    favouriteProduct?: any;
  };
}

function emailForm(payload: {
  category: EmailCategory;
  subject: string;
  bodyText: string;
  attachments?: File[];
}) {
  const form = new FormData();
  form.set("category", payload.category);
  form.set("subject", payload.subject);
  form.set("bodyText", payload.bodyText);
  (payload.attachments || []).forEach((file) => form.append("attachments", file, file.name));
  return form;
}

export const customerEngagementService = {
  details: (id: string | number) => request<CustomerDetailsResponse>({ url: endpoints.admin.customerDetails(id), method: "GET" }),
  remove: (id: string | number, reason: string) => request<any>({ url: endpoints.admin.customerDelete(id), method: "DELETE", data: { reason } }),
  notify: (id: string | number, payload: { type: string; title: string; message: string; data?: Record<string, unknown> }) =>
    request<any>({ url: endpoints.admin.customerNotification(id), method: "POST", data: payload }),
  emailCustomer: (id: string | number, payload: { category: EmailCategory; subject: string; bodyText: string; attachments?: File[] }) =>
    request<any>({ url: endpoints.admin.customerEmail(id), method: "POST", data: emailForm(payload), headers: { "Content-Type": "multipart/form-data" } }),
  emailRider: (id: string | number, payload: { category: EmailCategory; subject: string; bodyText: string; attachments?: File[] }) =>
    request<any>({ url: endpoints.admin.riderEmail(id), method: "POST", data: emailForm(payload), headers: { "Content-Type": "multipart/form-data" } }),
  emailHistory: (id: string | number, role: "CUSTOMER" | "RIDER") => request<any[]>({ url: role === "RIDER" ? endpoints.admin.riderEmails(id) : endpoints.admin.customerEmails(id), method: "GET" }),
  templates: (recipientName = "") => request<any[]>({ url: endpoints.admin.emailTemplates, method: "GET", params: { recipientName } }),
  emailConfig: () => request<any>({ url: endpoints.admin.emailConfigStatus, method: "GET" }),
  integrationHealth: () => request<any>({ url: endpoints.admin.integrationsHealth, method: "GET" }),
};
