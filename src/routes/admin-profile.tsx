import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Mail, Phone, Save, Shield, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { accountService } from "@/services/account.service";
import { authStore } from "@/store/auth";

export const Route = createFileRoute("/admin-profile")({
  head: () => ({ meta: [{ title: "Admin Profile | Mr. Breado Admin" }] }),
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "account-profile"],
    queryFn: accountService.profile,
  });

  const [profile, setProfile] = useState<any>({ name: "", email: "", phone: "", gstin: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "", otp: "" });
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState({ currentPassword: "", otp: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (!data) return;
    const root = data.data ?? data.user ?? data;
    setProfile({
      name: root.name ?? root.fullName ?? "",
      email: root.email ?? "",
      phone: root.phone ?? root.mobile ?? "",
      gstin: root.gstin ?? root.gstinNumber ?? "",
    });
    setEmailForm((s) => ({ ...s, newEmail: root.email ?? "" }));
    setPhone(root.phone ?? root.mobile ?? "");
  }, [data]);

  const saveProfile = useMut(() => accountService.updateProfile({
    name: profile.name,
    fullName: profile.name,
    phone: profile.phone,
    mobile: profile.phone,
  }), "Profile saved", ["admin", "account-profile"]);

  const saveGstin = useMut(() => accountService.updateGstin({
    gstin: profile.gstin,
    gstinNumber: profile.gstin,
  }), "GSTIN updated", ["admin", "account-profile"]);

  const sendPassOtp = useMut(accountService.sendPasswordOtp, "Password OTP sent", ["admin", "account-profile"]);
  const sendEmailOtp = useMut(accountService.sendEmailOtp, "Email OTP sent", ["admin", "account-profile"]);
  const updatePhone = useMut(() => accountService.updatePhone({ phone, mobile: phone }), "Phone updated", ["admin", "account-profile"]);

  const updateEmail = useMutation({
    mutationFn: async () => {
      if (!emailForm.newEmail.trim()) throw new Error("Enter a valid new email address.");
      if (!emailForm.currentPassword.trim()) throw new Error("Enter your current password.");
      return accountService.updateEmail(emailForm);
    },
    onSuccess: () => {
      toast.success("Admin email updated. Please sign in again with the new email.");
      authStore.clear();
      navigate({ to: "/login" });
    },
    onError: (e: Error) => toast.error(e.message),
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
      navigate({ to: "/login" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function useMut(fn: any, ok: string, key: any[]) {
    return useMutation({
      mutationFn: fn,
      onSuccess: () => {
        toast.success(ok);
        qc.invalidateQueries({ queryKey: key });
      },
      onError: (e: Error) => toast.error(e.message),
    });
  }

  return (
    <>
      <PageHeader
        title="Admin Profile"
        icon={<UserCircle className="h-5 w-5" />}
        breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Admin Profile" }]}
      />
      {isLoading ? (
        <div className="h-80 animate-pulse rounded-xl bg-primary/10" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          <Panel title="Profile Details" icon={<UserCircle className="h-5 w-5" />}>
            <Field label="Name" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
            <Field label="Current Email" value={profile.email} disabled onChange={() => undefined} />
            <Field label="Phone" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
            <button onClick={() => saveProfile.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              <Save className="h-4 w-4" /> Save Profile
            </button>
          </Panel>

          <Panel title="Business GSTIN" icon={<Shield className="h-5 w-5" />}>
            <Field label="GSTIN Number" value={profile.gstin} onChange={(v) => setProfile({ ...profile, gstin: v })} />
            <button onClick={() => saveGstin.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">
              <Save className="h-4 w-4" /> Update GSTIN
            </button>
          </Panel>

          <Panel title="Change Admin Email" icon={<Mail className="h-5 w-5" />}>
            <Field label="New Email" type="email" value={emailForm.newEmail} onChange={(v) => setEmailForm({ ...emailForm, newEmail: v })} />
            <Field label="Current Password" type="password" value={emailForm.currentPassword} onChange={(v) => setEmailForm({ ...emailForm, currentPassword: v })} />
            <Field label="OTP (only when backend OTP is enabled)" value={emailForm.otp} onChange={(v) => setEmailForm({ ...emailForm, otp: v })} />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => sendEmailOtp.mutate()} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">Send OTP</button>
              <button disabled={updateEmail.isPending} onClick={() => updateEmail.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
                {updateEmail.isPending ? "Updating…" : "Update Email"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">After changing the email, you will be signed out and must log in with the new email.</p>
          </Panel>

          <Panel title="Change Phone" icon={<Phone className="h-5 w-5" />}>
            <Field label="Phone Number" value={phone} onChange={setPhone} />
            <button onClick={() => updatePhone.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Update Phone</button>
          </Panel>

          <Panel title="Change Admin Password" icon={<KeyRound className="h-5 w-5" />}>
            <Field label="Current Password" type="password" value={password.currentPassword} onChange={(v) => setPassword({ ...password, currentPassword: v })} />
            <Field label="OTP (only when backend OTP is enabled)" value={password.otp} onChange={(v) => setPassword({ ...password, otp: v })} />
            <Field label="New Password" type="password" value={password.newPassword} onChange={(v) => setPassword({ ...password, newPassword: v })} />
            <Field label="Confirm New Password" type="password" value={password.confirmPassword} onChange={(v) => setPassword({ ...password, confirmPassword: v })} />
            <div className="flex flex-wrap gap-2">
              <button onClick={() => sendPassOtp.mutate()} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">Send OTP</button>
              <button disabled={updatePass.isPending} onClick={() => updatePass.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
                {updatePass.isPending ? "Updating…" : "Update Password"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">After changing the password, all local admin login state is cleared and you must sign in again.</p>
          </Panel>
        </div>
      )}
    </>
  );
}

function Panel({ title, icon, children }: any) {
  return <section className="rounded-xl border border-border bg-card p-4 shadow-card md:p-6"><div className="mb-4 flex items-center gap-2 text-lg font-semibold">{icon}{title}</div><div className="space-y-4">{children}</div></section>;
}

function Field({ label, value, onChange, type = "text", disabled = false }: any) {
  return <label className="block text-sm font-medium">{label}<input disabled={disabled} type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-60" /></label>;
}
