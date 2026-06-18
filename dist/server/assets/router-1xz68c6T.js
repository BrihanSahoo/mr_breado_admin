import { useQueryClient, useQuery, useMutation, QueryClientProvider, keepPreviousData, QueryClient } from "@tanstack/react-query";
import { Link, useRouterState, useNavigate, createRootRouteWithContext, useRouter, Navigate, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useSyncExternalStore, useState, useEffect, useMemo } from "react";
import { X, Menu, Bell, Sparkles, Globe, ChevronDown, LayoutDashboard, ShoppingBag, Users, Building2, UserCog, Bike, Utensils, ChefHat, Soup, Layers, Shield, KeyRound, Tag, Gift, LifeBuoy, Ticket, CreditCard, MapPin, Activity, MessageSquare, UserCircle, Image, Settings, Search, ChevronRight, LogOut, ArrowLeft, Download, Plus, FileText, WalletCards, IndianRupee, CalendarDays, TrendingUp, Package, UserRound, Clock3, Phone, TrendingDown, Save, Navigation, Truck, ShieldCheck, FileSpreadsheet, Loader2, Star, Pencil, Trash2, ChevronLeft, Store, ToggleRight, ToggleLeft, ReceiptText, Eye, Check, PackageCheck, FileDown, Send } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import axios from "axios";
import { toast, Toaster as Toaster$1 } from "sonner";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
const appCss = "/assets/styles-C1qYi_yt.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetPortal = SheetPrimitive.Portal;
const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxs(SheetPrimitive.Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
const SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
const SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
const STORAGE_KEY = "go4food.admin.session";
const EMPTY = Object.freeze({ token: null, tokenType: null });
function readFromStorage() {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.token !== "string" || !parsed.token) return EMPTY;
    return {
      token: parsed.token,
      tokenType: typeof parsed.tokenType === "string" ? parsed.tokenType : "ADMIN"
    };
  } catch {
    return EMPTY;
  }
}
let snapshot = readFromStorage();
const listeners = /* @__PURE__ */ new Set();
const emit = () => listeners.forEach((l) => l());
function persist(state) {
  if (typeof window === "undefined") return;
  try {
    if (state.token) {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
  }
}
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.storageArea !== window.sessionStorage) return;
    if (e.key && e.key !== STORAGE_KEY) return;
    const next = readFromStorage();
    if (next.token !== snapshot.token) {
      snapshot = next;
      emit();
    }
  });
}
const authStore = {
  getToken() {
    return snapshot.token;
  },
  getTokenType() {
    return snapshot.tokenType;
  },
  setToken(token, tokenType = "ADMIN") {
    snapshot = { token, tokenType };
    persist(snapshot);
    emit();
  },
  clear() {
    snapshot = EMPTY;
    persist(snapshot);
    emit();
  },
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return snapshot;
  },
  /**
   * Stable server snapshot. MUST return the same reference on every call to
   * avoid the React "getServerSnapshot should be cached" infinite loop.
   */
  getServerSnapshot() {
    return EMPTY;
  }
};
function useAuth() {
  const state = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot
  );
  return { ...state, isAuthenticated: !!state.token };
}
const DEFAULT_API_BASE_URL = "https://mr-breado-new-backend.onrender.com/api";
const API_BASE_URL = "https://mr-breado-new-backend.onrender.com/api"?.replace(/\/$/, "") || DEFAULT_API_BASE_URL;
const ADMIN_LOGO_URL = "https://res.cloudinary.com/dswsz53xi/image/upload/v1780431123/logo_qbyjg5.png";
const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    register: "/auth/register"
  },
  platform: {
    publicSettings: "/platform/settings",
    adminSettings: "/platform/admin/settings"
  },
  admin: {
    profile: "/admin/profile",
    serviceArea: "/admin/service-area",
    verifications: "/admin/verifications",
    verificationsAll: "/admin/verifications/all",
    verificationRequestsAlias: "/admin/verification-requests",
    serviceAreaVerificationsAlias: "/admin/service-area-verifications",
    verificationApprove: (id) => `/admin/verifications/${id}/approve`,
    verificationReject: (id) => `/admin/verifications/${id}/reject`,
    restaurantVerificationStatus: (id) => `/admin/verifications/restaurants/${id}/status`,
    riderVerificationStatus: (id) => `/admin/verifications/riders/${id}/status`,
    accountProfile: "/admin/account/profile",
    updateProfile: "/admin/profile",
    updateEmail: "/admin/account/email",
    updateEmailOtp: "/admin/account/email/otp",
    updatePassword: "/admin/account/password",
    updatePasswordOtp: "/admin/account/password/otp",
    updatePhone: "/admin/account/phone",
    gstinUpdate: "/admin/account/profile/gstin",
    dashboard: "/admin/head-office/dashboard",
    headOfficeDashboard: "/admin/head-office/dashboard",
    dashboardOverview: "/admin/dashboard/overview",
    dashboardRevenue: "/admin/dashboard/revenue",
    dashboardPayments: "/admin/dashboard/payments",
    dashboardUserGrowth: "/admin/dashboard/user-growth",
    dashboardOrderStatusChart: "/admin/dashboard/order-status-chart",
    dashboardRecentOrders: "/admin/dashboard/recent-orders",
    orders: "/admin/orders",
    orderById: (id) => `/admin/orders/${id}`,
    dashboardTrendingMenu: "/admin/dashboard/trending-menu",
    dashboardPopularRestaurants: "/admin/dashboard/popular-restaurants",
    dashboardTopRestaurants: "/admin/dashboard/top-restaurants",
    mrBreadoDashboard: "/admin/mr-breado/dashboard",
    users: "/admin/users",
    userById: (id) => `/admin/users/${id}`,
    userStatus: (id) => `/admin/users/${id}/status`,
    customers: "/admin/customers",
    customerById: (id) => `/admin/customers/${id}`,
    customerDetails: (id) => `/admin/customers/${id}/details`,
    customerOrders: (id) => `/admin/customers/${id}/orders`,
    customerWallet: (id) => `/admin/customers/${id}/wallet`,
    customerAddresses: (id) => `/admin/customers/${id}/addresses`,
    customerWalletTopup: (id) => `/admin/customers/${id}/wallet/top-up`,
    customersExport: "/admin/customers/export",
    owners: "/admin/owners",
    sellers: "/admin/sellers",
    ownerById: (id) => `/admin/owners/${id}`,
    ownerDetails: (id) => `/admin/owners/${id}/details`,
    ownerRestaurants: (id) => `/admin/owners/${id}/restaurants`,
    ownerWallet: (id) => `/admin/owners/${id}/wallet`,
    ownerSubscriptions: (id) => `/admin/owners/${id}/subscriptions`,
    ownerStatus: (id) => `/admin/owners/${id}/status`,
    ownerVerification: (id) => `/admin/owners/${id}/verification`,
    ownersExport: "/admin/owners/export",
    restaurants: "/admin/outlets",
    restaurantById: (id) => `/admin/restaurants/${id}`,
    restaurantDetails: (id) => `/admin/restaurants/${id}/details`,
    restaurantOrders: (id) => `/admin/restaurants/${id}/orders`,
    restaurantProducts: (id) => `/admin/restaurants/${id}/products`,
    restaurantReviews: (id) => `/admin/restaurants/${id}/reviews`,
    restaurantWallet: (id) => `/admin/restaurants/${id}/wallet`,
    restaurantPayoutSummary: (id) => `/admin/restaurants/${id}/payout-summary`,
    restaurantPayoutAlert: (id) => `/admin/restaurants/${id}/payout-alert`,
    restaurantPayoutPay: (id) => `/admin/restaurants/${id}/payout/pay`,
    restaurantStatus: (id) => `/admin/restaurants/${id}/status`,
    restaurantOnlineStatus: (id) => `/admin/restaurants/${id}/online-status`,
    restaurantOpeningHours: (id) => `/admin/restaurants/${id}/opening-hours`,
    franchiseRequests: "/admin/franchise-requests",
    franchiseRequestStatus: (id) => `/admin/franchise-requests/${id}/status`,
    franchiseRequestContact: (id) => `/admin/franchise-requests/${id}/contact`,
    franchiseOutlets: "/admin/outlets",
    franchiseOutletInventory: (id) => `/admin/outlets/${id}/inventory`,
    franchiseOutletTransfers: (id) => `/admin/outlets/${id}/transfers`,
    franchiseRefillRequests: "/admin/franchise-refill-requests",
    franchiseRefillStatus: (id) => `/admin/franchise-refill-requests/${id}/status`,
    restaurantJoinRequests: "/admin/restaurants/join-requests",
    restaurantJoinRequestById: (id) => `/admin/restaurants/join-requests/${id}`,
    restaurantJoinVerify: (id) => `/admin/restaurants/join-requests/${id}/verify`,
    restaurantJoinApprove: (id) => `/admin/restaurants/join-requests/${id}/approve`,
    restaurantJoinReject: (id) => `/admin/restaurants/join-requests/${id}/reject`,
    restaurantsExport: "/admin/restaurants/export",
    drivers: "/admin/delivery-boys",
    driverById: (id) => `/admin/drivers/${id}`,
    driverStatus: (id) => `/admin/drivers/${id}/status`,
    driverVerification: (id) => `/admin/drivers/${id}/verification`,
    driverVerificationRequests: "/admin/drivers/verification-requests",
    driverVerificationDetails: (id) => `/admin/drivers/${id}/verification-details`,
    driverApprove: (id) => `/admin/drivers/${id}/approve`,
    driverReject: (id) => `/admin/drivers/${id}/reject`,
    driversExport: "/admin/drivers/export",
    driversCash: "/admin/drivers/cash",
    verifyDriverCash: (driverId) => `/admin/drivers/${driverId}/cash-deposit/verify`,
    driverCashTx: (driverId) => `/admin/drivers/${driverId}/cash-transactions`,
    products: "/admin/products",
    foodRequests: "/admin/food-requests",
    foodRequestStatus: (id) => `/admin/food-requests/${id}/status`,
    productById: (id) => `/admin/products/${id}`,
    productDetails: (id) => `/admin/products/${id}/details`,
    productStock: (id) => `/admin/products/${id}/stock`,
    productVisibility: (id) => `/admin/products/${id}/visibility`,
    productAddons: (id) => `/admin/products/${id}/addons`,
    productAddonById: (id, addonId) => `/admin/products/${id}/addons/${addonId}`,
    productsExport: "/admin/products/export",
    categories: "/admin/categories",
    categorySummary: "/admin/categories/summary",
    categoryById: (id) => `/admin/categories/${id}`,
    categoryStatus: (id) => `/admin/categories/${id}/status`,
    categorySubcategories: (id) => `/admin/categories/${id}/subcategories`,
    subcategoryById: (id) => `/admin/subcategories/${id}`,
    subcategoryStatus: (id) => `/admin/subcategories/${id}/status`,
    categoryAliases: "/admin/category",
    foodCategoriesAdmin: "/admin/food-categories",
    publicCategories: "/categories",
    publicSubCategories: "/categories/sub-categories",
    publicFoodCategories: "/food-categories",
    cuisine: "/admin/cuisines",
    cuisines: "/admin/cuisines",
    banners: "/admin/banners",
    bannerById: (id) => `/admin/banners/${id}`,
    bannerStatus: (id) => `/admin/banners/${id}/status`,
    offers: "/admin/offers",
    offerById: (id) => `/admin/offers/${id}`,
    offerStatus: (id) => `/admin/offers/${id}/status`,
    coupons: "/admin/coupons",
    couponById: (id) => `/admin/coupons/${id}`,
    couponStatus: (id) => `/admin/coupons/${id}/status`,
    paymentsSummary: "/admin/payments/summary",
    paymentLedger: "/admin/payment-ledger",
    paymentSettings: "/admin/payment-settings",
    onlineTransactions: "/admin/online-transactions",
    onlineTransactionById: (id) => `/admin/online-transactions/${id}`,
    onlineTransactionReceipt: (id) => `/admin/online-transactions/${id}/receipt.pdf`,
    stories: "/admin/stories",
    storyById: (id) => `/admin/stories/${id}`,
    storyStatus: (id) => `/admin/stories/${id}/status`,
    paymentGatewaySettings: "/admin/finance/payment-gateways",
    paymentGatewayByCode: (code) => `/admin/finance/payment-gateways/${code}`,
    mrBreadoPayments: "/admin/mr-breado/payments",
    settlements: "/admin/money/restaurant-payouts",
    generateWeeklySettlement: (restaurantId) => `/admin/restaurant-settlements/${restaurantId}/generate-weekly`,
    markSettlementPaid: (settlementId) => `/admin/restaurant-settlements/${settlementId}/mark-paid`,
    sellerPayoutAccounts: "/admin/seller-payout-accounts",
    verifySellerPayout: (accountId) => `/admin/seller-payout-accounts/${accountId}/verify`,
    settings: "/admin/settings",
    restaurantSettings: "/admin/settings/restaurant",
    driverSettings: "/admin/settings/driver",
    mapSettings: "/admin/settings/map",
    commissionSettings: "/admin/settings/commission",
    vendorCommissionSettings: "/admin/settings/commission/vendor",
    driverCommissionSettings: "/admin/settings/commission/driver",
    platformFeeSettings: "/admin/settings/platform-fee",
    supportDashboard: "/admin/support/dashboard",
    supportTickets: "/admin/support/tickets",
    supportTicketById: (id) => `/admin/support/tickets/${id}`,
    supportTicketToday: "/admin/support/tickets/today",
    supportTicketAccept: (id) => `/admin/support/tickets/${id}/accept`,
    supportTicketStatus: (id) => `/admin/support/tickets/${id}/status`,
    supportTicketReply: (id) => `/admin/support/tickets/${id}/reply`,
    notifications: {
      send: "/admin/notifications/send",
      sendToAll: "/admin/notifications/send-to-all",
      sendToCustomers: "/admin/notifications/send-to-customers",
      sendToSellers: "/admin/notifications/send-to-sellers",
      sendToDrivers: "/admin/notifications/send-to-drivers"
    },
    customerMessages: "/admin/customer-messages/send",
    sellerMessages: "/admin/seller-messages",
    roles: "/admin/roles",
    roleAliases: "/admin/role",
    rolePermissions: (code) => `/admin/roles/${code}/permissions`,
    reviews: "/admin/reviews",
    restaurantReports: "/admin/restaurant-reports",
    reportStatus: (reportId) => `/admin/restaurant-reports/${reportId}/status`,
    uploadOfferImage: "/admin/uploads/offer-image",
    mrBreado: {
      dashboard: "/admin/mr-breado/dashboard",
      orders: "/admin/mr-breado/orders",
      orderById: (id) => `/admin/mr-breado/orders/${id}`,
      accept: (id) => `/admin/mr-breado/orders/${id}/accept`,
      preparing: (id) => `/admin/mr-breado/orders/${id}/preparing`,
      ready: (id) => `/admin/mr-breado/orders/${id}/ready`,
      reject: (id) => `/admin/mr-breado/orders/${id}/reject`,
      invoicePdf: (id) => `/admin/mr-breado/orders/${id}/invoice.pdf`,
      sendInvoice: (id) => `/admin/mr-breado/orders/${id}/invoice/send-to-customer`,
      products: "/admin/mr-breado/products",
      productById: (id) => `/admin/mr-breado/products/${id}`,
      productAvailability: (id) => `/admin/mr-breado/products/${id}/availability`,
      productStock: (id) => `/admin/mr-breado/products/${id}/stock`,
      template: "/admin/mr-breado/products/template",
      import: "/admin/mr-breado/products/import",
      export: "/admin/mr-breado/products/export",
      restaurant: "/admin/mr-breado/restaurant",
      restaurantStatus: "/admin/mr-breado/restaurant/status"
    }
  }
};
function toCamel(s) {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}
function camelizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((v) => camelizeObject(v));
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    const key = toCamel(k);
    out[key] = camelizeObject(v);
  });
  if (Object.prototype.hasOwnProperty.call(obj, "_id") && obj._id != null) {
    out.id = String(obj._id);
    out._id = String(obj._id);
  } else if (out.Id != null && out.id == null) {
    out.id = String(out.Id);
  }
  if ("per_page" in obj && !("perPage" in out)) out.perPage = obj.per_page;
  if ("total_pages" in obj && !("totalPages" in out)) out.totalPages = obj.total_pages;
  if ("current_page" in obj && !("currentPage" in out)) out.currentPage = obj.current_page;
  if ("totalElements" in out && !("total" in out)) out.total = out.totalElements;
  if ("totalItems" in out && !("total" in out)) out.total = out.totalItems;
  const collectionKeys = [
    "items",
    "content",
    "records",
    "rows",
    "results",
    "list",
    "orders",
    "users",
    "customers",
    "owners",
    "sellers",
    "restaurants",
    "drivers",
    "deliveryBoys",
    "products",
    "foods",
    "categories",
    "banners",
    "offers",
    "coupons",
    "reviews",
    "reports",
    "transactions",
    "payments",
    "settlements",
    "tickets",
    "messages",
    "notifications",
    "stories",
    "verificationRequests",
    "verifications"
  ];
  for (const key of collectionKeys) {
    if (!("items" in out) && Array.isArray(out[key])) {
      out.items = out[key];
      break;
    }
  }
  const pagination = out.pagination ?? out.pageable ?? {};
  if (!("page" in out)) out.page = out.currentPage ?? pagination.currentPage ?? pagination.page ?? 1;
  if (!("perPage" in out)) out.perPage = out.size ?? out.limit ?? pagination.perPage ?? pagination.limit ?? pagination.size ?? (Array.isArray(out.items) ? out.items.length : 20);
  if (!("per_page" in out)) out.per_page = out.perPage;
  if (!("total" in out)) out.total = out.totalCount ?? out.count ?? pagination.total ?? pagination.totalItems ?? (Array.isArray(out.items) ? out.items.length : 0);
  if (!("totalPages" in out)) out.totalPages = out.total_pages ?? pagination.totalPages ?? pagination.total_pages ?? Math.max(1, Math.ceil(Number(out.total || 0) / Math.max(1, Number(out.perPage || 20))));
  if (!("total_pages" in out)) out.total_pages = out.totalPages;
  return out;
}
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3e4,
  headers: { Accept: "application/json" }
});
api.interceptors.request.use((config) => {
  const token = authStore.getToken();
  config.headers = config.headers ?? {};
  const headers = config.headers;
  const responseType = String(config.responseType ?? "").toLowerCase();
  const isBinary = responseType === "blob" || responseType === "arraybuffer";
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (!isBinary && !headers.Accept) {
    headers.Accept = "application/json";
  }
  return config;
});
function isAuthenticationRequest(url) {
  const value = String(url ?? "").toLowerCase();
  return value.includes("/admin/login") || value.includes("/admin/auth/login") || value.includes("/auth/login") || value.endsWith("/login");
}
function safeMessageFor(status, authRequest = false) {
  if (status === 400) return authRequest ? "Please enter a valid admin email and password." : "The request was invalid. Please check your input.";
  if (status === 401) return authRequest ? "Invalid admin email or password." : "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return "This action conflicts with the current state.";
  if (status === 422) return "Some fields are invalid. Please review and try again.";
  if (status === 429) return "Too many requests. Please slow down and try again.";
  if (status && status >= 500) return "Server error. Please try again later.";
  return "Something went wrong. Please try again.";
}
api.interceptors.response.use(
  (response) => {
    try {
      if (response?.data && typeof response.data === "object") {
        if (response.data.data) {
          response.data.data = camelizeObject(response.data.data);
        }
      }
    } catch (e) {
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const authRequest = isAuthenticationRequest(error.config?.url);
    const safeMessage = safeMessageFor(status, authRequest);
    if (status === 401 && !authRequest) {
      authStore.clear();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        toast.error(safeMessage);
        window.location.href = "/login";
      }
    }
    if (typeof console !== "undefined") {
      console.debug("[api]", status, error.response?.data?.message ?? error.message);
    }
    return Promise.reject(Object.assign(new Error(safeMessage), { status }));
  }
);
async function request(config) {
  const res = await api.request(config);
  const body = camelizeObject(res.data);
  if (body && Object.prototype.hasOwnProperty.call(body, "data") && body.data !== void 0 && body.data !== null) {
    const payload = camelizeObject(body.data);
    const params = config.params ?? {};
    const wantsPage = params && ("page" in params || "perPage" in params || "per_page" in params || "limit" in params);
    if (Array.isArray(payload) && wantsPage) {
      const perPage = Number(params.perPage ?? params.per_page ?? params.limit ?? payload.length ?? 20) || 20;
      const page = Number(params.page ?? 1) || 1;
      return {
        items: payload,
        page,
        per_page: perPage,
        perPage,
        total: payload.length,
        total_pages: Math.max(1, Math.ceil(payload.length / Math.max(1, perPage))),
        totalPages: Math.max(1, Math.ceil(payload.length / Math.max(1, perPage))),
        last: true
      };
    }
    return payload;
  }
  return body;
}
async function downloadBlob(config) {
  const res = await api.request({
    ...config,
    responseType: "blob",
    headers: {
      Accept: "application/pdf, text/csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream",
      ...config.headers ?? {}
    }
  });
  return res.data;
}
function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
const LOGIN_PATHS = ["/admin/login", "/auth/login", "/admin/auth/login"];
const LOGOUT_PATHS = ["/admin/logout", "/auth/logout", "/admin/auth/logout"];
const firstString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return "";
};
const normalizeAuthResponse = (raw) => {
  const root = raw && typeof raw === "object" ? raw : {};
  const nested = root.data && typeof root.data === "object" ? root.data : {};
  const user = root.user && typeof root.user === "object" ? root.user : nested.user && typeof nested.user === "object" ? nested.user : {};
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
    nested.bearerToken
  );
  const role = firstString(user.role, nested.role, root.role, root.tokenType, root.token_type).toUpperCase();
  if (role && !["ADMIN", "SUPER_ADMIN", "SUPERADMIN"].includes(role)) {
    throw new Error("This account is not authorized for the Admin Dashboard.");
  }
  return {
    accessToken,
    tokenType: role || "ADMIN",
    data: root.data ?? root.user ?? root
  };
};
async function tryPaths(paths, config) {
  let lastError;
  for (const url of paths) {
    try {
      return await request({ ...config, url });
    } catch (error) {
      lastError = error;
      const status = Number(error?.status ?? 0);
      if ([400, 401, 403, 422, 429].includes(status)) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Unable to connect to the backend.");
}
const authService = {
  login: async (payload) => {
    authStore.clear();
    const raw = await tryPaths(LOGIN_PATHS, {
      method: "POST",
      data: {
        email: payload.email,
        password: payload.password,
        emailOrMobile: payload.email ?? payload.mobile,
        username: payload.email,
        deviceType: payload.deviceType ?? "ADMIN",
        role: "ADMIN"
      }
    });
    const normalized = normalizeAuthResponse(raw);
    if (!normalized.accessToken) throw new Error("The backend did not return an authentication token.");
    return normalized;
  },
  logout: async () => {
    try {
      return await tryPaths(LOGOUT_PATHS, { method: "POST" });
    } catch {
      return null;
    }
  }
};
const NAV = [
  { items: [{ label: "Dashboard", to: "/", icon: LayoutDashboard }] },
  { items: [{
    label: "Orders",
    icon: ShoppingBag,
    children: [
      { label: "All Orders", to: "/orders" },
      { label: "Active Orders", to: "/orders/active" },
      { label: "Pending", to: "/orders/pending" },
      { label: "Accepted", to: "/orders/accepted" },
      { label: "Preparing", to: "/orders/preparing" },
      { label: "Ready for Pickup", to: "/orders/ready-for-pickup" },
      { label: "Delivered", to: "/orders/delivered" },
      { label: "Cancelled", to: "/orders/cancelled" }
    ]
  }] },
  { items: [{ label: "Customers", to: "/customers", icon: Users }] },
  { section: "MR BREADO BUSINESS", items: [
    { label: "Business Outlets", to: "/business-outlets", icon: Building2 },
    { label: "Outlet Managers", to: "/owners", icon: UserCog }
  ] },
  { section: "DELIVERY MANAGEMENT", items: [
    { label: "Delivery Boys", to: "/delivery-boys", icon: Bike }
  ] },
  { section: "MENU MANAGEMENT", items: [
    { label: "Foods", to: "/foods", icon: Utensils },
    { label: "Mr. Breado Store", to: "/admin-foods", icon: ChefHat },
    { label: "Cuisine", to: "/cuisine", icon: Soup },
    { label: "Categories", to: "/categories", icon: Layers }
  ] },
  { section: "ROLE MANAGEMENT", items: [
    { label: "Roles", to: "/roles", icon: Shield },
    { label: "Permissions", to: "/permissions", icon: KeyRound }
  ] },
  { section: "OFFER MANAGEMENT", items: [
    { label: "Coupons", to: "/coupons", icon: Tag },
    { label: "Offers", to: "/offers", icon: Gift }
  ] },
  { section: "SUPPORT MANAGEMENT", items: [
    { label: "Support Dashboard", to: "/support", icon: LifeBuoy },
    { label: "Support Tickets", to: "/tickets", icon: Ticket },
    { label: "Notifications", to: "/notifications", icon: Bell }
  ] },
  { section: "SUBSCRIPTION MANAGEMENT", items: [
    { label: "Subscriptions", to: "/subscriptions", icon: CreditCard }
  ] },
  { section: "ZONE MANAGEMENT", items: [
    { label: "Zones", to: "/zones", icon: MapPin }
  ] },
  { section: "SERVICE MANAGEMENT", items: [
    { label: "Operations", to: "/operations", icon: Activity },
    { label: "Outlet Business Control", to: "/business-outlets", icon: Building2 },
    { label: "Customer Messages", to: "/customer-messages", icon: MessageSquare },
    { label: "Admin Profile", to: "/admin-profile", icon: UserCircle },
    { label: "Banner Management", to: "/banners", icon: Image },
    { label: "Bite Stories", to: "/stories", icon: Sparkles },
    { label: "Online Transactions", to: "/online-transactions", icon: CreditCard }
  ] },
  { section: "BUSINESS CONFIG", items: [
    { label: "API Keys", to: "/api-keys", icon: KeyRound },
    { label: "Payment Controls", to: "/payment-controls", icon: CreditCard },
    { label: "Settings", to: "/settings", icon: Settings }
  ] }
];
function SidebarContent({ onNavigate }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to) => !!to && (to === "/" ? pathname === "/" : pathname.startsWith(to));
  const initiallyOpen = {};
  NAV.forEach((g) => g.items.forEach((it) => {
    if (it.children?.some((c) => isActive(c.to))) initiallyOpen[it.label] = true;
  }));
  const [open, setOpen] = useState(initiallyOpen);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col bg-sidebar text-sidebar-foreground", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex h-[72px] items-center gap-3 border-b border-sidebar-border px-5", children: [
      /* @__PURE__ */ jsx("img", { src: ADMIN_LOGO_URL, alt: "Mr. Breado", className: "h-10 w-10 rounded-xl object-contain" }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-semibold tracking-tight", children: "Mr. Breado" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-b border-sidebar-border p-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md bg-sidebar-accent px-3 py-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsx("input", { placeholder: "Search here", className: "w-full bg-transparent outline-none placeholder:text-muted-foreground" })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto px-2 py-3 text-sm", children: NAV.map((group, gi) => /* @__PURE__ */ jsxs("div", { className: "mb-2", children: [
      group.section && /* @__PURE__ */ jsx("div", { className: "px-3 pb-1 pt-3 text-[10px] font-semibold tracking-widest text-muted-foreground", children: group.section }),
      group.items.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to) || item.children?.some((c) => isActive(c.to));
        if (item.children) {
          const isOpen = open[item.label] ?? false;
          return /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setOpen((o) => ({ ...o, [item.label]: !o[item.label] })),
                className: cn(
                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 transition-colors",
                  active ? "bg-primary/15 text-primary shadow-[inset_3px_0_0_var(--primary)]" : "hover:bg-sidebar-accent"
                ),
                children: [
                  Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
                  /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: item.label }),
                  isOpen ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
                ]
              }
            ),
            isOpen && /* @__PURE__ */ jsx("div", { className: "ml-7 mt-0.5 border-l border-sidebar-border pl-2", children: item.children.map((c) => /* @__PURE__ */ jsx(
              Link,
              {
                to: c.to,
                onClick: onNavigate,
                className: cn(
                  "block rounded-md px-3 py-1.5 text-[13px] transition-colors",
                  isActive(c.to) ? "bg-primary/10 text-primary" : "text-sidebar-foreground/80 hover:bg-sidebar-accent"
                ),
                children: c.label
              },
              c.to
            )) })
          ] }, item.label);
        }
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            onClick: onNavigate,
            className: cn(
              "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
              active ? "bg-primary/15 text-primary shadow-[inset_3px_0_0_var(--primary)]" : "hover:bg-sidebar-accent"
            ),
            children: [
              Icon && /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { children: item.label })
            ]
          },
          item.label
        );
      })
    ] }, gi)) }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-sidebar-border p-3", children: /* @__PURE__ */ jsx(LogoutButton, {}) })
  ] });
}
function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => localStorage.getItem("admin-theme") || "luxury");
  useEffect(() => {
    document.documentElement.classList.remove("theme-dark", "theme-light", "theme-luxury");
    document.documentElement.classList.add(`theme-${theme}`);
    localStorage.setItem("admin-theme", theme);
  }, [theme]);
  return /* @__PURE__ */ jsxs(
    "select",
    {
      value: theme,
      onChange: (e) => setTheme(e.target.value),
      className: "rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold outline-none hover:bg-accent",
      title: "Theme",
      children: [
        /* @__PURE__ */ jsx("option", { value: "dark", children: "Dark" }),
        /* @__PURE__ */ jsx("option", { value: "light", children: "Light" }),
        /* @__PURE__ */ jsx("option", { value: "luxury", children: "Luxury" })
      ]
    }
  );
}
function LogoutButton() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: async () => {
        await authService.logout();
        authStore.clear();
        qc.clear();
        navigate({ to: "/login", replace: true });
      },
      className: "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive hover:bg-sidebar-accent",
      children: [
        /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
        " Log out"
      ]
    }
  );
}
function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden w-[285px] shrink-0 border-r border-sidebar-border bg-sidebar shadow-card lg:block", children: /* @__PURE__ */ jsx(SidebarContent, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxs("header", { className: "flex h-[72px] shrink-0 items-center gap-3 border-b border-border bg-card/50 px-4 backdrop-blur-xl", children: [
        /* @__PURE__ */ jsxs(Sheet, { open: mobileOpen, onOpenChange: setMobileOpen, children: [
          /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "rounded-md p-2 hover:bg-accent lg:hidden", children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsx(SheetContent, { side: "left", className: "w-72 border-sidebar-border bg-sidebar p-0", children: /* @__PURE__ */ jsx(SidebarContent, { onNavigate: () => setMobileOpen(false) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxs(Link, { to: "/notifications", className: "relative rounded-xl border border-transparent p-2 text-primary transition hover:border-primary/30 hover:bg-primary/10", title: "Open notifications", children: [
          /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsx("span", { className: "absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-primary shadow-glow" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "hidden items-center gap-2 rounded-xl border border-border bg-card px-2 py-1 text-sm md:flex", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-primary" }),
          /* @__PURE__ */ jsx(ThemeSwitcher, {})
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "hidden items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold hover:bg-accent sm:flex", children: [
          /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
          " English ",
          /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 pr-3 shadow-card", children: [
          /* @__PURE__ */ jsx("img", { src: ADMIN_LOGO_URL, alt: "Admin", className: "h-9 w-9 rounded-full object-contain" }),
          /* @__PURE__ */ jsxs("div", { className: "hidden text-xs leading-tight sm:block", children: [
            /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Hello" }),
            /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Mr. Breado Admin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("main", { className: "min-w-0 flex-1 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "mx-auto w-full max-w-[1680px] p-4 md:p-7", children }) })
    ] })
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
async function tryRequest$1(configs, fallback) {
  let lastError;
  for (const config of configs) {
    try {
      return await request(config);
    } catch (error) {
      lastError = error;
      if (error?.status !== 404) break;
    }
  }
  if (lastError?.status && lastError.status !== 404) throw lastError;
  return fallback;
}
function rowsFrom(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.items ?? payload?.outlets ?? payload?.restaurants ?? payload?.data?.items ?? payload?.data?.outlets ?? [];
}
const businessOutletsService = {
  ensureSchema: () => Promise.resolve({ success: true }),
  dashboard: async (params) => {
    const direct = await tryRequest$1([
      { url: "/admin/business/dashboard", params },
      { url: "/admin/outlets/dashboard", params }
    ], null);
    if (direct) return direct;
    const listing = await tryRequest$1([
      { url: "/admin/outlets" },
      { url: "/admin/restaurants" }
    ], { items: [] });
    const outlets = rowsFrom(listing);
    return { outlets, totalOutlets: outlets.length, totalOrders: 0, totalSales: 0, onlineSales: 0 };
  },
  list: () => tryRequest$1([
    { url: "/admin/outlets" },
    { url: "/admin/restaurants" },
    { url: "/admin/mr-breado/restaurant" }
  ], { items: [] }).then((payload) => {
    const rows = rowsFrom(payload);
    if (rows.length) return { ...payload, items: rows, outlets: rows };
    const single = payload?.outlet ?? payload?.restaurant ?? payload?.data;
    return single && !Array.isArray(single) ? { items: [single], outlets: [single] } : { items: [], outlets: [] };
  }),
  createOutlet: (data) => request({ method: "POST", url: "/admin/outlets", data }),
  updateOutlet: (id, data) => request({ method: "PUT", url: `/admin/outlets/${id}`, data }),
  getGstin: (id) => request({ url: `/admin/outlets/${id}/gstin` }),
  saveGstin: (id, data) => request({ method: "PUT", url: `/admin/outlets/${id}/gstin`, data }),
  businessAudit: (id) => request({ url: `/admin/outlets/${id}/business-audit` }),
  stockSubmissions: (id) => request({ url: `/admin/outlets/${id}/stock-submissions` }),
  setCredentials: (id, data) => request({ method: "POST", url: `/admin/outlets/${id}/credentials`, data }),
  calendar: (id, params) => request({ url: `/admin/outlets/${id}/calendar`, params }),
  performance: (id, params) => request({ url: `/admin/outlets/${id}/performance`, params }),
  updateStock: (id, items) => request({ method: "POST", url: `/admin/outlets/${id}/stock`, data: { items } }),
  availableProducts: async (id) => {
    const data = await request({ url: `/admin/outlets/${id}/available-products` });
    return { ...data, all: data?.all ?? data?.products ?? [], assigned: data?.assigned ?? data?.items ?? [] };
  },
  productCatalog: () => request({ url: "/admin/products/catalog" }),
  saveBranding: (id, data) => request({ method: "POST", url: `/admin/outlets/${id}/branding`, data }),
  exportAccounting: async (from, to) => {
    const blob = await downloadBlob({ url: "/admin/reports/accounting-export.csv", params: { from, to } });
    saveBlob(blob, `mr_breado_accounting_${from}_${to}.csv`);
  }
};
const businessOutletsV41Service = {
  ensureSchema: () => Promise.resolve({ success: true }),
  fullDashboard: async (id, params) => {
    const data = await tryRequest$1([
      { url: `/admin/outlets/${id}/full-dashboard`, params },
      { url: `/admin/outlets/${id}/dashboard`, params },
      { url: `/admin/outlets/${id}`, params }
    ], null);
    if (!data) throw Object.assign(new Error("Outlet endpoint not found"), { status: 404 });
    const inventory = (data?.inventory ?? []).map((row) => ({
      ...row,
      productId: row.productId?.id ?? row.productId?._id ?? row.productId,
      productName: row.productId?.name ?? row.productName ?? "Food item",
      imageUrl: row.productId?.images?.[0]?.url ?? row.imageUrl ?? "",
      categoryName: row.productId?.categoryId?.name ?? row.categoryName ?? "Uncategorised",
      sellingPrice: row.priceOverride ?? row.productId?.offerPrice ?? row.productId?.basePrice ?? 0,
      lowStockAlert: row.lowStockThreshold ?? 5,
      isAvailable: row.available ?? row.enabled ?? false
    }));
    return { ...data, inventory, stock: inventory, products: inventory, ...data?.metrics ?? {} };
  },
  getGstin: (id) => request({ url: `/admin/outlets/${id}/gstin` }),
  saveGstin: (id, data) => request({ method: "PUT", url: `/admin/outlets/${id}/gstin`, data }),
  businessAudit: (id) => request({ url: `/admin/outlets/${id}/business-audit` }),
  stockSubmissions: (id) => request({ url: `/admin/outlets/${id}/stock-submissions` }),
  setLocation: (id, data) => request({ method: "POST", url: `/admin/outlets/${id}/set-location`, data }),
  saveBranding: (id, data) => request({ method: "POST", url: `/admin/outlets/${id}/branding`, data }),
  availableProducts: async (id) => {
    const data = await request({ url: `/admin/outlets/${id}/available-products` });
    return { ...data, all: data?.all ?? data?.products ?? [], assigned: data?.assigned ?? data?.items ?? [] };
  },
  productCatalog: () => request({ url: "/admin/products/catalog" }),
  stockLedger: (id) => request({ url: `/admin/outlets/${id}/stock-ledger` }),
  orders: (id) => request({ url: `/admin/outlets/${id}/orders` }),
  updateStock: (id, items) => request({ method: "POST", url: `/admin/outlets/${id}/stock`, data: { items } }),
  exportOutletAccounting: async (id, from, to) => {
    const blob = await downloadBlob({ url: "/admin/reports/outlet-accounting.csv", params: { outletId: id, from, to } });
    saveBlob(blob, `mr_breado_outlet_${id}_accounting_${from}_${to}.csv`);
  }
};
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
const Card = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
      ...props
    }
  )
);
Card.displayName = "Card";
const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props })
);
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn("font-semibold leading-none tracking-tight", className),
      ...props
    }
  )
);
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("text-sm text-muted-foreground", className), ...props })
);
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props })
);
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center p-6 pt-0", className), ...props })
);
CardFooter.displayName = "CardFooter";
const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
const Label = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(LabelPrimitive.Root, { ref, className: cn(labelVariants(), className), ...props }));
Label.displayName = LabelPrimitive.Root.displayName;
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Dialog = SheetPrimitive.Root;
const DialogTrigger = SheetPrimitive.Trigger;
const DialogPortal = SheetPrimitive.Portal;
const DialogClose = SheetPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = SheetPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    SheetPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = SheetPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = SheetPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SheetPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = SheetPrimitive.Description.displayName;
const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
function money(v) {
  return `₹${Number(v || 0).toLocaleString("en-IN")}`;
}
function today() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function safeText(value) {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(safeText).filter(Boolean).join(", ");
  if (typeof value === "object") {
    const parts = [value.line1, value.line2, value.street, value.area, value.landmark, value.city, value.state, value.pincode, value.postalCode, value.country].map(safeText).filter(Boolean);
    if (parts.length) return Array.from(new Set(parts)).join(", ");
  }
  return "";
}
function outletAddress(outlet) {
  const direct = safeText(outlet?.addressText) || safeText(outlet?.formattedAddress) || safeText(outlet?.address);
  const extra = [outlet?.city, outlet?.state, outlet?.pincode].map(safeText).filter(Boolean);
  return Array.from(new Set([direct, ...extra].filter(Boolean))).join(", ") || "Address not configured";
}
function OutletCommandCenterPage({ outletId, onBack }) {
  const qc = useQueryClient();
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [locationOpen, setLocationOpen] = useState(false);
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [gstinOpen, setGstinOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(null);
  const query = useQuery({ queryKey: ["outlet-v41-dashboard", outletId, from, to], queryFn: () => businessOutletsV41Service.fullDashboard(outletId, { from, to }) });
  const ordersQuery = useQuery({ queryKey: ["outlet-order-history", outletId], queryFn: () => businessOutletsV41Service.orders(outletId) });
  const exportCsv = useMutation({ mutationFn: () => businessOutletsV41Service.exportOutletAccounting(outletId, from, to) });
  const data = query.data ?? {};
  const outlet = data.outlet ?? {};
  const summary = data.summary ?? {};
  const outletOrders = Array.isArray(ordersQuery.data?.items) ? ordersQuery.data.items : Array.isArray(ordersQuery.data?.orders) ? ordersQuery.data.orders : [];
  if (query.isLoading) return /* @__PURE__ */ jsx(Card, { className: "rounded-3xl", children: /* @__PURE__ */ jsx(CardContent, { className: "p-10 text-center", children: "Loading outlet dashboard..." }) });
  if (query.isError) return /* @__PURE__ */ jsx(Card, { className: "rounded-3xl border-destructive/30", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-10 text-center", children: [
    /* @__PURE__ */ jsx("p", { className: "text-xl font-bold", children: "Outlet dashboard unavailable" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The backend did not return this outlet dashboard. The page is protected from crashing." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex justify-center gap-2", children: [
      onBack ? /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onBack, children: "Back to outlets" }) : /* @__PURE__ */ jsx(Button, { variant: "outline", asChild: true, children: /* @__PURE__ */ jsx(Link, { to: "/business-outlets", children: "Back to outlets" }) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => query.refetch(), children: "Try again" })
    ] })
  ] }) });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-3xl border bg-card shadow-card", children: [
      outlet.bannerImage || outlet.banner_image ? /* @__PURE__ */ jsx("img", { src: outlet.bannerImage || outlet.banner_image, alt: "Outlet banner", className: "h-44 w-full object-cover" }) : null,
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-5 xl:flex-row xl:items-start xl:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          onBack ? /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "mb-2", onClick: onBack, children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to Outlets"
          ] }) : /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", asChild: true, className: "mb-2", children: /* @__PURE__ */ jsxs(Link, { to: "/business-outlets", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            "Back to Outlets"
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
            outlet.profileImage || outlet.profile_image ? /* @__PURE__ */ jsx("img", { src: outlet.profileImage || outlet.profile_image, alt: "Outlet profile", className: "h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/30" }) : null,
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold tracking-tight", children: outlet.name || "Outlet Command Center" }),
            /* @__PURE__ */ jsx(Badge, { children: outlet.isOpen ? "Open" : "Closed" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 max-w-3xl text-sm text-muted-foreground", children: outletAddress(outlet) }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-muted px-3 py-1", children: [
              "Code: ",
              outlet.outletCode || outlet.outlet_code || outletId
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-muted px-3 py-1", children: [
              "Radius: ",
              outlet.serviceRadiusKm || outlet.service_radius_km || 0,
              " km"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-muted px-3 py-1", children: [
              "Manager: ",
              outlet.manager_name || outlet.managerName || "Not set"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "rounded-full bg-muted px-3 py-1", children: [
              "GSTIN: ",
              outlet.gstin || "Not added"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(Input, { type: "date", value: from, onChange: (e) => setFrom(e.target.value), className: "w-40" }),
          /* @__PURE__ */ jsx(Input, { type: "date", value: to, onChange: (e) => setTo(e.target.value), className: "w-40" }),
          /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => exportCsv.mutate(), children: [
            /* @__PURE__ */ jsx(Download, { className: "mr-2 h-4 w-4" }),
            "Export"
          ] }),
          /* @__PURE__ */ jsxs(Dialog, { open: assignOpen, onOpenChange: setAssignOpen, children: [
            /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
              /* @__PURE__ */ jsx(Plus, { className: "mr-2 h-4 w-4" }),
              "Add Items"
            ] }) }),
            /* @__PURE__ */ jsx(DialogContent, { className: "max-w-5xl", children: /* @__PURE__ */ jsx(AssignOutletItemsForm, { outletId, onDone: () => {
              setAssignOpen(false);
              qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] });
            } }) })
          ] }),
          /* @__PURE__ */ jsxs(Dialog, { open: brandingOpen, onOpenChange: setBrandingOpen, children: [
            /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", children: [
              /* @__PURE__ */ jsx(Image, { className: "mr-2 h-4 w-4" }),
              "Branding"
            ] }) }),
            /* @__PURE__ */ jsx(DialogContent, { className: "max-w-2xl", children: /* @__PURE__ */ jsx(BrandingForm, { outlet, outletId, onDone: () => {
              setBrandingOpen(false);
              qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] });
            } }) })
          ] }),
          /* @__PURE__ */ jsxs(Dialog, { open: gstinOpen, onOpenChange: setGstinOpen, children: [
            /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: outlet.gstin ? "outline" : "destructive", children: [
              /* @__PURE__ */ jsx(FileText, { className: "mr-2 h-4 w-4" }),
              outlet.gstin ? "Edit GSTIN" : "Add GSTIN"
            ] }) }),
            /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(GstinForm, { outlet, outletId, onDone: () => {
              setGstinOpen(false);
              qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] });
            } }) })
          ] }),
          /* @__PURE__ */ jsxs(Dialog, { open: locationOpen, onOpenChange: setLocationOpen, children: [
            /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
              /* @__PURE__ */ jsx(MapPin, { className: "mr-2 h-4 w-4" }),
              "Set Location"
            ] }) }),
            /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(LocationForm, { outlet, outletId, onDone: () => {
              setLocationOpen(false);
              qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] });
            } }) })
          ] })
        ] })
      ] })
    ] }),
    !outlet.gstin && /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "GSTIN required for outlet invoices" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Add this outlet GSTIN before issuing customer tax invoices." })
      ] }),
      /* @__PURE__ */ jsx(Button, { variant: "destructive", onClick: () => setGstinOpen(true), children: "Add GSTIN now" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Metric, { title: "Total Sales", value: money(summary.totalSales), icon: /* @__PURE__ */ jsx(WalletCards, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx(Metric, { title: "Online Sales", value: money(summary.onlineSales) }),
      /* @__PURE__ */ jsx(Metric, { title: "Offline Sales", value: money(summary.offlineSales) }),
      /* @__PURE__ */ jsx(Metric, { title: "Orders", value: summary.orders ?? 0 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Metric, { title: "Average Order", value: money(summary.averageOrderValue) }),
      /* @__PURE__ */ jsx(Metric, { title: "Stock Items", value: summary.stockItems ?? 0 }),
      /* @__PURE__ */ jsx(Metric, { title: "Low Stock", value: summary.lowStock ?? 0 }),
      /* @__PURE__ */ jsx(Metric, { title: "Bookings", value: summary.bookings ?? 0 })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-4", children: [
      /* @__PURE__ */ jsx(Metric, { title: "Today Sales", value: money(summary.todaySales ?? summary.totalSales), icon: /* @__PURE__ */ jsx(IndianRupee, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx(Metric, { title: "This Week", value: money(summary.weekSales ?? 0), icon: /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx(Metric, { title: "This Month", value: money(summary.monthSales ?? 0), icon: /* @__PURE__ */ jsx(CalendarDays, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsx(Metric, { title: "This Year", value: money(summary.yearSales ?? 0), icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { className: "xl:col-span-2", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Activity, { className: "h-5 w-5" }),
          " Outlet sales graph"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(SimpleBarChart, { rows: data.salesByDay ?? data.closingCalendar ?? [], valueKey: "totalSales", labelKey: "date", emptyText: "No sales ledger yet. Sales will appear after online/COD/offline daily closing." }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Package, { className: "h-5 w-5" }),
          " Stock health"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(StockHealth, { summary }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(UserRound, { className: "h-5 w-5" }),
          "Manager Control"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx(Row, { k: "Manager Name", v: outlet.manager_name || outlet.managerName }),
          /* @__PURE__ */ jsx(Row, { k: "Phone", v: outlet.manager_phone || outlet.managerPhone || outlet.contactPhone || outlet.contact_phone }),
          /* @__PURE__ */ jsx(Row, { k: "Email", v: outlet.manager_email || outlet.managerEmail || outlet.contactEmail || outlet.contact_email }),
          /* @__PURE__ */ jsx(Row, { k: "Outlet Code", v: outlet.outletCode || outlet.outlet_code || outletId })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5" }),
          "Product Availability"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx(Row, { k: "Available Products", v: summary.availableProducts ?? summary.stockItems ?? 0 }),
          /* @__PURE__ */ jsx(Row, { k: "Out of Stock", v: summary.outOfStock ?? 0 }),
          /* @__PURE__ */ jsx(Row, { k: "Low Stock", v: summary.lowStock ?? 0 }),
          /* @__PURE__ */ jsx(Row, { k: "Stock Value", v: money(summary.stockValue ?? 0) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Clock3, { className: "h-5 w-5" }),
          "Daily Activity"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx(Row, { k: "Orders", v: summary.orders ?? 0 }),
          /* @__PURE__ */ jsx(Row, { k: "Bookings", v: summary.bookings ?? 0 }),
          /* @__PURE__ */ jsx(Row, { k: "Online Transaction", v: money(summary.onlineSales) }),
          /* @__PURE__ */ jsx(Row, { k: "Offline Transaction", v: money(summary.offlineSales) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5" }),
        " Outlet order history"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3", children: [
        outletOrders.length === 0 && /* @__PURE__ */ jsx(Empty, { text: "No orders have been routed to this outlet yet." }),
        outletOrders.slice(0, 100).map((order) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border bg-muted/20 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("b", { children: order.order_number || order.orderNumber || `Order #${order.id}` }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: String(order.created_at || order.createdAt || "").replace("T", " ").slice(0, 19) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: order.status }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 font-bold", children: money(order.total || order.grand_total) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-2 text-sm md:grid-cols-3", children: [
            /* @__PURE__ */ jsx(Row, { k: "Customer", v: order.customerName || order.delivery_name || "--" }),
            /* @__PURE__ */ jsx(Row, { k: "Customer phone", v: order.customerMobile || order.delivery_mobile || "--" }),
            /* @__PURE__ */ jsx(Row, { k: "Rider", v: order.riderName || "Not assigned" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 space-y-1", children: (order.items || []).map((item) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between rounded-xl bg-background px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              item.quantity || 1,
              " × ",
              item.productName || item.title || `Food #${item.product_id}`
            ] }),
            /* @__PURE__ */ jsx("b", { children: money(item.total_price || Number(item.unit_price || 0) * Number(item.quantity || 1)) })
          ] }, `${order.id}-${item.id}`)) })
        ] }, order.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxs(Card, { className: "xl:col-span-2", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(CalendarDays, { className: "h-5 w-5" }),
          " Daily business ledger"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          (data.closingCalendar ?? []).length === 0 && /* @__PURE__ */ jsx(Empty, { text: "No day closing submitted for this date range." }),
          (data.closingCalendar ?? []).map((d) => /* @__PURE__ */ jsxs("div", { className: "grid gap-2 rounded-2xl border bg-muted/30 p-3 text-sm md:grid-cols-6", children: [
            /* @__PURE__ */ jsx("b", { children: String(d.closing_date || d.closingDate).slice(0, 10) }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Online ",
              money(d.online_sales)
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "COD ",
              money(d.cod_sales)
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Offline ",
              money(d.offline_sales)
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Total ",
              money(d.total_sales)
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Net Cash ",
              money(d.net_cash)
            ] })
          ] }, d.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }),
          " Manager & contact"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx(Row, { k: "Manager", v: outlet.manager_name || outlet.managerName }),
          /* @__PURE__ */ jsx(Row, { k: "Phone", v: outlet.contactPhone || outlet.contact_phone || outlet.manager_phone }),
          /* @__PURE__ */ jsx(Row, { k: "Email", v: outlet.contactEmail || outlet.contact_email || outlet.manager_email }),
          /* @__PURE__ */ jsx(Row, { k: "WhatsApp", v: outlet.whatsappNumber || outlet.whatsapp_number }),
          /* @__PURE__ */ jsx(Row, { k: "Hours", v: `${outlet.openingTime || outlet.opening_time || "--"} - ${outlet.closingTime || outlet.closing_time || "--"}` })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 xl:grid-cols-2", children: [
      /* @__PURE__ */ jsx(FoodCard, { title: "Best selling foods", icon: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 text-primary" }), rows: data.bestFoods ?? [] }),
      /* @__PURE__ */ jsx(FoodCard, { title: "Foods not selling well", icon: /* @__PURE__ */ jsx(TrendingDown, { className: "h-5 w-5 text-destructive" }), rows: data.slowFoods ?? [] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Package, { className: "h-5 w-5" }),
        " Current stock and money control"
      ] }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
        (data.stock ?? []).length === 0 && /* @__PURE__ */ jsx(Empty, { text: "No outlet stock added yet." }),
        (data.stock ?? []).map((s) => /* @__PURE__ */ jsxs("div", { className: "grid gap-2 rounded-2xl border bg-muted/20 p-3 text-sm md:grid-cols-6 md:items-center", children: [
          /* @__PURE__ */ jsx("b", { className: "md:col-span-2", children: s.productName }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Stock: ",
            s.stockQuantity ?? s.stock_quantity
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Low alert: ",
            s.lowStockAlert ?? s.low_stock_alert
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Price: ",
            money(s.price)
          ] }),
          /* @__PURE__ */ jsx(Button, { size: "sm", variant: "outline", onClick: () => setStockOpen(s), children: "Update" })
        ] }, s.id || s.productId))
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { children: "Recent stock movements and outlet activity" }) }),
      /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
        (data.stockMovements ?? []).slice(0, 30).map((m) => /* @__PURE__ */ jsxs("div", { className: "grid gap-2 rounded-xl bg-muted/30 px-3 py-2 text-sm md:grid-cols-5", children: [
          /* @__PURE__ */ jsx("span", { children: String(m.created_at).slice(0, 16) }),
          /* @__PURE__ */ jsx("b", { children: m.productName }),
          /* @__PURE__ */ jsx("span", { children: m.movement_type }),
          /* @__PURE__ */ jsxs("span", { children: [
            m.before_stock,
            " → ",
            m.after_stock
          ] }),
          /* @__PURE__ */ jsx("span", { children: m.note })
        ] }, m.id)),
        (data.stockMovements ?? []).length === 0 && /* @__PURE__ */ jsx(Empty, { text: "No stock movements yet." })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { open: !!stockOpen, onOpenChange: (v) => !v && setStockOpen(null), children: /* @__PURE__ */ jsx(DialogContent, { children: /* @__PURE__ */ jsx(StockUpdateForm, { outletId, item: stockOpen, onDone: () => {
      setStockOpen(null);
      qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard"] });
    } }) }) })
  ] });
}
function SimpleBarChart({ rows, valueKey, labelKey, emptyText }) {
  const clean = (rows || []).slice(-14).map((r) => ({ label: String(r[labelKey] || r.closingDate || r.closing_date || "").slice(5, 10), value: Number(r[valueKey] ?? r.total_sales ?? 0) || 0 }));
  const max = Math.max(1, ...clean.map((x) => x.value));
  if (!clean.length) return /* @__PURE__ */ jsx(Empty, { text: emptyText });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsx("div", { className: "flex h-56 items-end gap-2 rounded-2xl border bg-muted/20 p-4", children: clean.map((x, i) => /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 flex-1 flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "w-full rounded-t-xl bg-primary/80", style: { height: `${Math.max(8, x.value / max * 185)}px` }, title: `${x.label}: ${money(x.value)}` }),
      /* @__PURE__ */ jsx("span", { className: "truncate text-[10px] text-muted-foreground", children: x.label })
    ] }, `${x.label}-${i}`)) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-2 text-sm md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Row, { k: "Peak day", v: money(Math.max(...clean.map((x) => x.value))) }),
      /* @__PURE__ */ jsx(Row, { k: "Days tracked", v: clean.length }),
      /* @__PURE__ */ jsx(Row, { k: "Range sales", v: money(clean.reduce((a, x) => a + x.value, 0)) })
    ] })
  ] });
}
function StockHealth({ summary }) {
  const total = Math.max(1, Number(summary.stockItems || 0));
  const available = Number(summary.availableProducts || 0);
  const low = Number(summary.lowStock || 0);
  const out = Number(summary.outOfStock || 0);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    [{ k: "Available", v: available }, { k: "Low stock", v: low }, { k: "Out of stock", v: out }].map((x) => /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: x.k }),
        /* @__PURE__ */ jsx("b", { children: x.v })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-muted", children: /* @__PURE__ */ jsx("div", { className: "h-2 rounded-full bg-primary", style: { width: `${Math.min(100, x.v / total * 100)}%` } }) })
    ] }, x.k)),
    /* @__PURE__ */ jsx(Row, { k: "Stock value", v: money(summary.stockValue || 0) })
  ] });
}
function Metric({ title, value, icon }) {
  return /* @__PURE__ */ jsx(Card, { className: "rounded-3xl", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: title }),
      icon
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-2xl font-bold", children: value })
  ] }) });
}
function Row({ k, v }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between gap-4 rounded-xl bg-muted/30 px-3 py-2", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: k }),
    /* @__PURE__ */ jsx("b", { className: "text-right", children: v || "--" })
  ] });
}
function Empty({ text }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground", children: text });
}
function FoodCard({ title, icon, rows }) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
      icon,
      title
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
      rows.length === 0 && /* @__PURE__ */ jsx(Empty, { text: "No sales data yet." }),
      rows.slice(0, 10).map((f) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between rounded-xl bg-muted/30 px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsx("span", { children: f.productName }),
        /* @__PURE__ */ jsxs("b", { children: [
          f.soldQuantity ?? 0,
          " sold · ",
          money(f.grossSales)
        ] })
      ] }, `${title}-${f.productId}`))
    ] })
  ] });
}
function LocationForm({ outlet, outletId, onDone }) {
  const [data, setData] = useState({ latitude: outlet.latitude || "", longitude: outlet.longitude || "", serviceRadiusKm: outlet.serviceRadiusKm || 5, address: outletAddress(outlet) === "Address not configured" ? "" : outletAddress(outlet), googleMapLink: outlet.googleMapLink || "" });
  const m = useMutation({ mutationFn: () => businessOutletsV41Service.setLocation(outletId, data), onSuccess: () => {
    toast.success("Outlet location updated");
    onDone();
  } });
  return /* @__PURE__ */ jsxs("form", { className: "space-y-3", onSubmit: (e) => {
    e.preventDefault();
    m.mutate();
  }, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Set exact outlet location" }) }),
    /* @__PURE__ */ jsx(Label, { children: "Latitude" }),
    /* @__PURE__ */ jsx(Input, { value: data.latitude, onChange: (e) => setData((d) => ({ ...d, latitude: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Longitude" }),
    /* @__PURE__ */ jsx(Input, { value: data.longitude, onChange: (e) => setData((d) => ({ ...d, longitude: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Delivery radius km" }),
    /* @__PURE__ */ jsx(Input, { value: data.serviceRadiusKm, onChange: (e) => setData((d) => ({ ...d, serviceRadiusKm: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Address" }),
    /* @__PURE__ */ jsx(Textarea, { value: data.address, onChange: (e) => setData((d) => ({ ...d, address: e.target.value })) }),
    /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Save location" })
  ] });
}
function StockUpdateForm({ outletId, item, onDone }) {
  const [data, setData] = useState({ productId: item?.productId || item?.product_id, stockQuantity: item?.stockQuantity ?? item?.stock_quantity ?? 0, lowStockAlert: item?.lowStockAlert ?? item?.low_stock_alert ?? 5, preparationMinutes: item?.preparation_minutes ?? 15, note: "Admin stock correction" });
  const m = useMutation({ mutationFn: () => businessOutletsV41Service.updateStock(outletId, [data]), onSuccess: () => {
    toast.success("Stock updated");
    onDone();
  } });
  return /* @__PURE__ */ jsxs("form", { className: "space-y-3", onSubmit: (e) => {
    e.preventDefault();
    m.mutate();
  }, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { children: [
      "Update stock - ",
      item?.productName
    ] }) }),
    /* @__PURE__ */ jsx(Label, { children: "Stock quantity" }),
    /* @__PURE__ */ jsx(Input, { value: data.stockQuantity, onChange: (e) => setData((d) => ({ ...d, stockQuantity: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Low stock alert" }),
    /* @__PURE__ */ jsx(Input, { value: data.lowStockAlert, onChange: (e) => setData((d) => ({ ...d, lowStockAlert: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Preparation minutes" }),
    /* @__PURE__ */ jsx(Input, { value: data.preparationMinutes, onChange: (e) => setData((d) => ({ ...d, preparationMinutes: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Note" }),
    /* @__PURE__ */ jsx(Textarea, { value: data.note, onChange: (e) => setData((d) => ({ ...d, note: e.target.value })) }),
    /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Save stock" })
  ] });
}
function GstinForm({ outlet, outletId, onDone }) {
  const [data, setData] = useState({ gstin: outlet.gstin || "", invoiceLegalName: outlet.invoiceLegalName || outlet.invoice_legal_name || outlet.name || "Mr. Breado", invoiceAddress: safeText(outlet.invoiceAddress || outlet.invoice_address) || (outletAddress(outlet) === "Address not configured" ? "" : outletAddress(outlet)) });
  const m = useMutation({ mutationFn: () => businessOutletsV41Service.saveGstin(outletId, data), onSuccess: () => {
    toast.success("Outlet GSTIN saved");
    onDone();
  } });
  return /* @__PURE__ */ jsxs("form", { className: "space-y-3", onSubmit: (e) => {
    e.preventDefault();
    if (data.gstin && String(data.gstin).trim().length !== 15) {
      toast.error("GSTIN must be exactly 15 characters");
      return;
    }
    m.mutate();
  }, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Outlet GSTIN & invoice identity" }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm", children: "This GSTIN will appear on invoices generated for orders placed at this outlet." }),
    /* @__PURE__ */ jsx(Label, { children: "GSTIN Number" }),
    /* @__PURE__ */ jsx(Input, { maxLength: 15, value: data.gstin, onChange: (e) => setData((d) => ({ ...d, gstin: e.target.value.toUpperCase() })), placeholder: "19ABCDE1234F1Z5" }),
    /* @__PURE__ */ jsx(Label, { children: "Invoice Legal Name" }),
    /* @__PURE__ */ jsx(Input, { value: data.invoiceLegalName, onChange: (e) => setData((d) => ({ ...d, invoiceLegalName: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Invoice Address" }),
    /* @__PURE__ */ jsx(Textarea, { value: data.invoiceAddress, onChange: (e) => setData((d) => ({ ...d, invoiceAddress: e.target.value })) }),
    /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Save GSTIN & invoice details" })
  ] });
}
function fileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}
function BrandingForm({ outlet, outletId, onDone }) {
  const [data, setData] = useState({ bannerImage: outlet.bannerImage || outlet.banner_image || "", profileImage: outlet.profileImage || outlet.profile_image || "", phone: outlet.phone || "", email: outlet.email || "", address: outletAddress(outlet) === "Address not configured" ? "" : outletAddress(outlet) });
  const m = useMutation({ mutationFn: () => businessOutletsV41Service.saveBranding(outletId, data), onSuccess: () => {
    toast.success("Outlet branding saved");
    onDone();
  } });
  return /* @__PURE__ */ jsxs("form", { className: "space-y-4", onSubmit: (e) => {
    e.preventDefault();
    m.mutate();
  }, children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Outlet banner, profile and contact" }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("label", { className: "rounded-2xl border border-dashed p-4 text-sm", children: [
        "Banner image",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "mt-2 block w-full", onChange: async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            const url = await fileToDataUrl(f);
            setData((d) => ({ ...d, bannerImage: url }));
          }
        } }),
        data.bannerImage && /* @__PURE__ */ jsx("img", { src: data.bannerImage, className: "mt-3 h-32 w-full rounded-xl object-cover" })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "rounded-2xl border border-dashed p-4 text-sm", children: [
        "Profile/logo image",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", className: "mt-2 block w-full", onChange: async (e) => {
          const f = e.target.files?.[0];
          if (f) {
            const url = await fileToDataUrl(f);
            setData((d) => ({ ...d, profileImage: url }));
          }
        } }),
        data.profileImage && /* @__PURE__ */ jsx("img", { src: data.profileImage, className: "mt-3 h-32 w-full rounded-xl object-cover" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Label, { children: "Outlet phone" }),
    /* @__PURE__ */ jsx(Input, { value: data.phone, onChange: (e) => setData((d) => ({ ...d, phone: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Outlet email" }),
    /* @__PURE__ */ jsx(Input, { value: data.email, onChange: (e) => setData((d) => ({ ...d, email: e.target.value })) }),
    /* @__PURE__ */ jsx(Label, { children: "Outlet address" }),
    /* @__PURE__ */ jsx(Textarea, { value: data.address, onChange: (e) => setData((d) => ({ ...d, address: e.target.value })) }),
    /* @__PURE__ */ jsx(Button, { className: "w-full", type: "submit", children: "Save outlet branding" })
  ] });
}
function AssignOutletItemsForm({ outletId, onDone }) {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["outlet-assignable-products", outletId],
    queryFn: () => businessOutletsV41Service.availableProducts(outletId)
  });
  const [draft, setDraft] = useState({});
  const [selected, setSelected] = useState({});
  const rows = useMemo(() => {
    const data = query.data ?? {};
    const assigned = Array.isArray(data.assigned) ? data.assigned : [];
    const all = Array.isArray(data.all) ? data.all : [];
    const assignedById = new Map(assigned.map((x) => [String(x.productId ?? x.product_id ?? x.id), x]));
    return all.map((product) => {
      const key = String(product.productId ?? product.id);
      const saved = assignedById.get(key) ?? {};
      return {
        ...product,
        ...saved,
        productId: product.productId ?? product.id,
        productName: product.productName ?? product.title ?? product.name ?? `Food #${key}`,
        imageUrl: product.imageUrl ?? product.image ?? saved.imageUrl ?? saved.image,
        categoryName: product.categoryName ?? product.foodType ?? saved.categoryName ?? "Uncategorised",
        isVeg: product.isVeg ?? product.veg ?? saved.isVeg ?? true
      };
    });
  }, [query.data]);
  useEffect(() => {
    if (!rows.length) return;
    const nextDraft = {};
    const nextSelected = {};
    for (const p of rows) {
      const key = String(p.productId);
      const alreadyAssigned = Number(p.stockQuantity ?? p.stock_quantity ?? p.stock_qty ?? 0) > 0 || p.outlet_id != null;
      nextSelected[key] = alreadyAssigned;
      nextDraft[key] = {
        productId: p.productId,
        stockQuantity: p.stockQuantity ?? p.stock_quantity ?? p.stock_qty ?? "",
        lowStockAlert: p.lowStockAlert ?? p.low_stock_alert ?? p.min_stock_qty ?? 5,
        sellingPrice: p.sellingPrice ?? p.selling_price ?? p.price ?? 0,
        unitCost: p.unitCost ?? p.unit_cost ?? 0,
        preparationMinutes: p.preparationMinutes ?? p.preparation_minutes ?? p.prep_time_minutes ?? 15,
        isAvailable: p.isAvailable ?? p.available ?? true,
        note: alreadyAssigned ? "Admin updated outlet stock" : "Admin added item to outlet"
      };
    }
    setDraft(nextDraft);
    setSelected(nextSelected);
  }, [rows]);
  const mutation = useMutation({
    mutationFn: (items) => businessOutletsV41Service.updateStock(outletId, items),
    onSuccess: () => {
      toast.success("Outlet inventory saved successfully");
      qc.invalidateQueries({ queryKey: ["outlet-assignable-products", outletId] });
      qc.invalidateQueries({ queryKey: ["outlet-v41-dashboard", outletId] });
      onDone();
    },
    onError: (error) => toast.error(error?.message || "Unable to save outlet inventory")
  });
  const update = (key, field, value) => {
    setDraft((current) => ({ ...current, [key]: { ...current[key], [field]: value } }));
  };
  const save = () => {
    const items = rows.filter((p) => selected[String(p.productId)]).map((p) => draft[String(p.productId)]).filter((item) => item?.productId).map((item) => ({
      ...item,
      stockQuantity: Number(item.stockQuantity || 0),
      lowStockAlert: Number(item.lowStockAlert || 0),
      sellingPrice: Number(item.sellingPrice || 0),
      unitCost: Number(item.unitCost || 0),
      preparationMinutes: Number(item.preparationMinutes || 0)
    }));
    if (!items.length) return toast.error("Select at least one food item");
    const invalid = items.find((item) => item.stockQuantity < 0 || item.sellingPrice < 0 || item.preparationMinutes <= 0);
    if (invalid) return toast.error("Quantity and price cannot be negative, and preparation time must be greater than zero");
    mutation.mutate(items);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Manage outlet food inventory" }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl border bg-muted/20 p-4 text-sm text-muted-foreground", children: "Select foods for this outlet, then set stock quantity, low-stock alert, selling price, cost price and preparation time. Only active items with stock greater than zero are shown to customers." }),
    /* @__PURE__ */ jsxs("div", { className: "hidden grid-cols-[52px_minmax(220px,1fr)_110px_110px_120px_120px_120px_90px] gap-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid", children: [
      /* @__PURE__ */ jsx("span", { children: "Select" }),
      /* @__PURE__ */ jsx("span", { children: "Food details" }),
      /* @__PURE__ */ jsx("span", { children: "Quantity" }),
      /* @__PURE__ */ jsx("span", { children: "Low-stock alert" }),
      /* @__PURE__ */ jsx("span", { children: "Selling price" }),
      /* @__PURE__ */ jsx("span", { children: "Cost price" }),
      /* @__PURE__ */ jsx("span", { children: "Prep. minutes" }),
      /* @__PURE__ */ jsx("span", { children: "Available" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "max-h-[62vh] space-y-3 overflow-y-auto pr-2", children: [
      query.isLoading && /* @__PURE__ */ jsx(Empty, { text: "Loading admin-created foods..." }),
      rows.map((p) => {
        const key = String(p.productId);
        const d = draft[key] ?? {};
        const checked = !!selected[key];
        return /* @__PURE__ */ jsx("div", { className: `rounded-2xl border p-3 transition ${checked ? "border-primary/50 bg-primary/5" : "bg-muted/10"}`, children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 lg:grid-cols-[52px_minmax(220px,1fr)_110px_110px_120px_120px_120px_90px] lg:items-center", children: [
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm font-semibold", children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked, onChange: (e) => setSelected((x) => ({ ...x, [key]: e.target.checked })) }),
            /* @__PURE__ */ jsx("span", { className: "lg:hidden", children: "Use" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
            p.imageUrl ? /* @__PURE__ */ jsx("img", { src: p.imageUrl, className: "h-14 w-14 shrink-0 rounded-xl object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted text-xs", children: "No image" }),
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "truncate font-semibold", children: p.productName }),
              /* @__PURE__ */ jsxs("div", { className: "mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsx(Badge, { variant: "outline", children: p.categoryName }),
                /* @__PURE__ */ jsx(Badge, { variant: "outline", children: p.isVeg ? "Veg" : "Non-Veg" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Base ",
                  money(p.price)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "mb-1 block lg:hidden", children: "Quantity" }),
            /* @__PURE__ */ jsx(Input, { disabled: !checked, min: 0, placeholder: "0", type: "number", value: d.stockQuantity ?? "", onChange: (e) => update(key, "stockQuantity", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "mb-1 block lg:hidden", children: "Low-stock alert" }),
            /* @__PURE__ */ jsx(Input, { disabled: !checked, min: 0, placeholder: "5", type: "number", value: d.lowStockAlert ?? "", onChange: (e) => update(key, "lowStockAlert", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "mb-1 block lg:hidden", children: "Selling price" }),
            /* @__PURE__ */ jsx(Input, { disabled: !checked, min: 0, placeholder: "₹", type: "number", value: d.sellingPrice ?? "", onChange: (e) => update(key, "sellingPrice", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "mb-1 block lg:hidden", children: "Cost price" }),
            /* @__PURE__ */ jsx(Input, { disabled: !checked, min: 0, placeholder: "₹", type: "number", value: d.unitCost ?? "", onChange: (e) => update(key, "unitCost", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "mb-1 block lg:hidden", children: "Preparation minutes" }),
            /* @__PURE__ */ jsx(Input, { disabled: !checked, min: 1, placeholder: "15", type: "number", value: d.preparationMinutes ?? "", onChange: (e) => update(key, "preparationMinutes", e.target.value) })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsx("input", { disabled: !checked, type: "checkbox", checked: !!d.isAvailable, onChange: (e) => update(key, "isAvailable", e.target.checked) }),
            " Available"
          ] })
        ] }) }, key);
      }),
      !query.isLoading && rows.length === 0 && /* @__PURE__ */ jsx(Empty, { text: "No admin foods found. Create foods first from Mr. Breado Store." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2 border-t pt-4", children: [
      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: onDone, children: "Cancel" }),
      /* @__PURE__ */ jsx(Button, { onClick: save, disabled: mutation.isPending, children: mutation.isPending ? "Saving inventory..." : "Save outlet inventory" })
    ] })
  ] });
}
function PageHeader({ title, breadcrumbs = [], icon, actions }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      icon && /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: icon }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold leading-tight", children: title }),
        breadcrumbs.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-0.5 flex items-center gap-1 text-xs text-muted-foreground", children: breadcrumbs.map((b, i) => /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          b.to ? /* @__PURE__ */ jsx(Link, { to: b.to, className: "hover:text-foreground", children: b.label }) : /* @__PURE__ */ jsx("span", { children: b.label }),
          i < breadcrumbs.length - 1 && /* @__PURE__ */ jsx(ChevronRight, { className: "h-3 w-3" })
        ] }, i)) })
      ] })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })
  ] });
}
const defaults = {
  provider: "GOOGLE",
  distanceProvider: "GOOGLE",
  baseDeliveryCharge: 20,
  deliveryChargePerKm: 8,
  riderBasePay: 25,
  riderPayPerKm: 7,
  monthlySettlementDay: 1
};
function ApiKeysPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(defaults);
  const { data, isLoading } = useQuery({ queryKey: ["api-keys"], queryFn: () => request({ url: "/admin/api-keys", method: "GET" }) });
  useEffect(() => {
    if (!data) return;
    setForm({ ...defaults, ...data, googleMapKey: data.googleMapKey ?? data.googleMapsApiKey ?? "", provider: data.distanceProvider === "GOOGLE" || data.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE" });
  }, [data]);
  const save = useMutation({ mutationFn: (payload) => request({ url: "/admin/api-keys", method: "PUT", data: payload }), onSuccess: () => {
    toast.success("API and distance settings saved");
    qc.invalidateQueries({ queryKey: ["api-keys"] });
  }, onError: (e) => toast.error(e.message) });
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const onSave = () => {
    save.mutate({
      ...form,
      googleMapsApiKey: form.googleMapKey ?? form.googleMapsApiKey ?? "",
      distanceProvider: form.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE"
    });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "API Keys & Distance", icon: /* @__PURE__ */ jsx(KeyRound, { className: "h-5 w-5" }), breadcrumbs: [{ label: "Dashboard", to: "/" }, { label: "API Keys" }] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,.8fr)]", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-5 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-primary/15 p-3 text-primary", children: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Google Maps Distance API" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Used by backend to find nearest Mr. Breado outlet and calculate accurate distance, delivery charge, and rider earning." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Field$2, { className: "md:col-span-2", label: "Google Maps API Key", value: form.googleMapKey ?? "", onChange: (v) => set("googleMapKey", v), placeholder: form.googleMapsApiKeyConfigured ? "Key configured. Leave unchanged or paste new key." : "AIza..." }),
          /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
            "Distance Provider",
            /* @__PURE__ */ jsxs("select", { value: form.provider ?? "GOOGLE", onChange: (e) => set("provider", e.target.value), className: "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary", children: [
              /* @__PURE__ */ jsx("option", { value: "GOOGLE", children: "Google Distance Matrix" }),
              /* @__PURE__ */ jsx("option", { value: "HAVERSINE", children: "Haversine fallback" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(Field$2, { label: "Monthly Rider Settlement Day", type: "number", value: form.monthlySettlementDay ?? 1, onChange: (v) => set("monthlySettlementDay", Number(v)) }),
          /* @__PURE__ */ jsx(Field$2, { label: "Base Delivery Charge (₹)", type: "number", value: form.baseDeliveryCharge ?? 0, onChange: (v) => set("baseDeliveryCharge", Number(v)) }),
          /* @__PURE__ */ jsx(Field$2, { label: "Customer Charge / KM (₹)", type: "number", value: form.deliveryChargePerKm ?? 0, onChange: (v) => set("deliveryChargePerKm", Number(v)) }),
          /* @__PURE__ */ jsx(Field$2, { label: "Rider Base Pay (₹)", type: "number", value: form.riderBasePay ?? 0, onChange: (v) => set("riderBasePay", Number(v)) }),
          /* @__PURE__ */ jsx(Field$2, { label: "Rider Pay / KM (₹)", type: "number", value: form.riderPayPerKm ?? 0, onChange: (v) => set("riderPayPerKm", Number(v)) })
        ] }),
        /* @__PURE__ */ jsxs("button", { disabled: isLoading || save.isPending, onClick: onSave, className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          " Save API Settings"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-bold", children: "Business impact" }),
        /* @__PURE__ */ jsx(Info, { icon: /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4" }), title: "Nearest outlet", text: "Backend compares user lat/lng with every outlet lat/lng set by admin." }),
        /* @__PURE__ */ jsx(Info, { icon: /* @__PURE__ */ jsx(IndianRupee, { className: "h-4 w-4" }), title: "Delivery fee", text: "Customer delivery charge uses base fee + exact distance × charge/km." }),
        /* @__PURE__ */ jsx(Info, { icon: /* @__PURE__ */ jsx(IndianRupee, { className: "h-4 w-4" }), title: "Rider payout", text: "Rider popup and monthly payout use base pay + exact distance × rider pay/km." }),
        /* @__PURE__ */ jsx("div", { className: "mt-5 rounded-xl border border-border bg-background p-4 text-xs leading-5 text-muted-foreground", children: "The Google key stays on backend only. User and rider apps receive calculated values, not the key." })
      ] })
    ] })
  ] });
}
function Field$2({ label, value, onChange, type = "text", placeholder = "", className = "" }) {
  return /* @__PURE__ */ jsxs("label", { className: `block text-sm font-semibold ${className}`, children: [
    label,
    /* @__PURE__ */ jsx("input", { type, value: value ?? "", placeholder, onChange: (e) => onChange(e.target.value), className: "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" })
  ] });
}
function Info({ icon, title, text }) {
  return /* @__PURE__ */ jsxs("div", { className: "mb-3 rounded-xl border border-border bg-background p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-bold text-foreground", children: [
      icon,
      title
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm leading-5 text-muted-foreground", children: text })
  ] });
}
function PaymentControlsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["payment-controls"], queryFn: () => request({ url: "/admin/payment-controls", method: "GET" }) });
  const [form, setForm] = useState({ codEnabled: true, onlinePaymentEnabled: false, razorpayMode: "TEST", razorpayKeyId: "", razorpayKeySecret: "", razorpayWebhookSecret: "", mrBreadoTakeawayEnabled: false, takeawayAdvancePercentage: 0 });
  useEffect(() => {
    if (data) setForm({ ...form, ...data, razorpayKeySecret: "" });
  }, [data]);
  const save = useMutation({ mutationFn: (payload) => request({ url: "/admin/payment-controls", method: "PUT", data: payload }), onSuccess: () => {
    toast.success("Payment controls saved");
    qc.invalidateQueries({ queryKey: ["payment-controls"] });
  }, onError: (e) => toast.error(e.message) });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Payment & Takeaway Controls", icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }), breadcrumbs: [{ label: "Dashboard", to: "/" }, { label: "Payment Controls" }] }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-card p-6 shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsx(Status, { title: "COD", active: !!form.codEnabled, icon: /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Status, { title: "Online Payment", active: !!form.onlinePaymentEnabled, icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx(Status, { title: "Razorpay Secret", active: !!form.razorpaySecretConfigured || !!form.razorpayKeySecret, icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsx(Toggle$1, { label: "Cash on Delivery", value: !!form.codEnabled, onChange: (v) => set("codEnabled", v) }),
        /* @__PURE__ */ jsx(Toggle$1, { label: "Online Razorpay Payment", value: !!form.onlinePaymentEnabled, onChange: (v) => set("onlinePaymentEnabled", v) }),
        /* @__PURE__ */ jsx(Toggle$1, { label: "Mr. Breado Takeaway", value: !!form.mrBreadoTakeawayEnabled, onChange: (v) => set("mrBreadoTakeawayEnabled", v) }),
        /* @__PURE__ */ jsx(Field$1, { label: "Takeaway Advance Percentage", type: "number", value: form.takeawayAdvancePercentage ?? 0, onChange: (v) => set("takeawayAdvancePercentage", Math.max(0, Math.min(100, Number(v)))) }),
        /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
          "Razorpay Mode",
          /* @__PURE__ */ jsxs("select", { value: form.razorpayMode ?? "TEST", onChange: (e) => set("razorpayMode", e.target.value), className: "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary", children: [
            /* @__PURE__ */ jsx("option", { value: "TEST", children: "TEST" }),
            /* @__PURE__ */ jsx("option", { value: "LIVE", children: "LIVE" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Field$1, { label: "Razorpay Key ID", value: form.razorpayKeyId ?? "", onChange: (v) => set("razorpayKeyId", v) }),
        /* @__PURE__ */ jsx(Field$1, { label: "Razorpay Secret Key", type: "password", value: form.razorpayKeySecret ?? "", placeholder: form.razorpaySecretConfigured ? "Configured. Leave blank to keep old secret." : "Secret key", onChange: (v) => set("razorpayKeySecret", v) }),
        /* @__PURE__ */ jsx(Field$1, { label: "Razorpay Webhook Secret", type: "password", value: form.razorpayWebhookSecret ?? "", placeholder: form.razorpayWebhookSecretConfigured ? "Configured. Leave blank to keep old secret." : "Webhook secret", onChange: (v) => set("razorpayWebhookSecret", v) })
      ] }),
      /* @__PURE__ */ jsxs("button", { disabled: isLoading || save.isPending, onClick: () => save.mutate(form), className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60", children: [
        /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
        " Save Payment Controls"
      ] })
    ] })
  ] });
}
function Field$1({ label, value, onChange, type = "text", placeholder = "" }) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-semibold", children: [
    label,
    /* @__PURE__ */ jsx("input", { type, value: value ?? "", placeholder, onChange: (e) => onChange(e.target.value), className: "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary" })
  ] });
}
function Toggle$1({ label, value, onChange }) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between rounded-xl border border-border bg-background p-4 text-sm font-semibold", children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: value, onChange: (e) => onChange(e.target.checked), className: "h-5 w-5 accent-primary" })
  ] });
}
function Status({ title, active, icon }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-3 text-primary", children: icon }),
    /* @__PURE__ */ jsx("div", { className: "font-bold", children: title }),
    /* @__PURE__ */ jsx("div", { className: `mt-1 text-sm ${active ? "text-emerald-500" : "text-muted-foreground"}`, children: active ? "Enabled" : "Disabled" })
  ] });
}
const PUBLIC_ROUTES = ["/login", "/register"];
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$G = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Go4Food Admin" },
      { name: "description", content: "Food delivery admin dashboard." }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$G.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthenticated } = useAuth();
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  const outletDashboardMatch = pathname.match(/^\/business-outlets\/([^/?#]+)$/);
  const isApiKeysPage = pathname === "/api-keys";
  const isPaymentControlsPage = pathname === "/payment-controls";
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    isPublic ? isAuthenticated && pathname.startsWith("/login") ? /* @__PURE__ */ jsx(Navigate, { to: "/" }) : /* @__PURE__ */ jsx(Outlet, {}) : !isAuthenticated ? /* @__PURE__ */ jsx(Navigate, { to: "/login" }) : /* @__PURE__ */ jsx(AdminLayout, { children: isApiKeysPage ? /* @__PURE__ */ jsx(ApiKeysPage, {}) : isPaymentControlsPage ? /* @__PURE__ */ jsx(PaymentControlsPage, {}) : outletDashboardMatch?.[1] ? /* @__PURE__ */ jsx(OutletCommandCenterPage, { outletId: decodeURIComponent(outletDashboardMatch[1]) }) : /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
}
const $$splitComponentImporter$F = () => import("./zones-vdtq30F8.js");
const Route$F = createFileRoute("/zones")({
  head: () => ({
    meta: [{
      title: "Zones | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$F, "component")
});
const $$splitComponentImporter$E = () => import("./tickets-CBZLw7Ef.js");
const Route$E = createFileRoute("/tickets")({
  head: () => ({
    meta: [{
      title: "Support Tickets | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$E, "component")
});
const $$splitComponentImporter$D = () => import("./support-Ccf7dWqQ.js");
const Route$D = createFileRoute("/support")({
  head: () => ({
    meta: [{
      title: "Support Dashboard | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$D, "component")
});
const $$splitComponentImporter$C = () => import("./subscriptions-Ja6kDxf5.js");
const Route$C = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [{
      title: "Subscriptions | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$C, "component")
});
const $$splitComponentImporter$B = () => import("./stories-DLW3Kh-N.js");
const Route$B = createFileRoute("/stories")({
  head: () => ({
    meta: [{
      title: "Bite Stories | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$B, "component")
});
const $$splitComponentImporter$A = () => import("./settings-C03FmvQm.js");
const Route$A = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$A, "component")
});
const $$splitComponentImporter$z = () => import("./service-area-verifications-2HnFh958.js");
const Route$z = createFileRoute("/service-area-verifications")({
  head: () => ({
    meta: [{
      title: "Verification Requests | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$z, "component")
});
const $$splitComponentImporter$y = () => import("./roles-1XbRUjZH.js");
const Route$y = createFileRoute("/roles")({
  head: () => ({
    meta: [{
      title: "Roles | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$y, "component")
});
const $$splitComponentImporter$x = () => import("./reviews-CLUJjx4G.js");
const Route$x = createFileRoute("/reviews")({
  head: () => ({
    meta: [{
      title: "Reviews | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$x, "component")
});
const $$splitComponentImporter$w = () => import("./restaurants-CLnX9XGQ.js");
const Route$w = createFileRoute("/restaurants")({
  head: () => ({
    meta: [{
      title: "Restaurants | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component")
});
const $$splitComponentImporter$v = () => import("./register-FSvJxpq5.js");
const Route$v = createFileRoute("/register")({
  head: () => ({
    meta: [{
      title: "Create account | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component")
});
const $$splitComponentImporter$u = () => import("./permissions-Bj_XUsfB.js");
const Route$u = createFileRoute("/permissions")({
  head: () => ({
    meta: [{
      title: "Permissions | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component")
});
const $$splitComponentImporter$t = () => import("./payouts-BKLo0I4r.js");
const Route$t = createFileRoute("/payouts")({
  head: () => ({
    meta: [{
      title: "Payouts | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component")
});
const $$splitComponentImporter$s = () => import("./owners-Cj_LtABX.js");
const Route$s = createFileRoute("/owners")({
  head: () => ({
    meta: [{
      title: "Owners | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./operations-DQPW0Qm-.js");
const Route$r = createFileRoute("/operations")({
  head: () => ({
    meta: [{
      title: "Operations | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./online-transactions-CG2QB0z0.js");
const Route$q = createFileRoute("/online-transactions")({
  head: () => ({
    meta: [{
      title: "Online Transactions | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./offers-DBgwE6MP.js");
const Route$p = createFileRoute("/offers")({
  head: () => ({
    meta: [{
      title: "Offers | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./notifications-CeX0JlSh.js");
const Route$o = createFileRoute("/notifications")({
  head: () => ({
    meta: [{
      title: "Notifications | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./mr-breado-restaurant-CCFPOq8w.js");
const Route$n = createFileRoute("/mr-breado-restaurant")({
  head: () => ({
    meta: [{
      title: "Mr. Breado Restaurant | Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./login-kaE9klc4.js");
const Route$m = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Sign in | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./franchise-DHr-ea09.js");
const Route$l = createFileRoute("/franchise")({
  head: () => ({
    meta: [{
      title: "Franchise & Outlets | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const variants = {
  Active: "bg-success/15 text-success border-success/30",
  Inactive: "bg-muted text-muted-foreground border-border",
  Pending: "bg-warning/15 text-warning border-warning/30",
  Accepted: "bg-info/15 text-info border-info/30",
  Preparing: "bg-primary/15 text-primary border-primary/30",
  Ready: "bg-success/15 text-success border-success/30",
  "Ready for Pickup": "bg-success/15 text-success border-success/30",
  READY_FOR_PICKUP: "bg-success/15 text-success border-success/30",
  Delivered: "bg-success/15 text-success border-success/30",
  Cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  Suspended: "bg-destructive/15 text-destructive border-destructive/30",
  Open: "bg-info/15 text-info border-info/30",
  "In Progress": "bg-warning/15 text-warning border-warning/30",
  Resolved: "bg-success/15 text-success border-success/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  Low: "bg-muted text-muted-foreground border-border"
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsx("span", { className: cn(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
    variants[status] ?? variants.Inactive
  ), children: status });
}
function first(...vals) {
  for (const v of vals) if (v !== void 0 && v !== null && String(v).trim() !== "") return v;
  return void 0;
}
function asArray(payload) {
  const d = payload?.data ?? payload;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.items)) return d.items;
  if (Array.isArray(d?.products)) return d.products;
  if (Array.isArray(d?.content)) return d.content;
  if (Array.isArray(d?.records)) return d.records;
  return [];
}
function normalizeProduct(raw) {
  const restaurant = typeof raw?.restaurant === "object" ? raw.restaurant : {};
  const category = typeof raw?.category === "object" ? raw.category : {};
  const title = first(raw?.title, raw?.name, raw?.productName, raw?.product_name, raw?.foodName, raw?.food_name, "Food item");
  const image = first(raw?.imageUrl, raw?.image_url, raw?.image, raw?.thumbnailUrl, raw?.thumbnail_url, raw?.primaryImageUrl, raw?.primary_image_url);
  const available = first(raw?.isAvailable, raw?.available, raw?.is_available, raw?.active, raw?.enabled, true);
  return {
    ...raw,
    title,
    name: title,
    productName: title,
    image,
    imageUrl: image,
    categoryName: first(raw?.categoryName, raw?.category_name, raw?.foodType, raw?.food_type, raw?.category, category?.name, category?.title, ""),
    restaurantName: first(raw?.restaurantName, raw?.restaurant_name, restaurant?.name, restaurant?.restaurantName, restaurant?.restaurant_name, raw?.storeName, "Mr. Breado"),
    price: Number(first(raw?.price, raw?.basePrice, raw?.base_price, raw?.sellingPrice, raw?.selling_price, 0)) || 0,
    effectivePrice: Number(first(raw?.effectivePrice, raw?.effective_price, raw?.discountPrice, raw?.discount_price, raw?.price, 0)) || 0,
    isAvailable: available === true || available === 1 || String(available).toLowerCase() === "true" || String(available).toUpperCase() === "ACTIVE",
    isFeatured: Boolean(first(raw?.isFeatured, raw?.featured, raw?.bestseller, raw?.is_bestseller, false))
  };
}
function normalizePage$1(payload, params) {
  const d = payload?.data ?? payload;
  const items = asArray(payload).map(normalizeProduct);
  const perPage = Number(d?.perPage ?? d?.per_page ?? params.perPage ?? 20) || 20;
  const page = Number(d?.page ?? d?.currentPage ?? params.page ?? 1) || 1;
  return {
    items,
    page,
    per_page: perPage,
    perPage,
    total: Number(d?.total ?? d?.totalItems ?? d?.totalElements ?? items.length) || items.length,
    total_pages: Number(d?.total_pages ?? d?.totalPages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    totalPages: Number(d?.totalPages ?? d?.total_pages ?? Math.max(1, Math.ceil(items.length / Math.max(1, perPage)))) || 1,
    last: d?.last ?? true
  };
}
const isMrBreadoStore = (source) => source === "seller";
function normalizeProductPayload(payload) {
  if (payload instanceof FormData) return payload;
  const raw = payload;
  const image = raw.imageUrl ?? raw.image ?? raw.thumbnailUrl;
  const category = raw.categoryId ?? raw.category_id ?? (typeof raw.category === "object" ? raw.category?.id ?? raw.category?._id : raw.category);
  return {
    ...raw,
    name: raw.name ?? raw.title ?? raw.productName,
    basePrice: Number(raw.basePrice ?? raw.price ?? raw.sellingPrice ?? 0),
    offerPrice: Number(raw.offerPrice ?? raw.discountPrice ?? raw.effectivePrice ?? raw.basePrice ?? raw.price ?? 0),
    categoryId: category || void 0,
    images: Array.isArray(raw.images) ? raw.images : typeof image === "string" && image ? [{ url: image }] : [],
    active: raw.active ?? raw.isAvailable ?? true,
    featured: raw.featured ?? raw.isFeatured ?? false
  };
}
const productsService = {
  list: async (params = {}) => {
    const baseParams = {
      page: params.page ?? 1,
      per_page: params.perPage ?? 20,
      perPage: params.perPage ?? 20,
      search: params.search || void 0,
      _t: Date.now()
    };
    const primaryUrl = endpoints.admin.mrBreado.products;
    let response = await request({ url: primaryUrl, method: "GET", params: baseParams });
    let page = normalizePage$1(response, params);
    if ((page.items?.length ?? 0) === 0 && isMrBreadoStore(params.source)) {
      try {
        response = await request({ url: "/admin/products/catalog", method: "GET", params: baseParams });
        page = normalizePage$1(response, params);
      } catch (_) {
      }
    }
    return page;
  },
  detail: async (id, source) => {
    const response = await request({
      url: endpoints.admin.mrBreado.productById(id),
      method: "GET"
    });
    return normalizeProduct(response?.data ?? response);
  },
  create: (payload, source = "admin") => request({
    url: endpoints.admin.mrBreado.products,
    method: "POST",
    data: normalizeProductPayload(payload)
  }),
  update: (id, payload, source = "admin") => request({
    url: endpoints.admin.mrBreado.productById(id),
    method: "PUT",
    data: normalizeProductPayload(payload)
  }),
  remove: (id, source = "admin") => request({
    url: endpoints.admin.mrBreado.productById(id),
    method: "DELETE"
  }),
  setAvailability: (id, isAvailable, source = "admin") => request({
    url: endpoints.admin.mrBreado.productAvailability(id),
    method: "PATCH",
    data: { isAvailable, available: isAvailable, inStock: isAvailable, in_stock: isAvailable }
  }),
  downloadTemplate: async () => {
    const blob = await downloadBlob({ url: endpoints.admin.mrBreado.template, method: "GET" });
    saveBlob(blob, "mr-breado-products-template.xlsx");
  },
  exportAdminProducts: async () => {
    const blob = await downloadBlob({ url: endpoints.admin.mrBreado.export, method: "GET" });
    saveBlob(blob, "mr-breado-products.csv");
  }
};
const productKeys = {
  all: ["products"],
  list: (q) => ["products", "list", q]
};
function useProducts(query) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, source = "admin" }) => productsService.remove(id, source),
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useToggleProductAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v) => productsService.setAvailability(v.id, v.isAvailable, v.source ?? "admin"),
    onSuccess: () => {
      toast.success("Availability updated");
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, source = "admin" }) => productsService.create(payload, source),
    onSuccess: () => {
      toast.success("Product created");
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v) => productsService.update(v.id, v.payload, v.source ?? "admin"),
    onSuccess: () => {
      toast.success("Product updated");
      qc.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (e) => toast.error(e.message)
  });
}
const $$splitComponentImporter$k = () => import("./foods-Dn4BjCGN.js");
const Route$k = createFileRoute("/foods")({
  head: () => ({
    meta: [{
      title: "Foods | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
function FoodsPage({
  title,
  source = "admin"
}) {
  const [page, setPage] = useState(1);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useProducts({
    page,
    perPage: 20,
    source
  });
  const del = useDeleteProduct();
  const toggle = useToggleProductAvailability();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const items = data?.items ?? [];
  const totalPages = data?.total_pages ?? 1;
  const [showForm, setShowForm] = useState(false);
  const categoriesQuery = useQuery({
    queryKey: ["admin-food-categories-for-form"],
    queryFn: async () => {
      const res = await api.get("/admin/categories", {
        params: {
          page: 1,
          perPage: 200,
          _t: Date.now()
        }
      });
      const d = res.data?.data ?? res.data;
      const arr = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : Array.isArray(d?.categories) ? d.categories : [];
      return arr.filter((x) => x.active !== false && String(x.status ?? "ACTIVE").toUpperCase() !== "INACTIVE").map((x) => ({
        id: String(x._id ?? x.mongoId ?? x.id),
        name: x.name ?? x.title ?? x.categoryName ?? x.category_name
      })).filter((x) => x.id && x.name);
    },
    staleTime: 3e4
  });
  const [editing, setEditing] = useState(null);
  const blankForm = {
    title: "",
    subtitle: "",
    description: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    categoryName: "",
    foodType: "VEG",
    stockQuantity: "",
    isVeg: true,
    isAvailable: true,
    isBestseller: false,
    smallSizeExtra: "",
    mediumSizeExtra: "",
    largeSizeExtra: "",
    cake500gmExtra: "",
    cake1kgExtra: "",
    cake15kgExtra: "",
    cake2kgExtra: "",
    cakeMessageEnabled: false,
    cakeMessageCharge: "",
    customWeightEnabled: false,
    image: null
  };
  const [form, setForm] = useState(blankForm);
  const applyProductToForm = (product) => {
    const pick = (...vals) => vals.find((v) => v !== void 0 && v !== null && String(v).trim() !== "") ?? "";
    setForm({
      ...blankForm,
      title: pick(product.title, product.name, product.productName, product.product_name, product.foodName, product.food_name),
      subtitle: pick(product.subtitle, product.shortDescription, product.short_description),
      description: pick(product.description, product.details, product.subtitle),
      price: String(pick(product.price, product.basePrice, product.base_price, product.sellingPrice, product.selling_price)),
      discountPrice: String(pick(product.discountPrice, product.discount_price, product.discountedPrice, product.discounted_price, product.effectivePrice, product.effective_price)),
      categoryId: String(pick(product.categoryId?._id, product.categoryId, product.category_id, product.category?.id, product.category?._id)),
      categoryName: pick(product.categoryName, product.category_name, product.foodCategoryName, product.menuCategoryName, product.category?.name, product.category?.title),
      foodType: pick(product.foodType, product.food_type, product.type, product.categoryName, product.category_name),
      stockQuantity: String(pick(product.stockQuantity, product.stock_quantity, product.stock, product.quantity)),
      isVeg: Boolean(product.isVeg ?? product.veg ?? product.is_veg ?? true),
      isAvailable: Boolean(product.isAvailable ?? product.available ?? product.is_available ?? true),
      isBestseller: Boolean(product.isBestseller ?? product.bestseller ?? product.is_bestseller ?? product.isFeatured ?? product.featured ?? false),
      smallSizeExtra: String(pick(product.smallSizeExtra, product.small_size_extra, product.smallPrice, product.small_price)),
      mediumSizeExtra: String(pick(product.mediumSizeExtra, product.medium_size_extra, product.mediumPrice, product.medium_price)),
      largeSizeExtra: String(pick(product.largeSizeExtra, product.large_size_extra, product.largePrice, product.large_price)),
      cake500gmExtra: String(pick(product.cake500gmExtra, product.cake_500gm_extra, product.cake500gmPrice, product.cake_500gm_price)),
      cake1kgExtra: String(pick(product.cake1kgExtra, product.cake_1kg_extra, product.cake1kgPrice, product.cake_1kg_price)),
      cake15kgExtra: String(pick(product.cake15kgExtra, product.cake1_5kgExtra, product.cake_1_5kg_extra, product.cake15kgPrice, product.cake_1_5kg_price)),
      cake2kgExtra: String(pick(product.cake2kgExtra, product.cake_2kg_extra, product.cake2kgPrice, product.cake_2kg_price)),
      cakeMessageEnabled: Boolean(product.cakeMessageEnabled ?? product.cake_message_enabled ?? false),
      cakeMessageCharge: String(pick(product.cakeMessageCharge, product.cake_message_charge)),
      customWeightEnabled: Boolean(product.customWeightEnabled ?? product.custom_weight_enabled ?? false),
      image: null
    });
  };
  useEffect(() => {
    let cancelled = false;
    if (editing) {
      applyProductToForm(editing);
      productsService.detail(editing.id, source).then((detail) => {
        if (!cancelled) applyProductToForm({
          ...editing,
          ...detail
        });
      }).catch(() => {
      });
    } else {
      setForm(blankForm);
    }
    return () => {
      cancelled = true;
    };
  }, [editing]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title, icon: /* @__PURE__ */ jsx(Utensils, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Menu Management"
    }, {
      label: title
    }], actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => {
        setEditing(null);
        setShowForm(true);
      }, className: "inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        " Add Item"
      ] }),
      source === "admin" && /* @__PURE__ */ jsxs("button", { onClick: () => productsService.downloadTemplate(), className: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent", children: [
        /* @__PURE__ */ jsx(FileSpreadsheet, { className: "h-4 w-4" }),
        "Template"
      ] }),
      source === "admin" && /* @__PURE__ */ jsxs("button", { onClick: () => productsService.exportAdminProducts(), className: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        "Export"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card shadow-card", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between border-b border-border p-4", children: /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold", children: [
        data?.total ?? 0,
        " products ",
        isFetching && /* @__PURE__ */ jsx(Loader2, { className: "ml-1 inline h-3 w-3 animate-spin" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Food" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Restaurant" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Price" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Availability" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: isLoading ? Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-4", children: /* @__PURE__ */ jsx("div", { className: "h-10 w-full animate-pulse rounded bg-primary/10" }) }) }, i)) : error ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-16 text-center text-destructive", children: error.message }) }) : items.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 5, className: "px-4 py-16 text-center text-muted-foreground", children: "No products yet" }) }) : items.map((p) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-border/60 hover:bg-accent/30", children: [
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            p.image || p.imageUrl ? /* @__PURE__ */ jsx("img", { src: p.image || p.imageUrl, alt: p.title, className: "h-10 w-10 rounded-lg object-cover" }) : /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-accent", children: "🍽️" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-medium", children: [
                p.title,
                " ",
                p.isFeatured && /* @__PURE__ */ jsx("span", { className: "ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800", children: "Featured" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "#",
                p.id
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: p.restaurantName ?? p.restaurant_name ?? (typeof p.restaurant === "object" ? p.restaurant?.name ?? "—" : p.restaurant ?? "—") }),
          /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 font-semibold", children: [
            "₹",
            Number(p.effectivePrice ?? p.effective_price ?? p.price ?? 0).toFixed(2)
          ] }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("button", { onClick: () => toggle.mutate({
            id: p.id,
            isAvailable: !p.isAvailable,
            source
          }), disabled: toggle.isPending, children: /* @__PURE__ */ jsx(StatusBadge, { status: p.isAvailable ? "Active" : "Inactive" }) }) }),
          /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => update.mutate({
              id: p.id,
              payload: {
                featured: !p.isFeatured
              },
              source
            }), className: "rounded p-1.5 text-amber-600 hover:bg-amber-100", title: p.isFeatured ? "Unfeature" : "Mark as featured", children: /* @__PURE__ */ jsx(Star, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxs("button", { onClick: () => {
              setEditing(p);
              setShowForm(true);
            }, className: "inline-flex items-center gap-1 rounded-md border border-primary/30 px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10", title: "Edit food item", children: [
              /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }),
              " Edit"
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => {
              if (window.confirm(`Delete "${p.title}"?`)) del.mutate({
                id: p.id,
                source
              });
            }, disabled: del.isPending, className: "rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
          ] }) })
        ] }, p.id)) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Page ",
          data?.page ?? page,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(ModalForm, { open: showForm, onClose: () => {
      setShowForm(false);
      setEditing(null);
    }, form, setForm, editing, categories: categoriesQuery.data ?? [], onSave: async () => {
      const categoryText = String(form.categoryName || "").toLowerCase();
      const isPizza = categoryText.includes("pizza");
      const isCake = categoryText.includes("cake");
      if (!form.title.trim()) return window.alert("Food title is required.");
      if (!form.categoryId) return window.alert("Select an Admin-created category.");
      if (isPizza && (!form.smallSizeExtra || !form.mediumSizeExtra || !form.largeSizeExtra)) return window.alert("Enter Small, Medium and Large pizza prices.");
      if (isCake && (!form.cake500gmExtra || !form.cake1kgExtra || !form.cake15kgExtra || !form.cake2kgExtra)) return window.alert("Enter all cake prices from 500gm to 2kg.");
      if (!isPizza && !isCake && !form.price) return window.alert("Enter the food price.");
      const fd = new FormData();
      fd.append("name", form.title.trim());
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("subtitle", form.subtitle.trim());
      fd.append("categoryId", form.categoryId);
      fd.append("categoryName", form.categoryName);
      fd.append("foodType", form.isVeg ? "VEG" : "NON_VEG");
      fd.append("active", String(form.isAvailable));
      fd.append("featured", String(form.isBestseller));
      if (form.discountPrice) fd.append("offerPrice", form.discountPrice);
      if (isPizza) {
        fd.append("smallSizePrice", form.smallSizeExtra);
        fd.append("mediumSizePrice", form.mediumSizeExtra);
        fd.append("largeSizePrice", form.largeSizeExtra);
        fd.append("basePrice", form.smallSizeExtra);
      } else if (isCake) {
        fd.append("cake500gmPrice", form.cake500gmExtra);
        fd.append("cake1kgPrice", form.cake1kgExtra);
        fd.append("cake15kgPrice", form.cake15kgExtra);
        fd.append("cake2kgPrice", form.cake2kgExtra);
        fd.append("basePrice", form.cake500gmExtra);
        fd.append("cakeMessageEnabled", String(form.cakeMessageEnabled));
        fd.append("cakeMessageCharge", form.cakeMessageCharge || "0");
        fd.append("customWeightEnabled", String(form.customWeightEnabled));
      } else {
        fd.append("basePrice", form.price);
      }
      if (form.image) fd.append("image", form.image);
      try {
        if (editing) {
          await update.mutateAsync({
            id: editing.id,
            payload: fd,
            source
          });
        } else {
          await create.mutateAsync({
            payload: fd,
            source
          });
        }
        setShowForm(false);
        setEditing(null);
      } catch (e) {
        console.error(e);
      }
    } })
  ] });
}
function ModalForm({
  open,
  onClose,
  form,
  setForm,
  onSave,
  editing,
  categories = []
}) {
  if (!open) return null;
  const set = (key, value) => setForm((s) => ({
    ...s,
    [key]: value
  }));
  const categoryText = String(form.categoryName || "").toLowerCase();
  const isPizza = categoryText.includes("pizza");
  const isCake = categoryText.includes("cake");
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl rounded-xl border border-border bg-card p-5 shadow-card", children: [
    /* @__PURE__ */ jsx("h3", { className: "mb-4 text-lg font-semibold", children: editing ? "Edit Food" : "Add Item" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Field, { label: "Title", value: form.title, onChange: (v) => set("title", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Subtitle", value: form.subtitle, onChange: (v) => set("subtitle", v) }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
        "Admin Category",
        /* @__PURE__ */ jsxs("select", { value: form.categoryId, onChange: (e) => {
          const c = categories.find((x) => String(x.id) === e.target.value);
          setForm((v) => ({
            ...v,
            categoryId: e.target.value,
            categoryName: c?.name ?? "",
            price: "",
            smallSizeExtra: "",
            mediumSizeExtra: "",
            largeSizeExtra: "",
            cake500gmExtra: "",
            cake1kgExtra: "",
            cake15kgExtra: "",
            cake2kgExtra: ""
          }));
        }, className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2", children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Select category" }),
          categories.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mt-1 block text-xs text-muted-foreground", children: "Only categories created by Admin are available." })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
        "Food Type",
        /* @__PURE__ */ jsxs("select", { value: form.isVeg ? "VEG" : "NON_VEG", onChange: (e) => set("isVeg", e.target.value === "VEG"), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2", children: [
          /* @__PURE__ */ jsx("option", { value: "VEG", children: "Veg" }),
          /* @__PURE__ */ jsx("option", { value: "NON_VEG", children: "Non-Veg" })
        ] })
      ] }),
      !isPizza && !isCake && /* @__PURE__ */ jsx(Field, { label: "Price (₹)", type: "number", value: form.price, onChange: (v) => set("price", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Offer Price (₹, optional)", type: "number", value: form.discountPrice, onChange: (v) => set("discountPrice", v) }),
      isPizza && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Field, { label: "Small Price (₹) — Default", type: "number", value: form.smallSizeExtra, onChange: (v) => set("smallSizeExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "Medium Price (₹)", type: "number", value: form.mediumSizeExtra, onChange: (v) => set("mediumSizeExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "Large Price (₹)", type: "number", value: form.largeSizeExtra, onChange: (v) => set("largeSizeExtra", v) })
      ] }),
      isCake && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Field, { label: "500gm Price (₹) — Default", type: "number", value: form.cake500gmExtra, onChange: (v) => set("cake500gmExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "1kg Price (₹)", type: "number", value: form.cake1kgExtra, onChange: (v) => set("cake1kgExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "1.5kg Price (₹)", type: "number", value: form.cake15kgExtra, onChange: (v) => set("cake15kgExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "2kg Price (₹)", type: "number", value: form.cake2kgExtra, onChange: (v) => set("cake2kgExtra", v) }),
        /* @__PURE__ */ jsx(Field, { label: "Cake Message Charge (₹)", type: "number", value: form.cakeMessageCharge, onChange: (v) => set("cakeMessageCharge", v) })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
        "Image",
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: (e) => set("image", e.target.files?.[0] ?? null), className: "mt-1 w-full rounded-md border border-input px-3 py-2" })
      ] })
    ] }),
    (isPizza || isCake) && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm", children: [
      /* @__PURE__ */ jsx("strong", { children: isPizza ? "Pizza size pricing" : "Cake weight pricing" }),
      /* @__PURE__ */ jsx("div", { className: "mt-1 text-muted-foreground", children: isPizza ? "Customer sees Small, Medium and Large. Small is selected by default." : "Customer sees 500gm, 1kg, 1.5kg and 2kg. 500gm is selected by default." })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "mt-3 block text-sm font-medium", children: [
      "Description",
      /* @__PURE__ */ jsx("textarea", { value: form.description, onChange: (e) => set("description", e.target.value), className: "mt-1 min-h-24 w-full rounded-md border border-input px-3 py-2" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-2 md:grid-cols-3", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Veg", value: form.isVeg, onChange: (v) => set("isVeg", v) }),
      /* @__PURE__ */ jsx(Toggle, { label: "Available", value: form.isAvailable, onChange: (v) => set("isAvailable", v) }),
      /* @__PURE__ */ jsx(Toggle, { label: "Bestseller", value: form.isBestseller, onChange: (v) => set("isBestseller", v) }),
      isCake && /* @__PURE__ */ jsx(Toggle, { label: "Cake Message", value: form.cakeMessageEnabled, onChange: (v) => set("cakeMessageEnabled", v) }),
      isCake && /* @__PURE__ */ jsx(Toggle, { label: "Custom Weight", value: form.customWeightEnabled, onChange: (v) => set("customWeightEnabled", v) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-md border border-border px-4 py-2 text-sm hover:bg-accent", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { onClick: onSave, className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground", children: "Save" })
    ] })
  ] }) });
}
function Field({
  label,
  value,
  onChange,
  type = "text"
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("input", { type, min: type === "number" ? 0 : void 0, step: type === "number" ? "0.01" : void 0, value: value ?? "", onChange: (e) => onChange(e.target.value), className: "mt-1 w-full rounded-md border border-input bg-background px-3 py-2" })
  ] });
}
function Toggle({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("label", { className: "flex items-center justify-between rounded-lg border border-border p-3 text-sm font-medium", children: [
    /* @__PURE__ */ jsx("span", { children: label }),
    /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!value, onChange: (e) => onChange(e.target.checked) })
  ] });
}
const $$splitComponentImporter$j = () => import("./delivery-boys-DC65950H.js");
const Route$j = createFileRoute("/delivery-boys")({
  head: () => ({
    meta: [{
      title: "Delivery Boys | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./customers-BygZki4V.js");
const Route$i = createFileRoute("/customers")({
  head: () => ({
    meta: [{
      title: "Customers | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./customer-messages-FY1-Xkyv.js");
const Route$h = createFileRoute("/customer-messages")({
  head: () => ({
    meta: [{
      title: "Admin Notifications | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./cuisine-D0n4PmF1.js");
const Route$g = createFileRoute("/cuisine")({
  head: () => ({
    meta: [{
      title: "Cuisine | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./coupons-BR5fR2U8.js");
const Route$f = createFileRoute("/coupons")({
  head: () => ({
    meta: [{
      title: "Coupons | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./categories-CGNylUqb.js");
const Route$e = createFileRoute("/categories")({
  head: () => ({
    meta: [{
      title: "Categories | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./business-outlets--ct7bfiE.js");
const Route$d = createFileRoute("/business-outlets")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./banners-CQtOyAAH.js");
const Route$c = createFileRoute("/banners")({
  head: () => ({
    meta: [{
      title: "Banners | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin-profile-B_XdFKHn.js");
const Route$b = createFileRoute("/admin-profile")({
  head: () => ({
    meta: [{
      title: "Admin Profile | Mr. Breado Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./admin-foods-DeSwVYau.js");
const Route$a = createFileRoute("/admin-foods")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-BaxMBQ-9.js");
const Route$9 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Dashboard | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function firstValue(obj, keys, fallback) {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== void 0 && value !== null && value !== "") return value;
  }
  return fallback;
}
function normalizeOrder(raw) {
  const customer = raw?.customer ?? raw?.user ?? raw?.customerDetails ?? {};
  const address = raw?.address ?? raw?.deliveryAddressDetails ?? raw?.delivery_address_details ?? {};
  const restaurant = raw?.restaurant ?? {};
  const customerName = firstValue(raw, ["customerName", "customer_name", "userName", "user_name"], void 0) ?? firstValue(customer, ["name", "fullName", "full_name"], "Guest");
  const customerMobile = firstValue(raw, ["customerMobile", "customer_mobile", "mobile", "phone", "phoneNumber", "phone_number"], void 0) ?? firstValue(customer, ["mobile", "phone", "phoneNumber", "phone_number"], "");
  const customerEmail = firstValue(raw, ["customerEmail", "customer_email", "email"], void 0) ?? firstValue(customer, ["email"], "");
  const deliveryAddress = firstValue(raw, ["deliveryAddress", "delivery_address", "addressText", "address_text"], void 0) ?? [address?.line1, address?.street, address?.area, address?.city, address?.state, address?.pincode].filter(Boolean).join(", ");
  const items = Array.isArray(raw?.items) ? raw.items : Array.isArray(raw?.orderItems) ? raw.orderItems : Array.isArray(raw?.order_items) ? raw.order_items : [];
  return {
    ...raw,
    id: String(firstValue(raw, ["id", "_id", "orderId", "order_id"], "")),
    orderNumber: String(firstValue(raw, ["orderNumber", "order_number", "slug", "invoiceNumber", "invoice_number"], raw?.id ? `#${raw.id}` : "—")),
    customerName,
    customerMobile,
    customerEmail,
    status: String(firstValue(raw, ["status", "orderStatus", "order_status"], "PENDING")),
    statusLabel: String(firstValue(raw, ["statusLabel", "status_label", "status", "orderStatus", "order_status"], "PENDING")),
    paymentStatus: String(firstValue(raw, ["paymentStatus", "payment_status"], "")),
    paymentType: String(firstValue(raw, ["paymentType", "payment_type", "paymentMethod", "payment_method"], "")),
    subtotal: toNumber(firstValue(raw, ["subtotal", "subTotal", "sub_total"], 0)),
    deliveryCharge: toNumber(firstValue(raw, ["deliveryCharge", "delivery_charge"], 0)),
    discount: toNumber(firstValue(raw, ["discount", "discountAmount", "discount_amount"], 0)),
    tax: toNumber(firstValue(raw, ["tax", "taxAmount", "tax_amount"], 0)),
    grandTotal: toNumber(firstValue(raw, ["grandTotal", "grand_total", "total", "totalAmount", "total_amount"], 0)),
    deliveryAddress,
    createdAt: String(firstValue(raw, ["createdAt", "created_at", "orderDate", "order_date"], "")),
    updatedAt: String(firstValue(raw, ["updatedAt", "updated_at"], "")),
    orderType: String(firstValue(raw, ["orderType", "order_type"], "DELIVERY")),
    outletId: String(firstValue(raw, ["outletId", "outlet_id", "restaurantId", "restaurant_id"], "")),
    outletName: String(firstValue(raw, ["outletName", "outlet_name", "restaurantName", "restaurant_name"], firstValue(restaurant, ["name", "outletName"], "Mr. Breado Outlet"))),
    riderName: String(firstValue(raw, ["riderName", "rider_name", "deliveryBoyName", "delivery_boy_name"], "")),
    items: items.map((it, idx) => ({
      ...it,
      id: String(firstValue(it, ["id", "_id"], idx)),
      productId: String(firstValue(it, ["productId", "product_id"], "")),
      productName: String(firstValue(it, ["productName", "product_name", "name", "title"], "Food item")),
      quantity: toNumber(firstValue(it, ["quantity", "qty"], 1), 1),
      price: toNumber(firstValue(it, ["price", "unitPrice", "unit_price"], 0)),
      totalPrice: toNumber(firstValue(it, ["totalPrice", "total_price", "total"], toNumber(it?.price) * toNumber(it?.quantity ?? 1)))
    }))
  };
}
function normalizePage(payload, q) {
  payload = payload?.data ?? payload;
  const rawItems = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : Array.isArray(payload?.content) ? payload.content : Array.isArray(payload?.orders) ? payload.orders : Array.isArray(payload?.data) ? payload.data : [];
  const page = toNumber(firstValue(payload, ["page", "currentPage", "current_page"], q.page ?? 1), q.page ?? 1);
  const fallbackPerPage = q.perPage ?? (rawItems.length || 20);
  const perPage = toNumber(
    firstValue(payload, ["perPage", "per_page", "size", "limit"], fallbackPerPage),
    q.perPage ?? 20
  );
  const total = toNumber(firstValue(payload, ["total", "totalElements", "total_elements", "totalItems", "total_items"], rawItems.length), rawItems.length);
  const totalPages = toNumber(firstValue(payload, ["totalPages", "total_pages", "pages"], Math.max(1, Math.ceil(total / Math.max(1, perPage)))), 1);
  return {
    items: rawItems.map(normalizeOrder),
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
    last: page >= totalPages
  };
}
async function tryRequest(url, method = "GET", data, params) {
  return request({ url, method, data, params });
}
const ordersService = {
  list: async (params = {}) => {
    const q = { page: params.page ?? 1, perPage: params.perPage ?? 20, status: params.status || void 0 };
    try {
      const primary = await tryRequest(endpoints.admin.mrBreado.orders, "GET", void 0, q);
      return normalizePage(primary, q);
    } catch (primaryError) {
      const fallback = await tryRequest(endpoints.admin.orders, "GET", void 0, q);
      return normalizePage(fallback, q);
    }
  },
  detail: async (id) => {
    try {
      const primary = await tryRequest(endpoints.admin.mrBreado.orderById(id));
      return normalizeOrder(primary?.order ?? primary?.data ?? primary);
    } catch (primaryError) {
      const fallback = await tryRequest(endpoints.admin.orderById(id));
      return normalizeOrder(fallback?.order ?? fallback?.data ?? fallback);
    }
  },
  accept: (id) => request({
    url: endpoints.admin.mrBreado.accept(id),
    method: "POST"
  }),
  preparing: (id) => request({
    url: endpoints.admin.mrBreado.preparing(id),
    method: "POST"
  }),
  ready: (id) => request({
    url: endpoints.admin.mrBreado.ready(id),
    method: "POST"
  }),
  reject: (id, reason) => request({
    url: endpoints.admin.mrBreado.reject(id),
    method: "POST",
    data: { reason }
  }),
  downloadInvoice: async (id, orderNumber) => {
    const blob = await downloadBlob({ url: endpoints.admin.mrBreado.invoicePdf(id), method: "GET" });
    const clean = String(orderNumber || id).replace(/[^a-zA-Z0-9_-]/g, "_");
    saveBlob(blob, `${clean}_invoice.pdf`);
  },
  sendInvoice: (id) => request({
    url: endpoints.admin.mrBreado.sendInvoice(id),
    method: "POST"
  })
};
const orderKeys = {
  all: ["orders"],
  list: (q) => ["orders", "list", q],
  detail: (id) => ["orders", "detail", id]
};
function useOrders(query) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => ordersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
function useOrder(id) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? "none"),
    queryFn: () => ordersService.detail(id),
    enabled: id != null
  });
}
function labelFor(action) {
  switch (action) {
    case "accept":
      return "Order accepted";
    case "preparing":
      return "Order moved to preparing";
    case "ready":
      return "Order marked ready";
    case "reject":
      return "Order rejected";
    case "sendInvoice":
      return "Invoice sent to customer";
    case "downloadInvoice":
      return "Invoice downloaded";
  }
}
function useOrderAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars) => {
      switch (vars.action) {
        case "accept":
          return ordersService.accept(vars.id);
        case "preparing":
          return ordersService.preparing(vars.id);
        case "ready":
          return ordersService.ready(vars.id);
        case "reject":
          return ordersService.reject(vars.id, vars.reason ?? "Rejected by admin");
        case "sendInvoice":
          return ordersService.sendInvoice(vars.id);
        case "downloadInvoice":
          return ordersService.downloadInvoice(vars.id, vars.orderNumber);
      }
    },
    onMutate: (v) => {
      if (v.action !== "downloadInvoice") toast.loading("Updating order...", { id: `order-${v.id}-${v.action}` });
    },
    onSuccess: (_d, v) => {
      toast.success(labelFor(v.action), { id: `order-${v.id}-${v.action}` });
      qc.invalidateQueries({ queryKey: orderKeys.all });
      qc.invalidateQueries({ queryKey: orderKeys.detail(v.id) });
    },
    onError: (_e, v) => toast.error("Action could not be completed. Please refresh and try again.", { id: `order-${v.id}-${v.action}` })
  });
}
function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
function formatCurrency(value) {
  const n = Number(value);
  return `₹${Number.isFinite(n) ? n.toFixed(2) : "0.00"}`;
}
function toFormData(payload) {
  if (payload instanceof FormData) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === void 0 || value === null || value === "") return;
    if (value instanceof File || value instanceof Blob) fd.append(key, value);
    else fd.append(key, typeof value === "string" ? value : JSON.stringify(value));
  });
  return fd;
}
const mrBreadoService = {
  restaurant: async () => {
    const paths = [endpoints.admin.mrBreado.restaurant, "/admin/outlets/primary", "/admin/primary-outlet"];
    for (const url of paths) {
      try {
        const result2 = await request({ url, method: "GET" });
        if (result2) return result2;
      } catch (error) {
        if (error?.status !== 404) throw error;
      }
    }
    const result = await request({ url: "/admin/outlets", method: "GET" });
    const rows = Array.isArray(result) ? result : result?.items ?? result?.outlets ?? [];
    return rows.find((x) => x.primary || x.isPrimary) ?? rows[0] ?? null;
  },
  updateRestaurant: (data) => request({
    url: endpoints.admin.mrBreado.restaurant,
    method: "PUT",
    data: toFormData(data),
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updateRestaurantStatus: (data) => request({ url: endpoints.admin.mrBreado.restaurantStatus, method: "PATCH", data })
};
const $$splitComponentImporter$8 = () => import("./index-Dm3MiVcR.js");
const Route$8 = createFileRoute("/orders/")({
  head: () => ({
    meta: [{
      title: "Orders | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const ACTIVE_STATUSES = /* @__PURE__ */ new Set(["PENDING", "ACCEPTED", "PREPARING", "READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"]);
const FINAL_STATUSES = /* @__PURE__ */ new Set(["DELIVERED", "CANCELLED", "REJECTED"]);
function normalizeStatus(status) {
  return String(status || "").trim().toUpperCase().replaceAll(" ", "_");
}
function isActiveOrder(order) {
  return ACTIVE_STATUSES.has(normalizeStatus(order.status || order.statusLabel));
}
function asNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
function actionStorageKey(orderId, action) {
  return `mrbreado:order-action:${orderId}:${action}`;
}
function getStoredAction(orderId, action) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(actionStorageKey(orderId, action)) === "1";
}
function setStoredAction(orderId, action) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(actionStorageKey(orderId, action), "1");
}
function isActionAlreadyDone(order, action, localDone) {
  if (action === "downloadInvoice") return false;
  const status = normalizeStatus(order.status || order.statusLabel);
  const key = actionStorageKey(order.id, action);
  if (localDone[key] || getStoredAction(order.id, action)) return true;
  if (action === "accept") return status !== "PENDING";
  if (action === "preparing") return ["PREPARING", "READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REJECTED"].includes(status);
  if (action === "ready") return ["READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REJECTED"].includes(status);
  if (action === "reject") return FINAL_STATUSES.has(status);
  if (action === "sendInvoice") return localDone[key] || getStoredAction(order.id, action);
  return false;
}
function OrdersPage({
  filterStatus,
  title = "All Orders",
  activeOnly = false
}) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [localDone, setLocalDone] = useState({});
  const dq = useDebounce(search, 300);
  const {
    data,
    isLoading,
    isFetching,
    error
  } = useOrders({
    page,
    perPage,
    status: activeOnly ? void 0 : filterStatus
  });
  const action = useOrderAction();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const orderDetail = useOrder(selectedOrderId ?? void 0);
  const restaurant = useQuery({
    queryKey: ["mr-breado", "restaurant"],
    queryFn: mrBreadoService.restaurant,
    staleTime: 2e4
  });
  const isRestaurantOpen = !!(restaurant.data?.open ?? restaurant.data?.isOpen ?? restaurant.data?.is_open);
  const toggleRestaurant = useMutation({
    mutationFn: () => mrBreadoService.updateRestaurantStatus({
      open: !isRestaurantOpen,
      isOpen: !isRestaurantOpen,
      is_open: !isRestaurantOpen
    }),
    onSuccess: () => {
      toast.success(!isRestaurantOpen ? "Restaurant opened for orders" : "Restaurant closed for new orders");
      qc.invalidateQueries({
        queryKey: ["mr-breado", "restaurant"]
      });
    },
    onError: () => toast.error("Restaurant status could not be updated. Please try again.")
  });
  const items = useMemo(() => {
    return (data?.items ?? []).filter((o) => !activeOnly || isActiveOrder(o)).filter((o) => {
      if (!dq) return true;
      const q = dq.toLowerCase();
      return o.orderNumber?.toLowerCase().includes(q) || o.customerName?.toLowerCase().includes(q) || o.customerMobile?.includes(q);
    });
  }, [data?.items, activeOnly, dq]);
  const activeCount = (data?.items ?? []).filter(isActiveOrder).length;
  const totalPages = data?.total_pages ?? data?.totalPages ?? 1;
  const markActionDone = (id, actionName) => {
    if (actionName === "downloadInvoice") return;
    setStoredAction(id, actionName);
    setLocalDone((s) => ({
      ...s,
      [actionStorageKey(id, actionName)]: true
    }));
  };
  const runOrderAction = (vars) => {
    action.mutate(vars, {
      onSuccess: () => markActionDone(vars.id, vars.action)
    });
  };
  useEffect(() => {
    if (!orderDetail.data) return;
    qc.invalidateQueries({
      queryKey: orderKeys.list({
        page,
        perPage,
        status: activeOnly ? void 0 : filterStatus
      })
    });
  }, [orderDetail.data?.status]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title, icon: /* @__PURE__ */ jsx(ShoppingBag, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Orders"
    }, ...activeOnly ? [{
      label: "Active"
    }] : filterStatus ? [{
      label: String(filterStatus)
    }] : []] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isRestaurantOpen ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`, children: /* @__PURE__ */ jsx(Store, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: "Mr. Breado order receiving" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Current state: ",
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-foreground", children: isRestaurantOpen ? "Open" : "Closed" }),
            ". Use this to stop or resume new restaurant orders."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => toggleRestaurant.mutate(), disabled: toggleRestaurant.isPending || restaurant.isLoading, className: `inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition disabled:opacity-60 ${isRestaurantOpen ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20" : "border-success/30 bg-success/10 text-success hover:bg-success/20"}`, children: [
        toggleRestaurant.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : isRestaurantOpen ? /* @__PURE__ */ jsx(ToggleRight, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ToggleLeft, { className: "h-4 w-4" }),
        isRestaurantOpen ? "Close Restaurant" : "Open Restaurant"
      ] })
    ] }),
    activeCount > 0 && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-2xl border border-primary/40 bg-primary/10 p-4 shadow-[0_0_35px_rgba(249,115,22,0.20)]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 md:flex-row md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-primary", children: [
          activeCount,
          " active order",
          activeCount > 1 ? "s" : "",
          " need attention"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Current live orders are highlighted below with a glowing border." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow", children: [
        /* @__PURE__ */ jsx(Clock3, { className: "h-4 w-4" }),
        " Active now"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card shadow-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold", children: [
          activeOnly ? items.length : data?.total ?? 0,
          " orders ",
          isFetching && /* @__PURE__ */ jsx(Loader2, { className: "ml-1 inline h-3 w-3 animate-spin" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by order #, name, mobile...", className: "w-64 max-w-full bg-transparent outline-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[1180px] text-sm", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground", children: [
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Order #" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Customer" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Outlet" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Payment" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Total" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Status" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Date" }),
          /* @__PURE__ */ jsx("th", { className: "px-4 py-3 font-medium", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: isLoading ? Array.from({
          length: 6
        }).map((_, i) => /* @__PURE__ */ jsx("tr", { className: "border-b border-border/60", children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-4 py-4", children: /* @__PURE__ */ jsx("div", { className: "h-5 w-full animate-pulse rounded bg-primary/10" }) }) }, i)) : error ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-4 py-16 text-center text-muted-foreground", children: "Orders are temporarily unavailable. Please refresh after a moment." }) }) : items.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "px-4 py-16 text-center text-muted-foreground", children: "No orders found" }) }) : items.map((o) => {
          const total = asNumber(o.grandTotal);
          const createdAt = o.createdAt ? new Date(o.createdAt) : null;
          const dateLabel = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleString() : "—";
          const payment = [o.paymentType, o.paymentStatus].filter(Boolean).join(" · ") || "—";
          const active = isActiveOrder(o);
          return /* @__PURE__ */ jsxs("tr", { className: `border-b border-border/60 transition ${active ? "bg-primary/5 shadow-[inset_4px_0_0_hsl(var(--primary)),0_0_24px_rgba(249,115,22,0.10)]" : "hover:bg-accent/30"}`, children: [
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-4 font-mono text-primary", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold", children: o.orderNumber || `#${o.id}` }),
              active && /* @__PURE__ */ jsx("div", { className: "mt-1 inline-flex rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary", children: "Active" })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-4", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: o.customerName || "Guest" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: o.customerMobile || "—" })
            ] }),
            /* @__PURE__ */ jsxs("td", { className: "px-4 py-4", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold", children: o.outletName || "Mr. Breado Outlet" }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Outlet #",
                o.outletId || "—"
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-xs", children: payment }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4 font-semibold", children: formatCurrency(total) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx(StatusBadge, { status: o.statusLabel || o.status || "PENDING" }) }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-xs text-muted-foreground", children: dateLabel }),
            /* @__PURE__ */ jsx("td", { className: "px-4 py-4", children: /* @__PURE__ */ jsx(OrderActions, { order: o, isPending: action.isPending, localDone, onView: () => setSelectedOrderId(o.id), onAction: runOrderAction }) })
          ] }, o.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsx(Dialog, { open: selectedOrderId != null, onOpenChange: (open) => {
        if (!open) setSelectedOrderId(null);
      }, children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-h-[92vh] max-w-5xl overflow-y-auto p-0", children: [
        /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 border-b border-border bg-card px-6 py-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(DialogTitle, { className: "text-2xl font-bold", children: orderDetail.isLoading ? "Loading Order Details..." : orderDetail.error ? "Order Details" : orderDetail.data?.orderNumber || `Order #${orderDetail.data?.id}` }),
            orderDetail.data && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Placed on ",
              orderDetail.data.createdAt ? new Date(orderDetail.data.createdAt).toLocaleString() : "—"
            ] })
          ] }),
          /* @__PURE__ */ jsx(DialogClose, { className: "rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-accent", children: "Close" })
        ] }) }),
        orderDetail.isLoading ? /* @__PURE__ */ jsx("div", { className: "p-8", children: /* @__PURE__ */ jsx(Loader2, { className: "h-6 w-6 animate-spin" }) }) : orderDetail.error ? /* @__PURE__ */ jsx("div", { className: "p-8 text-muted-foreground", children: "Order details are temporarily unavailable. Please try again." }) : orderDetail.data ? /* @__PURE__ */ jsxs("div", { className: "space-y-6 p-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-4", children: [
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }), title: "Outlet", lines: [orderDetail.data.outletName || "Mr. Breado Outlet", `Outlet #${orderDetail.data.outletId || "—"}`, orderDetail.data.riderName ? `Rider: ${orderDetail.data.riderName}` : ""] }),
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }), title: "Customer", lines: [orderDetail.data.customerName || "Guest", orderDetail.data.customerMobile || "No mobile", orderDetail.data.customerEmail || ""] }),
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(ReceiptText, { className: "h-4 w-4" }), title: "Payment", lines: [[orderDetail.data.paymentType, orderDetail.data.paymentStatus].filter(Boolean).join(" · ") || "—", `Status: ${orderDetail.data.statusLabel || orderDetail.data.status || "—"}`] }),
            /* @__PURE__ */ jsx(InfoCard, { icon: /* @__PURE__ */ jsx(IndianRupee, { className: "h-4 w-4" }), title: "Grand Total", lines: [formatCurrency(orderDetail.data.grandTotal), `Subtotal: ${formatCurrency(orderDetail.data.subtotal)}`], big: true })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-background/30 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-base font-bold", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-primary" }),
              " Delivery Address"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm leading-6 text-muted-foreground", children: orderDetail.data.deliveryAddress || "Address not available from backend response." })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-card", children: [
            /* @__PURE__ */ jsx("div", { className: "border-b border-border p-4", children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: "Order Items" }) }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full min-w-[720px] text-sm", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-background/60 text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-left", children: "Item" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Qty" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Price" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Total" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { children: (orderDetail.data.items ?? []).length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "px-4 py-8 text-center text-muted-foreground", children: "No item details returned by backend." }) }) : (orderDetail.data.items ?? []).map((it, idx) => /* @__PURE__ */ jsxs("tr", { className: "border-t border-border/70", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-4 font-medium", children: it.productName || it.title || it.name || "Food item" }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-4 text-right", children: [
                  "x",
                  it.quantity ?? 1
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-right", children: formatCurrency(it.price) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-4 text-right font-semibold", children: formatCurrency(it.totalPrice ?? asNumber(it.price) * asNumber(it.quantity ?? 1)) })
              ] }, it.id ?? idx)) })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "grid gap-4 lg:grid-cols-[1fr_360px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-background/30 p-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: "Order Notes" }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  "Order type: ",
                  orderDetail.data.orderType || "—"
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  "Estimated delivery: ",
                  orderDetail.data.estimatedDeliveryMinutes ? `${orderDetail.data.estimatedDeliveryMinutes} mins` : "—"
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  "Cancelled at: ",
                  orderDetail.data.cancelledAt || "—"
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  "Delivered at: ",
                  orderDetail.data.deliveredAt || "—"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
                  "Cancellation reason: ",
                  orderDetail.data.cancellationReason || "—"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-base font-bold", children: "Bill Summary" }),
              /* @__PURE__ */ jsx(SummaryRow, { label: "Subtotal", value: orderDetail.data.subtotal }),
              /* @__PURE__ */ jsx(SummaryRow, { label: "Delivery charge", value: orderDetail.data.deliveryCharge }),
              /* @__PURE__ */ jsx(SummaryRow, { label: "Tax", value: orderDetail.data.tax }),
              /* @__PURE__ */ jsx(SummaryRow, { label: "Discount", value: -Math.abs(asNumber(orderDetail.data.discount)) }),
              /* @__PURE__ */ jsx(SummaryRow, { label: "Wallet used", value: -Math.abs(asNumber(orderDetail.data.walletUsed)) }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between border-t border-border pt-3 text-lg font-bold", children: [
                /* @__PURE__ */ jsx("span", { children: "Grand Total" }),
                /* @__PURE__ */ jsx("span", { className: "text-primary", children: formatCurrency(orderDetail.data.grandTotal) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-3 border-t border-border pt-5", children: /* @__PURE__ */ jsx(OrderActions, { order: orderDetail.data, isPending: action.isPending, localDone, onView: () => void 0, onAction: runOrderAction, expanded: true }) })
        ] }) : null
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "Page ",
          data?.page ?? page,
          " of ",
          totalPages
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.max(1, p - 1)), disabled: page === 1 || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setPage((p) => Math.min(totalPages, p + 1)), disabled: page >= totalPages || isFetching, className: "rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
        ] })
      ] })
    ] })
  ] });
}
function OrderActions({
  order,
  isPending,
  localDone,
  onView,
  onAction,
  expanded = false
}) {
  const disabled = (name) => isPending || isActionAlreadyDone(order, name, localDone);
  const reject = () => {
    const reason = window.prompt("Reject reason?") || "";
    if (reason.trim()) onAction({
      id: order.id,
      action: "reject",
      reason
    });
  };
  const cls = expanded ? "flex flex-wrap items-center gap-3" : "flex min-w-[520px] flex-wrap items-center gap-2";
  return /* @__PURE__ */ jsxs("div", { className: cls, children: [
    !expanded && /* @__PURE__ */ jsx(IconAction, { label: "View", icon: /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }), onClick: onView, tone: "info" }),
    /* @__PURE__ */ jsx(IconAction, { label: "Accept", icon: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }), onClick: () => onAction({
      id: order.id,
      action: "accept"
    }), tone: "success", disabled: disabled("accept") }),
    /* @__PURE__ */ jsx(IconAction, { label: "Prep", icon: /* @__PURE__ */ jsx(ChefHat, { className: "h-4 w-4" }), onClick: () => onAction({
      id: order.id,
      action: "preparing"
    }), tone: "warning", disabled: disabled("preparing") }),
    /* @__PURE__ */ jsx(IconAction, { label: "Ready", icon: /* @__PURE__ */ jsx(PackageCheck, { className: "h-4 w-4" }), onClick: () => onAction({
      id: order.id,
      action: "ready"
    }), tone: "primary", disabled: disabled("ready") }),
    /* @__PURE__ */ jsx(IconAction, { label: expanded ? "Download Invoice" : "PDF", icon: /* @__PURE__ */ jsx(FileDown, { className: "h-4 w-4" }), onClick: () => onAction({
      id: order.id,
      action: "downloadInvoice",
      orderNumber: order.orderNumber
    }), disabled: isPending }),
    /* @__PURE__ */ jsx(IconAction, { label: expanded ? "Send Invoice" : "Send", icon: /* @__PURE__ */ jsx(Send, { className: "h-4 w-4" }), onClick: () => onAction({
      id: order.id,
      action: "sendInvoice"
    }), tone: "info", disabled: disabled("sendInvoice") }),
    /* @__PURE__ */ jsx(IconAction, { label: "Reject", icon: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), onClick: reject, tone: "danger", disabled: disabled("reject") })
  ] });
}
function IconAction({
  label,
  icon,
  onClick,
  disabled,
  tone = "neutral"
}) {
  const toneClass = {
    neutral: "border-border bg-background text-foreground hover:bg-accent",
    info: "border-info/30 bg-info/10 text-info hover:bg-info/20",
    success: "border-success/30 bg-success/10 text-success hover:bg-success/20",
    warning: "border-warning/30 bg-warning/10 text-warning hover:bg-warning/20",
    primary: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20",
    danger: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
  }[tone];
  return /* @__PURE__ */ jsxs("button", { onClick, disabled, className: `inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`, title: disabled ? `${label} already completed or not available for this status` : label, children: [
    icon,
    /* @__PURE__ */ jsx("span", { children: label })
  ] });
}
function InfoCard({
  icon,
  title,
  lines,
  big
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-3 flex items-center gap-2 text-sm font-bold text-muted-foreground", children: [
      icon,
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: big ? "text-2xl font-bold text-primary" : "space-y-1 text-sm font-medium", children: lines.filter(Boolean).map((line, i) => /* @__PURE__ */ jsx("div", { children: line }, i)) })
  ] });
}
function SummaryRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-sm", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-semibold", children: formatCurrency(value) })
  ] });
}
const $$splitComponentImporter$7 = () => import("./ready-for-pickup-BodqPXb7.js");
const Route$7 = createFileRoute("/orders/ready-for-pickup")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./preparing-CiXdFTxC.js");
const Route$6 = createFileRoute("/orders/preparing")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./pending-DDc8FCaj.js");
const Route$5 = createFileRoute("/orders/pending")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./delivered-C6xevDv7.js");
const Route$4 = createFileRoute("/orders/delivered")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./cancelled-nQwbg69K.js");
const Route$3 = createFileRoute("/orders/cancelled")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./active-m--y8QpX.js");
const Route$2 = createFileRoute("/orders/active")({
  head: () => ({
    meta: [{
      title: "Active Orders | Go4Food Admin"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./accepted-BZx6oplf.js");
const Route$1 = createFileRoute("/orders/accepted")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./business-outlets._outletId-DuRXarFK.js");
const Route = createFileRoute("/business-outlets/$outletId")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ZonesRoute = Route$F.update({
  id: "/zones",
  path: "/zones",
  getParentRoute: () => Route$G
});
const TicketsRoute = Route$E.update({
  id: "/tickets",
  path: "/tickets",
  getParentRoute: () => Route$G
});
const SupportRoute = Route$D.update({
  id: "/support",
  path: "/support",
  getParentRoute: () => Route$G
});
const SubscriptionsRoute = Route$C.update({
  id: "/subscriptions",
  path: "/subscriptions",
  getParentRoute: () => Route$G
});
const StoriesRoute = Route$B.update({
  id: "/stories",
  path: "/stories",
  getParentRoute: () => Route$G
});
const SettingsRoute = Route$A.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$G
});
const ServiceAreaVerificationsRoute = Route$z.update({
  id: "/service-area-verifications",
  path: "/service-area-verifications",
  getParentRoute: () => Route$G
});
const RolesRoute = Route$y.update({
  id: "/roles",
  path: "/roles",
  getParentRoute: () => Route$G
});
const ReviewsRoute = Route$x.update({
  id: "/reviews",
  path: "/reviews",
  getParentRoute: () => Route$G
});
const RestaurantsRoute = Route$w.update({
  id: "/restaurants",
  path: "/restaurants",
  getParentRoute: () => Route$G
});
const RegisterRoute = Route$v.update({
  id: "/register",
  path: "/register",
  getParentRoute: () => Route$G
});
const PermissionsRoute = Route$u.update({
  id: "/permissions",
  path: "/permissions",
  getParentRoute: () => Route$G
});
const PayoutsRoute = Route$t.update({
  id: "/payouts",
  path: "/payouts",
  getParentRoute: () => Route$G
});
const OwnersRoute = Route$s.update({
  id: "/owners",
  path: "/owners",
  getParentRoute: () => Route$G
});
const OperationsRoute = Route$r.update({
  id: "/operations",
  path: "/operations",
  getParentRoute: () => Route$G
});
const OnlineTransactionsRoute = Route$q.update({
  id: "/online-transactions",
  path: "/online-transactions",
  getParentRoute: () => Route$G
});
const OffersRoute = Route$p.update({
  id: "/offers",
  path: "/offers",
  getParentRoute: () => Route$G
});
const NotificationsRoute = Route$o.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => Route$G
});
const MrBreadoRestaurantRoute = Route$n.update({
  id: "/mr-breado-restaurant",
  path: "/mr-breado-restaurant",
  getParentRoute: () => Route$G
});
const LoginRoute = Route$m.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$G
});
const FranchiseRoute = Route$l.update({
  id: "/franchise",
  path: "/franchise",
  getParentRoute: () => Route$G
});
const FoodsRoute = Route$k.update({
  id: "/foods",
  path: "/foods",
  getParentRoute: () => Route$G
});
const DeliveryBoysRoute = Route$j.update({
  id: "/delivery-boys",
  path: "/delivery-boys",
  getParentRoute: () => Route$G
});
const CustomersRoute = Route$i.update({
  id: "/customers",
  path: "/customers",
  getParentRoute: () => Route$G
});
const CustomerMessagesRoute = Route$h.update({
  id: "/customer-messages",
  path: "/customer-messages",
  getParentRoute: () => Route$G
});
const CuisineRoute = Route$g.update({
  id: "/cuisine",
  path: "/cuisine",
  getParentRoute: () => Route$G
});
const CouponsRoute = Route$f.update({
  id: "/coupons",
  path: "/coupons",
  getParentRoute: () => Route$G
});
const CategoriesRoute = Route$e.update({
  id: "/categories",
  path: "/categories",
  getParentRoute: () => Route$G
});
const BusinessOutletsRoute = Route$d.update({
  id: "/business-outlets",
  path: "/business-outlets",
  getParentRoute: () => Route$G
});
const BannersRoute = Route$c.update({
  id: "/banners",
  path: "/banners",
  getParentRoute: () => Route$G
});
const AdminProfileRoute = Route$b.update({
  id: "/admin-profile",
  path: "/admin-profile",
  getParentRoute: () => Route$G
});
const AdminFoodsRoute = Route$a.update({
  id: "/admin-foods",
  path: "/admin-foods",
  getParentRoute: () => Route$G
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$G
});
const OrdersIndexRoute = Route$8.update({
  id: "/orders/",
  path: "/orders/",
  getParentRoute: () => Route$G
});
const OrdersReadyForPickupRoute = Route$7.update({
  id: "/orders/ready-for-pickup",
  path: "/orders/ready-for-pickup",
  getParentRoute: () => Route$G
});
const OrdersPreparingRoute = Route$6.update({
  id: "/orders/preparing",
  path: "/orders/preparing",
  getParentRoute: () => Route$G
});
const OrdersPendingRoute = Route$5.update({
  id: "/orders/pending",
  path: "/orders/pending",
  getParentRoute: () => Route$G
});
const OrdersDeliveredRoute = Route$4.update({
  id: "/orders/delivered",
  path: "/orders/delivered",
  getParentRoute: () => Route$G
});
const OrdersCancelledRoute = Route$3.update({
  id: "/orders/cancelled",
  path: "/orders/cancelled",
  getParentRoute: () => Route$G
});
const OrdersActiveRoute = Route$2.update({
  id: "/orders/active",
  path: "/orders/active",
  getParentRoute: () => Route$G
});
const OrdersAcceptedRoute = Route$1.update({
  id: "/orders/accepted",
  path: "/orders/accepted",
  getParentRoute: () => Route$G
});
const BusinessOutletsOutletIdRoute = Route.update({
  id: "/$outletId",
  path: "/$outletId",
  getParentRoute: () => BusinessOutletsRoute
});
const BusinessOutletsRouteChildren = {
  BusinessOutletsOutletIdRoute
};
const BusinessOutletsRouteWithChildren = BusinessOutletsRoute._addFileChildren(
  BusinessOutletsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AdminFoodsRoute,
  AdminProfileRoute,
  BannersRoute,
  BusinessOutletsRoute: BusinessOutletsRouteWithChildren,
  CategoriesRoute,
  CouponsRoute,
  CuisineRoute,
  CustomerMessagesRoute,
  CustomersRoute,
  DeliveryBoysRoute,
  FoodsRoute,
  FranchiseRoute,
  LoginRoute,
  MrBreadoRestaurantRoute,
  NotificationsRoute,
  OffersRoute,
  OnlineTransactionsRoute,
  OperationsRoute,
  OwnersRoute,
  PayoutsRoute,
  PermissionsRoute,
  RegisterRoute,
  RestaurantsRoute,
  ReviewsRoute,
  RolesRoute,
  ServiceAreaVerificationsRoute,
  SettingsRoute,
  StoriesRoute,
  SubscriptionsRoute,
  SupportRoute,
  TicketsRoute,
  ZonesRoute,
  OrdersAcceptedRoute,
  OrdersActiveRoute,
  OrdersCancelledRoute,
  OrdersDeliveredRoute,
  OrdersPendingRoute,
  OrdersPreparingRoute,
  OrdersReadyForPickupRoute,
  OrdersIndexRoute
};
const routeTree = Route$G._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ADMIN_LOGO_URL as A,
  Button as B,
  Card as C,
  Dialog as D,
  Badge as E,
  FoodsPage as F,
  useOrders as G,
  useOrderAction as H,
  Input as I,
  useOrder as J,
  orderKeys as K,
  Label as L,
  formatCurrency as M,
  DialogClose as N,
  OutletCommandCenterPage as O,
  PageHeader as P,
  OrdersPage as Q,
  Route as R,
  StatusBadge as S,
  router as T,
  api as a,
  authStore as b,
  cn as c,
  downloadBlob as d,
  endpoints as e,
  authService as f,
  API_BASE_URL as g,
  useDeleteProduct as h,
  useToggleProductAvailability as i,
  useCreateProduct as j,
  useUpdateProduct as k,
  DialogContent as l,
  mrBreadoService as m,
  DialogHeader as n,
  DialogTitle as o,
  productsService as p,
  DialogDescription as q,
  request as r,
  saveBlob as s,
  useDebounce as t,
  useProducts as u,
  businessOutletsService as v,
  DialogTrigger as w,
  CardContent as x,
  CardHeader as y,
  CardTitle as z
};
