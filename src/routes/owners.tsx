import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn, useTableSearch } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { UserCog, Eye } from "lucide-react";
import { useUsers } from "@/hooks/queries/use-users";
import type { AdminUserResponse } from "@/types";

export const Route = createFileRoute("/owners")({
  head: () => ({ meta: [{ title: "Owners | Mr. Breado Admin" }] }),
  component: OwnersPage,
});

function OwnersPage() {
  const [page, setPage] = useState(1);
  const { search, setSearch, debounced } = useTableSearch();
  const { data, isLoading, isFetching, error } = useUsers({
    page, perPage: 20, role: "SELLER", search: debounced,
  });

  const items = data?.items ?? [];
  const cols: ServerColumn<AdminUserResponse>[] = [
    { key: "name", header: "Owner", render: (r) => (
      <div className="flex items-center gap-3">
        {r.profileImage ? (
          <img src={r.profileImage} alt={r.name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
            {(r.name || "?").split(" ").map((x) => x[0]).slice(0, 2).join("")}
          </div>
        )}
        <div>
          <div className="font-medium">{r.name}</div>
          <div className="text-xs text-muted-foreground">#{r.id}</div>
        </div>
      </div>
    )},
    { key: "email", header: "Email", render: (r) => r.email || "—" },
    { key: "mobile", header: "Phone", render: (r) => r.mobile || "—" },
    { key: "orders", header: "Orders", render: (r) => r.totalOrders ?? 0 },
    { key: "status", header: "Status", render: (r) => (
      <StatusBadge status={r.blocked ? "Blocked" : r.enabled ? "Active" : "Inactive"} />
    )},
    { key: "actions", header: "Actions", render: () => (
      <button className="rounded p-1.5 text-info hover:bg-info/10"><Eye className="h-4 w-4" /></button>
    )},
  ];

  return (
    <>
      <PageHeader title="Restaurant Owners" icon={<UserCog className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Restaurant Management"},{label:"Owners"}]} />
      <ServerTable
        title={`${data?.total ?? 0} owners`}
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
        searchPlaceholder="Search owners..."
        rowKey={(r) => r.id}
      />
    </>
  );
}
