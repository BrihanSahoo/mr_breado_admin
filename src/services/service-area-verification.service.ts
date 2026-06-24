import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";

export type ServiceAreaSettings = {
  defaultRangeKm?: number;
  maxRangeKm?: number;
  message?: string;
  enabled?: boolean;
};

export type VerificationDocument = { name?: string; type?: string; url?: string; fileName?: string; fileUrl?: string; viewUrl?: string; downloadUrl?: string; originalName?: string; documentType?: string };

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

function parsePayload(raw: any): Record<string, any> {
  const value = raw?.submittedPayload ?? raw?.submitted_payload ?? raw?.payload ?? raw?.note;
  if (!value) return {};
  if (typeof value === "object") return value;
  try { return JSON.parse(String(value)); } catch { return {}; }
}

function firstNonEmpty(...values: any[]) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim() !== "") return value;
  }
  return undefined;
}

function normalizeDocuments(raw: any): VerificationDocument[] {
  if (Array.isArray(raw?.documents)) return raw.documents.map((d: any) => ({ ...d, url: d.url || d.viewUrl || d.view_url || d.downloadUrl || d.download_url, fileUrl: d.fileUrl || d.viewUrl || d.view_url || d.downloadUrl || d.download_url, name: d.name || d.originalName || d.original_name || d.documentType || d.document_type }));
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
  const payload = parsePayload(raw);
  const entityType = String(
    firstNonEmpty(raw?.entityType, raw?.entity_type, raw?.requesterType, raw?.requester_type, raw?.targetType, raw?.target_type, raw?.requestType, raw?.request_type,
      source === "RIDER" ? "RIDER" : source === "RESTAURANT" ? "RESTAURANT" : "")
  ).toUpperCase();

  const populatedUser = raw?.userId && typeof raw.userId === "object" ? raw.userId : undefined;
  const populatedOutlet = raw?.outletId && typeof raw.outletId === "object" ? raw.outletId : undefined;
  const targetId = raw?.targetId ?? raw?.target_id ?? populatedUser?.legacyId ?? populatedUser?._id ?? populatedOutlet?.legacyId ?? populatedOutlet?._id;
  const requestId = raw?.id ?? raw?.requestId ?? raw?.request_id;
  const docs = normalizeDocuments(raw);

  const fullName = firstNonEmpty(raw?.fullName, raw?.applicantName, raw?.applicant_name, raw?.ownerName, raw?.owner_name, raw?.driverName, raw?.driver_name, raw?.riderName, raw?.rider_name, raw?.userName, raw?.user_name, payload.fullName, payload.name, payload.applicantName, payload.driverName, payload.riderName, payload.ownerName, populatedUser?.name, populatedOutlet?.name);
  const businessName = firstNonEmpty(raw?.businessName, raw?.business_name, raw?.restaurantName, raw?.restaurant_name, payload.businessName, payload.restaurantName, payload.storeName);
  const mobile = firstNonEmpty(raw?.contactMobile, raw?.contact_mobile, raw?.mobile, raw?.phone, raw?.userMobile, raw?.user_mobile, raw?.driverMobile, raw?.driver_mobile, payload.mobile, payload.phone, payload.phoneNumber, payload.contactMobile, populatedUser?.phone);
  const address = firstNonEmpty(raw?.address, raw?.note, raw?.notes, payload.address, payload.fullAddress, payload.residentialAddress, payload.restaurantAddress, payload.businessAddress);

  return {
    ...raw,
    id: requestId ?? raw?.profileId ?? raw?.profile_id ?? raw?.restaurantId ?? raw?.restaurant_id ?? raw?.driverId ?? raw?.driver_id ?? targetId,
    entityType,
    requestType: raw?.requestType ?? raw?.request_type ?? entityType,
    restaurantId: raw?.restaurantId ?? raw?.restaurant_id ?? (entityType.includes("RESTAURANT") ? targetId : undefined),
    riderId: raw?.riderId ?? raw?.rider_id ?? raw?.driverId ?? raw?.driver_id ?? raw?.profileId ?? raw?.profile_id ?? (entityType.includes("RIDER") || entityType.includes("DRIVER") ? (populatedUser?.legacyId ?? populatedUser?._id ?? targetId) : undefined),
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
      const id = x.id ?? `${x.source}-${x.restaurantId ?? ""}-${x.riderId ?? ""}-${x.contactMobile ?? ""}`;
      const key = `request-${id}`;
      if (id !== undefined && id !== null) unique.set(key, x);
    });
    return filterStatus(Array.from(unique.values()), status);
  },
  async approve(request: VerificationRequest | number | string, note?: string) {
    const req = typeof request === "object" ? request : { id: request } as VerificationRequest;
    try { return unwrap(await api.post(endpoints.admin.verificationApprove(req.id), { note })); }
    catch {
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
      throw new Error("Unable to approve verification request.");
    }
  },
  async reject(request: VerificationRequest | number | string, reason: string) {
    const req = typeof request === "object" ? request : { id: request } as VerificationRequest;
    try { return unwrap(await api.post(endpoints.admin.verificationReject(req.id), { reason, note: reason })); }
    catch {
      const source = String(req.source ?? req.entityType ?? req.requestType ?? "").toUpperCase();
      const entity = String(req.entityType ?? req.requestType ?? "").toUpperCase();
      if (source.includes("RESTAURANT") || entity.includes("RESTAURANT")) {
        const id = req.restaurantId ?? req.id;
        try { return unwrap(await api.post(endpoints.admin.restaurantJoinReject(id), { reason, note: reason })); }
        catch { return unwrap(await api.patch(endpoints.admin.restaurantVerificationStatus(id), { reason }, { params: { status: "REJECTED" } })); }
      }
      if (source.includes("RIDER") || source.includes("DRIVER") || entity.includes("RIDER") || entity.includes("DRIVER")) {
        const id = req.riderId ?? req.driverId ?? req.id;
        try { return unwrap(await api.post(endpoints.admin.driverReject(id), { reason, note: reason })); }
        catch { return unwrap(await api.patch(endpoints.admin.riderVerificationStatus(id), { reason }, { params: { status: "REJECTED" } })); }
      }
      throw new Error("Unable to reject verification request.");
    }
  },
};
