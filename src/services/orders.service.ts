import { downloadBlob, request, saveBlob } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  PageResponse,
  SellerOrderDetailResponse,
  SellerOrderResponse,
} from "@/types";

export interface OrdersQuery {
  page?: number;
  perPage?: number;
  status?: string;
}

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function firstValue<T = unknown>(obj: any, keys: string[], fallback?: T): T {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") return value as T;
  }
  return fallback as T;
}

function normalizeOrder(raw: any): SellerOrderResponse {
  const customer = raw?.customer ?? raw?.user ?? raw?.customerDetails ?? {};
  const address = raw?.address ?? raw?.deliveryAddressDetails ?? raw?.delivery_address_details ?? {};
  const restaurant = raw?.restaurant ?? {};

  const customerName = firstValue<string>(raw, ["customerName", "customer_name", "userName", "user_name"], undefined)
    ?? firstValue<string>(customer, ["name", "fullName", "full_name"], "Guest");

  const customerMobile = firstValue<string>(raw, ["customerMobile", "customer_mobile", "mobile", "phone", "phoneNumber", "phone_number"], undefined)
    ?? firstValue<string>(customer, ["mobile", "phone", "phoneNumber", "phone_number"], "");

  const customerEmail = firstValue<string>(raw, ["customerEmail", "customer_email", "email"], undefined)
    ?? firstValue<string>(customer, ["email"], "");

  const deliveryAddress = firstValue<string>(raw, ["deliveryAddress", "delivery_address", "addressText", "address_text"], undefined)
    ?? [address?.line1, address?.street, address?.area, address?.city, address?.state, address?.pincode].filter(Boolean).join(", ");

  const items = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.orderItems)
      ? raw.orderItems
      : Array.isArray(raw?.order_items)
        ? raw.order_items
        : [];

  return {
    ...(raw as SellerOrderResponse),
    id: String(firstValue(raw, ["id", "_id", "orderId", "order_id"], "")) as any,
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
    outletId: orderRef({ id: firstValue(raw, ["outletId", "outlet_id", "restaurantId", "restaurant_id"], "") }) as any,
    outletName: String(firstValue(raw, ["outletName", "outlet_name", "restaurantName", "restaurant_name"], firstValue(restaurant, ["name", "outletName"], "Mr. Breado Outlet"))),
    riderName: String(firstValue(raw, ["riderName", "rider_name", "deliveryBoyName", "delivery_boy_name"], "")),
    items: items.map((it: any, idx: number) => ({
      ...it,
      id: String(firstValue(it, ["id", "_id"], idx)) as any,
      productId: String(firstValue(it, ["productId", "product_id"], "")) as any,
      productName: String(firstValue(it, ["productName", "product_name", "name", "title"], "Food item")),
      quantity: toNumber(firstValue(it, ["quantity", "qty"], 1), 1),
      price: toNumber(firstValue(it, ["price", "unitPrice", "unit_price"], 0)),
      totalPrice: toNumber(firstValue(it, ["totalPrice", "total_price", "total"], toNumber(it?.price) * toNumber(it?.quantity ?? 1))),
    })),
  };
}

function normalizePage(payload: any, q: OrdersQuery): PageResponse<SellerOrderResponse> {
  payload = payload?.data ?? payload;
  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.content)
        ? payload.content
        : Array.isArray(payload?.orders)
          ? payload.orders
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

  const page = toNumber(firstValue(payload, ["page", "currentPage", "current_page"], q.page ?? 1), q.page ?? 1);
  const fallbackPerPage = q.perPage ?? (rawItems.length || 20);
  const perPage = toNumber(
    firstValue(payload, ["perPage", "per_page", "size", "limit"], fallbackPerPage),
    q.perPage ?? 20,
  );
  const total = toNumber(firstValue(payload, ["total", "totalElements", "total_elements", "totalItems", "total_items"], rawItems.length), rawItems.length);
  const totalPages = toNumber(firstValue(payload, ["totalPages", "total_pages", "pages"], Math.max(1, Math.ceil(total / Math.max(1, perPage)))), 1);

  return {
    items: rawItems.map(normalizeOrder),
    page,
    per_page: perPage,
    total,
    total_pages: totalPages,
    last: page >= totalPages,
  };
}

async function tryRequest<T>(url: string, method: "GET" | "POST" = "GET", data?: unknown, params?: unknown): Promise<T> {
  return request<T>({ url, method, data, params });
}


function orderRef(raw: any): string {
  const value = firstValue(raw, ["_id", "mongoId", "id", "orderId", "order_id", "orderNumber", "order_number", "slug"], "");
  if (value && typeof value === "object") {
    return String(firstValue(value, ["_id", "id", "mongoId"], ""));
  }
  return String(value ?? "");
}

async function actionWithFallback<T = any>(configs: Array<Record<string, any>>): Promise<T> {
  let last: any;
  for (const config of configs) {
    try { return await request<T>(config); }
    catch (error: any) {
      last = error;
      if (![404, 405].includes(Number(error?.status))) throw error;
    }
  }
  throw last ?? Object.assign(new Error("No compatible backend route was found"), { status: 404 });
}

async function blobWithFallback(configs: Array<Record<string, any>>): Promise<Blob> {
  let last: any;
  for (const config of configs) {
    try { return await downloadBlob(config); }
    catch (error: any) {
      last = error;
      if (![404, 405, 409, 422].includes(Number(error?.status))) throw error;
    }
  }
  throw last ?? Object.assign(new Error("Invoice or receipt is not available"), { status: 404 });
}

export const ordersService = {
  list: async (params: OrdersQuery = {}) => {
    const q = { page: params.page ?? 1, perPage: params.perPage ?? 20, status: params.status || undefined };
    try {
      const primary = await tryRequest<any>(endpoints.admin.mrBreado.orders, "GET", undefined, q);
      return normalizePage(primary, q);
    } catch (primaryError) {
      const fallback = await tryRequest<any>(endpoints.admin.orders, "GET", undefined, q);
      return normalizePage(fallback, q);
    }
  },
  detail: async (id: number | string) => {
    try {
      const primary = await tryRequest<any>(endpoints.admin.mrBreado.orderById(id));
      return normalizeOrder(primary?.order ?? primary?.data ?? primary) as SellerOrderDetailResponse;
    } catch (primaryError) {
      const fallback = await tryRequest<any>(endpoints.admin.orderById(id));
      return normalizeOrder(fallback?.order ?? fallback?.data ?? fallback) as SellerOrderDetailResponse;
    }
  },
  accept: (id: number | string) => actionWithFallback<SellerOrderDetailResponse>([
    { url: endpoints.admin.mrBreado.accept(id), method: "POST" },
    { url: `/admin/orders/${id}/accept`, method: "POST" },
    { url: `/admin/orders/${id}/status`, method: "PUT", data: { status: "ACCEPTED" } },
  ]),
  preparing: (id: number | string) => actionWithFallback<SellerOrderDetailResponse>([
    { url: endpoints.admin.mrBreado.preparing(id), method: "POST" },
    { url: `/admin/orders/${id}/preparing`, method: "POST" },
    { url: `/admin/orders/${id}/prep`, method: "POST" },
    { url: `/admin/orders/${id}/status`, method: "PUT", data: { status: "PREPARING" } },
  ]),
  ready: (id: number | string) => actionWithFallback<SellerOrderDetailResponse>([
    { url: endpoints.admin.mrBreado.ready(id), method: "POST" },
    { url: `/admin/orders/${id}/ready`, method: "POST" },
    { url: `/admin/orders/${id}/status`, method: "PUT", data: { status: "READY" } },
  ]),
  cancel: (id: number | string) => actionWithFallback<SellerOrderDetailResponse>([
    { url: endpoints.admin.mrBreado.cancel(id), method: "POST", data: {} },
    { url: `/admin/orders/${id}/cancel`, method: "POST", data: {} },
    { url: `/admin/orders/${id}/status`, method: "PUT", data: { status: "CANCELLED" } },
  ]),
  reject: (id: number | string, reason: string) => actionWithFallback<SellerOrderDetailResponse>([
    { url: endpoints.admin.mrBreado.reject(id), method: "POST", data: { reason } },
    { url: `/admin/orders/${id}/reject`, method: "POST", data: { reason } },
    { url: `/admin/orders/${id}/status`, method: "PUT", data: { status: "REJECTED", reason } },
  ]),
  downloadInvoice: async (id: number | string, orderNumber?: string) => {
    const blob = await blobWithFallback([
      { url: endpoints.admin.mrBreado.invoicePdf(id), method: "GET" },
      { url: `/admin/orders/${id}/invoice.pdf`, method: "GET" },
      { url: `/admin/orders/${id}/invoice`, method: "GET" },
      { url: `/admin/orders/${id}/receipt.pdf`, method: "GET" },
      { url: `/admin/orders/${id}/receipt`, method: "GET" },
    ]);
    const clean = String(orderNumber || id).replace(/[^a-zA-Z0-9_-]/g, "_");
    saveBlob(blob, `${clean}_invoice_or_receipt.pdf`);
  },
  sendInvoice: (id: number | string) => actionWithFallback<void>([
    { url: endpoints.admin.mrBreado.sendInvoice(id), method: "POST" },
    { url: `/admin/orders/${id}/invoice/send-to-customer`, method: "POST" },
    { url: `/admin/orders/${id}/send-invoice`, method: "POST" },
  ]),
};
