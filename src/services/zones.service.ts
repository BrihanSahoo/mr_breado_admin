import { request } from "@/api/client";

export type DeliveryZone = {
  id: string;
  name: string;
  deliveryCharge: number;
  radiusKm: number;
  latitude: number;
  longitude: number;
  active: boolean;
  status?: string;
};

export type DeliveryZoneInput = Omit<DeliveryZone, "id" | "status">;

export const zonesService = {
  list: () => request<DeliveryZone[]>({ url: "/admin/zones", method: "GET" }),
  create: (data: DeliveryZoneInput) =>
    request<DeliveryZone>({ url: "/admin/zones", method: "POST", data }),
  update: (id: string, data: Partial<DeliveryZoneInput>) =>
    request<DeliveryZone>({ url: `/admin/zones/${id}`, method: "PUT", data }),
  remove: (id: string) =>
    request<void>({ url: `/admin/zones/${id}`, method: "DELETE" }),
};
