import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { Shield, Pencil, Trash2, Plus } from "lucide-react";
import { useUsers } from "@/hooks/queries/use-users";
import { usersService } from "@/services/users.service";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/roles")({
  head: () => ({ meta: [{ title: "Roles | Go4Food Admin" }] }),
  component: RolesPage,
});

function RolesPage() {
  const roleDefs = [
    { key: "ADMIN", label: "Admins", color: "gradient-primary" },
    { key: "SELLER", label: "Sellers", color: "gradient-warning" },
    { key: "DELIVERY_PARTNER", label: "Delivery Partners", color: "gradient-info" },
    { key: "CUSTOMER", label: "Customers", color: "gradient-success" },
  ];

  const countsQuery = useQuery({
    queryKey: ["roles", "counts"],
    queryFn: async () => {
      const results = await Promise.all(
        roleDefs.map((r) => usersService.list({ role: r.key, page: 1, perPage: 1 })),
      );
      return results.map((res, i) => ({ key: roleDefs[i].key, total: res.total }));
    },
    staleTime: 30_000,
  });

  const counts = Object.fromEntries((countsQuery.data ?? []).map((c: any) => [c.key, c.total]));

  return (
    <>
      <PageHeader
        title="Roles"
        icon={<Shield className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Role Management" }, { label: "Roles" }]}
        actions={
          <button className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> Add Role
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {roleDefs.map((r) => (
          <div key={r.key} className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
            <div className={`h-2 ${r.color}`} />
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{r.label}</h3>
                <div className="flex gap-1">
                  <button className="rounded p-1.5 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button>
                  <button className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-background p-3"><div className="text-xs text-muted-foreground">Users</div><div className="text-xl font-bold">{counts[r.key] ?? (countsQuery.isLoading ? '…' : 0)}</div></div>
                <div className="rounded-lg bg-background p-3"><div className="text-xs text-muted-foreground">Permissions</div><div className="text-xl font-bold">—</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
