import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Eye } from "lucide-react";
import { useUsers } from "@/hooks/queries/use-users";
import { userKeys } from "@/hooks/queries/use-users";
import { useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import type { AdminUserResponse } from "@/types";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers | Go4Food Admin" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminUserResponse | null>(null);
  const { search, setSearch, debounced } = useTableSearch();
  const { data, isLoading, isFetching, error } = useUsers({
    page, perPage: 20, role: "CUSTOMER", search: debounced,
  });
  const queryClient = useQueryClient();

  const items = data?.items ?? [];
  const cols: ServerColumn<AdminUserResponse>[] = [
    { key: "name", header: "Customer", render: (r) => (
      <div className="flex items-center gap-3">
        {r.profileImage ? (
          <img src={r.profileImage} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
            {(r.name || "?").split(" ").map((x) => x[0]).slice(0,2).join("")}
          </div>
        )}
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-xs text-muted-foreground">#{r.id}</div>
        </div>
      </div>
    )},
    { key: "mobile", header: "Phone", render: (r) => r.mobile || "—" },
    { key: "email", header: "Email", render: (r) => r.email || "—" },
    { key: "orders", header: "Orders", render: (r) => r.totalOrders ?? 0 },
    { key: "wallet", header: "Wallet", render: (r) => <span className="font-semibold">₹{Number(r.walletBalance ?? 0).toFixed(2)}</span> },
    { key: "status", header: "Status", render: (r) => (
      <StatusBadge status={r.blocked ? "Blocked" : r.enabled ? "Active" : "Inactive"} />
    )},
    { key: "actions", header: "Actions", render: (r) => (
      <button
        onClick={() => setSelectedCustomer(r)}
        className="rounded p-1.5 text-info hover:bg-info/10"
        aria-label={`View ${r.name} details`}
      >
        <Eye className="h-4 w-4" />
      </button>
    )},
  ];

  async function handleToggleStatus(user: AdminUserResponse, patch: { enabled?: boolean; blocked?: boolean }) {
    try {
      await usersService.setStatus(user.id, patch);
      queryClient.invalidateQueries({ queryKey: userKeys.list({ page, perPage: 20, role: "CUSTOMER", search: debounced }) });
      const updated = await usersService.get(user.id);
      setSelectedCustomer(updated);
    } catch (e) {
      // failed - show console for now
      console.error(e);
    }
  }

  async function handleSave(userId: number | string, values: { name?: string; email?: string; mobile?: string; phoneNumber?: string }) {
    try {
      await usersService.update(userId, values);
      queryClient.invalidateQueries({ queryKey: userKeys.list({ page, perPage: 20, role: "CUSTOMER", search: debounced }) });
      const updated = await usersService.get(userId);
      setSelectedCustomer(updated);
    } catch (e) {
      console.error(e);
    }
  }

  const [editValues, setEditValues] = useState({ name: "", email: "", mobile: "", phoneNumber: "" });

  useEffect(() => {
    if (selectedCustomer) {
      setEditValues({
        name: selectedCustomer.name ?? "",
        email: selectedCustomer.email ?? "",
        mobile: selectedCustomer.mobile ?? "",
        phoneNumber: (selectedCustomer as any).phoneNumber ?? "",
      });
    } else {
      setEditValues({ name: "", email: "", mobile: "", phoneNumber: "" });
    }
  }, [selectedCustomer]);

  return (
    <>
      <PageHeader title="Customers" icon={<Users className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Customers" }]} />
      <ServerTable
        title={`${data?.total ?? 0} customers`}
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
        searchPlaceholder="Search customers..."
        rowKey={(r) => r.id}
      />

      <Dialog open={Boolean(selectedCustomer)} onOpenChange={(open) => { if (!open) setSelectedCustomer(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer details</DialogTitle>
            <DialogDescription>Review the selected customer profile and account status.</DialogDescription>
          </DialogHeader>

          {selectedCustomer ? (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/50 p-4">
                {selectedCustomer.profileImage ? (
                  <img src={selectedCustomer.profileImage} alt={selectedCustomer.name} className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-lg font-bold text-primary-foreground">
                    {(selectedCustomer.name || "?").split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </div>
                )}
                <div>
                  <div className="text-xl font-semibold">{selectedCustomer.name}</div>
                  <div className="text-sm text-muted-foreground">#{selectedCustomer.id}</div>
                  <div className="text-sm text-muted-foreground">{selectedCustomer.role || "Customer"}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedCustomer, { enabled: !selectedCustomer.enabled })}
                    className="rounded-md border border-border px-3 py-1 text-sm hover:bg-accent"
                  >
                    {selectedCustomer.enabled ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleToggleStatus(selectedCustomer, { blocked: !selectedCustomer.blocked })}
                    className="rounded-md border border-border px-3 py-1 text-sm hover:bg-accent"
                  >
                    {selectedCustomer.blocked ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Contact</div>
                  <div className="text-sm">{selectedCustomer.email || "—"}</div>
                  <div className="text-sm">{selectedCustomer.mobile || "—"}</div>
                </div>
                <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Account</div>
                  <div className="text-sm">Orders: {selectedCustomer.totalOrders ?? 0}</div>
                  <div className="text-sm">Wallet: ₹{Number(selectedCustomer.walletBalance ?? 0).toFixed(2)}</div>
                  <div className="text-sm">Status: <StatusBadge status={selectedCustomer.blocked ? "Blocked" : selectedCustomer.enabled ? "Active" : "Inactive"} /></div>
                </div>
              </div>
              {selectedCustomer.createdAt && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">Joined</div>
                  <div className="text-sm">{new Date(selectedCustomer.createdAt).toLocaleDateString()}</div>
                </div>
              )}

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Edit Customer</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={editValues.name} onChange={(e) => setEditValues(v => ({ ...v, name: e.target.value }))} placeholder="Name" className="rounded-md border border-input px-3 py-2" />
                  <input value={editValues.email} onChange={(e) => setEditValues(v => ({ ...v, email: e.target.value }))} placeholder="Email" className="rounded-md border border-input px-3 py-2" />
                  <input value={editValues.mobile} onChange={(e) => setEditValues(v => ({ ...v, mobile: e.target.value }))} placeholder="Mobile" className="rounded-md border border-input px-3 py-2" />
                  <input value={editValues.phoneNumber} onChange={(e) => setEditValues(v => ({ ...v, phoneNumber: e.target.value }))} placeholder="Phone number" className="rounded-md border border-input px-3 py-2" />
                </div>
                <div className="mt-3 flex justify-end">
                  <button onClick={() => handleSave(selectedCustomer.id, editValues)} className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground">Save</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">No customer selected.</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
