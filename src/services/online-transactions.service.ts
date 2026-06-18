import { downloadBlob, request, saveBlob } from '@/api/client';

export type OnlineTransaction = {
  id: number | string;
  orderId?: string | number;
  orderNumber?: string;
  customerId?: string | number;
  customerName?: string;
  sellerId?: string | number;
  sellerName?: string;
  restaurantId?: string | number;
  restaurantName?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  paidAt?: string;
  createdAt?: string;
};

function normalizeList(data: any): OnlineTransaction[] {
  const raw = Array.isArray(data) ? data : data?.items ?? data?.content ?? data?.transactions ?? data?.records ?? [];
  return Array.isArray(raw) ? raw : [];
}

export const onlineTransactionsService = {
  async list() { return normalizeList(await request<any>({ url: '/admin/online-transactions', method: 'GET' })); },
  async detail(id: number | string) { return request<OnlineTransaction>({ url: `/admin/online-transactions/${id}`, method: 'GET' }); },
  async downloadReceipt(id: number | string) {
    const blob = await downloadBlob({ url: `/admin/online-transactions/${id}/receipt.pdf`, method: 'GET' });
    saveBlob(blob, `mr_breado_receipt_${id}.pdf`);
  },
};
