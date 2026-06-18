import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { ShieldCheck, MapPin, Store, Bike, FileText, Eye, CheckCircle2, XCircle, X, Download } from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { a as api, e as endpoints, P as PageHeader, S as StatusBadge } from "./router-1xz68c6T.js";
import { d as driverKeys } from "./use-drivers-D7VbKiyT.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function unwrap(res) {
  return res?.data?.data ?? res?.data ?? res;
}
function asArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.requests)) return data.requests;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.records)) return data.records;
  if (Array.isArray(data?.payload)) return data.payload;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}
function parsePayload(raw) {
  const value = raw?.submittedPayload ?? raw?.submitted_payload ?? raw?.payload;
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return {};
  }
}
function firstNonEmpty(...values) {
  for (const value of values) {
    if (value !== void 0 && value !== null && String(value).trim() !== "") return value;
  }
  return void 0;
}
function normalizeDocuments(raw) {
  if (Array.isArray(raw?.documents)) return raw.documents.map((d) => ({ ...d, url: d.url || d.viewUrl || d.view_url || d.downloadUrl || d.download_url, fileUrl: d.fileUrl || d.viewUrl || d.view_url || d.downloadUrl || d.download_url, name: d.name || d.originalName || d.original_name || d.documentType || d.document_type }));
  const docs = [];
  const fields = [
    ["gstCertificate", "GST Certificate"],
    ["panCard", "PAN Card"],
    ["fssaiLicense", "FSSAI License"],
    ["ownerIdProof", "Owner ID Proof"],
    ["bankProof", "Bank Proof"],
    ["aadhaarFront", "Aadhaar Front"],
    ["aadhaarBack", "Aadhaar Back"],
    ["drivingLicense", "Driving License"],
    ["vehicleRc", "Vehicle RC"],
    ["profilePhoto", "Profile Photo"],
    ["documentUrl", "Document"],
    ["fileUrl", "Document"],
    ["url", "Document"]
  ];
  fields.forEach(([key, label]) => {
    const value = raw?.[key];
    if (typeof value === "string" && value.trim()) docs.push({ name: label, url: value });
  });
  return docs;
}
function normalizeRequest(raw, source) {
  const payload = parsePayload(raw);
  const entityType = String(
    firstNonEmpty(
      raw?.entityType,
      raw?.entity_type,
      raw?.requesterType,
      raw?.requester_type,
      raw?.targetType,
      raw?.target_type,
      raw?.requestType,
      raw?.request_type,
      source === "RIDER" ? "RIDER" : source === "RESTAURANT" ? "RESTAURANT" : ""
    )
  ).toUpperCase();
  const targetId = raw?.targetId ?? raw?.target_id;
  const requestId = raw?.id ?? raw?.requestId ?? raw?.request_id;
  const docs = normalizeDocuments(raw);
  const fullName = firstNonEmpty(raw?.fullName, raw?.applicantName, raw?.applicant_name, raw?.ownerName, raw?.owner_name, raw?.driverName, raw?.driver_name, raw?.riderName, raw?.rider_name, raw?.userName, raw?.user_name, payload.fullName, payload.name, payload.driverName, payload.riderName, payload.ownerName);
  const businessName = firstNonEmpty(raw?.businessName, raw?.business_name, raw?.restaurantName, raw?.restaurant_name, payload.businessName, payload.restaurantName, payload.storeName);
  const mobile = firstNonEmpty(raw?.contactMobile, raw?.contact_mobile, raw?.mobile, raw?.phone, raw?.userMobile, raw?.user_mobile, raw?.driverMobile, raw?.driver_mobile, payload.mobile, payload.phone, payload.phoneNumber, payload.contactMobile);
  const address = firstNonEmpty(raw?.address, raw?.note, raw?.notes, payload.address, payload.fullAddress, payload.residentialAddress, payload.restaurantAddress, payload.businessAddress);
  return {
    ...raw,
    id: requestId ?? raw?.profileId ?? raw?.profile_id ?? raw?.restaurantId ?? raw?.restaurant_id ?? raw?.driverId ?? raw?.driver_id ?? targetId,
    entityType,
    requestType: raw?.requestType ?? raw?.request_type ?? entityType,
    restaurantId: raw?.restaurantId ?? raw?.restaurant_id ?? (entityType.includes("RESTAURANT") ? targetId : void 0),
    riderId: raw?.riderId ?? raw?.rider_id ?? raw?.driverId ?? raw?.driver_id ?? raw?.profileId ?? raw?.profile_id ?? (entityType.includes("RIDER") || entityType.includes("DRIVER") ? targetId : void 0),
    applicantName: fullName ?? businessName ?? "Verification request",
    businessName,
    restaurantName: firstNonEmpty(raw?.restaurantName, raw?.restaurant_name, businessName),
    riderName: entityType.includes("RIDER") || entityType.includes("DRIVER") ? fullName : raw?.riderName,
    driverName: entityType.includes("RIDER") || entityType.includes("DRIVER") ? fullName : raw?.driverName,
    contactMobile: mobile,
    mobile,
    status: raw?.status ?? raw?.verificationStatus ?? raw?.verification_status ?? "PENDING",
    note: firstNonEmpty(raw?.note, raw?.notes, raw?.applicantNote, raw?.applicant_note, payload.notes, payload.note, payload.message),
    address,
    gstin: firstNonEmpty(raw?.gstin, raw?.gstNumber, raw?.gst_number, payload.gstin, payload.gstNumber, payload.gst),
    panNumber: firstNonEmpty(raw?.panNumber, raw?.pan_number, payload.panNumber, payload.pan, payload.panCardNo),
    fssaiNumber: firstNonEmpty(raw?.fssaiNumber, raw?.fssai_number, payload.fssaiNumber, payload.fssaiLicense, payload.fssai),
    aadhaarNumber: firstNonEmpty(raw?.aadhaarNumber, raw?.aadhaar_number, raw?.aadharNumber, raw?.aadhar_number, payload.aadhaarNumber, payload.aadharNumber, payload.aadhaarNo, payload.aadharNo),
    drivingLicenseNumber: firstNonEmpty(raw?.drivingLicenseNumber, raw?.driving_license_number, payload.drivingLicenseNumber, payload.drivingLicense, payload.licenseNumber, payload.dlNumber),
    vehicleRegistrationNumber: firstNonEmpty(raw?.vehicleRegistrationNumber, raw?.vehicle_registration_number, payload.vehicleRegistrationNumber, payload.vehicleRcNumber, payload.vehicleRc, payload.vehicleNumber, payload.rcNumber),
    rejectionReason: raw?.rejectionReason ?? raw?.rejection_reason,
    createdAt: raw?.createdAt ?? raw?.created_at,
    updatedAt: raw?.updatedAt ?? raw?.updated_at,
    documents: docs,
    source: entityType.includes("RESTAURANT") ? "RESTAURANT" : entityType.includes("RIDER") || entityType.includes("DRIVER") ? "RIDER" : source
  };
}
function filterStatus(items, status) {
  const wanted = String(status || "").toUpperCase();
  if (!wanted) return items;
  return items.filter((x) => String(x.status ?? x.verificationStatus ?? "").toUpperCase() === wanted);
}
const serviceAreaVerificationService = {
  async getServiceArea() {
    const res = await api.get(endpoints.admin.serviceArea);
    return unwrap(res);
  },
  async updateServiceArea(payload) {
    const res = await api.put(endpoints.admin.serviceArea, payload);
    return unwrap(res);
  },
  async listVerifications(status, type) {
    const calls = [];
    if (!type || type === "ALL") {
      const params = { status: status || void 0, targetType: void 0, target_type: void 0, _t: Date.now() };
      calls.push(api.get(endpoints.admin.verifications, { params }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "GENERAL"))).catch(() => []));
      calls.push(api.get(endpoints.admin.verificationsAll, { params }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "GENERAL"))).catch(() => []));
      calls.push(api.get(endpoints.admin.verificationRequestsAlias, { params }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "GENERAL"))).catch(() => []));
      calls.push(api.get(endpoints.admin.serviceAreaVerificationsAlias, { params }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "GENERAL"))).catch(() => []));
    }
    if (!type || type === "ALL" || type === "RESTAURANT") {
      calls.push(api.get(endpoints.admin.verifications, { params: { status: status || void 0, targetType: "RESTAURANT", target_type: "RESTAURANT", _t: Date.now() } }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "RESTAURANT"))).catch(() => []));
      calls.push(api.get(endpoints.admin.restaurantJoinRequests, { params: { status: status || void 0, _t: Date.now() } }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "RESTAURANT"))).catch(() => []));
    }
    if (!type || type === "ALL" || type === "RIDER") {
      calls.push(api.get(endpoints.admin.verifications, { params: { status: status || void 0, targetType: "RIDER", target_type: "RIDER", _t: Date.now() } }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "RIDER"))).catch(() => []));
      calls.push(api.get(endpoints.admin.driverVerificationRequests, { params: { status: status || void 0, _t: Date.now() } }).then((res) => asArray(unwrap(res)).map((x) => normalizeRequest(x, "RIDER"))).catch(() => []));
    }
    const merged = (await Promise.all(calls)).flat();
    const unique = /* @__PURE__ */ new Map();
    merged.forEach((x) => {
      const id = x.id ?? `${x.source}-${x.restaurantId ?? ""}-${x.riderId ?? ""}-${x.contactMobile ?? ""}`;
      const key = `request-${id}`;
      if (id !== void 0 && id !== null) unique.set(key, x);
    });
    return filterStatus(Array.from(unique.values()), status);
  },
  async approve(request, note) {
    const req = typeof request === "object" ? request : { id: request };
    try {
      return unwrap(await api.post(endpoints.admin.verificationApprove(req.id), { note }));
    } catch {
      const source = String(req.source ?? req.entityType ?? req.requestType ?? "").toUpperCase();
      const entity = String(req.entityType ?? req.requestType ?? "").toUpperCase();
      if (source.includes("RESTAURANT") || entity.includes("RESTAURANT")) {
        const id = req.restaurantId ?? req.id;
        try {
          return unwrap(await api.post(endpoints.admin.restaurantJoinApprove(id), { note }));
        } catch {
          return unwrap(await api.patch(endpoints.admin.restaurantVerificationStatus(id), null, { params: { status: "VERIFIED" } }));
        }
      }
      if (source.includes("RIDER") || source.includes("DRIVER") || entity.includes("RIDER") || entity.includes("DRIVER")) {
        const id = req.riderId ?? req.driverId ?? req.id;
        try {
          return unwrap(await api.post(endpoints.admin.driverApprove(id), { note }));
        } catch {
          return unwrap(await api.patch(endpoints.admin.riderVerificationStatus(id), null, { params: { status: "VERIFIED" } }));
        }
      }
      throw new Error("Unable to approve verification request.");
    }
  },
  async reject(request, reason) {
    const req = typeof request === "object" ? request : { id: request };
    try {
      return unwrap(await api.post(endpoints.admin.verificationReject(req.id), { reason, note: reason }));
    } catch {
      const source = String(req.source ?? req.entityType ?? req.requestType ?? "").toUpperCase();
      const entity = String(req.entityType ?? req.requestType ?? "").toUpperCase();
      if (source.includes("RESTAURANT") || entity.includes("RESTAURANT")) {
        const id = req.restaurantId ?? req.id;
        try {
          return unwrap(await api.post(endpoints.admin.restaurantJoinReject(id), { reason, note: reason }));
        } catch {
          return unwrap(await api.patch(endpoints.admin.restaurantVerificationStatus(id), { reason }, { params: { status: "REJECTED" } }));
        }
      }
      if (source.includes("RIDER") || source.includes("DRIVER") || entity.includes("RIDER") || entity.includes("DRIVER")) {
        const id = req.riderId ?? req.driverId ?? req.id;
        try {
          return unwrap(await api.post(endpoints.admin.driverReject(id), { reason, note: reason }));
        } catch {
          return unwrap(await api.patch(endpoints.admin.riderVerificationStatus(id), { reason }, { params: { status: "REJECTED" } }));
        }
      }
      throw new Error("Unable to reject verification request.");
    }
  }
};
function ServiceAreaVerificationPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("PENDING");
  const [type, setType] = useState("ALL");
  const [range, setRange] = useState("");
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const area = useQuery({
    queryKey: ["service-area"],
    queryFn: serviceAreaVerificationService.getServiceArea
  });
  const requests = useQuery({
    queryKey: ["verifications", status, type],
    queryFn: () => serviceAreaVerificationService.listVerifications(status, type),
    staleTime: 8e3
  });
  const grouped = useMemo(() => {
    const all = requests.data ?? [];
    return {
      all: all.length,
      restaurant: all.filter((x) => requestKind(x) === "RESTAURANT").length,
      rider: all.filter((x) => requestKind(x) === "RIDER").length,
      pending: all.filter((x) => String(x.status ?? "").toUpperCase() === "PENDING").length
    };
  }, [requests.data]);
  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["verifications"]
    });
    qc.invalidateQueries({
      queryKey: driverKeys.all
    });
  };
  const saveArea = useMutation({
    mutationFn: () => serviceAreaVerificationService.updateServiceArea({
      defaultRangeKm: Number(range || area.data?.defaultRangeKm || 0),
      message: message || area.data?.message || "Sorry, this restaurant cannot deliver to your selected location right now.",
      enabled: area.data?.enabled ?? true
    }),
    onSuccess: () => {
      toast.success("Service area updated successfully");
      qc.invalidateQueries({
        queryKey: ["service-area"]
      });
    },
    onError: () => toast.error("Service area could not be updated. Please try again.")
  });
  const approve = useMutation({
    mutationFn: (req) => serviceAreaVerificationService.approve(req, "Verified by admin."),
    onSuccess: () => {
      toast.success("Verification approved successfully");
      setSelected(null);
      refresh();
    },
    onError: () => toast.error("Verification could not be approved. Please refresh and try again.")
  });
  const reject = useMutation({
    mutationFn: ({
      req,
      reason
    }) => serviceAreaVerificationService.reject(req, reason),
    onSuccess: () => {
      toast.success("Verification rejected successfully");
      setSelected(null);
      refresh();
    },
    onError: () => toast.error("Verification could not be rejected. Please refresh and try again.")
  });
  const items = requests.data ?? [];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Verification Requests", icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Service Management"
    }, {
      label: "Verification Requests"
    }] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-[390px_1fr]", children: [
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Delivery service area" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Set the maximum restaurant-to-customer delivery radius. Checkout is blocked professionally when the user is outside this range." }),
        /* @__PURE__ */ jsx("label", { className: "mt-5 block text-sm font-semibold", children: "Default delivery range in KM" }),
        /* @__PURE__ */ jsx("input", { className: "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none", type: "number", min: "0", step: "0.1", placeholder: String(area.data?.defaultRangeKm ?? 5), value: range, onChange: (e) => setRange(e.target.value) }),
        /* @__PURE__ */ jsx("label", { className: "mt-4 block text-sm font-semibold", children: "Out-of-range user message" }),
        /* @__PURE__ */ jsx("textarea", { className: "mt-2 min-h-28 w-full rounded-xl border border-border bg-background px-3 py-3 outline-none", placeholder: area.data?.message ?? "Sorry, this restaurant cannot deliver to your selected location right now.", value: message, onChange: (e) => setMessage(e.target.value) }),
        /* @__PURE__ */ jsx("button", { onClick: () => saveArea.mutate(), disabled: saveArea.isPending, className: "mt-4 w-full rounded-xl gradient-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60", children: saveArea.isPending ? "Saving..." : "Save service area" })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "rounded-2xl border border-border bg-card p-5 shadow-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold", children: "Restaurant & Rider Verification Requests" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Pending requests are highlighted here. Approved/rejected requests are removed from this working queue and reflected in Riders/Restaurants automatically." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsxs("select", { className: "rounded-xl border border-border bg-background px-3 py-2 text-sm", value: type, onChange: (e) => setType(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "ALL", children: "All request types" }),
              /* @__PURE__ */ jsx("option", { value: "RESTAURANT", children: "Restaurants only" }),
              /* @__PURE__ */ jsx("option", { value: "RIDER", children: "Riders only" })
            ] }),
            /* @__PURE__ */ jsxs("select", { className: "rounded-xl border border-border bg-background px-3 py-2 text-sm", value: status, onChange: (e) => setStatus(e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "PENDING", children: "Pending only" }),
              /* @__PURE__ */ jsx("option", { value: "", children: "All statuses" }),
              /* @__PURE__ */ jsx("option", { value: "APPROVED", children: "Approved" }),
              /* @__PURE__ */ jsx("option", { value: "REJECTED", children: "Rejected" }),
              /* @__PURE__ */ jsx("option", { value: "VERIFIED", children: "Verified" }),
              /* @__PURE__ */ jsx("option", { value: "UNVERIFIED", children: "Unverified" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4 grid gap-3 sm:grid-cols-4", children: [
          /* @__PURE__ */ jsx(Metric, { label: "Showing", value: grouped.all, icon: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Metric, { label: "Restaurants", value: grouped.restaurant, icon: /* @__PURE__ */ jsx(Store, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Metric, { label: "Riders", value: grouped.rider, icon: /* @__PURE__ */ jsx(Bike, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx(Metric, { label: "Pending", value: grouped.pending, icon: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4" }) })
        ] }),
        requests.isLoading ? /* @__PURE__ */ jsx("div", { className: "grid gap-3", children: Array.from({
          length: 5
        }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-28 animate-pulse rounded-xl bg-muted" }, i)) }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-3", children: [
          items.map((req) => /* @__PURE__ */ jsx(RequestCard, { req, approving: approve.isPending, rejecting: reject.isPending, onView: () => setSelected(req), onApprove: () => approve.mutate(req), onReject: () => {
            const reason = prompt("Reason for rejection?") || "Documents are not valid.";
            reject.mutate({
              req,
              reason
            });
          } }, `${req.source}-${String(req.id)}-${req.entityType}`)),
          items.length === 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-dashed border-border p-10 text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "No pending verification requests found" }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Approved or rejected requests are automatically removed from this queue." })
          ] })
        ] })
      ] })
    ] }),
    selected && /* @__PURE__ */ jsx(RequestDetailsModal, { req: selected, onClose: () => setSelected(null), onApprove: () => approve.mutate(selected), onReject: () => {
      const reason = prompt("Reason for rejection?") || "Documents are not valid.";
      reject.mutate({
        req: selected,
        reason
      });
    }, busy: approve.isPending || reject.isPending })
  ] });
}
function Metric({
  label,
  value,
  icon
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background/60 p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: label }),
      icon
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 text-2xl font-extrabold", children: value })
  ] });
}
function requestKind(req) {
  const raw = String(req.entityType ?? req.requestType ?? req.source ?? "").toUpperCase();
  if (raw.includes("RIDER") || raw.includes("DRIVER")) return "RIDER";
  if (raw.includes("RESTAURANT") || req.restaurantId) return "RESTAURANT";
  return "REQUEST";
}
function requestTitle(req) {
  return req.businessName || req.restaurantName || req.riderName || req.driverName || req.applicantName || "Verification request";
}
function documentUrl(d) {
  return d?.url || d?.fileUrl || d?.viewUrl || d?.view_url || d?.downloadUrl || d?.download_url;
}
function documentName(d, i) {
  return d?.name || d?.originalName || d?.original_name || d?.type || d?.documentType || d?.document_type || d?.fileName || `Document ${i + 1}`;
}
function isPdf(d) {
  return String(d?.mimeType || d?.mime_type || d?.type || d?.name || "").toLowerCase().includes("pdf");
}
function RequestCard({
  req,
  onView,
  onApprove,
  onReject,
  approving,
  rejecting
}) {
  const name = requestTitle(req);
  const kind = requestKind(req);
  const docs = req.documents ?? [];
  const status = String(req.status ?? req.verificationStatus ?? "PENDING").toUpperCase();
  const done = ["VERIFIED", "APPROVED", "REJECTED"].includes(status);
  return /* @__PURE__ */ jsx("article", { className: `rounded-xl border p-4 ${status === "PENDING" ? "border-primary/40 bg-primary/5 shadow-[0_0_0_1px_rgba(255,92,0,0.15)]" : "border-border bg-background/50"}`, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "truncate text-base font-bold", children: name }),
        /* @__PURE__ */ jsx(StatusBadge, { status: req.status || req.verificationStatus || "PENDING" }),
        /* @__PURE__ */ jsx("span", { className: "rounded-full bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary", children: kind }),
        status === "PENDING" && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-bold text-amber-500", children: "Needs review" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
        "Mobile: ",
        req.contactMobile || req.mobile || "N/A",
        " · Submitted: ",
        req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A"
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 line-clamp-2 text-sm text-muted-foreground", children: req.note || req.address || "Open details to review submitted information and uploaded documents." }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
        docs.slice(0, 4).map((d, i) => /* @__PURE__ */ jsxs("button", { onClick: onView, className: "inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold hover:bg-muted", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-3 w-3" }),
          documentName(d, i)
        ] }, i)),
        docs.length === 0 && /* @__PURE__ */ jsx("span", { className: "rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground", children: "No document links returned by backend" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex shrink-0 flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick: onView, className: "inline-flex items-center gap-2 rounded-xl border border-info/30 px-4 py-2 text-sm font-bold text-info hover:bg-info/10", children: [
        /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
        "View Details"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onApprove, disabled: approving || done, className: "inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
        "Approve"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onReject, disabled: rejecting || done, className: "inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50", children: [
        /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
        "Reject"
      ] })
    ] })
  ] }) });
}
function RequestDetailsModal({
  req,
  onClose,
  onApprove,
  onReject,
  busy
}) {
  const docs = req.documents ?? [];
  const kind = requestKind(req);
  const [activeDoc, setActiveDoc] = useState(docs[0] ?? null);
  const [imageFailed, setImageFailed] = useState(false);
  const activeUrl = activeDoc ? documentUrl(activeDoc) : "";
  const riderFields = [["Aadhaar", req.aadhaarNumber], ["Driving license", req.drivingLicenseNumber], ["Vehicle number", req.vehicleRegistrationNumber]];
  const restaurantFields = [["GSTIN", req.gstin], ["PAN", req.panNumber], ["FSSAI", req.fssaiNumber]];
  const payoutFields = [["UPI ID", req.upiId || req.upi_id], ["Bank name", req.bankName || req.bank_name], ["Account holder", req.bankAccountName || req.bank_account_name], ["Account number", req.bankAccountNumber || req.bank_account_number], ["IFSC", req.bankIfsc || req.bank_ifsc]];
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4", children: /* @__PURE__ */ jsxs("div", { className: "max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-extrabold", children: requestTitle(req) }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
          kind,
          " verification request · Review documents without leaving this screen."
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "rounded-lg border border-border p-2 hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 grid gap-4 xl:grid-cols-[1fr_1.25fr]", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-3 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm", children: [
          /* @__PURE__ */ jsx("b", { children: kind === "RIDER" ? "Rider payout + identity verification" : "Restaurant payout + business verification" }),
          /* @__PURE__ */ jsx("p", { className: "mt-1 text-muted-foreground", children: "Only fields relevant to this request type are shown." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2", children: [
          /* @__PURE__ */ jsx(Info, { label: "Status", value: req.status || req.verificationStatus || "PENDING" }),
          /* @__PURE__ */ jsx(Info, { label: "Mobile", value: req.contactMobile || req.mobile || "N/A" }),
          /* @__PURE__ */ jsx(Info, { label: "Email", value: req.email || "N/A" }),
          (kind === "RIDER" ? riderFields : restaurantFields).map(([label, value]) => /* @__PURE__ */ jsx(Info, { label, value: value || "Not provided" }, label)),
          payoutFields.map(([label, value]) => value ? /* @__PURE__ */ jsx(Info, { label, value }, label) : null),
          /* @__PURE__ */ jsx(Info, { label: "Submitted", value: req.createdAt ? new Date(req.createdAt).toLocaleString() : "N/A" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl border border-border bg-background/50 p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Address / Note" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 whitespace-pre-wrap text-sm", children: req.address || req.note || "No note provided." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold", children: "Uploaded documents" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 grid gap-2 sm:grid-cols-2", children: [
          docs.map((d, i) => /* @__PURE__ */ jsxs("button", { onClick: () => {
            setActiveDoc(d);
            setImageFailed(false);
          }, className: `flex items-center justify-between rounded-xl border px-3 py-3 text-left text-sm font-semibold hover:bg-muted ${activeDoc === d ? "border-primary bg-primary/10" : "border-border bg-background/50"}`, children: [
            /* @__PURE__ */ jsx("span", { children: documentName(d, i) }),
            /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
          ] }, i)),
          docs.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground", children: "Backend did not return document links for this request." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 overflow-hidden rounded-2xl border border-border bg-background/60", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm font-bold", children: activeDoc ? documentName(activeDoc, 0) : "Document preview" }),
            activeUrl && /* @__PURE__ */ jsxs("a", { href: activeUrl, target: "_blank", rel: "noreferrer", className: "inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-bold hover:bg-muted", children: [
              /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
              "Open / Download"
            ] })
          ] }),
          activeUrl ? isPdf(activeDoc) ? /* @__PURE__ */ jsx("iframe", { src: activeUrl, title: "Document preview", className: "h-[520px] w-full bg-white" }) : /* @__PURE__ */ jsx("div", { className: "flex min-h-[360px] max-h-[520px] items-center justify-center bg-black/20 p-3", children: imageFailed ? /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold", children: "Preview could not be rendered inline." }),
            /* @__PURE__ */ jsx("a", { className: "mt-2 inline-flex rounded-lg border border-border px-3 py-2 font-bold hover:bg-muted", href: activeUrl, target: "_blank", rel: "noreferrer", children: "Open document" })
          ] }) : /* @__PURE__ */ jsx("img", { src: activeUrl, onError: () => setImageFailed(true), alt: "Verification document", className: "max-h-[500px] max-w-full rounded-xl object-contain" }) }) : /* @__PURE__ */ jsx("div", { className: "p-10 text-center text-sm text-muted-foreground", children: "Select a document to preview here." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex flex-wrap justify-end gap-2", children: [
      /* @__PURE__ */ jsx("button", { onClick: onApprove, disabled: busy, className: "rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50", children: "Approve Verification" }),
      /* @__PURE__ */ jsx("button", { onClick: onReject, disabled: busy, className: "rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50", children: "Reject Verification" })
    ] })
  ] }) });
}
function Info({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-background/50 p-3", children: [
    /* @__PURE__ */ jsx("div", { className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1 break-words font-semibold", children: String(value || "N/A") })
  ] });
}
export {
  ServiceAreaVerificationPage as component
};
