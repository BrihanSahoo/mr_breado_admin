import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/page-header";
import { KeyRound } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/permissions")({
  head: () => ({ meta: [{ title: "Permissions | Mr. Breado Admin" }] }),
  component: PermissionsPage,
});

function PermissionsPage() {
  const modules = ["Dashboard", "Orders", "Customers", "Restaurants", "Delivery", "Foods", "Categories", "Offers", "Tickets", "Settings"];
  const roleDefs = ["ADMIN", "SELLER", "DELIVERY_PARTNER", "CUSTOMER"];

  const storageKey = "admin_permissions_config";
  const [state, setState] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try { setState(JSON.parse(raw)); return; } catch (e) { /* ignore */ }
    }
    // default values
    const initial: Record<string, Record<string, boolean>> = {};
    modules.forEach((m, i) => {
      initial[m] = {};
      roleDefs.forEach((r, j) => { initial[m][r] = ((i + j) % 3) !== 0; });
    });
    setState(initial);
  }, []);

  function toggle(module: string, role: string) {
    setState((s) => ({ ...s, [module]: { ...(s[module] || {}), [role]: !(s[module]?.[role] ?? false) } }));
  }

  function handleSave() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      toast.success("Permissions saved (local only).");
    } catch (e) {
      toast.error("Failed to save permissions.");
    }
  }

  return (<>
    <PageHeader title="Permissions" icon={<KeyRound className="h-5 w-5"/>}
      breadcrumbs={[{label:"Dashboard",to:"/"},{label:"Role Management"},{label:"Permissions"}]} />
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="mb-4 flex items-center justify-end">
        <button onClick={handleSave} className="rounded-md gradient-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">Save</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Module</th>
              {roleDefs.map(r => <th key={r} className="px-4 py-3 text-center">{r.replace('_', ' ')}</th>)}
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr key={m} className="border-b border-border/60">
                <td className="px-4 py-3 font-medium">{m}</td>
                {roleDefs.map((r) => (
                  <td key={r} className="px-4 py-3 text-center">
                    <label className="inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={!!state[m]?.[r]} onChange={() => toggle(m, r)} className="peer sr-only" />
                      <div className="relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
                    </label>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}
