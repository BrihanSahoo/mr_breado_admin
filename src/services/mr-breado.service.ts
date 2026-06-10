import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

function toFormData(payload: Record<string, unknown> | FormData): FormData {
  if (payload instanceof FormData) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (value instanceof File || value instanceof Blob) fd.append(key, value);
    else fd.append(key, typeof value === "string" ? value : JSON.stringify(value));
  });
  return fd;
}

export const mrBreadoService = {
  restaurant: () => request<any>({ url: endpoints.admin.mrBreado.restaurant, method: "GET" }),
  updateRestaurant: (data: Record<string, unknown> | FormData) => request<any>({
    url: endpoints.admin.mrBreado.restaurant,
    method: "PUT",
    data: toFormData(data),
    headers: { "Content-Type": "multipart/form-data" },
  }),
  updateRestaurantStatus: (data: any) => request<any>({ url: endpoints.admin.mrBreado.restaurantStatus, method: "PATCH", data }),
};
