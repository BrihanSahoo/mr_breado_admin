import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/zones")({
  head: () => ({ meta: [{ title: "Zones | Mr. Breado Admin" }] }),
  component: () => {
    const zones = [
      { name:"Downtown", charge:2.50, restaurants:24, status:"Active" },
      { name:"Uptown", charge:3.00, restaurants:18, status:"Active" },
      { name:"Eastside", charge:3.50, restaurants:12, status:"Active" },
      { name:"Westside", charge:4.00, restaurants:9, status:"Inactive" },
    ];
    return (<>
      <PageHeader title="Zone Management" icon={<MapPin className="h-5 w-5"/>}
        breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Zones"}]}
        actions={<button className="inline-flex items-center gap-1.5 rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-glow"><Plus className="h-4 w-4"/> Add Zone</button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <h3 className="mb-3 font-semibold">Delivery Map</h3>
          <div className="relative flex h-96 items-center justify-center overflow-hidden rounded-lg bg-background">
            <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 30% 40%, var(--color-primary) 0%, transparent 30%), radial-gradient(circle at 70% 60%, var(--color-info) 0%, transparent 30%)"}}/>
            <div className="relative text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary"/>
              <p className="mt-2 text-sm text-muted-foreground">Google Maps integration · Draw zone polygons</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {zones.map(z => (
            <div key={z.name} className="rounded-xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{z.name}</h4>
                <span className={`rounded-full px-2 py-0.5 text-xs ${z.status==="Active"?"bg-success/15 text-success":"bg-muted text-muted-foreground"}`}>{z.status}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div><div className="text-muted-foreground">Delivery</div><div className="font-semibold">₹{z.charge}</div></div>
                <div><div className="text-muted-foreground">Restaurants</div><div className="font-semibold">{z.restaurants}</div></div>
              </div>
              <div className="mt-3 flex justify-end gap-1">
                <button className="rounded p-1.5 text-primary hover:bg-primary/10"><Pencil className="h-4 w-4"/></button>
                <button className="rounded p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>);
  },
});
