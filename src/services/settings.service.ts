import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export const settingsService = {
  restaurant: () => request<any>({ url: endpoints.admin.restaurantSettings, method: "GET" }),
  updateRestaurant: (data: any) => request<any>({ url: endpoints.admin.restaurantSettings, method: "PUT", data }),
  driver: () => request<any>({ url: endpoints.admin.driverSettings, method: "GET" }),
  updateDriver: (data: any) => request<any>({ url: endpoints.admin.driverSettings, method: "PUT", data }),
  map: async () => {
    const data = await request<any>({ url: "/admin/business/settings", method: "GET" });
    return {
      ...data,
      googleMapKey: data.googleMapKey ?? data.googleMapsApiKey ?? "",
      provider: (data.distanceProvider === "GOOGLE" || data.provider === "GOOGLE") ? "GOOGLE" : "OSM",
    };
  },
  updateMap: (data: any) => request<any>({
    url: "/admin/business/settings",
    method: "PUT",
    data: {
      ...data,
      googleMapKey: data.googleMapKey ?? data.googleMapsApiKey ?? "",
      googleMapsApiKey: data.googleMapKey ?? data.googleMapsApiKey ?? "",
      distanceProvider: data.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE",
    },
  }),
  commission: () => request<any>({ url: endpoints.admin.commissionSettings, method: "GET" }),
  updateVendorCommission: (data: any) => request<any>({ url: endpoints.admin.vendorCommissionSettings, method: "PUT", data }),
  updateDriverCommission: (data: any) => request<any>({ url: endpoints.admin.driverCommissionSettings, method: "PUT", data }),
  platformFee: () => request<any>({ url: endpoints.admin.platformFeeSettings, method: "GET" }),
  updatePlatformFee: (data: any) => request<any>({ url: endpoints.admin.platformFeeSettings, method: "PUT", data }),
  gateways: () => request<any>({ url: endpoints.admin.paymentGatewaySettings, method: "GET" }),
  updateGateways: (data: any) => request<any>({ url: endpoints.admin.paymentGatewaySettings, method: "PUT", data }),

  // Real backend platform settings used by app checkout/payment/takeaway flows.
  // Admin can change Razorpay key id/secret, enable/disable online payment, COD,
  // Mr. Breado takeaway, delivery charge rules, rider payout and support details.
  platformAdmin: () => request<any>({ url: endpoints.platform.adminSettings, method: "GET" }),
  updatePlatformAdmin: (data: any) => request<any>({ url: endpoints.platform.adminSettings, method: "PUT", data }),
  platformPublic: () => request<any>({ url: endpoints.platform.publicSettings, method: "GET" }),
};
