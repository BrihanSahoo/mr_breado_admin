import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { UserCircle, Save, Shield, Mail, Phone, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { r as request, b as authStore, P as PageHeader } from "./router-1xz68c6T.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
async function requestFallback(paths, config) {
  let lastError;
  for (const url of paths) {
    try {
      return await request({ ...config, url });
    } catch (error) {
      lastError = error;
      const status = Number(error?.status ?? 0);
      if ([400, 401, 403, 409, 422, 429].includes(status)) throw error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("The backend does not support this account operation.");
}
const PROFILE_PATHS = ["/admin/account/profile", "/admin/profile", "/admin/me"];
const EMAIL_PATHS = ["/admin/account/email", "/admin/profile/email", "/admin/change-email"];
const PASSWORD_PATHS = ["/admin/account/password", "/admin/profile/password", "/admin/change-password"];
const accountService = {
  profile: () => requestFallback(PROFILE_PATHS, { method: "GET" }),
  updateProfile: (data) => requestFallback(PROFILE_PATHS, { method: "PUT", data }),
  updateGstin: (data) => requestFallback(["/admin/account/profile/gstin", "/admin/profile/gstin"], { method: "PATCH", data }),
  sendPasswordOtp: () => requestFallback(["/admin/account/password/otp", "/admin/profile/password/otp"], { method: "POST" }),
  updatePassword: (data) => requestFallback(PASSWORD_PATHS, {
    method: "PUT",
    data: {
      ...data,
      current_password: data.currentPassword,
      oldPassword: data.currentPassword,
      password: data.newPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword
    }
  }),
  sendEmailOtp: () => requestFallback(["/admin/account/email/otp", "/admin/profile/email/otp"], { method: "POST" }),
  updateEmail: (data) => requestFallback(EMAIL_PATHS, {
    method: "PUT",
    data: {
      ...data,
      email: data.newEmail ?? data.email,
      newEmail: data.newEmail ?? data.email,
      new_email: data.newEmail ?? data.email,
      current_password: data.currentPassword,
      password: data.currentPassword
    }
  }),
  updatePhone: (data) => requestFallback(["/admin/account/phone", "/admin/profile/phone"], { method: "PUT", data })
};
function AdminProfilePage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin", "account-profile"],
    queryFn: accountService.profile
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gstin: ""
  });
  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    currentPassword: "",
    otp: ""
  });
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState({
    currentPassword: "",
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  useEffect(() => {
    if (!data) return;
    const root = data.data ?? data.user ?? data;
    setProfile({
      name: root.name ?? root.fullName ?? "",
      email: root.email ?? "",
      phone: root.phone ?? root.mobile ?? "",
      gstin: root.gstin ?? root.gstinNumber ?? ""
    });
    setEmailForm((s) => ({
      ...s,
      newEmail: root.email ?? ""
    }));
    setPhone(root.phone ?? root.mobile ?? "");
  }, [data]);
  const saveProfile = useMut(() => accountService.updateProfile({
    name: profile.name,
    fullName: profile.name,
    phone: profile.phone,
    mobile: profile.phone
  }), "Profile saved", ["admin", "account-profile"]);
  const saveGstin = useMut(() => accountService.updateGstin({
    gstin: profile.gstin,
    gstinNumber: profile.gstin
  }), "GSTIN updated", ["admin", "account-profile"]);
  const sendPassOtp = useMut(accountService.sendPasswordOtp, "Password OTP sent", ["admin", "account-profile"]);
  const sendEmailOtp = useMut(accountService.sendEmailOtp, "Email OTP sent", ["admin", "account-profile"]);
  const updatePhone = useMut(() => accountService.updatePhone({
    phone,
    mobile: phone
  }), "Phone updated", ["admin", "account-profile"]);
  const updateEmail = useMutation({
    mutationFn: async () => {
      if (!emailForm.newEmail.trim()) throw new Error("Enter a valid new email address.");
      if (!emailForm.currentPassword.trim()) throw new Error("Enter your current password.");
      return accountService.updateEmail(emailForm);
    },
    onSuccess: () => {
      toast.success("Admin email updated. Please sign in again with the new email.");
      authStore.clear();
      navigate({
        to: "/login"
      });
    },
    onError: (e) => toast.error(e.message)
  });
  const updatePass = useMutation({
    mutationFn: async () => {
      if (!password.currentPassword) throw new Error("Enter your current password.");
      if (password.newPassword.length < 8) throw new Error("New password must be at least 8 characters.");
      if (password.newPassword !== password.confirmPassword) throw new Error("New password and confirmation do not match.");
      return accountService.updatePassword(password);
    },
    onSuccess: () => {
      toast.success("Password updated. Please sign in again.");
      authStore.clear();
      navigate({
        to: "/login"
      });
    },
    onError: (e) => toast.error(e.message)
  });
  function useMut(fn, ok, key) {
    return useMutation({
      mutationFn: fn,
      onSuccess: () => {
        toast.success(ok);
        qc.invalidateQueries({
          queryKey: key
        });
      },
      onError: (e) => toast.error(e.message)
    });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Admin Profile", icon: /* @__PURE__ */ jsx(UserCircle, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Admin Profile"
    }] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "h-80 animate-pulse rounded-xl bg-primary/10" }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-5 xl:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(Panel, { title: "Profile Details", icon: /* @__PURE__ */ jsx(UserCircle, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(Field, { label: "Name", value: profile.name, onChange: (v) => setProfile({
          ...profile,
          name: v
        }) }),
        /* @__PURE__ */ jsx(Field, { label: "Current Email", value: profile.email, disabled: true, onChange: () => void 0 }),
        /* @__PURE__ */ jsx(Field, { label: "Phone", value: profile.phone, onChange: (v) => setProfile({
          ...profile,
          phone: v
        }) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => saveProfile.mutate(), className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          " Save Profile"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Panel, { title: "Business GSTIN", icon: /* @__PURE__ */ jsx(Shield, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(Field, { label: "GSTIN Number", value: profile.gstin, onChange: (v) => setProfile({
          ...profile,
          gstin: v
        }) }),
        /* @__PURE__ */ jsxs("button", { onClick: () => saveGstin.mutate(), className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
          " Update GSTIN"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Panel, { title: "Change Admin Email", icon: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(Field, { label: "New Email", type: "email", value: emailForm.newEmail, onChange: (v) => setEmailForm({
          ...emailForm,
          newEmail: v
        }) }),
        /* @__PURE__ */ jsx(Field, { label: "Current Password", type: "password", value: emailForm.currentPassword, onChange: (v) => setEmailForm({
          ...emailForm,
          currentPassword: v
        }) }),
        /* @__PURE__ */ jsx(Field, { label: "OTP (only when backend OTP is enabled)", value: emailForm.otp, onChange: (v) => setEmailForm({
          ...emailForm,
          otp: v
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => sendEmailOtp.mutate(), className: "rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent", children: "Send OTP" }),
          /* @__PURE__ */ jsx("button", { disabled: updateEmail.isPending, onClick: () => updateEmail.mutate(), className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: updateEmail.isPending ? "Updating…" : "Update Email" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "After changing the email, you will be signed out and must log in with the new email." })
      ] }),
      /* @__PURE__ */ jsxs(Panel, { title: "Change Phone", icon: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(Field, { label: "Phone Number", value: phone, onChange: setPhone }),
        /* @__PURE__ */ jsx("button", { onClick: () => updatePhone.mutate(), className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow", children: "Update Phone" })
      ] }),
      /* @__PURE__ */ jsxs(Panel, { title: "Change Admin Password", icon: /* @__PURE__ */ jsx(KeyRound, { className: "h-5 w-5" }), children: [
        /* @__PURE__ */ jsx(Field, { label: "Current Password", type: "password", value: password.currentPassword, onChange: (v) => setPassword({
          ...password,
          currentPassword: v
        }) }),
        /* @__PURE__ */ jsx(Field, { label: "OTP (only when backend OTP is enabled)", value: password.otp, onChange: (v) => setPassword({
          ...password,
          otp: v
        }) }),
        /* @__PURE__ */ jsx(Field, { label: "New Password", type: "password", value: password.newPassword, onChange: (v) => setPassword({
          ...password,
          newPassword: v
        }) }),
        /* @__PURE__ */ jsx(Field, { label: "Confirm New Password", type: "password", value: password.confirmPassword, onChange: (v) => setPassword({
          ...password,
          confirmPassword: v
        }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => sendPassOtp.mutate(), className: "rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent", children: "Send OTP" }),
          /* @__PURE__ */ jsx("button", { disabled: updatePass.isPending, onClick: () => updatePass.mutate(), className: "inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60", children: updatePass.isPending ? "Updating…" : "Update Password" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "After changing the password, all local admin login state is cleared and you must sign in again." })
      ] })
    ] })
  ] });
}
function Panel({
  title,
  icon,
  children
}) {
  return /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-border bg-card p-4 shadow-card md:p-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center gap-2 text-lg font-semibold", children: [
      icon,
      title
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled = false
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block text-sm font-medium", children: [
    label,
    /* @__PURE__ */ jsx("input", { disabled, type, value: value ?? "", onChange: (e) => onChange(e.target.value), className: "mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60" })
  ] });
}
export {
  AdminProfilePage as component
};
