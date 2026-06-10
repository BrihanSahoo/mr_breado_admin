import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export type NotificationReceiver = "CUSTOMERS" | "SELLERS" | "DRIVERS" | "ALL";
export type NotificationType = "OFFER" | "DEAL" | "ISSUE" | "SYSTEM";

export interface AdminNotificationPayload {
  receiver: NotificationReceiver;
  messageType: NotificationType;
  title: string;
  message: string;
  targetValue?: string;
}

function endpointForReceiver(receiver: NotificationReceiver) {
  switch (receiver) {
    case "CUSTOMERS":
      return endpoints.admin.notifications.sendToCustomers;
    case "SELLERS":
      return endpoints.admin.notifications.sendToSellers;
    case "DRIVERS":
      return endpoints.admin.notifications.sendToDrivers;
    case "ALL":
    default:
      return endpoints.admin.notifications.sendToAll;
  }
}

export const customerMessagesService = {
  send: (data: { customerId?: number | string; title: string; message: string; targetType?: string }) =>
    request<any>({ url: endpoints.admin.customerMessages, method: "POST", data }),

  sendNotification: (payload: AdminNotificationPayload) => {
    const data = {
      receiver: payload.receiver,
      type: payload.messageType,
      messageType: payload.messageType,
      title: payload.title,
      message: payload.message,
      body: payload.message,
      targetValue: payload.targetValue || undefined,
      target: payload.targetValue || undefined,
    };
    return request<any>({ url: endpointForReceiver(payload.receiver), method: "POST", data });
  },
};
