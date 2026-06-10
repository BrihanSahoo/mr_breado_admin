import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Mail, Phone, Save, Shield, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { accountService } from "@/services/account.service";

export const Route = createFileRoute("/admin-profile")({
  head: () => ({ meta: [{ title: "Admin Profile | Mr Breado Admin" }] }),
  component: AdminProfilePage,
});

function AdminProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin", "account-profile"], queryFn: accountService.profile });
  const [profile, setProfile] = useState<any>({ name: "", email: "", phone: "", gstin: "" });
  const [emailForm, setEmailForm] = useState({ email: "", otp: "" });
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState({ otp: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    if (!data) return;
    setProfile({ name: data.name ?? data.fullName ?? "", email: data.email ?? "", phone: data.phone ?? data.mobile ?? "", gstin: data.gstin ?? data.gstinNumber ?? "" });
    setEmailForm((s) => ({ ...s, email: data.email ?? "" }));
    setPhone(data.phone ?? data.mobile ?? "");
  }, [data]);

  const saveProfile = useMut(() => accountService.updateProfile(profile), "Profile saved", ["admin", "account-profile"]);
  const saveGstin = useMut(() => accountService.updateGstin({ gstin: profile.gstin, gstinNumber: profile.gstin }), "GSTIN updated", ["admin", "account-profile"]);
  const sendPassOtp = useMut(accountService.sendPasswordOtp, "Password OTP sent", ["admin", "account-profile"]);
  const updatePass = useMut(() => accountService.updatePassword(password), "Password updated", ["admin", "account-profile"]);
  const sendEmailOtp = useMut(accountService.sendEmailOtp, "Email OTP sent", ["admin", "account-profile"]);
  const updateEmail = useMut(() => accountService.updateEmail(emailForm), "Email updated", ["admin", "account-profile"]);
  const updatePhone = useMut(() => accountService.updatePhone({ phone, mobile: phone }), "Phone updated", ["admin", "account-profile"]);

  function useMut(fn: any, ok: string, key: any[]) { return useMutation({ mutationFn: fn, onSuccess: () => { toast.success(ok); qc.invalidateQueries({ queryKey: key }); }, onError: (e: Error) => toast.error(e.message) }); }

  return <>
    <PageHeader title="Admin Profile" icon={<UserCircle className="h-5 w-5" />} breadcrumbs={[{ label: "Dashboard", to: "/" }, { label: "Admin Profile" }]} />
    {isLoading ? <div className="h-80 animate-pulse rounded-xl bg-primary/10" /> : <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Profile Details" icon={<UserCircle className="h-5 w-5" />}>
        <Field label="Name" value={profile.name} onChange={(v)=>setProfile({...profile, name:v})} />
        <Field label="Email" value={profile.email} onChange={(v)=>setProfile({...profile, email:v})} />
        <Field label="Phone" value={profile.phone} onChange={(v)=>setProfile({...profile, phone:v})} />
        <button onClick={()=>saveProfile.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"><Save className="h-4 w-4"/>Save Profile</button>
      </Panel>
      <Panel title="Business GSTIN" icon={<Shield className="h-5 w-5" />}>
        <Field label="GSTIN Number" value={profile.gstin} onChange={(v)=>setProfile({...profile, gstin:v})} />
        <button onClick={()=>saveGstin.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow"><Save className="h-4 w-4"/>Update GSTIN</button>
      </Panel>
      <Panel title="Change Email" icon={<Mail className="h-5 w-5" />}>
        <Field label="New Email" value={emailForm.email} onChange={(v)=>setEmailForm({...emailForm, email:v})} />
        <Field label="Email OTP" value={emailForm.otp} onChange={(v)=>setEmailForm({...emailForm, otp:v})} />
        <div className="flex flex-wrap gap-2"><button onClick={()=>sendEmailOtp.mutate()} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">Send OTP</button><button onClick={()=>updateEmail.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Update Email</button></div>
      </Panel>
      <Panel title="Change Phone" icon={<Phone className="h-5 w-5" />}>
        <Field label="Phone Number" value={phone} onChange={setPhone} />
        <button onClick={()=>updatePhone.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Update Phone</button>
      </Panel>
      <Panel title="Change Password" icon={<KeyRound className="h-5 w-5" />}>
        <Field label="OTP" value={password.otp} onChange={(v)=>setPassword({...password, otp:v})} />
        <Field label="New Password" type="password" value={password.newPassword} onChange={(v)=>setPassword({...password, newPassword:v})} />
        <Field label="Confirm Password" type="password" value={password.confirmPassword} onChange={(v)=>setPassword({...password, confirmPassword:v})} />
        <div className="flex flex-wrap gap-2"><button onClick={()=>sendPassOtp.mutate()} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">Send OTP</button><button onClick={()=>updatePass.mutate()} className="inline-flex items-center gap-2 rounded-md gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow">Update Password</button></div>
      </Panel>
    </div>}
  </>;
}

function Panel({ title, icon, children }: any) { return <section className="rounded-xl border border-border bg-card p-4 shadow-card md:p-6"><div className="mb-4 flex items-center gap-2 text-lg font-semibold">{icon}{title}</div><div className="space-y-4">{children}</div></section>; }
function Field({ label, value, onChange, type="text" }: any) { return <label className="block text-sm font-medium">{label}<input type={type} value={value ?? ""} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" /></label>; }
