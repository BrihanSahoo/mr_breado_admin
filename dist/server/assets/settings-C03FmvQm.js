import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { r as request, e as endpoints, P as PageHeader } from "./router-1xz68c6T.js";
import { Settings, Store, Bike, MapPin, Percent, Grid2X2, CreditCard, ShieldCheck, Truck, Save, EyeOff, Eye } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const settingsService = {
  restaurant: () => request({ url: endpoints.admin.restaurantSettings, method: "GET" }),
  updateRestaurant: (data) => request({ url: endpoints.admin.restaurantSettings, method: "PUT", data }),
  driver: () => request({ url: endpoints.admin.driverSettings, method: "GET" }),
  updateDriver: (data) => request({ url: endpoints.admin.driverSettings, method: "PUT", data }),
  map: async () => {
    const data = await request({ url: "/admin/business/settings", method: "GET" });
    return {
      ...data,
      googleMapKey: data.googleMapKey ?? data.googleMapsApiKey ?? "",
      provider: data.distanceProvider === "GOOGLE" || data.provider === "GOOGLE" ? "GOOGLE" : "OSM"
    };
  },
  updateMap: (data) => request({
    url: "/admin/business/settings",
    method: "PUT",
    data: {
      ...data,
      googleMapKey: data.googleMapKey ?? data.googleMapsApiKey ?? "",
      googleMapsApiKey: data.googleMapKey ?? data.googleMapsApiKey ?? "",
      distanceProvider: data.provider === "GOOGLE" ? "GOOGLE" : "HAVERSINE"
    }
  }),
  commission: () => request({ url: endpoints.admin.commissionSettings, method: "GET" }),
  updateVendorCommission: (data) => request({ url: endpoints.admin.vendorCommissionSettings, method: "PUT", data }),
  updateDriverCommission: (data) => request({ url: endpoints.admin.driverCommissionSettings, method: "PUT", data }),
  platformFee: () => request({ url: endpoints.admin.platformFeeSettings, method: "GET" }),
  updatePlatformFee: (data) => request({ url: endpoints.admin.platformFeeSettings, method: "PUT", data }),
  // Real backend platform settings used by app checkout/payment/takeaway flows.
  // Admin can change Razorpay key id/secret, enable/disable online payment, COD,
  // Mr. Breado takeaway, delivery charge rules, rider payout and support details.
  platformAdmin: () => request({ url: endpoints.platform.adminSettings, method: "GET" }),
  updatePlatformAdmin: (data) => request({ url: endpoints.platform.adminSettings, method: "PUT", data })
};
const tabs = [{
  key: "restaurant",
  label: "Restaurant Settings",
  icon: Store
}, {
  key: "driver",
  label: "Driver Settings",
  icon: Bike
}, {
  key: "map",
  label: "Map Settings",
  icon: MapPin
}, {
  key: "commission",
  label: "Admin Commission",
  icon: Percent
}, {
  key: "platform",
  label: "Platform Fee",
  icon: Grid2X2
}, {
  key: "payment",
  label: "Payment & Takeaway",
  icon: CreditCard
}];
const platformDefaults = {
  codEnabled: true,
  onlinePaymentEnabled: false,
  razorpayMode: "TEST",
  razorpayKeyId: "",
  razorpayKeySecret: "",
  razorpaySecretConfigured: false,
  mrBreadoTakeawayEnabled: false,
  takeawayBookingFeePercent: 20,
  deliveryChargePerKm: 8,
  minimumDeliveryCharge: 25,
  maximumDeliveryCharge: 120,
  riderDeliveryPayPerKm: 6,
  minimumRiderDeliveryPay: 20,
  supportEmail: "",
  supportPhone: "",
  businessAddress: "",
  businessLatitude: "",
  businessLongitude: "",
  googleMapsApiKey: "",
  googleMapsApiKeyConfigured: false,
  googleDistanceEnabled: false
};
function SettingsPage() {
  const [tab, setTab] = useState("payment");
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Settings", icon: /* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Settings"
    }] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]", children: [
      /* @__PURE__ */ jsx("aside", { className: "rounded-xl border border-border bg-card p-3 shadow-card", children: tabs.map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.key), className: `mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${tab === t.key ? "bg-primary/15 text-primary" : "hover:bg-accent"}`, children: [
        /* @__PURE__ */ jsx(t.icon, { className: "h-4 w-4" }),
        " ",
        t.label
      ] }, t.key)) }),
      /* @__PURE__ */ jsxs("section", { className: "min-w-0 rounded-xl border border-border bg-card p-4 shadow-card md:p-6", children: [
        tab === "restaurant" && /* @__PURE__ */ jsx(RestaurantSettings, {}),
        tab === "driver" && /* @__PURE__ */ jsx(DriverSettings, {}),
        tab === "map" && /* @__PURE__ */ jsx(MapSettings, {}),
        tab === "commission" && /* @__PURE__ */ jsx(CommissionSettings, {}),
        tab === "platform" && /* @__PURE__ */ jsx(PlatformSettings, {}),
        tab === "payment" && /* @__PURE__ */ jsx(PaymentAndTakeawaySettings, {})
      ] })
    ] })
  ] });
}
function useSettingsQuery(key, fn) {
  return useQuery({
    queryKey: ["settings", key],
    queryFn: fn,
    staleTime: 3e4
  });
}
function useSave(key, fn) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      toast.success("Settings saved successfully");
      qc.invalidateQueries({
        queryKey: ["settings", key]
      });
    },
    onError: (e) => toast.error(e.message)
  });
}
function RestaurantSettings() {
  const {
    data
  } = useSettingsQuery("restaurant", settingsService.restaurant);
  const save = useSave("restaurant", settingsService.updateRestaurant);
  const [form, setForm] = useState({});
  useEffect(() => setForm(data ?? {}), [data]);
  return /* @__PURE__ */ jsxs(Panel, { title: "Restaurant Settings", children: [
    /* @__PURE__ */ jsx(Toggle, { label: "Subscription Plan", value: !!form.subscriptionPlanEnabled, onChange: (v) => setForm({
      ...form,
      subscriptionPlanEnabled: v
    }) }),
    /* @__PURE__ */ jsx(Toggle, { label: "Vendor Document Verification", value: !!form.vendorDocumentVerificationEnabled, onChange: (v) => setForm({
      ...form,
      vendorDocumentVerificationEnabled: v
    }) }),
    /* @__PURE__ */ jsx(Toggle, { label: "Self Delivery", value: !!form.selfDeliveryEnabled, onChange: (v) => setForm({
      ...form,
      selfDeliveryEnabled: v
    }) }),
    /* @__PURE__ */ jsx(Field, { label: "Restaurant Location Radius", value: form.restaurantLocationRadius ?? "", onChange: (v) => setForm({
      ...form,
      restaurantLocationRadius: Number(v)
    }) }),
    /* @__PURE__ */ jsx(SaveButton, { loading: save.isPending, onClick: () => save.mutate(form) })
  ] });
}
function DriverSettings() {
  const {
    data
  } = useSettingsQuery("driver", settingsService.driver);
  const save = useSave("driver", settingsService.updateDriver);
  const [form, setForm] = useState({});
  useEffect(() => setForm(data ?? {}), [data]);
  return /* @__PURE__ */ jsxs(Panel, { title: "Driver Settings", children: [
    /* @__PURE__ */ jsx(Toggle, { label: "Driver Document Verification", value: !!form.driverDocumentVerificationEnabled, onChange: (v) => setForm({
      ...form,
      driverDocumentVerificationEnabled: v
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(Field, { label: "Driver Radius", value: form.driverRadiusKm ?? "", onChange: (v) => setForm({
        ...form,
        driverRadiusKm: Number(v)
      }) }),
      /* @__PURE__ */ jsx(Field, { label: "Driver Location Update", value: form.driverLocationUpdateSeconds ?? "", onChange: (v) => setForm({
        ...form,
        driverLocationUpdateSeconds: Number(v)
      }) }),
      /* @__PURE__ */ jsx(Field, { label: "Fare per KM", value: form.farePerKm ?? "", onChange: (v) => setForm({
        ...form,
        farePerKm: Number(v)
      }) }),
      /* @__PURE__ */ jsx(Field, { label: "Fare MinCharge With KM", value: form.fareMinChargeWithKm ?? "", onChange: (v) => setForm({
        ...form,
        fareMinChargeWithKm: Number(v)
      }) }),
      /* @__PURE__ */ jsx(Field, { label: "Fare Minimum Charge", value: form.fareMinimumCharge ?? "", onChange: (v) => setForm({
        ...form,
        fareMinimumCharge: Number(v)
      }) })
    ] }),
    /* @__PURE__ */ jsx(Toggle, { label: "Delivery Charges", value: !!form.deliveryChargeEnabled, onChange: (v) => setForm({
      ...form,
      deliveryChargeEnabled: v
    }) }),
    /* @__PURE__ */ jsx(SaveButton, { loading: save.isPending, onClick: () => save.mutate(form) })
  ] });
}
function MapSettings() {
  const {
    data
  } = useSettingsQuery("map", settingsService.map);
  const save = useSave("map", settingsService.updateMap);
  const [form, setForm] = useState({});
  useEffect(() => setForm(data ?? {}), [data]);
  return /* @__PURE__ */ jsxs(Panel, { title: "Map Settings", children: [
    /* @__PURE__ */ jsx(Field, { label: "Google Map Key", value: form.googleMapKey ?? "", onChange: (v) => setForm({
      ...form,
      googleMapKey: v
    }) }),
    /* @__PURE__ */ jsx(SelectField, { label: "Type", value: form.provider ?? "OSM", onChange: (v) => setForm({
      ...form,
      provider: v
    }), options: ["OSM", "GOOGLE"] }),
    /* @__PURE__ */ jsx(SaveButton, { loading: save.isPending, onClick: () => save.mutate(form) })
  ] });
}
function CommissionSettings() {
  const {
    data
  } = useSettingsQuery("commission", settingsService.commission);
  const vendorSave = useSave("commission", settingsService.updateVendorCommission);
  const driverSave = useSave("commission", settingsService.updateDriverCommission);
  const [vendor, setVendor] = useState({});
  const [driver, setDriver] = useState({});
  useEffect(() => {
    setVendor({
      type: data?.["vendor.type"] ?? data?.vendor?.type ?? "FIXED",
      value: data?.["vendor.value"] ?? data?.vendor?.value ?? 15,
      active: data?.["vendor.active"] ?? data?.vendor?.active ?? true
    });
    setDriver({
      type: data?.["driver.type"] ?? data?.driver?.type ?? "PERCENTAGE",
      value: data?.["driver.value"] ?? data?.driver?.value ?? 20,
      active: data?.["driver.active"] ?? data?.driver?.active ?? true
    });
  }, [data]);
  return /* @__PURE__ */ jsxs(Panel, { title: "Admin Commission Settings", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Vendor Admin Commission" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(SelectField, { label: "Commission Type", value: vendor.type, onChange: (v) => setVendor({
        ...vendor,
        type: v
      }), options: ["FIXED", "PERCENTAGE"] }),
      /* @__PURE__ */ jsx(Field, { label: "Admin Commission", value: vendor.value ?? "", onChange: (v) => setVendor({
        ...vendor,
        value: Number(v)
      }) })
    ] }),
    /* @__PURE__ */ jsx(Toggle, { label: "Status", value: !!vendor.active, onChange: (v) => setVendor({
      ...vendor,
      active: v
    }) }),
    /* @__PURE__ */ jsx(SaveButton, { loading: vendorSave.isPending, onClick: () => vendorSave.mutate(vendor) }),
    /* @__PURE__ */ jsx("hr", { className: "border-border" }),
    /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Driver Admin Commission" }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx(SelectField, { label: "Commission Type", value: driver.type, onChange: (v) => setDriver({
        ...driver,
        type: v
      }), options: ["FIXED", "PERCENTAGE"] }),
      /* @__PURE__ */ jsx(Field, { label: "Admin Commission", value: driver.value ?? "", onChange: (v) => setDriver({
        ...driver,
        value: Number(v)
      }) })
    ] }),
    /* @__PURE__ */ jsx(Toggle, { label: "Status", value: !!driver.active, onChange: (v) => setDriver({
      ...driver,
      active: v
    }) }),
    /* @__PURE__ */ jsx(SaveButton, { loading: driverSave.isPending, onClick: () => driverSave.mutate(driver) })
  ] });
}
function PlatformSettings() {
  const {
    data
  } = useSettingsQuery("platform", settingsService.platformFee);
  const save = useSave("platform", settingsService.updatePlatformFee);
  const [form, setForm] = useState({});
  useEffect(() => setForm(data ?? {}), [data]);
  return /* @__PURE__ */ jsxs(Panel, { title: "Platform Fee Settings", children: [
    /* @__PURE__ */ jsx(Field, { label: "Platform Fee", value: form.platformFee ?? "", onChange: (v) => setForm({
      ...form,
      platformFee: Number(v)
    }) }),
    /* @__PURE__ */ jsx(Toggle, { label: "Platform Fee Status", value: !!form.platformFeeActive, onChange: (v) => setForm({
      ...form,
      platformFeeActive: v
    }) }),
    /* @__PURE__ */ jsx(Toggle, { label: "Packaging Fee", value: !!form.packagingFeeActive, onChange: (v) => setForm({
      ...form,
      packagingFeeActive: v
    }) }),
    /* @__PURE__ */ jsx(SaveButton, { loading: save.isPending, onClick: () => save.mutate(form) })
  ] });
}
function PaymentAndTakeawaySettings() {
  const {
    data,
    isLoading
  } = useSettingsQuery("platform-payment", settingsService.platformAdmin);
  const save = useSave("platform-payment", settingsService.updatePlatformAdmin);
  const [form, setForm] = useState(platformDefaults);
  const [showSecret, setShowSecret] = useState(false);
  useEffect(() => {
    if (!data) return;
    setForm({
      ...platformDefaults,
      ...data,
      razorpayKeySecret: "",
      supportEmail: data.supportEmail ?? "",
      supportPhone: data.supportPhone ?? "",
      businessAddress: data.businessAddress ?? "",
      businessLatitude: data.businessLatitude ?? "",
      businessLongitude: data.businessLongitude ?? "",
      googleMapsApiKey: "",
      googleMapsApiKeyConfigured: data.googleMapsApiKeyConfigured ?? false,
      googleDistanceEnabled: data.googleDistanceEnabled ?? false
    });
  }, [data]);
  const razorpayReady = useMemo(() => Boolean(form.razorpayKeyId) && (Boolean(form.razorpayKeySecret) || Boolean(form.razorpaySecretConfigured)), [form.razorpayKeyId, form.razorpayKeySecret, form.razorpaySecretConfigured]);
  const set = (key, value) => setForm((current) => ({
    ...current,
    [key]: value
  }));
  const numberSet = (key, value) => set(key, value === "" ? "" : Number(value));
  const payload = () => ({
    codEnabled: Boolean(form.codEnabled),
    onlinePaymentEnabled: Boolean(form.onlinePaymentEnabled),
    razorpayMode: form.razorpayMode || "TEST",
    razorpayKeyId: optionalText(form.razorpayKeyId),
    razorpayKeySecret: optionalText(form.razorpayKeySecret),
    mrBreadoTakeawayEnabled: Boolean(form.mrBreadoTakeawayEnabled),
    takeawayBookingFeePercent: moneyNumber(form.takeawayBookingFeePercent, 20),
    deliveryChargePerKm: moneyNumber(form.deliveryChargePerKm, 8),
    minimumDeliveryCharge: moneyNumber(form.minimumDeliveryCharge, 25),
    maximumDeliveryCharge: moneyNumber(form.maximumDeliveryCharge, 120),
    riderDeliveryPayPerKm: moneyNumber(form.riderDeliveryPayPerKm, 6),
    minimumRiderDeliveryPay: moneyNumber(form.minimumRiderDeliveryPay, 20),
    supportEmail: optionalText(form.supportEmail),
    supportPhone: optionalText(form.supportPhone),
    businessAddress: optionalText(form.businessAddress),
    businessLatitude: optionalNumber(form.businessLatitude),
    businessLongitude: optionalNumber(form.businessLongitude),
    googleMapsApiKey: optionalText(form.googleMapsApiKey),
    googleDistanceEnabled: Boolean(form.googleDistanceEnabled)
  });
  const onSave = () => {
    if (!form.codEnabled && !form.onlinePaymentEnabled) {
      toast.error("Keep at least one payment method enabled.");
      return;
    }
    if (form.mrBreadoTakeawayEnabled && !form.onlinePaymentEnabled) {
      toast.error("Enable online payment before enabling takeaway.");
      return;
    }
    if (form.onlinePaymentEnabled && !razorpayReady) {
      toast.error("Add Razorpay Key ID and Secret Key before enabling online payment.");
      return;
    }
    save.mutate(payload());
  };
  if (isLoading) {
    return /* @__PURE__ */ jsx(Panel, { title: "Payment & Takeaway Settings", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx("div", { className: "h-24 animate-pulse rounded-xl bg-muted" }),
      /* @__PURE__ */ jsx("div", { className: "h-24 animate-pulse rounded-xl bg-muted" }),
      /* @__PURE__ */ jsx("div", { className: "h-44 animate-pulse rounded-xl bg-muted md:col-span-2" })
    ] }) });
  }
  return /* @__PURE__ */ jsxs(Panel, { title: "Payment & Takeaway Settings", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900", children: [
      /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "Production payment control" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs leading-5", children: "These settings are used by the customer app checkout flow. Online payment is available only when it is enabled and Razorpay credentials are configured. Secret key is never shown after saving; enter a new secret only when you want to replace it." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsx(StatusCard, { icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }), title: "Online Payment", active: !!form.onlinePaymentEnabled && razorpayReady, activeText: "Enabled", inactiveText: form.onlinePaymentEnabled ? "Credentials needed" : "Disabled" }),
      /* @__PURE__ */ jsx(StatusCard, { icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }), title: "Razorpay Secret", active: !!form.razorpaySecretConfigured || !!form.razorpayKeySecret, activeText: "Configured", inactiveText: "Not configured" }),
      /* @__PURE__ */ jsx(StatusCard, { icon: /* @__PURE__ */ jsx(Truck, { className: "h-5 w-5" }), title: "Mr. Breado Takeaway", active: !!form.mrBreadoTakeawayEnabled, activeText: "Enabled", inactiveText: "Disabled" })
    ] }),
    /* @__PURE__ */ jsxs(Gateway, { title: "Payment Availability", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Cash on Delivery", value: !!form.codEnabled, onChange: (v) => set("codEnabled", v) }),
      /* @__PURE__ */ jsx(Toggle, { label: "Online Payment", value: !!form.onlinePaymentEnabled, onChange: (v) => set("onlinePaymentEnabled", v) }),
      /* @__PURE__ */ jsx(Toggle, { label: "Mr. Breado Takeaway", value: !!form.mrBreadoTakeawayEnabled, onChange: (v) => set("mrBreadoTakeawayEnabled", v) }),
      /* @__PURE__ */ jsx(SelectField, { label: "Razorpay Mode", value: form.razorpayMode ?? "TEST", onChange: (v) => set("razorpayMode", v), options: ["TEST", "LIVE"] })
    ] }),
    /* @__PURE__ */ jsxs(Gateway, { title: "Razorpay Credentials", children: [
      /* @__PURE__ */ jsx(Field, { label: "Razorpay Key ID", value: form.razorpayKeyId ?? "", onChange: (v) => set("razorpayKeyId", v), placeholder: "rzp_test_xxxxx or rzp_live_xxxxx" }),
      /* @__PURE__ */ jsx(SecretField, { label: "Razorpay Secret Key", value: form.razorpayKeySecret ?? "", visible: showSecret, configured: !!form.razorpaySecretConfigured, onToggle: () => setShowSecret(!showSecret), onChange: (v) => set("razorpayKeySecret", v) })
    ] }),
    /* @__PURE__ */ jsxs(Gateway, { title: "Takeaway & Delivery Charges", children: [
      /* @__PURE__ */ jsx(Field, { label: "Takeaway Booking Fee (%)", type: "number", value: form.takeawayBookingFeePercent ?? "", onChange: (v) => numberSet("takeawayBookingFeePercent", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Customer Delivery Charge / KM (₹)", type: "number", value: form.deliveryChargePerKm ?? "", onChange: (v) => numberSet("deliveryChargePerKm", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Minimum Delivery Charge (₹)", type: "number", value: form.minimumDeliveryCharge ?? "", onChange: (v) => numberSet("minimumDeliveryCharge", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Maximum Delivery Charge (₹)", type: "number", value: form.maximumDeliveryCharge ?? "", onChange: (v) => numberSet("maximumDeliveryCharge", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Rider Pay / KM (₹)", type: "number", value: form.riderDeliveryPayPerKm ?? "", onChange: (v) => numberSet("riderDeliveryPayPerKm", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Minimum Rider Pay (₹)", type: "number", value: form.minimumRiderDeliveryPay ?? "", onChange: (v) => numberSet("minimumRiderDeliveryPay", v) })
    ] }),
    /* @__PURE__ */ jsxs(Gateway, { title: "Google Maps Distance API", children: [
      /* @__PURE__ */ jsx(Toggle, { label: "Use Google distance calculation when key is configured", value: !!form.googleDistanceEnabled, onChange: (v) => set("googleDistanceEnabled", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Google Maps API Key", value: form.googleMapsApiKey ?? "", onChange: (v) => set("googleMapsApiKey", v), placeholder: form.googleMapsApiKeyConfigured ? "Key already configured. Leave blank to keep existing." : "AIza..." }),
      /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-background p-3 text-xs leading-5 text-muted-foreground md:col-span-2 xl:col-span-3", children: "The key is stored only on the backend. Customer apps receive calculated distance and delivery charge, never the API key. If Google distance fails, backend should fall back to safe haversine calculation and return a clear distance-unavailable message when needed." })
    ] }),
    /* @__PURE__ */ jsxs(Gateway, { title: "Business Support Details", children: [
      /* @__PURE__ */ jsx(Field, { label: "Support Email", value: form.supportEmail ?? "", onChange: (v) => set("supportEmail", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Support Phone", value: form.supportPhone ?? "", onChange: (v) => set("supportPhone", v), placeholder: "10 digit mobile number" }),
      /* @__PURE__ */ jsx(Field, { label: "Business Latitude", type: "number", value: form.businessLatitude ?? "", onChange: (v) => set("businessLatitude", v) }),
      /* @__PURE__ */ jsx(Field, { label: "Business Longitude", type: "number", value: form.businessLongitude ?? "", onChange: (v) => set("businessLongitude", v) }),
      /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium md:col-span-2 xl:col-span-3", children: [
        "Business Address",
        /* @__PURE__ */ jsx("textarea", { value: form.businessAddress ?? "", onChange: (e) => set("businessAddress", e.target.value), className: "mt-1 min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SaveButton, { loading: save.isPending, onClick: onSave, label: "Save Payment Settings" })
  ] });
}
function optionalText(value) {
  const text = value == null ? "" : String(value).trim();
  return text.length ? text : null;
}
function optionalNumber(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function moneyNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}
function Panel({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: title }),
    children
  ] });
}
function Gateway({
  title,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-b border-border pb-5 last:border-0", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold", children: title }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-3", children })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = ""
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("input", { type, value: value ?? "", placeholder, onChange: (e) => onChange(e.target.value), className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" })
  ] });
}
function SecretField({
  label,
  value,
  onChange,
  visible,
  onToggle,
  configured
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsxs("div", { className: "mt-1 flex overflow-hidden rounded-md border border-border bg-background focus-within:border-primary", children: [
      /* @__PURE__ */ jsx("input", { type: visible ? "text" : "password", value: value ?? "", placeholder: configured ? "Secret already configured. Leave blank to keep existing." : "Enter Razorpay secret key", onChange: (e) => onChange(e.target.value), className: "min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none" }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: onToggle, className: "border-l border-border px-3 text-muted-foreground hover:text-foreground", children: visible ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
    ] })
  ] });
}
function SelectField({
  label,
  value,
  onChange,
  options
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("select", { value: value ?? "", onChange: (e) => onChange(e.target.value), className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary", children: options.map((o) => /* @__PURE__ */ jsx("option", { value: o, children: o }, o)) })
  ] });
}
function Toggle({
  label,
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxs("label", { className: "inline-flex cursor-pointer items-center", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: value, onChange: (e) => onChange(e.target.checked), className: "peer sr-only" }),
      /* @__PURE__ */ jsx("div", { className: "relative h-5 w-9 rounded-full bg-muted transition peer-checked:bg-primary after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" })
    ] })
  ] });
}
function SaveButton({
  onClick,
  loading,
  label = "Save"
}) {
  return /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("button", { disabled: loading, onClick, className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:cursor-not-allowed disabled:opacity-60", children: [
    /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
    loading ? "Saving..." : label
  ] }) });
}
function StatusCard({
  icon,
  title,
  active,
  activeText,
  inactiveText
}) {
  return /* @__PURE__ */ jsx("div", { className: `rounded-xl border p-4 ${active ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-border bg-background text-muted-foreground"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 font-semibold", children: [
      icon,
      title
    ] }),
    /* @__PURE__ */ jsx("span", { className: `rounded-full px-2 py-1 text-xs font-bold ${active ? "bg-emerald-600 text-white" : "bg-muted text-foreground"}`, children: active ? activeText : inactiveText })
  ] }) });
}
export {
  SettingsPage as component
};
