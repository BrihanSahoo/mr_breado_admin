import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import type { Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useCategories, useCategorySummary } from "@/hooks/queries/use-categories";
import { useState } from "react";
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useToggleCategoryStatus } from "@/hooks/mutations/use-category-mutations";
import type { CategoryResponse } from "@/services/categories.service";
import { Layers, Plus, Pencil, Trash2, Tag } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({ meta: [{ title: "Categories | Go4Food Admin" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  type Row = CategoryResponse;
  const { data, isLoading, error } = useCategories();
  const { data: summary } = useCategorySummary();
  const items = data?.items ?? [];
  const del = useDeleteCategory();
  const toggle = useToggleCategoryStatus();
  const create = useCreateCategory();
  const update = useUpdateCategory();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const cols: Column<Row>[] = [
    { key: "img", header: "Image", render: r => (r.image && String(r.image).startsWith("http") ? <img src={r.image} className="h-10 w-10 rounded-lg object-cover" /> : <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xl">{r.icon ?? r.image ?? '🍽️'}</div>) },
    { key: "name", header: "Name", render: r => <span className="font-medium">{r.title ?? r.name}</span> },
    { key: "sub", header: "Sub Categories", render: r => <span className="inline-flex items-center gap-1 rounded-full bg-info/15 px-2 py-0.5 text-xs text-info"><Tag className="h-3 w-3"/>{r.subCategoryCount ?? r.productCount ?? 0}</span> },
    { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
    { key: "actions", header: "Action", render: (r: Row) => (
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center">
          <input type="checkbox" checked={(r.status === 'ACTIVE') || r.active === true || r.enabled === true} onChange={(e) => toggle.mutate({ id: r.id, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' })} className="peer sr-only" />
          <div className="relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
        </label>
        <button onClick={() => { setEditing(r); setTitle(r.title ?? r.name ?? ""); setIcon(r.icon ?? r.image ?? ""); setStatus(r.status ?? "ACTIVE"); setIsOpen(true); }} className="rounded p-1.5 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4"/></button>
        <button onClick={() => del.mutate(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4"/></button>
      </div>
    )},
  ];
  return (<>
    <PageHeader title="Categories" icon={<Layers className="h-5 w-5"/>}
      breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Categories"}]}
      actions={<button onClick={() => { setEditing(null); setTitle(""); setIcon(""); setStatus("ACTIVE"); setIsOpen(true); }} className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"><Plus className="h-4 w-4"/> Add Category</button>} />
    <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {label:"Total Categories",value:summary?.totalCategories ?? data?.total ?? items.length,color:"bg-primary/15 text-primary"},
        {label:"Active",value:summary?.activeCategories ?? items.filter((i:any)=>i.active || i.enabled || i.status === "ACTIVE").length,color:"bg-success/15 text-success"},
        {label:"Inactive",value:summary?.inactiveCategories ?? items.filter((i:any)=>i.status === "INACTIVE" || i.active === false || i.enabled === false).length,color:"bg-destructive/15 text-destructive"},
        {label:"Sub Categories",value:summary?.totalSubCategories ?? items.reduce((sum:any,i:any)=>sum+Number(i.subCategoryCount ?? i.productCount ?? 0),0),color:"bg-info/15 text-info"},
      ].map(s => (
        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}><Layers className="h-5 w-5"/></div>
          <div><div className="text-xs text-muted-foreground">{s.label}</div><div className="text-xl font-bold">{s.value}</div></div>
        </div>
      ))}
    </div>
    <DataTable data={items} columns={cols} searchableKeys={["name"]} title="All Categories" subtitle={`${data?.total ?? 0} categories`} loading={isLoading} />

    {isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">{editing ? "Edit Category" : "Add Category"}</h3>
          <div className="flex flex-col gap-3">
            <label className="text-sm">Name<input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded border px-2 py-1" /></label>
            <label className="text-sm">Icon / Image<input value={icon} onChange={e => setIcon(e.target.value)} className="mt-1 w-full rounded border px-2 py-1" placeholder="emoji or url" /></label>
            <label className="text-sm">Status<select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 w-full rounded border px-2 py-1"><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></label>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsOpen(false)} className="rounded-md px-3 py-1">Cancel</button>
              <button onClick={() => {
                const payload: any = { title, name: title, icon, image: icon, status, active: status === "ACTIVE", enabled: status === "ACTIVE" };
                if (editing) {
                  update.mutate({ id: editing.id, payload });
                } else {
                  create.mutate(payload);
                }
                setIsOpen(false);
              }} className="rounded-md bg-primary px-3 py-1 text-white">Save</button>
            </div>
          </div>
        </div>
      </div>
    ) : null }
  </>);
}
