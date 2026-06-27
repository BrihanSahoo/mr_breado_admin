import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { Loader2, MapPin, Pencil, Plus, Radar, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import {
  zonesService,
  type DeliveryZone,
  type DeliveryZoneInput,
} from "@/services/zones.service";

export const Route = createFileRoute("/zones")({
  head: () => ({ meta: [{ title: "Zones | Mr. Breado Admin" }] }),
  component: ZonesPage,
});

const emptyZone: DeliveryZoneInput = {
  name: "",
  deliveryCharge: 0,
  radiusKm: 5,
  latitude: 22.5726,
  longitude: 88.3639,
  active: true,
};

function haptic(pattern: number | number[] = 12) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* optional */
  }
}

function ZonesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [creating, setCreating] = useState(false);
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "zones"],
    queryFn: zonesService.list,
  });
  const totalActive = useMemo(
    () => data.filter((zone) => zone.active).length,
    [data],
  );

  const remove = useMutation({
    mutationFn: zonesService.remove,
    onSuccess: () => {
      haptic([20, 25, 20]);
      toast.success("Zone deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "zones"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <PageHeader
        title="Delivery Zones"
        icon={<MapPin className="h-5 w-5" />}
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Delivery Zones" },
        ]}
        actions={
          <button
            onClick={() => {
              haptic();
              setCreating(true);
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl gradient-primary px-4 py-2 text-sm font-black text-primary-foreground shadow-glow"
          >
            <Plus className="h-4 w-4" /> Add Zone
          </button>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Metric
          label="Configured zones"
          value={data.length}
          icon={<MapPin className="h-5 w-5" />}
        />
        <Metric
          label="Active zones"
          value={totalActive}
          icon={<Radar className="h-5 w-5" />}
        />
        <Metric
          label="Inactive zones"
          value={data.length - totalActive}
          icon={<X className="h-5 w-5" />}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl bg-primary/5"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          {(error as Error).message}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-primary/30 bg-card p-12 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-black">
            No delivery zones configured
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Add a database-backed service zone with a centre coordinate, radius
            and delivery charge. These values remain available after deployment.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((zone) => (
            <article
              key={zone.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow"
            >
              <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary/20 via-background to-primary/5">
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 25% 35%, currentColor 0 2px, transparent 3px), radial-gradient(circle at 70% 65%, currentColor 0 2px, transparent 3px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/15 text-primary">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                <span
                  className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-black ${zone.active ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                >
                  {zone.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <h3 className="text-lg font-black">{zone.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {zone.latitude.toFixed(5)}, {zone.longitude.toFixed(5)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <SmallMetric
                    label="Radius"
                    value={`${zone.radiusKm.toFixed(1)} km`}
                  />
                  <SmallMetric
                    label="Delivery charge"
                    value={`₹${zone.deliveryCharge.toFixed(2)}`}
                  />
                </div>
                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <button
                    onClick={() => {
                      haptic();
                      setEditing(zone);
                    }}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-bold transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button
                    disabled={remove.isPending}
                    onClick={() => {
                      if (window.confirm(`Delete ${zone.name}?`))
                        remove.mutate(zone.id);
                    }}
                    className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-destructive/20 px-3 py-2 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {(creating || editing) && (
        <ZoneDialog
          zone={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function ZoneDialog({
  zone,
  onClose,
}: {
  zone: DeliveryZone | null;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<DeliveryZoneInput>(
    zone
      ? {
          name: zone.name,
          deliveryCharge: zone.deliveryCharge,
          radiusKm: zone.radiusKm,
          latitude: zone.latitude,
          longitude: zone.longitude,
          active: zone.active,
        }
      : emptyZone,
  );
  const save = useMutation({
    mutationFn: () =>
      zone ? zonesService.update(zone.id, form) : zonesService.create(form),
    onSuccess: () => {
      haptic([18, 22, 18]);
      toast.success(zone ? "Zone updated" : "Zone created");
      queryClient.invalidateQueries({ queryKey: ["admin", "zones"] });
      onClose();
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const valid =
    form.name.trim().length > 0 &&
    form.radiusKm >= 0 &&
    form.deliveryCharge >= 0 &&
    Number.isFinite(form.latitude) &&
    Number.isFinite(form.longitude);
  const setNumber = (key: keyof DeliveryZoneInput, value: string) =>
    setForm((current) => ({
      ...current,
      [key]: value === "" ? 0 : Number(value),
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[96dvh] w-full max-w-xl overflow-y-auto rounded-t-[28px] border border-primary/25 bg-card p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black">
              {zone ? "Edit delivery zone" : "Create delivery zone"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Stored in MongoDB and used as an admin-controlled service
              configuration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field
            label="Zone name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
            className="sm:col-span-2"
          />
          <Field
            label="Centre latitude"
            type="number"
            value={form.latitude}
            onChange={(value) => setNumber("latitude", value)}
          />
          <Field
            label="Centre longitude"
            type="number"
            value={form.longitude}
            onChange={(value) => setNumber("longitude", value)}
          />
          <Field
            label="Service radius (km)"
            type="number"
            value={form.radiusKm}
            onChange={(value) => setNumber("radiusKm", value)}
          />
          <Field
            label="Delivery charge (₹)"
            type="number"
            value={form.deliveryCharge}
            onChange={(value) => setNumber("deliveryCharge", value)}
          />
          <label className="flex min-h-12 items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm font-bold sm:col-span-2">
            Zone available
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm({ ...form, active: event.target.checked })
              }
              className="h-5 w-5 accent-primary"
            />
          </label>
        </div>
        <div className="sticky bottom-0 -mx-5 mt-6 flex justify-end gap-2 border-t bg-card/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <button
            disabled={save.isPending}
            onClick={onClose}
            className="min-h-11 rounded-xl border border-border px-4 py-2 font-bold hover:bg-accent"
          >
            Cancel
          </button>
          <button
            disabled={!valid || save.isPending}
            onClick={() => save.mutate()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl gradient-primary px-5 py-2 font-black text-primary-foreground disabled:opacity-50"
          >
            {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {save.isPending ? "Saving…" : "Save zone"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}
function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/70 p-3">
      <p className="text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-bold ${className}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 min-h-12 w-full rounded-xl border border-border bg-background px-3 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 sm:text-sm"
      />
    </label>
  );
}
