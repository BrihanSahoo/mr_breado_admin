import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Store, Eye, Star, ShieldCheck, X, Power } from "lucide-react";
import { useRestaurants, restaurantKeys } from "@/hooks/queries/use-restaurants";
import { restaurantsService } from "@/services/restaurants.service";
import type { AdminRestaurantResponse } from "@/types";

export const Route = createFileRoute("/restaurants")({
  head: () => ({ meta: [{ title: "Restaurants | Go4Food Admin" }] }),
  component: RestaurantsPage,
});

function isRestaurantVerified(r: AdminRestaurantResponse) {
  const s = String(r.verificationStatus ?? "").toUpperCase();
  return s === "VERIFIED" || s === "APPROVED";
}

function RestaurantsPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const { search, setSearch, debounced } = useTableSearch();
  const [verification, setVerification] = useState<string>("");
  const [selected, setSelected] = useState<AdminRestaurantResponse | null>(null);

  const { data, isLoading, isFetching, error } = useRestaurants({
    page, perPage: 20, search: debounced, verificationStatus: verification || undefined,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: "VERIFIED" | "UNVERIFIED" | "REJECTED" }) => restaurantsService.setVerificationStatus(id, status),
    onSuccess: (_, v) => {
      toast.success(v.status === "VERIFIED" ? "Restaurant verified successfully" : "Restaurant verification updated");
      qc.invalidateQueries({ queryKey: restaurantKeys.all });
    },
    onError: () => toast.error("Restaurant verification could not be updated. Please try again."),
  });

  const items = data?.items ?? [];
  const cols: ServerColumn<AdminRestaurantResponse>[] = [
    { key: "name", header: "Restaurant", render: (r) => (
      <div className="flex items-center gap-3">
        {r.logo ? (
          <img src={r.logo} alt={r.name} className="h-10 w-10 rounded-lg object-cover" />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-lg">🏪</div>
        )}
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-xs text-muted-foreground">#{r.id} · {r.city || "—"}</div>
        </div>
      </div>
    )},
    { key: "verification", header: "Verification", render: (r) => <StatusBadge status={r.verificationStatus || "UNVERIFIED"} /> },
    { key: "rating", header: "Rating", render: (r) => (
      <span className="inline-flex items-center gap-1 text-warning">
        <Star className="h-3 w-3 fill-current" />{r.rating ?? 0}
      </span>
    )},
    { key: "products", header: "Products", render: (r) => r.productCount ?? 0 },
    { key: "revenue", header: "Gross Sales", render: (r) => <span className="font-semibold">₹{Number(r.grossSales ?? 0).toFixed(2)}</span> },
    { key: "payable", header: "Payable", render: (r) => <span>₹{Number(r.restaurantPayable ?? 0).toFixed(2)}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.open ? "Active" : "Inactive"} /> },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSelected(r)} className="inline-flex items-center gap-1.5 rounded-lg border border-info/30 px-3 py-2 text-xs font-bold text-info hover:bg-info/10"><Eye className="h-4 w-4" />View</button>
        {!isRestaurantVerified(r) && <button onClick={() => verifyMutation.mutate({ id: r.id, status: "VERIFIED" })} disabled={verifyMutation.isPending} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><ShieldCheck className="h-4 w-4" />Verify</button>}
      </div>
    )},
  ];

  return (
    <>
      <PageHeader title="Restaurants" icon={<Store className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Restaurant Management"},{label:"Restaurants"}]} />
      <ServerTable
        title={`${data?.total ?? 0} restaurants`}
        columns={cols}
        items={items}
        page={page}
        totalPages={data?.total_pages ?? 1}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onPageChange={setPage}
        search={search}
        onSearchChange={(s) => { setSearch(s); setPage(1); }}
        searchPlaceholder="Search restaurants..."
        rowKey={(r) => r.id}
        filters={
          <select
            value={verification}
            onChange={(e) => { setVerification(e.target.value); setPage(1); }}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          >
            <option value="">All verifications</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="REJECTED">Rejected</option>
          </select>
        }
      />
      {selected && <RestaurantModal restaurant={selected} onClose={() => setSelected(null)} onVerify={() => verifyMutation.mutate({ id: selected.id, status: "VERIFIED" })} onUnverify={() => verifyMutation.mutate({ id: selected.id, status: "UNVERIFIED" })} busy={verifyMutation.isPending} />}
    </>
  );
}

function RestaurantModal({ restaurant, onClose, onVerify, onUnverify, busy }: { restaurant: AdminRestaurantResponse; onClose: () => void; onVerify: () => void; onUnverify: () => void; busy: boolean }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl">
      <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-extrabold">{restaurant.name}</h2><p className="text-sm text-muted-foreground">Restaurant #{restaurant.id} · {restaurant.city || "—"}</p></div><button onClick={onClose} className="rounded-lg border border-border p-2 hover:bg-muted"><X className="h-4 w-4" /></button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Info label="Verification" value={restaurant.verificationStatus || "UNVERIFIED"} />
        <Info label="Visibility" value={restaurant.visibilityStatus || "—"} />
        <Info label="Open state" value={restaurant.open ? "Open" : "Closed"} />
        <Info label="Status" value={restaurant.status || "—"} />
        <Info label="Rating" value={String(restaurant.rating ?? 0)} />
        <Info label="Products" value={String(restaurant.productCount ?? 0)} />
        <Info label="Gross sales" value={`₹${Number(restaurant.grossSales ?? 0).toFixed(2)}`} />
        <Info label="Admin commission" value={`₹${Number(restaurant.adminCommission ?? 0).toFixed(2)}`} />
        <Info label="Payable" value={`₹${Number(restaurant.restaurantPayable ?? 0).toFixed(2)}`} />
      </div>
      <div className="mt-4 rounded-xl border border-border bg-background/50 p-4"><div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</div><p className="mt-2 whitespace-pre-wrap text-sm">{restaurant.address || "No address returned by backend."}</p></div>
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button disabled className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-muted-foreground disabled:opacity-50"><Power className="h-4 w-4" />Open/Close from Mr Breado Restaurant page</button>
        {isRestaurantVerified(restaurant) ? <button onClick={onUnverify} disabled={busy} className="rounded-xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-500 disabled:opacity-50">Mark Unverified</button> : <button onClick={onVerify} disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><ShieldCheck className="h-4 w-4" />Verify Restaurant</button>}
      </div>
    </div>
  </div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border bg-background/50 p-3"><div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-1 break-words font-semibold">{value}</div></div>;
}
