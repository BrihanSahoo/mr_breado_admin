import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export type ServiceAreaSettings = {
  defaultRangeKm?: number;
  maxRangeKm?: number;
  message?: string;
  enabled?: boolean;
};

export type VerificationDocument = { name?: string; type?: string; url?: string; fileName?: string; fileUrl?: string; documentType?: string };

export type VerificationRequest = {
  id: number | string;
  requestType?: string;
  entityType?: string;
  restaurantId?: number | string;
  riderId?: number | string;
  driverId?: number | string;
  applicantName?: string;
  businessName?: string;
  restaurantName?: string;
  riderName?: string;
  driverName?: string;
  contactMobile?: string;
  mobile?: string;
  status?: string;
  verificationStatus?: string;
  note?: string;
  rejectionReason?: string;
  address?: string;
  gstin?: string;
  panNumber?: string;
  fssaiNumber?: string;
  aadhaarNumber?: string;
  drivingLicenseNumber?: string;
  vehicleRegistrationNumber?: string;
  documents?: VerificationDocument[];
  createdAt?: string;
  updatedAt?: string;
  source?: "GENERAL" | "RESTAURANT" | "RIDER";
};

function unwrap<T>(res: any): T {
  return (res?.data?.data ?? res?.data ?? res) as T;
}

function asArray(data: any): any[] {
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

function normalizeDocuments(raw: any): VerificationDocument[] {
  if (Array.isArray(raw?.documents)) return raw.documents;
  const docs: VerificationDocument[] = [];
  const fields = [
    ["gstCertificate", "GST Certificate"], ["panCard", "PAN Card"], ["fssaiLicense", "FSSAI License"],
    ["ownerIdProof", "Owner ID Proof"], ["bankProof", "Bank Proof"], ["aadhaarFront", "Aadhaar Front"],
    ["aadhaarBack", "Aadhaar Back"], ["drivingLicense", "Driving License"], ["vehicleRc", "Vehicle RC"],
    ["profilePhoto", "Profile Photo"], ["documentUrl", "Document"], ["fileUrl", "Document"], ["url", "Document"],
  ];
  fields.forEach(([key, label]) => {
    const value = raw?.[key];
    if (typeof value === "string" && value.trim()) docs.push({ name: label, url: value });
  });
  return docs;
}

function normalizeRequest(raw: any, source: VerificationRequest["source"]): VerificationRequest {
  const entityType = String(
    raw?.entityType ?? raw?.entity_type ?? raw?.targetType ?? raw?.target_type ?? raw?.requestType ?? raw?.request_type ??
      (source === "RIDER" ? "RIDER" : source === "RESTAURANT" ? "RESTAURANT" : "")
  ).toUpperCase();

  const targetId = raw?.targetId ?? raw?.target_id;
  const requestId = raw?.id ?? raw?.requestId ?? raw?.request_id;

  return {
    ...raw,
    id: requestId ?? raw?.profileId ?? raw?.profile_id ?? raw?.restaurantId ?? raw?.restaurant_id ?? raw?.driverId ?? raw?.driver_id ?? targetId,
    entityType,
    requestType: raw?.requestType ?? raw?.request_type ?? entityType,
    restaurantId: raw?.restaurantId ?? raw?.restaurant_id ?? (entityType.includes("RESTAURANT") ? targetId : undefined),
    riderId: raw?.riderId ?? raw?.rider_id ?? raw?.driverId ?? raw?.driver_id ?? raw?.profileId ?? raw?.profile_id ?? (entityType.includes("RIDER") || entityType.includes("DRIVER") ? targetId : undefined),
    applicantName: raw?.applicantName ?? raw?.applicant_name ?? raw?.ownerName ?? raw?.owner_name ?? raw?.driverName ?? raw?.driver_name ?? raw?.riderName ?? raw?.rider_name ?? raw?.name,
    businessName: raw?.businessName ?? raw?.business_name ?? raw?.restaurantName ?? raw?.restaurant_name ?? raw?.name,
    contactMobile: raw?.contactMobile ?? raw?.contact_mobile ?? raw?.mobile ?? raw?.driverMobile ?? raw?.driver_mobile ?? raw?.phoneNumber ?? raw?.phone_number,
    status: raw?.status ?? raw?.verificationStatus ?? raw?.verification_status ?? "PENDING",
    note: raw?.note ?? raw?.applicantNote ?? raw?.applicant_note,
    createdAt: raw?.createdAt ?? raw?.created_at,
    updatedAt: raw?.updatedAt ?? raw?.updated_at,
    documents: normalizeDocuments(raw),
    source: entityType.includes("RESTAURANT") ? "RESTAURANT" : entityType.includes("RIDER") || entityType.includes("DRIVER") ? "RIDER" : source,
  };
}

function filterStatus(items: VerificationRequest[], status?: string) {
  const wanted = String(status || "").toUpperCase();
  if (!wanted) return items;
  return items.filter((x) => String(x.status ?? x.verificationStatus ?? "").toUpperCase() === wanted);
}

export const serviceAreaVerificationService = {
  async getServiceArea() {
    const res = await api.get(endpoints.admin.serviceArea);
    return unwrap<ServiceAreaSettings>(res);
  },
  async updateServiceArea(payload: ServiceAreaSettings) {
    const res = await api.put(endpoints.admin.serviceArea, payload);
    return unwrap<ServiceAreaSettings>(res);
  },
  async listVerifications(status?: string, type?: "ALL" | "RESTAURANT" | "RIDER") {
    const calls: Promise<VerificationRequest[]>[] = [];

    if (!type || type === "ALL") {
      const params = { status: status || undefined, targetType: undefined, target_type: undefined, _t: Date.now() };
      calls.push(api.get(endpoints.admin.verifications, { params })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "GENERAL")))
        .catch(() => []));
      calls.push(api.get(endpoints.admin.verificationsAll, { params })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "GENERAL")))
        .catch(() => []));
      calls.push(api.get(endpoints.admin.verificationRequestsAlias, { params })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "GENERAL")))
        .catch(() => []));
      calls.push(api.get(endpoints.admin.serviceAreaVerificationsAlias, { params })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "GENERAL")))
        .catch(() => []));
    }
    if (!type || type === "ALL" || type === "RESTAURANT") {
      calls.push(api.get(endpoints.admin.verifications, { params: { status: status || undefined, targetType: "RESTAURANT", target_type: "RESTAURANT", _t: Date.now() } })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "RESTAURANT")))
        .catch(() => []));
      calls.push(api.get(endpoints.admin.restaurantJoinRequests, { params: { status: status || undefined, _t: Date.now() } })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "RESTAURANT")))
        .catch(() => []));
    }
    if (!type || type === "ALL" || type === "RIDER") {
      calls.push(api.get(endpoints.admin.verifications, { params: { status: status || undefined, targetType: "RIDER", target_type: "RIDER", _t: Date.now() } })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "RIDER")))
        .catch(() => []));
      calls.push(api.get(endpoints.admin.driverVerificationRequests, { params: { status: status || undefined, _t: Date.now() } })
        .then((res) => asArray(unwrap<any>(res)).map((x) => normalizeRequest(x, "RIDER")))
        .catch(() => []));
    }

    const merged = (await Promise.all(calls)).flat();
    const unique = new Map<string, VerificationRequest>();
    merged.forEach((x) => {
      const key = `request-${x.id ?? ""}-${x.entityType ?? x.requestType ?? ""}`;
      if (x.id !== undefined && x.id !== null) unique.set(key, x);
    });
    return filterStatus(Array.from(unique.values()), status);
  },
  async approve(request: VerificationRequest | number | string, note?: string) {
    const req = typeof request === "object" ? request : { id: request } as VerificationRequest;
    const source = String(req.source ?? req.entityType ?? req.requestType ?? "").toUpperCase();
    const entity = String(req.entityType ?? req.requestType ?? "").toUpperCase();
    if (source.includes("RESTAURANT") || entity.includes("RESTAURANT")) {
      const id = req.restaurantId ?? req.id;
      try { return unwrap(await api.post(endpoints.admin.restaurantJoinApprove(id), { note })); }
      catch { return unwrap(await api.patch(endpoints.admin.restaurantVerificationStatus(id), null, { params: { status: "VERIFIED" } })); }
    }
    if (source.includes("RIDER") || source.includes("DRIVER") || entity.includes("RIDER") || entity.includes("DRIVER")) {
      const id = req.riderId ?? req.driverId ?? req.id;
      try { return unwrap(await api.post(endpoints.admin.driverApprove(id), { note })); }
      catch { return unwrap(await api.patch(endpoints.admin.riderVerificationStatus(id), null, { params: { status: "VERIFIED" } })); }
    }
    const res = await api.post(endpoints.admin.verificationApprove(req.id), { note });
    return unwrap(res);
  },
  async reject(request: VerificationRequest | number | string, reason: string) {
    const req = typeof request === "object" ? request : { id: request } as VerificationRequest;
    const source = String(req.source ?? req.entityType ?? req.requestType ?? "").toUpperCase();
    const entity = String(req.entityType ?? req.requestType ?? "").toUpperCase();
    if (source.includes("RESTAURANT") || entity.includes("RESTAURANT")) {
      const id = req.restaurantId ?? req.id;
      try { return unwrap(await api.post(endpoints.admin.restaurantJoinReject(id), { reason, note: reason })); }
      catch { return unwrap(await api.patch(endpoints.admin.restaurantVerificationStatus(id), null, { params: { status: "REJECTED" } })); }
    }
    if (source.includes("RIDER") || source.includes("DRIVER") || entity.includes("RIDER") || entity.includes("DRIVER")) {
      const id = req.riderId ?? req.driverId ?? req.id;
      try { return unwrap(await api.post(endpoints.admin.driverReject(id), { reason, note: reason })); }
      catch { return unwrap(await api.patch(endpoints.admin.riderVerificationStatus(id), null, { params: { status: "REJECTED" } })); }
    }
    const res = await api.post(endpoints.admin.verificationReject(req.id), { reason, note: reason });
    return unwrap(res);
  },
  async setRestaurantStatus(id: number | string, status: string) {
    const res = await api.patch(endpoints.admin.restaurantVerificationStatus(id), null, { params: { status } });
    return unwrap(res);
  },
  async setRiderStatus(id: number | string, status: string) {
    const res = await api.patch(endpoints.admin.riderVerificationStatus(id), null, { params: { status } });
    return unwrap(res);
  },
};
