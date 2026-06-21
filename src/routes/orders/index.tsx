import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Eye,
  Check,
  ChefHat,
  PackageCheck,
  X,
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileDown,
  Send,
  MapPin,
  Phone,
  ReceiptText,
  IndianRupee,
  Clock3,
  Store,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { useOrder, useOrders, orderKeys } from "@/hooks/queries/use-orders";
import { useOrderAction } from "@/hooks/mutations/use-order-actions";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency } from "@/lib/currency";
import { mrBreadoService } from "@/services/mr-breado.service";
import { toast } from "sonner";
import type { OrderStatus, SellerOrderResponse } from "@/types";

export const Route = createFileRoute("/orders/")({
  head: () => ({ meta: [{ title: "Orders | Mr. Breado Admin" }] }),
  component: () => <OrdersPage />,
});

const ACTIVE_STATUSES = new Set(["PENDING", "ACCEPTED", "PREPARING", "READY", "READY_FOR_PICKUP", "OUT_FOR_DELIVERY"]);
const FINAL_STATUSES = new Set(["DELIVERED", "CANCELLED", "REJECTED"]);

type OrderActionName = "accept" | "preparing" | "ready" | "reject" | "sendInvoice" | "downloadInvoice";

function normalizeStatus(status?: string) {
  return String(status || "").trim().toUpperCase().replaceAll(" ", "_");
}

function isActiveOrder(order: SellerOrderResponse) {
  return ACTIVE_STATUSES.has(normalizeStatus(order.status || order.statusLabel));
}

function asNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function actionStorageKey(orderId: number | string, action: OrderActionName) {
  return `mrbreado:order-action:${orderId}:${action}`;
}

function getStoredAction(orderId: number | string, action: OrderActionName) {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(actionStorageKey(orderId, action)) === "1";
}

function setStoredAction(orderId: number | string, action: OrderActionName) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(actionStorageKey(orderId, action), "1");
}

function isActionAlreadyDone(order: SellerOrderResponse, action: OrderActionName, localDone: Record<string, boolean>) {
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

export function OrdersPage({
  filterStatus,
  title = "All Orders",
  activeOnly = false,
}: {
  filterStatus?: OrderStatus | string;
  title?: string;
  activeOnly?: boolean;
}) {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [localDone, setLocalDone] = useState<Record<string, boolean>>({});
  const dq = useDebounce(search, 300);

  const { data, isLoading, isFetching, error } = useOrders({ page, perPage, status: activeOnly ? undefined : filterStatus });
  const action = useOrderAction();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const orderDetail = useOrder(selectedOrderId ?? undefined);

  const restaurant = useQuery({ queryKey: ["mr-breado", "restaurant"], queryFn: mrBreadoService.restaurant, staleTime: 20_000 });
  const isRestaurantOpen = !!(restaurant.data?.open ?? restaurant.data?.isOpen ?? restaurant.data?.is_open);
  const toggleRestaurant = useMutation({
    mutationFn: () => mrBreadoService.updateRestaurantStatus({ open: !isRestaurantOpen, isOpen: !isRestaurantOpen, is_open: !isRestaurantOpen }),
    onSuccess: () => {
      toast.success(!isRestaurantOpen ? "Restaurant opened for orders" : "Restaurant closed for new orders");
      qc.invalidateQueries({ queryKey: ["mr-breado", "restaurant"] });
    },
    onError: () => toast.error("Restaurant status could not be updated. Please try again."),
  });

  const items: SellerOrderResponse[] = useMemo(() => {
    return (data?.items ?? [])
      .filter((o) => !activeOnly || isActiveOrder(o))
      .filter((o) => {
        if (!dq) return true;
        const q = dq.toLowerCase();
        return (
          o.orderNumber?.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.customerMobile?.includes(q)
        );
      });
  }, [data?.items, activeOnly, dq]);

  const activeCount = (data?.items ?? []).filter(isActiveOrder).length;
  const totalPages = data?.total_pages ?? data?.totalPages ?? 1;

  const markActionDone = (id: number | string, actionName: OrderActionName) => {
    if (actionName === "downloadInvoice") return;
    setStoredAction(id, actionName);
    setLocalDone((s) => ({ ...s, [actionStorageKey(id, actionName)]: true }));
  };

  const runOrderAction = (vars: { id: number | string; action: OrderActionName; reason?: string; orderNumber?: string }) => {
    action.mutate(vars, {
      onSuccess: () => markActionDone(vars.id, vars.action),
    });
  };

  useEffect(() => {
    if (!orderDetail.data) return;
    qc.invalidateQueries({ queryKey: orderKeys.list({ page, perPage, status: activeOnly ? undefined : filterStatus }) });
  }, [orderDetail.data?.status]);

  return (
    <>
      <PageHeader
        title={title}
        icon={<ShoppingBag className="h-5 w-5" />}
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Orders" },
          ...(activeOnly ? [{ label: "Active" }] : filterStatus ? [{ label: String(filterStatus) }] : []),
        ]}
      />

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isRestaurantOpen ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">Mr. Breado order receiving</h3>
            <p className="text-sm text-muted-foreground">Current state: <span className="font-semibold text-foreground">{isRestaurantOpen ? "Open" : "Closed"}</span>. Use this to stop or resume new restaurant orders.</p>
          </div>
        </div>
        <button
          onClick={() => toggleRestaurant.mutate()}
          disabled={toggleRestaurant.isPending || restaurant.isLoading}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition disabled:opacity-60 ${isRestaurantOpen ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20" : "border-success/30 bg-success/10 text-success hover:bg-success/20"}`}
        >
          {toggleRestaurant.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : isRestaurantOpen ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
          {isRestaurantOpen ? "Close Restaurant" : "Open Restaurant"}
        </button>
      </div>

      {activeCount > 0 && (
        <div className="mb-4 rounded-2xl border border-primary/40 bg-primary/10 p-4 shadow-[0_0_35px_rgba(249,115,22,0.20)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-bold text-primary">{activeCount} active order{activeCount > 1 ? "s" : ""} need attention</h3>
              <p className="text-sm text-muted-foreground">Current live orders are highlighted below with a glowing border.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow">
              <Clock3 className="h-4 w-4" /> Active now
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base font-semibold">
              {activeOnly ? items.length : data?.total ?? 0} orders {isFetching && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, name, mobile..."
              className="w-64 max-w-full bg-transparent outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Outlet</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/60">
                    <td colSpan={8} className="px-4 py-4"><div className="h-5 w-full animate-pulse rounded bg-primary/10" /></td>
                  </tr>
                ))
              ) : error ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">Orders are temporarily unavailable. Please refresh after a moment.</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">No orders found</td></tr>
              ) : (
                items.map((o) => {
                  const total = asNumber(o.grandTotal);
                  const createdAt = o.createdAt ? new Date(o.createdAt) : null;
                  const dateLabel = createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt.toLocaleString() : "—";
                  const payment = [o.paymentType, o.paymentStatus].filter(Boolean).join(" · ") || "—";
                  const active = isActiveOrder(o);
                  return (
                    <tr key={o.id} className={`border-b border-border/60 transition ${active ? "bg-primary/5 shadow-[inset_4px_0_0_hsl(var(--primary)),0_0_24px_rgba(249,115,22,0.10)]" : "hover:bg-accent/30"}`}>
                      <td className="px-4 py-4 font-mono text-primary"><div className="font-semibold">{o.orderNumber || `#${o.id}`}</div>{active && <div className="mt-1 inline-flex rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">Active</div>}</td>
                      <td className="px-4 py-4"><div className="font-medium">{o.customerName || "Guest"}</div><div className="text-xs text-muted-foreground">{o.customerMobile || "—"}</div></td>
                      <td className="px-4 py-4"><div className="font-semibold">{(o as any).outletName || "Mr. Breado Outlet"}</div><div className="text-xs text-muted-foreground">Outlet #{(o as any).outletId || "—"}</div></td>
                      <td className="px-4 py-4 text-xs">{payment}</td>
                      <td className="px-4 py-4 font-semibold">{formatCurrency(total)}</td>
                      <td className="px-4 py-4"><StatusBadge status={o.statusLabel || o.status || "PENDING"} /></td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">{dateLabel}</td>
                      <td className="px-4 py-4"><OrderActions order={o} isPending={action.isPending} localDone={localDone} onView={() => setSelectedOrderId(o.id)} onAction={runOrderAction} /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={selectedOrderId != null} onOpenChange={(open) => { if (!open) setSelectedOrderId(null); }}>
          <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-0">
            <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl font-bold">{orderDetail.isLoading ? "Loading Order Details..." : orderDetail.error ? "Order Details" : orderDetail.data?.orderNumber || `Order #${orderDetail.data?.id}`}</DialogTitle>
                  {orderDetail.data && <p className="mt-1 text-sm text-muted-foreground">Placed on {orderDetail.data.createdAt ? new Date(orderDetail.data.createdAt).toLocaleString() : "—"}</p>}
                </div>
                <DialogClose className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">Close</DialogClose>
              </div>
            </div>

            {orderDetail.isLoading ? (
              <div className="p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
            ) : orderDetail.error ? (
              <div className="p-8 text-muted-foreground">Order details are temporarily unavailable. Please try again.</div>
            ) : orderDetail.data ? (
              <div className="space-y-6 p-6">
                <div className="grid gap-4 lg:grid-cols-4">
                  <InfoCard icon={<Store className="h-4 w-4" />} title="Outlet" lines={[(orderDetail.data as any).outletName || "Mr. Breado Outlet", `Outlet #${(orderDetail.data as any).outletId || "—"}`, (orderDetail.data as any).riderName ? `Rider: ${(orderDetail.data as any).riderName}` : ""]} />
                  <InfoCard icon={<Phone className="h-4 w-4" />} title="Customer" lines={[orderDetail.data.customerName || "Guest", orderDetail.data.customerMobile || "No mobile", orderDetail.data.customerEmail || ""]} />
                  <InfoCard icon={<ReceiptText className="h-4 w-4" />} title="Payment" lines={[[orderDetail.data.paymentType, orderDetail.data.paymentStatus].filter(Boolean).join(" · ") || "—", `Status: ${orderDetail.data.statusLabel || orderDetail.data.status || "—"}`]} />
                  <InfoCard icon={<IndianRupee className="h-4 w-4" />} title="Grand Total" lines={[formatCurrency(orderDetail.data.grandTotal), `Subtotal: ${formatCurrency(orderDetail.data.subtotal)}`]} big />
                </div>

                <section className="rounded-2xl border border-border bg-background/30 p-4">
                  <div className="mb-3 flex items-center gap-2 text-base font-bold"><MapPin className="h-4 w-4 text-primary" /> Delivery Address</div>
                  <p className="text-sm leading-6 text-muted-foreground">{orderDetail.data.deliveryAddress || "Address not available from backend response."}</p>
                </section>

                <section className="rounded-2xl border border-border bg-card">
                  <div className="border-b border-border p-4"><h3 className="text-lg font-bold">Order Items</h3></div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                      <thead className="bg-background/60 text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Item</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
                      <tbody>
                        {(orderDetail.data.items ?? []).length === 0 ? <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No item details returned by backend.</td></tr> : (orderDetail.data.items ?? []).map((it: any, idx: number) => (
                          <tr key={it.id ?? idx} className="border-t border-border/70"><td className="px-4 py-4 font-medium">{it.productName || it.title || it.name || "Food item"}</td><td className="px-4 py-4 text-right">x{it.quantity ?? 1}</td><td className="px-4 py-4 text-right">{formatCurrency(it.price)}</td><td className="px-4 py-4 text-right font-semibold">{formatCurrency(it.totalPrice ?? asNumber(it.price) * asNumber(it.quantity ?? 1))}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
                  <div className="rounded-2xl border border-border bg-background/30 p-4">
                    <h3 className="text-base font-bold">Order Notes</h3>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-2"><div>Order type: {orderDetail.data.orderType || "—"}</div><div>Estimated delivery: {orderDetail.data.estimatedDeliveryMinutes ? `${orderDetail.data.estimatedDeliveryMinutes} mins` : "—"}</div><div>Cancelled at: {orderDetail.data.cancelledAt || "—"}</div><div>Delivered at: {orderDetail.data.deliveredAt || "—"}</div><div className="md:col-span-2">Cancellation reason: {orderDetail.data.cancellationReason || "—"}</div></div>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <h3 className="text-base font-bold">Bill Summary</h3>
                    <SummaryRow label="Subtotal" value={orderDetail.data.subtotal} />
                    <SummaryRow label="Delivery charge" value={orderDetail.data.deliveryCharge} />
                    <SummaryRow label="Tax" value={orderDetail.data.tax} />
                    <SummaryRow label="Discount" value={-Math.abs(asNumber(orderDetail.data.discount))} />
                    <SummaryRow label="Wallet used" value={-Math.abs(asNumber(orderDetail.data.walletUsed))} />
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-lg font-bold"><span>Grand Total</span><span className="text-primary">{formatCurrency(orderDetail.data.grandTotal)}</span></div>
                  </div>
                </section>

                <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                  <OrderActions order={orderDetail.data} isPending={action.isPending} localDone={localDone} onView={() => undefined} onAction={runOrderAction} expanded />
                </div>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
          <div>Page {data?.page ?? page} of {totalPages}</div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isFetching} className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || isFetching} className="rounded-md border border-border p-1.5 hover:bg-accent disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </>
  );
}

function OrderActions({ order, isPending, localDone, onView, onAction, expanded = false }: { order: SellerOrderResponse; isPending: boolean; localDone: Record<string, boolean>; onView: () => void; onAction: (vars: { id: number | string; action: OrderActionName; reason?: string; orderNumber?: string }) => void; expanded?: boolean }) {
  const disabled = (name: OrderActionName) => isPending || isActionAlreadyDone(order, name, localDone);
  const reject = () => {
    const reason = window.prompt("Reject reason?") || "";
    if (reason.trim()) onAction({ id: order.id, action: "reject", reason });
  };
  const cls = expanded ? "flex flex-wrap items-center gap-3" : "flex min-w-[520px] flex-wrap items-center gap-2";
  return <div className={cls}>
    {!expanded && <IconAction label="View" icon={<Eye className="h-4 w-4" />} onClick={onView} tone="info" />}
    <IconAction label="Accept" icon={<Check className="h-4 w-4" />} onClick={() => onAction({ id: order.id, action: "accept" })} tone="success" disabled={disabled("accept")} />
    <IconAction label="Prep" icon={<ChefHat className="h-4 w-4" />} onClick={() => onAction({ id: order.id, action: "preparing" })} tone="warning" disabled={disabled("preparing")} />
    <IconAction label="Ready" icon={<PackageCheck className="h-4 w-4" />} onClick={() => onAction({ id: order.id, action: "ready" })} tone="primary" disabled={disabled("ready")} />
    <IconAction label={expanded ? "Download Invoice" : "PDF"} icon={<FileDown className="h-4 w-4" />} onClick={() => onAction({ id: order.id, action: "downloadInvoice", orderNumber: order.orderNumber })} disabled={isPending} />
    <IconAction label={expanded ? "Send Invoice" : "Send"} icon={<Send className="h-4 w-4" />} onClick={() => onAction({ id: order.id, action: "sendInvoice" })} tone="info" disabled={disabled("sendInvoice")} />
    <IconAction label="Reject" icon={<X className="h-4 w-4" />} onClick={reject} tone="danger" disabled={disabled("reject")} />
  </div>;
}

function IconAction({ label, icon, onClick, disabled, tone = "neutral" }: { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean; tone?: "neutral" | "info" | "success" | "warning" | "primary" | "danger" }) {
  const toneClass = { neutral: "border-border bg-background text-foreground hover:bg-accent", info: "border-info/30 bg-info/10 text-info hover:bg-info/20", success: "border-success/30 bg-success/10 text-success hover:bg-success/20", warning: "border-warning/30 bg-warning/10 text-warning hover:bg-warning/20", primary: "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20", danger: "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20" }[tone];
  return <button onClick={onClick} disabled={disabled} className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`} title={disabled ? `${label} already completed or not available for this status` : label}>{icon}<span>{label}</span></button>;
}

function InfoCard({ icon, title, lines, big }: { icon: ReactNode; title: string; lines: string[]; big?: boolean }) {
  return <div className="rounded-2xl border border-border bg-card p-4"><div className="mb-3 flex items-center gap-2 text-sm font-bold text-muted-foreground">{icon}{title}</div><div className={big ? "text-2xl font-bold text-primary" : "space-y-1 text-sm font-medium"}>{lines.filter(Boolean).map((line, i) => <div key={i}>{line}</div>)}</div></div>;
}

function SummaryRow({ label, value }: { label: string; value: unknown }) {
  return <div className="mt-3 flex items-center justify-between text-sm"><span className="text-muted-foreground">{label}</span><span className="font-semibold">{formatCurrency(value)}</span></div>;
}
