import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  FileText,
  IndianRupee,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Paperclip,
  RefreshCw,
  Send,
  ShoppingBag,
  Store,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useUsers, userKeys } from "@/hooks/queries/use-users";
import { usersService } from "@/services/users.service";
import {
  customerEngagementService,
  type CustomerDetailsResponse,
  type EmailCategory,
} from "@/services/customer-engagement.service";
import type { AdminUserResponse } from "@/types";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers | Mr. Breado Admin" }] }),
  component: CustomersPage,
});

function haptic(pattern: number | number[] = 18) {
  try { navigator.vibrate?.(pattern); } catch { /* unsupported browser */ }
}

function money(value: unknown) {
  return `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function customerId(row: any): string | number {
  return row?.mongoId || row?.id || "";
}

function CustomersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminUserResponse | null>(null);
  const { search, setSearch, debounced } = useTableSearch();
  const query = { page, perPage: 20, role: "CUSTOMER", search: debounced };
  const { data, isLoading, isFetching, error } = useUsers(query);

  const columns: ServerColumn<AdminUserResponse>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (row) => <div className="flex items-center gap-3">
        {row.profileImage
          ? <img src={row.profileImage} alt={row.name || "Customer"} className="h-11 w-11 rounded-2xl border border-border object-cover" />
          : <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 font-black text-white shadow-sm">{(row.name || "?").split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>}
        <div className="min-w-0">
          <div className="max-w-[220px] truncate font-bold">{row.name || "Unnamed customer"}</div>
          <div className="max-w-[220px] truncate text-xs text-muted-foreground">{row.email || row.mobile || `#${row.id}`}</div>
        </div>
      </div>,
    },
    { key: "phone", header: "Phone", render: (row) => row.mobile || "—" },
    { key: "orders", header: "Orders", render: (row) => <span className="font-bold">{Number(row.totalOrders || 0)}</span> },
    { key: "spending", header: "Total spending", render: (row) => <span className="font-black text-emerald-600">{money((row as any).totalSpending)}</span> },
    { key: "wallet", header: "Wallet", render: (row) => money(row.walletBalance) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={(row as any).deleted ? "Deleted" : row.blocked ? "Blocked" : row.enabled ? "Active" : "Inactive"} /> },
    {
      key: "action",
      header: "Action",
      render: (row) => <button
        type="button"
        onClick={() => { haptic(); setSelected(row); }}
        className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-xs font-black text-primary transition hover:-translate-y-0.5 hover:bg-primary/10"
      ><UserRound className="h-4 w-4" />Full details</button>,
    },
  ];

  return <>
    <PageHeader
      title="Customers"
      icon={<Users className="h-5 w-5" />}
      breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Customers" }]}
    />
    <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Registered customers" value={String(data?.total ?? 0)} icon={<Users className="h-5 w-5" />} />
      <Metric label="Visible on this page" value={String(data?.items?.length ?? 0)} icon={<UserRound className="h-5 w-5" />} />
      <Metric label="Orders on this page" value={String((data?.items ?? []).reduce((sum, row) => sum + Number(row.totalOrders || 0), 0))} icon={<ShoppingBag className="h-5 w-5" />} />
      <Metric label="Spending on this page" value={money((data?.items ?? []).reduce((sum, row) => sum + Number((row as any).totalSpending || 0), 0))} icon={<IndianRupee className="h-5 w-5" />} />
    </div>
    <ServerTable
      title={`${data?.total ?? 0} customers`}
      columns={columns}
      items={data?.items ?? []}
      page={page}
      totalPages={data?.total_pages ?? 1}
      total={data?.total ?? 0}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      onPageChange={setPage}
      search={search}
      onSearchChange={(value) => { setSearch(value); setPage(1); }}
      searchPlaceholder="Search name, email or phone"
      rowKey={(row) => customerId(row)}
    />
    {selected && <CustomerWorkspace
      summary={selected}
      onClose={() => setSelected(null)}
      onChanged={() => queryClient.invalidateQueries({ queryKey: userKeys.all })}
    />}
  </>;
}

function CustomerWorkspace({ summary, onClose, onChanged }: { summary: AdminUserResponse; onClose: () => void; onChanged: () => void }) {
  const id = customerId(summary);
  const [tab, setTab] = useState<"overview" | "orders" | "analytics" | "notification" | "email">("overview");
  const details = useQuery({
    queryKey: ["customer-details", id],
    queryFn: () => customerEngagementService.details(id),
    staleTime: 5_000,
  });
  const payload = details.data;
  const customer = payload?.customer || summary;

  const statusMutation = useMutation({
    mutationFn: (patch: { enabled?: boolean; blocked?: boolean }) => usersService.setStatus(id, patch),
    onSuccess: () => { haptic([25, 30, 25]); toast.success("Customer status updated"); details.refetch(); onChanged(); },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const reason = window.prompt("Reason for deleting this customer", "Deleted by administrator")?.trim();
      if (!reason) throw new Error("Deletion cancelled");
      return customerEngagementService.remove(id, reason);
    },
    onSuccess: () => { haptic([60, 45, 60]); toast.success("Customer deleted safely. Order records remain available for audit."); onChanged(); onClose(); },
    onError: (error: Error) => { if (error.message !== "Deletion cancelled") toast.error(error.message); },
  });

  const tabs = [
    ["overview", "Overview", UserRound],
    ["orders", "Orders", ShoppingBag],
    ["analytics", "Food analytics", BarChart3],
    ["notification", "App message", Bell],
    ["email", "Email", Mail],
  ] as const;

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 p-2 backdrop-blur-md sm:p-5">
    <div className="mx-auto my-2 min-h-[calc(100dvh-1rem)] w-full max-w-7xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl sm:my-4 sm:min-h-0">
      <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/95 p-4 backdrop-blur-xl sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          {customer.profileImage
            ? <img src={customer.profileImage} alt={customer.name} className="h-14 w-14 rounded-2xl border border-border object-cover" />
            : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 text-lg font-black text-white">{(customer.name || "?").split(" ").map((part: string) => part[0]).slice(0, 2).join("")}</div>}
          <div className="min-w-0">
            <h2 className="truncate text-xl font-black sm:text-2xl">{customer.name || "Customer"}</h2>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">{customer.email || "No email"} · {customer.mobile || "No phone"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { haptic(); details.refetch(); }} className="rounded-xl border border-border p-2.5 hover:bg-muted" title="Refresh"><RefreshCw className={`h-5 w-5 ${details.isFetching ? "animate-spin" : ""}`} /></button>
          <button type="button" onClick={onClose} className="rounded-xl border border-border p-2.5 hover:bg-muted" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
      </div>

      <div className="border-b border-border bg-muted/20 px-3 py-3 sm:px-5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(([key, label, Icon]) => <button key={key} type="button" onClick={() => { haptic(); setTab(key); }} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${tab === key ? "bg-primary text-primary-foreground shadow-sm" : "border border-border bg-card hover:bg-accent"}`}><Icon className="h-4 w-4" />{label}</button>)}
        </div>
      </div>

      {details.isLoading ? <div className="p-16 text-center text-muted-foreground">Loading complete customer profile…</div>
        : details.error ? <div className="m-5 rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-700">{(details.error as Error).message}</div>
        : <div className="p-4 sm:p-6">
          {tab === "overview" && <Overview customer={customer} payload={payload} statusMutation={statusMutation} deleteMutation={deleteMutation} />}
          {tab === "orders" && <Orders orders={payload?.orders || []} />}
          {tab === "analytics" && <Analytics data={payload?.analytics} />}
          {tab === "notification" && <NotificationComposer customer={customer} />}
          {tab === "email" && <EmailComposer recipient={customer} role="CUSTOMER" />}
        </div>}
    </div>
  </div>;
}

function Overview({ customer, payload, statusMutation, deleteMutation }: { customer: any; payload?: CustomerDetailsResponse; statusMutation: any; deleteMutation: any }) {
  const stats = customer;
  return <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Metric label="Total orders" value={String(stats.totalOrders || 0)} icon={<ShoppingBag className="h-5 w-5" />} />
      <Metric label="Delivered orders" value={String(stats.deliveredOrders || 0)} icon={<Package className="h-5 w-5" />} />
      <Metric label="Total spending" value={money(stats.totalSpending)} icon={<IndianRupee className="h-5 w-5" />} />
      <Metric label="Average order" value={money(stats.averageOrderValue)} icon={<BarChart3 className="h-5 w-5" />} />
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-border bg-background/50 p-5">
        <h3 className="mb-4 text-lg font-black">Contact and account</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Info label="Email" value={customer.email || "Not provided"} />
          <Info label="Phone" value={customer.mobile || customer.phoneNumber || "Not provided"} />
          <Info label="Wallet balance" value={money(customer.walletBalance)} />
          <Info label="Reward points" value={String(customer.rewardPoints || 0)} />
          <Info label="Joined" value={customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "—"} />
          <Info label="Last login" value={customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : "—"} />
        </div>
      </section>
      <section className="rounded-2xl border border-border bg-background/50 p-5">
        <h3 className="mb-4 text-lg font-black">Delivery addresses</h3>
        <div className="space-y-3">
          {(customer.addresses || []).length === 0 && <Empty text="No saved delivery addresses." />}
          {(customer.addresses || []).map((address: any, index: number) => <div key={address._id || index} className="rounded-xl border border-border bg-card p-3">
            <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><div><div className="font-bold">{address.label || `Address ${index + 1}`}</div><div className="mt-1 text-sm text-muted-foreground">{[address.line1, address.line2, address.area, address.city, address.state, address.pincode].filter(Boolean).join(", ") || "Address details unavailable"}</div>{address.distanceKm != null && <div className="mt-1 text-xs text-muted-foreground">{Number(address.distanceKm).toFixed(2)} km from nearest outlet</div>}</div></div>
          </div>)}
        </div>
      </section>
    </div>
    <section className="rounded-2xl border border-border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="text-lg font-black">Account controls</h3><p className="text-sm text-muted-foreground">Status changes apply immediately to customer authentication and ordering.</p></div>
        <StatusBadge status={customer.deleted ? "Deleted" : customer.blocked ? "Blocked" : customer.enabled ? "Active" : "Inactive"} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={statusMutation.isPending || customer.deleted} onClick={() => statusMutation.mutate({ enabled: !customer.enabled })} className="min-h-11 rounded-xl border border-border px-4 py-2 text-sm font-bold hover:bg-accent disabled:opacity-40">{customer.enabled ? "Disable account" : "Enable account"}</button>
        <button type="button" disabled={deleteMutation.isPending || customer.deleted} onClick={() => { if (window.confirm("Delete this customer account? Existing orders will remain preserved for financial audit.")) deleteMutation.mutate(); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-40"><Trash2 className="h-4 w-4" />Delete customer</button>
      </div>
    </section>
  </div>;
}

function Orders({ orders }: { orders: any[] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!orders.length) return <Empty text="This customer has not placed an order yet." />;
  return <div className="space-y-3">
    {orders.map((order) => {
      const key = String(order.mongoId || order.id);
      const expanded = open === key;
      return <article key={key} className="overflow-hidden rounded-2xl border border-border bg-background/50">
        <button type="button" onClick={() => { haptic(); setOpen(expanded ? null : key); }} className="flex w-full flex-wrap items-center justify-between gap-4 p-4 text-left hover:bg-accent/30">
          <div><div className="font-black">{order.orderNumber}</div><div className="mt-1 text-xs text-muted-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</div></div>
          <div className="flex flex-wrap items-center gap-3"><StatusBadge status={order.status || "—"} /><span className="font-black">{money(order.total)}</span>{expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}</div>
        </button>
        {expanded && <div className="border-t border-border p-4">
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Outlet" value={order.outletName || "—"} />
            <Info label="Payment" value={`${order.paymentMethod || "—"} / ${order.paymentStatus || "—"}`} />
            <Info label="Order type" value={order.fulfilmentType || "—"} />
            <Info label="Distance" value={order.distanceKm != null ? `${Number(order.distanceKm).toFixed(2)} km` : "—"} />
            <Info label="Subtotal" value={money(order.subtotal)} />
            <Info label="Discount" value={money(order.discount)} />
            <Info label="Delivery" value={money(order.deliveryCharge)} />
            <Info label="Grand total" value={money(order.total)} />
          </div>
          <h4 className="mb-3 font-black">Ordered food items</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {(order.items || []).map((item: any, index: number) => <div key={item.id || index} className="flex gap-3 rounded-xl border border-border bg-card p-3">
              {item.image ? <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted"><Package className="h-6 w-6" /></div>}
              <div className="min-w-0 flex-1"><div className="truncate font-bold">{item.name}</div><div className="text-xs text-muted-foreground">{item.categoryName || "Uncategorised"}</div><div className="mt-1 text-xs text-muted-foreground">Qty {item.quantity || 1}{item.selectedSize ? ` · ${item.selectedSize}` : ""}{item.selectedWeight ? ` · ${item.selectedWeight}` : ""}</div><div className="mt-1 font-black text-primary">{money(item.finalTotal ?? Number(item.unitPrice || 0) * Number(item.quantity || 1))}</div></div>
            </div>)}
          </div>
        </div>}
      </article>;
    })}
  </div>;
}

function Analytics({ data }: { data?: CustomerDetailsResponse["analytics"] }) {
  const categories = data?.categories || [];
  const products = data?.products || [];
  const maxQuantity = Math.max(1, ...categories.map((row) => Number(row.quantity || 0)));
  return <div className="grid gap-5 lg:grid-cols-2">
    <section className="rounded-2xl border border-border p-5">
      <h3 className="text-lg font-black">Category preference</h3>
      <p className="mb-5 text-sm text-muted-foreground">Quantity and spending grouped from the customer's order history.</p>
      {!categories.length ? <Empty text="No category analytics available yet." /> : <div className="space-y-4">{categories.map((row) => <div key={row.category}>
        <div className="mb-1 flex items-center justify-between gap-3 text-sm"><span className="font-bold">{row.category}</span><span className="text-muted-foreground">{row.quantity} items · {money(row.spend)}</span></div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.max(6, (row.quantity / maxQuantity) * 100)}%` }} /></div>
      </div>)}</div>}
    </section>
    <section className="rounded-2xl border border-border p-5">
      <h3 className="text-lg font-black">Most ordered foods</h3>
      <p className="mb-5 text-sm text-muted-foreground">Top foods ranked by ordered quantity.</p>
      {!products.length ? <Empty text="No food-item analytics available yet." /> : <div className="space-y-2">{products.slice(0, 12).map((row, index) => <div key={`${row.productName}-${index}`} className="flex items-center justify-between gap-4 rounded-xl bg-muted/35 px-3 py-3"><div className="flex min-w-0 items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">{index + 1}</div><span className="truncate font-bold">{row.productName}</span></div><div className="shrink-0 text-right"><div className="font-black">{row.quantity} ordered</div><div className="text-xs text-muted-foreground">{money(row.spend)}</div></div></div>)}</div>}
    </section>
  </div>;
}

function NotificationComposer({ customer }: { customer: any }) {
  const [type, setType] = useState("ADMIN_MESSAGE");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const mutation = useMutation({
    mutationFn: () => customerEngagementService.notify(customerId(customer), { type, title, message }),
    onSuccess: () => { haptic([25, 30, 25]); toast.success("Notification delivered to this customer"); setTitle(""); setMessage(""); },
    onError: (error: Error) => toast.error(error.message),
  });
  return <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-to-br from-card to-orange-50/40 p-5 shadow-sm sm:p-7">
    <div className="mb-6 flex items-start gap-3"><div className="rounded-2xl bg-primary/10 p-3 text-primary"><MessageSquare className="h-6 w-6" /></div><div><h3 className="text-xl font-black">Send an in-app message</h3><p className="text-sm text-muted-foreground">The message appears only in {customer.name}'s notification section.</p></div></div>
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm font-bold">Message category<select value={type} onChange={(event) => setType(event.target.value)} className="min-h-12 rounded-xl border border-input bg-background px-3 text-base font-medium"><option value="OFFER">Offer</option><option value="ADMIN_MESSAGE">Admin message</option><option value="UPDATE">Service update</option><option value="ALERT">Alert</option><option value="PAYMENT_REQUEST">Payment request</option></select></label>
      <label className="grid gap-2 text-sm font-bold">Title<input value={title} onChange={(event) => setTitle(event.target.value)} className="min-h-12 rounded-xl border border-input bg-background px-3 text-base font-medium" placeholder="Notification title" /></label>
      <label className="grid gap-2 text-sm font-bold">Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} className="min-h-36 rounded-xl border border-input bg-background p-3 text-base font-medium" placeholder="Write the customer-specific message" /></label>
      <button type="button" disabled={mutation.isPending || !title.trim() || !message.trim()} onClick={() => mutation.mutate()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground shadow-sm transition hover:-translate-y-0.5 disabled:opacity-40"><Send className="h-4 w-4" />{mutation.isPending ? "Sending…" : "Send notification"}</button>
    </div>
  </div>;
}

export function EmailComposer({ recipient, role }: { recipient: any; role: "CUSTOMER" | "RIDER" }) {
  const recipientName = recipient.name || recipient.driverName || "Recipient";
  const recipientEmail = recipient.email || recipient.driverEmail || "";
  const recipientId = customerId(recipient) || recipient.driverId || recipient.userId || recipient.profileId;
  const [category, setCategory] = useState<EmailCategory>("GENERAL");
  const [subject, setSubject] = useState("Message from Mr. Breado");
  const [bodyText, setBodyText] = useState(`Hello ${recipientName},\n\nYou have received a message from the Mr. Breado administration team.\n\nAdd your message here.\n\nRegards,\nMr. Breado Team`);
  const [files, setFiles] = useState<File[]>([]);
  const templates = useQuery({ queryKey: ["email-templates", recipientName], queryFn: () => customerEngagementService.templates(recipientName), staleTime: 60_000 });
  const config = useQuery({ queryKey: ["email-config"], queryFn: customerEngagementService.emailConfig, staleTime: 30_000 });
  const history = useQuery({ queryKey: ["email-history", role, recipientId], queryFn: () => customerEngagementService.emailHistory(recipientId, role), enabled: Boolean(recipientId), staleTime: 5_000 });

  const applyTemplate = (nextCategory: EmailCategory) => {
    setCategory(nextCategory);
    const template = templates.data?.find((row: any) => row.category === nextCategory);
    if (template) { setSubject(template.subject || ""); setBodyText(template.bodyText || ""); }
  };

  const mutation = useMutation({
    mutationFn: () => role === "RIDER"
      ? customerEngagementService.emailRider(recipientId, { category, subject, bodyText, attachments: files })
      : customerEngagementService.emailCustomer(recipientId, { category, subject, bodyText, attachments: files }),
    onSuccess: () => { haptic([35, 35, 55]); toast.success("Email sent successfully"); setFiles([]); history.refetch(); },
    onError: (error: Error) => toast.error(error.message),
  });

  return <div className="space-y-5">
    {!config.data?.configured && <div className="animate-pulse rounded-2xl border border-amber-400 bg-amber-50 p-4 text-amber-900"><div className="flex items-start gap-3"><AlertTriangle className="mt-0.5 h-5 w-5" /><div><div className="font-black">Email API configuration required</div><div className="mt-1 text-sm">Add <code>RESEND_API_KEY</code> and <code>ADMIN_EMAIL_FROM</code> to the backend environment. Email sending remains disabled until both are configured.</div></div></div></div>}
    <div className="grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
      <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-orange-50/40 p-5 shadow-sm sm:p-7">
        <div className="mb-5"><h3 className="text-xl font-black">Email {recipientName}</h3><p className="text-sm text-muted-foreground">To: {recipientEmail || "No email address available"}</p></div>
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold">Email section<select value={category} onChange={(event) => applyTemplate(event.target.value as EmailCategory)} className="min-h-12 rounded-xl border border-input bg-background px-3 text-base font-medium"><option value="PROMOTIONAL">Promotional</option><option value="ALERT">Alert</option><option value="PAYMENT_REQUEST">Payment request</option><option value="DOCUMENT">PDF / image / document</option><option value="GENERAL">Admin message</option></select></label>
          <label className="grid gap-2 text-sm font-bold">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} className="min-h-12 rounded-xl border border-input bg-background px-3 text-base font-medium" /></label>
          <label className="grid gap-2 text-sm font-bold">Editable email message<textarea value={bodyText} onChange={(event) => setBodyText(event.target.value)} className="min-h-64 rounded-xl border border-input bg-background p-3 text-base font-medium leading-relaxed" /></label>
          <label className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm font-bold"><div className="flex items-center gap-2"><Paperclip className="h-4 w-4" />Attach images, PDF, Word or spreadsheet files</div><input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" className="mt-3 block w-full text-sm" onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 5))} />{files.length > 0 && <div className="mt-3 space-y-1 text-xs text-muted-foreground">{files.map((file) => <div key={`${file.name}-${file.size}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</div>)}</div>}</label>
          <button type="button" disabled={!config.data?.configured || !recipientEmail || mutation.isPending || !subject.trim() || !bodyText.trim()} onClick={() => mutation.mutate()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-black text-primary-foreground shadow-sm transition hover:-translate-y-0.5 disabled:opacity-40"><Mail className="h-4 w-4" />{mutation.isPending ? "Sending email…" : "Send email"}</button>
        </div>
      </section>
      <section className="rounded-3xl border border-border p-5">
        <h3 className="font-black">Email history</h3><p className="mb-4 text-xs text-muted-foreground">Latest messages sent by admin.</p>
        <div className="max-h-[650px] space-y-2 overflow-y-auto pr-1">{history.isLoading ? <div className="py-8 text-center text-sm text-muted-foreground">Loading email history…</div> : (history.data || []).length === 0 ? <Empty text="No email has been sent to this account." /> : (history.data || []).map((row: any) => <div key={row.id || row._id} className="rounded-xl border border-border bg-background/60 p-3"><div className="flex items-center justify-between gap-2"><span className="truncate font-bold">{row.subject}</span><StatusBadge status={row.status || "PENDING"} /></div><div className="mt-1 text-xs text-muted-foreground">{row.category} · {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}</div>{row.attachments?.length ? <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />{row.attachments.length} attachment(s)</div> : null}</div>)}</div>
      </section>
    </div>
  </div>;
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-bold uppercase tracking-wider">{label}</span>{icon}</div><div className="mt-2 break-words text-2xl font-black">{value}</div></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div><div className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold">{value}</div></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{text}</div>; }
