import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useRestaurants } from "@/hooks/queries/use-restaurants";
import { PageHeader } from "@/components/admin/page-header";
import { ServerTable, type ServerColumn } from "@/components/admin/server-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";
import {
  useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon, useToggleCouponStatus,
} from "@/hooks/queries/use-coupons";
import type { AdminCouponRequest, Coupon } from "@/types";

export const Route = createFileRoute("/coupons")({
  head: () => ({ meta: [{ title: "Coupons | Mr. Breado Admin" }] }),
  component: CouponsPage,
});

function CouponsPage() {
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);

  const { data, isLoading, isFetching, error } = useCoupons({ page, perPage: 20 });
  const { data: outletData } = useRestaurants({ page: 1, perPage: 200 });
  const outlets: any[] = Array.isArray(outletData) ? outletData as any[] : ((outletData as any)?.items ?? []);
  const create = useCreateCoupon();
  const update = useUpdateCoupon();
  const del = useDeleteCoupon();
  const toggle = useToggleCouponStatus();

  const items = data?.items ?? [];

  const cols: ServerColumn<Coupon>[] = [
    { key: "code", header: "Code", render: (r) => <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-primary">{r.code}</span> },
    { key: "title", header: "Title", render: (r) => r.title || "—" },
    { key: "type", header: "Type", render: (r) => r.type || "—" },
    { key: "value", header: "Value", render: (r) => Number(r.value ?? 0).toFixed(2) },
    { key: "min", header: "Min Order", render: (r) => `₹${Number(r.minOrderAmount ?? 0).toFixed(2)}` },
    { key: "used", header: "Used", render: (r) => `${r.usedCount ?? 0}/${r.usageLimit ?? "∞"}` },
    { key: "expires", header: "Expires", render: (r) => r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : "—" },
    { key: "status", header: "Status", render: (r) => (
      <button onClick={() => toggle.mutate({ id: r.id, enabled: !r.enabled })} disabled={toggle.isPending}>
        <StatusBadge status={r.enabled ? "Active" : "Inactive"} />
      </button>
    )},
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-1">
        <button onClick={() => { setEditing(r); setIsNew(false); }} className="rounded p-1.5 text-primary hover:bg-primary/10">
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={() => { if (window.confirm("Delete this coupon?")) del.mutate(r.id); }}
          disabled={del.isPending}
          className="rounded p-1.5 text-destructive hover:bg-destructive/10 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )},
  ];

  return (
    <>
      <PageHeader title="Coupons" icon={<Tag className="h-5 w-5" />}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Offer Management"},{label:"Coupons"}]}
        actions={
          <button
            onClick={() => { setEditing({ id: 0, code: "", value: 0 } as Coupon); setIsNew(true); }}
            className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Add Coupon
          </button>
        }
      />
      <ServerTable
        title={`${data?.total ?? 0} coupons`}
        columns={cols}
        items={items}
        page={page}
        totalPages={data?.total_pages ?? 1}
        total={data?.total ?? 0}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        onPageChange={setPage}
        rowKey={(r) => r.id}
      />

      {editing && (
        <CouponDialog
          coupon={editing}
          isNew={isNew}
          submitting={create.isPending || update.isPending}
          outlets={outlets}
          onClose={() => setEditing(null)}
          onSubmit={(body) => {
            const action = isNew
              ? create.mutateAsync(body)
              : update.mutateAsync({ id: editing.id, body });
            action.then(() => setEditing(null)).catch(() => {});
          }}
        />
      )}
    </>
  );
}

function CouponDialog({
  coupon, isNew, onClose, onSubmit, submitting, outlets,
}: {
  coupon: Coupon;
  isNew: boolean;
  onClose: () => void;
  onSubmit: (b: AdminCouponRequest) => void;
  submitting?: boolean;
  outlets: any[];
}) {
  const [form, setForm] = useState<AdminCouponRequest>({
    code: coupon.code || "",
    title: coupon.title || "",
    description: coupon.description || "",
    type: coupon.type || "PERCENT",
    value: coupon.value ?? 0,
    minOrderAmount: coupon.minOrderAmount ?? 0,
    maxDiscountAmount: coupon.maxDiscountAmount ?? 0,
    usageLimit: coupon.usageLimit ?? 0,
    perUserLimit: coupon.perUserLimit ?? 0,
    expiresAt: coupon.expiresAt,
    enabled: coupon.enabled ?? true,
    appliesToAllOutlets: (coupon as any).appliesToAllOutlets ?? !((coupon as any).outletIds?.length),
    outletIds: ((coupon as any).outletIds || []).map((x:any)=>String(x?.id||x?._id||x)),
  });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-3 text-lg font-semibold">{isNew ? "New Coupon" : "Edit Coupon"}</h3>
        <div className="space-y-3">
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Code (e.g. SAVE10)" value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Title" value={form.title || ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">
            <select className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              value={form.type || "PERCENT"} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="PERCENT">PERCENT</option>
              <option value="FLAT">FLAT</option>
              <option value="DELIVERY">DELIVERY</option>
            </select>
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Value" value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Min order" value={form.minOrderAmount ?? 0}
              onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Max discount" value={form.maxDiscountAmount ?? 0}
              onChange={(e) => setForm({ ...form, maxDiscountAmount: Number(e.target.value) })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Usage limit" value={form.usageLimit ?? 0}
              onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} />
            <input type="number" className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Per user limit" value={form.perUserLimit ?? 0}
              onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) })} />
          </div>
          <input type="datetime-local" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            value={form.expiresAt ? form.expiresAt.slice(0, 16) : ""}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!(form as any).appliesToAllOutlets} onChange={(e)=>setForm({...form, appliesToAllOutlets:e.target.checked, outletIds:e.target.checked?[]:(form as any).outletIds} as any)}/> Apply coupon to all outlets</label>
          {!(form as any).appliesToAllOutlets && <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-border p-3">
            {outlets.map((o:any)=>{const id=String(o.id||o._id);const selected=((form as any).outletIds||[]).includes(id);return <label key={id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected} onChange={(e)=>setForm({...form,outletIds:e.target.checked?[...((form as any).outletIds||[]),id]:((form as any).outletIds||[]).filter((x:string)=>x!==id)} as any)}/>{o.name||o.outletName}</label>})}
          </div>}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })} />
            Enabled
          </label>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border border-border px-3 py-1.5 text-sm">Cancel</button>
          <button disabled={submitting || !form.code || (!(form as any).appliesToAllOutlets && !((form as any).outletIds||[]).length)}
            onClick={() => onSubmit(form)}
            className="rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50">
            {submitting ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
