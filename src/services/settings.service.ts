import { request } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export const settingsService = {
  restaurant: () => request<any>({ url: endpoints.admin.restaurantSettings, method: "GET" }),
  updateRestaurant: (data: any) => request<any>({ url: endpoints.admin.restaurantSettings, method: "PUT", data }),
  driver: () => request<any>({ url: endpoints.admin.driverSettings, method: "GET" }),
  updateDriver: (data: any) => request<any>({ url: endpoints.admin.driverSettings, method: "PUT", data }),
  map: () => request<any>({ url: endpoints.admin.mapSettings, method: "GET" }),
  updateMap: (data: any) => request<any>({ url: endpoints.admin.mapSettings, method: "PUT", data }),
  commission: () => request<any>({ url: endpoints.admin.commissionSettings, method: "GET" }),
  updateVendorCommission: (data: any) => request<any>({ url: endpoints.admin.vendorCommissionSettings, method: "PUT", data }),
  updateDriverCommission: (data: any) => request<any>({ url: endpoints.admin.driverCommissionSettings, method: "PUT", data }),
  platformFee: () => request<any>({ url: endpoints.admin.platformFeeSettings, method: "GET" }),
  updatePlatformFee: (data: any) => request<any>({ url: endpoints.admin.platformFeeSettings, method: "PUT", data }),
  gateways: () => request<any>({ url: endpoints.admin.paymentGatewaySettings, method: "GET" }),
  updateGateways: (data: any) => request<any>({ url: endpoints.admin.paymentGatewaySettings, method: "PUT", data }),

  // Real backend platform settings used by app checkout/payment/takeaway flows.
  // Admin can change Razorpay key id/secret, enable/disable online payment, COD,
  // Mr Breado takeaway, delivery charge rules, rider payout and support details.
  platformAdmin: () => request<any>({ url: endpoints.platform.adminSettings, method: "GET" }),
  updatePlatformAdmin: (data: any) => request<any>({ url: endpoints.platform.adminSettings, method: "PUT", data }),
  platformPublic: () => request<any>({ url: endpoints.platform.publicSettings, method: "GET" }),
};
