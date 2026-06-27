import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, KeyRound,
  Loader2, X, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import authHero from "@/assets/auth-hero.jpg";
import { ADMIN_LOGO_URL, API_BASE_URL } from "@/api/endpoints";
import { api } from "@/api/client";
import { useLogin } from "@/hooks/mutations/use-login";
import { accountService } from "@/services/account.service";
import { apiErrorMessage } from "@/lib/api-error";
import { haptic } from "@/lib/haptics";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in | Mr. Breado Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const login = useLogin();
  const loading = login.isPending;
  const [backendState, setBackendState] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let active = true;
    api.get("/health", { timeout: 8000 })
      .then(() => active && setBackendState("online"))
      .catch(() => active && setBackendState("offline"));
    return () => { active = false; };
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptic();
    login.mutate(
      { email, password, deviceType: "ADMIN" },
      { onSuccess: () => navigate({ to: "/" }) },
    );
  };

  return (
    <div className="grid min-h-[100dvh] bg-background lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={authHero} alt="Delicious food spread" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,115,0,0.25),transparent_60%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2 text-foreground">
            <img src={ADMIN_LOGO_URL} alt="Mr. Breado" className="h-10 w-10 rounded-xl object-contain shadow-glow" />
            <span className="text-lg font-bold tracking-tight">Mr. Breado Admin</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-foreground">Manage your food delivery business with confidence.</h2>
            <p className="mt-3 text-sm text-muted-foreground">Real-time orders, outlet operations, fleet tracking, promotions and revenue insights in one secure dashboard.</p>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" />Protected administrator access</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-[max(1.5rem,env(safe-area-inset-top))] sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <img src={ADMIN_LOGO_URL} alt="Mr. Breado" className="h-10 w-10 rounded-xl object-contain" />
            <span className="font-bold">Mr. Breado Admin</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your business dashboard.</p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-muted-foreground">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-10 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 sm:text-sm" placeholder="Enter admin email" />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-muted-foreground">Password</label>
                <button type="button" onClick={() => { haptic(); setRecoveryOpen(true); }} className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type={show ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-border bg-card px-10 pr-12 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 sm:text-sm" placeholder="••••••••" />
                <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => { haptic(); setShow(!show); }} className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" className="h-4 w-4 rounded border-border accent-[--color-primary]" />Keep me signed in on this device</label>

            <button type="submit" disabled={loading || backendState === "offline"} className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-primary text-sm font-black text-primary-foreground shadow-glow transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Signing in…</> : <>Sign in<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></>}
            </button>

            <div className="relative py-2 text-center"><span className="relative z-10 bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground">Secure admin access</span><div className="absolute left-0 top-1/2 h-px w-full bg-border" /></div>

            <div className="rounded-2xl border border-border bg-card/70 p-3 text-xs leading-5 text-muted-foreground shadow-card">
              <div className="flex items-center justify-between gap-3"><span>{backendState === "online" ? "Backend connected" : backendState === "offline" ? "Backend unavailable" : "Checking backend…"}</span><span className={backendState === "online" ? "text-emerald-500" : backendState === "offline" ? "text-red-500" : "text-amber-500"}>●</span></div>
              <div className="mt-1 break-all opacity-75">{API_BASE_URL}</div>
              {backendState === "offline" && <div className="mt-2 font-semibold text-destructive">The admin panel cannot sign in until the backend is reachable.</div>}
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">Access is restricted to approved Mr. Breado administrators.</p>
        </div>
      </div>

      {recoveryOpen && <PasswordRecoveryDialog initialEmail={email} onClose={() => setRecoveryOpen(false)} />}
    </div>
  );
}

function PasswordRecoveryDialog({ initialEmail, onClose }: { initialEmail: string; onClose: () => void }) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [requested, setRequested] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<{ emailSent?: boolean; emailDeliveryConfigured?: boolean; recoveryKeyAvailable?: boolean }>({});

  const requestReset = useMutation({
    mutationFn: () => accountService.forgotPassword(email.trim()),
    onSuccess: (data: any) => {
      const root = data?.data ?? data ?? {};
      setDeliveryInfo(root);
      setRequested(true);
      haptic([20, 20, 20]);
      if (root.emailSent) toast.success("A six-digit reset code was sent to the admin email.");
      else if (root.recoveryKeyAvailable) toast.success("Use the configured admin recovery key to continue.");
      else toast.info("Password recovery email is not configured. Configure SMTP email delivery or an admin recovery key on the backend.");
    },
    onError: (error) => toast.error(apiErrorMessage(error, "Password recovery could not be started.")),
  });

  const resetPassword = useMutation({
    mutationFn: async () => {
      if (newPassword.length < 8) throw new Error("Use at least 8 characters for the new password.");
      if (!/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) throw new Error("Use at least one letter and one number in the password.");
      if (newPassword !== confirmPassword) throw new Error("The password confirmation does not match.");
      if (!code.trim() && !recoveryKey.trim()) throw new Error("Enter the email code or the configured recovery key.");
      return accountService.resetPassword({ email: email.trim(), code: code.trim() || undefined, recoveryKey: recoveryKey.trim() || undefined, newPassword, confirmPassword });
    },
    onSuccess: () => {
      haptic([25, 30, 25]);
      toast.success("Password reset successfully. Sign in with your new password.");
      onClose();
    },
    onError: (error: any) => toast.error(apiErrorMessage(error, error?.message || "The password could not be reset.")),
  });

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/75 p-0 backdrop-blur-md sm:p-4">
      <div className="mx-auto mt-[max(4rem,env(safe-area-inset-top))] min-h-[calc(100dvh-4rem)] w-full rounded-t-[28px] border bg-card p-5 shadow-2xl sm:my-10 sm:min-h-0 sm:max-w-lg sm:rounded-3xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><KeyRound className="h-6 w-6" /></div><div><h2 className="text-2xl font-black">Recover admin access</h2><p className="mt-1 text-sm text-muted-foreground">Reset the administrator password securely.</p></div></div>
          <button aria-label="Close" onClick={() => { haptic(); onClose(); }} className="grid h-11 w-11 place-items-center rounded-xl border hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-bold">Admin email<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={requested} className="mt-1 h-12 w-full rounded-xl border bg-background px-3 text-base outline-none focus:border-primary disabled:opacity-60 sm:text-sm" /></label>

          {!requested ? (
            <button disabled={requestReset.isPending || !email.trim()} onClick={() => { haptic(); requestReset.mutate(); }} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl gradient-primary font-black text-primary-foreground shadow-glow disabled:opacity-50">
              {requestReset.isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Preparing recovery…</> : <>Continue securely<ArrowRight className="h-4 w-4" /></>}
            </button>
          ) : (
            <>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{deliveryInfo.emailSent ? "Enter the six-digit code sent to the admin email." : deliveryInfo.recoveryKeyAvailable ? "Enter the configured recovery key. You can also enter an email code when email delivery is configured." : "Email delivery and recovery key are not configured on the backend. Configure SMTP from API Keys, or add ADMIN_PASSWORD_RECOVERY_KEY, then retry."}</span></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-bold">Email code<input inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="mt-1 h-12 w-full rounded-xl border bg-background px-3 text-base tracking-[.35em] outline-none focus:border-primary" placeholder="000000" /></label>
                <label className="block text-sm font-bold">Recovery key<input type="password" value={recoveryKey} onChange={(e) => setRecoveryKey(e.target.value)} className="mt-1 h-12 w-full rounded-xl border bg-background px-3 text-base outline-none focus:border-primary sm:text-sm" placeholder="Configured backend key" /></label>
              </div>
              <label className="block text-sm font-bold">New password<div className="relative mt-1"><input type={showPasswords ? "text" : "password"} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-12 w-full rounded-xl border bg-background px-3 pr-12 text-base outline-none focus:border-primary sm:text-sm" /><button type="button" onClick={() => setShowPasswords((v) => !v)} className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg hover:bg-accent">{showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>
              <label className="block text-sm font-bold">Confirm new password<input type={showPasswords ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 h-12 w-full rounded-xl border bg-background px-3 text-base outline-none focus:border-primary sm:text-sm" /></label>
              <p className="text-xs text-muted-foreground">Use at least 8 characters with at least one letter and one number.</p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button disabled={resetPassword.isPending} onClick={() => { setRequested(false); setCode(""); setRecoveryKey(""); }} className="h-11 rounded-xl border px-4 font-bold hover:bg-accent disabled:opacity-50">Start again</button>
                <button disabled={resetPassword.isPending} onClick={() => { haptic(); resetPassword.mutate(); }} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl gradient-primary px-5 font-black text-primary-foreground shadow-glow disabled:opacity-50">
                  {resetPassword.isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Resetting…</> : "Reset password"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
