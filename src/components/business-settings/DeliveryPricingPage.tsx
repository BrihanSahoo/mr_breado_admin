import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeIndianRupee,
  Bike,
  Calculator,
  Database,
  Route,
  Save,
  ShoppingBag,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { request } from "@/api/client";
import { toast } from "sonner";

type DeliveryPricingResponse = {
  baseDeliveryCharge?: number;
  deliveryChargePerKm?: number;
  minimumDeliveryCharge?: number;
  maximumDeliveryCharge?: number;
  riderBasePay?: number;
  riderPayPerKm?: number;
  minimumRiderDeliveryPay?: number;
  assignmentRadiusKm?: number;
  monthlySettlementDay?: number;
  customer?: {
    baseCharge?: number;
    perKmCharge?: number;
    minimumCharge?: number;
    maximumCharge?: number;
  };
  rider?: {
    basePay?: number;
    perKmRate?: number;
    minimumDeliveryPay?: number;
    assignmentRadiusKm?: number;
    monthlySettlementDay?: number;
  };
};

type PricingForm = {
  baseDeliveryCharge: number;
  deliveryChargePerKm: number;
  minimumDeliveryCharge: number;
  maximumDeliveryCharge: number;
  riderBasePay: number;
  riderPayPerKm: number;
  minimumRiderDeliveryPay: number;
  assignmentRadiusKm: number;
  monthlySettlementDay: number;
};

const defaults: PricingForm = {
  baseDeliveryCharge: 20,
  deliveryChargePerKm: 8,
  minimumDeliveryCharge: 20,
  maximumDeliveryCharge: 150,
  riderBasePay: 0,
  riderPayPerKm: 7,
  minimumRiderDeliveryPay: 20,
  assignmentRadiusKm: 8,
  monthlySettlementDay: 1,
};

function fromResponse(data?: DeliveryPricingResponse): PricingForm {
  return {
    baseDeliveryCharge: Number(data?.baseDeliveryCharge ?? data?.customer?.baseCharge ?? defaults.baseDeliveryCharge),
    deliveryChargePerKm: Number(data?.deliveryChargePerKm ?? data?.customer?.perKmCharge ?? defaults.deliveryChargePerKm),
    minimumDeliveryCharge: Number(data?.minimumDeliveryCharge ?? data?.customer?.minimumCharge ?? defaults.minimumDeliveryCharge),
    maximumDeliveryCharge: Number(data?.maximumDeliveryCharge ?? data?.customer?.maximumCharge ?? defaults.maximumDeliveryCharge),
    riderBasePay: Number(data?.riderBasePay ?? data?.rider?.basePay ?? defaults.riderBasePay),
    riderPayPerKm: Number(data?.riderPayPerKm ?? data?.rider?.perKmRate ?? defaults.riderPayPerKm),
    minimumRiderDeliveryPay: Number(data?.minimumRiderDeliveryPay ?? data?.rider?.minimumDeliveryPay ?? defaults.minimumRiderDeliveryPay),
    assignmentRadiusKm: Number(data?.assignmentRadiusKm ?? data?.rider?.assignmentRadiusKm ?? defaults.assignmentRadiusKm),
    monthlySettlementDay: Number(data?.monthlySettlementDay ?? data?.rider?.monthlySettlementDay ?? defaults.monthlySettlementDay),
  };
}

function clampMoney(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

export function DeliveryPricingPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<PricingForm>(defaults);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["delivery-pricing"],
    queryFn: () => request<DeliveryPricingResponse>({ url: "/admin/delivery-pricing", method: "GET" }),
  });

  useEffect(() => {
    if (data) setForm(fromResponse(data));
  }, [data]);

  const save = useMutation({
    mutationFn: (payload: PricingForm) => request<DeliveryPricingResponse>({
      url: "/admin/delivery-pricing",
      method: "PUT",
      data: payload,
    }),
    onSuccess: (saved) => {
      setForm(fromResponse(saved));
      toast.success("Delivery pricing saved to the backend and database");
      queryClient.invalidateQueries({ queryKey: ["delivery-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const set = (key: keyof PricingForm, value: string) => {
    const parsed = clampMoney(value);
    setForm((current) => ({ ...current, [key]: parsed }));
  };

  const validate = () => {
    if (form.maximumDeliveryCharge < form.minimumDeliveryCharge) {
      toast.error("Maximum customer delivery charge cannot be below the minimum charge.");
      return false;
    }
    if (form.monthlySettlementDay < 1 || form.monthlySettlementDay > 28) {
      toast.error("Monthly settlement day must be between 1 and 28.");
      return false;
    }
    return true;
  };

  const previews = useMemo(() => [1, 5, 10].map((distance) => {
    const customerRaw = form.baseDeliveryCharge + distance * form.deliveryChargePerKm;
    const customer = Math.min(form.maximumDeliveryCharge, Math.max(form.minimumDeliveryCharge, customerRaw));
    const riderRaw = form.riderBasePay + distance * form.riderPayPerKm;
    const rider = Math.max(form.minimumRiderDeliveryPay, riderRaw);
    return { distance, customer, rider };
  }), [form]);

  return (
    <>
      <PageHeader
        title="Delivery Pricing"
        icon={<BadgeIndianRupee className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Delivery Pricing" }]}
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<Database className="h-5 w-5" />}
          title="Database backed"
          text={isLoading || isFetching ? "Loading current pricing…" : "Values are loaded from MongoDB settings."}
        />
        <SummaryCard
          icon={<ShoppingBag className="h-5 w-5" />}
          title="Customer checkout"
          text="The backend calculates and stores the order delivery charge using exact distance."
        />
        <SummaryCard
          icon={<Bike className="h-5 w-5" />}
          title="Rider earning"
          text="The same backend settings calculate offer earnings and final rider payout records."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-3 text-primary"><ShoppingBag className="h-5 w-5" /></div>
              <div>
                <h2 className="text-xl font-bold">Customer delivery charge</h2>
                <p className="text-sm text-muted-foreground">Applied at checkout for delivery orders from every outlet.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <MoneyField label="Base charge" value={form.baseDeliveryCharge} onChange={(v) => set("baseDeliveryCharge", v)} />
              <MoneyField label="Charge per KM" value={form.deliveryChargePerKm} onChange={(v) => set("deliveryChargePerKm", v)} />
              <MoneyField label="Minimum delivery charge" value={form.minimumDeliveryCharge} onChange={(v) => set("minimumDeliveryCharge", v)} />
              <MoneyField label="Maximum delivery charge" value={form.maximumDeliveryCharge} onChange={(v) => set("maximumDeliveryCharge", v)} />
            </div>
            <Formula text="Customer fee = max(minimum, min(maximum, base + road distance × charge per KM))" />
          </section>

          <section className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
            <div className="mb-5 flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-3 text-primary"><Bike className="h-5 w-5" /></div>
              <div>
                <h2 className="text-xl font-bold">Rider earning</h2>
                <p className="text-sm text-muted-foreground">Shown in rider offers and saved as the final earning when delivery completes.</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <MoneyField label="Rider base pay" value={form.riderBasePay} onChange={(v) => set("riderBasePay", v)} />
              <MoneyField label="Rider pay per KM" value={form.riderPayPerKm} onChange={(v) => set("riderPayPerKm", v)} />
              <MoneyField label="Minimum rider pay" value={form.minimumRiderDeliveryPay} onChange={(v) => set("minimumRiderDeliveryPay", v)} />
              <NumberField label="Offer assignment radius (KM)" value={form.assignmentRadiusKm} onChange={(v) => set("assignmentRadiusKm", v)} />
              <NumberField label="Monthly settlement day" min={1} max={28} value={form.monthlySettlementDay} onChange={(v) => set("monthlySettlementDay", v)} />
            </div>
            <Formula text="Rider earning = max(minimum rider pay, rider base pay + delivery distance × rider pay per KM)" />
          </section>

          <button
            disabled={isLoading || save.isPending}
            onClick={() => validate() && save.mutate(form)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {save.isPending ? "Saving to database…" : "Save delivery pricing"}
          </button>
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-card md:p-6">
            <div className="mb-4 flex items-center gap-2"><Calculator className="h-5 w-5 text-primary" /><h3 className="text-lg font-bold">Live calculation preview</h3></div>
            <div className="space-y-3">
              {previews.map((preview) => (
                <div key={preview.distance} className="rounded-xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center gap-2 font-bold"><Route className="h-4 w-4 text-primary" />{preview.distance} KM delivery</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Metric label="User pays" value={`₹${preview.customer.toFixed(2)}`} />
                    <Metric label="Rider earns" value={`₹${preview.rider.toFixed(2)}`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm leading-6">
            <div className="font-bold text-emerald-700">Single source of truth</div>
            <p className="mt-1 text-muted-foreground">
              Admin web only saves configuration. The backend recalculates every checkout, serviceability response, rider offer, and completed-delivery earning, so mobile clients cannot manipulate these amounts.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

function MoneyField({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return <NumberField label={`${label} (₹)`} value={value} onChange={onChange} />;
}

function NumberField({ label, value, onChange, min = 0, max }: { label: string; value: number; onChange: (value: string) => void; min?: number; max?: number }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type="number"
        min={min}
        max={max}
        step="0.01"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none focus:border-primary"
      />
    </label>
  );
}

function Formula({ text }: { text: string }) {
  return <div className="mt-5 rounded-xl border border-border bg-background p-4 text-xs font-semibold leading-5 text-muted-foreground">{text}</div>;
}

function SummaryCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="mb-3 text-primary">{icon}</div>
      <div className="font-bold">{title}</div>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className="mt-1 text-lg font-black">{value}</div></div>;
}
