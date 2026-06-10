import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import type { Column } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useCuisines } from "@/hooks/queries/use-cuisines";
import { useState } from "react";
import { useCreateCuisine, useUpdateCuisine, useDeleteCuisine, useToggleCuisineStatus } from "@/hooks/mutations/use-cuisine-mutations";
import { Soup, Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/cuisine")({
  head: () => ({ meta: [{ title: "Cuisine | Go4Food Admin" }] }),
  component: () => {
    const { data, isLoading, error } = useCuisines();
    type Row = { id: number; name: string; status?: string; img?: string };
    const items = data ?? [];
    const cols: Column<Row>[] = [
      { key: "img", header: "Image", render: r => <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xl">{r.img}</div> },
      { key: "name", header: "Cuisine Name", render: r => <span className="font-medium">{r.name}</span> },
      { key: "status", header: "Status", render: r => <StatusBadge status={r.status} /> },
      { key: "actions", header: "Action", render: (r) => (
        <div className="flex items-center gap-2">
          <label className="inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={r.status === 'Active'} onChange={(e) => toggle.mutate({ id: r.id, status: e.target.checked ? 'Active' : 'Inactive' })} className="peer sr-only" />
            <div className="relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
          </label>
          <button onClick={() => { setEditing(r); setName(r.name); setImg(r.img ?? '🍽️'); setStatus(r.status ?? 'Active'); setIsOpen(true); }} className="rounded p-1.5 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4"/></button>
          <button onClick={() => del.mutate(r.id)} className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4"/></button>
        </div>
      )},
    ];
      const create = useCreateCuisine();
      const update = useUpdateCuisine();
      const del = useDeleteCuisine();
      const toggle = useToggleCuisineStatus();
      const [isOpen, setIsOpen] = useState(false);
      const [editing, setEditing] = useState<any | null>(null);
      const [name, setName] = useState("");
      const [img, setImg] = useState("🍽️");
      const [status, setStatus] = useState("Active");

      return (<>
        <PageHeader title="Cuisine" icon={<Soup className="h-5 w-5"/>}
          breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Cuisine"}]}
          actions={<button onClick={() => { setEditing(null); setName(""); setImg("🍽️"); setStatus("Active"); setIsOpen(true); }} className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"><Plus className="h-4 w-4"/> Add Cuisine</button>} />
        <DataTable data={items} columns={cols} searchableKeys={["name"]} title="All Cuisines" loading={isLoading} />

        {isOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">{editing ? "Edit Cuisine" : "Add Cuisine"}</h3>
              <div className="flex flex-col gap-3">
                <label className="text-sm">Name<input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full rounded border px-2 py-1" /></label>
                <label className="text-sm">Emoji/Icon<input value={img} onChange={e => setImg(e.target.value)} className="mt-1 w-full rounded border px-2 py-1" /></label>
                <label className="text-sm">Status<select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 w-full rounded border px-2 py-1"><option>Active</option><option>Inactive</option></select></label>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setIsOpen(false)} className="rounded-md px-3 py-1">Cancel</button>
                  <button onClick={() => {
                    const payload = { name, img, status };
                    if (editing) update.mutate({ id: editing.id, payload });
                    else create.mutate({ id: Date.now(), name, img, status });
                    setIsOpen(false);
                  }} className="rounded-md bg-primary px-3 py-1 text-white">Save</button>
                </div>
              </div>
            </div>
          </div>
        ) : null }
      </>);
  },
});
