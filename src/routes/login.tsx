import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";
import { ADMIN_LOGO_URL, API_BASE_URL } from "@/api/endpoints";
import { api } from "@/api/client";
import { useLogin } from "@/hooks/mutations/use-login";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in | Go4Food Admin" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    login.mutate(
      { email, password, deviceType: "ADMIN" },
      { onSuccess: () => navigate({ to: "/" }) },
      
    );
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={authHero}
          alt="Delicious food spread"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,115,0,0.25),transparent_60%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2 text-foreground">
            <img src={ADMIN_LOGO_URL} alt="Mr. Breado" className="h-10 w-10 rounded-xl object-contain shadow-glow" />
            <span className="text-lg font-bold tracking-tight">Mr. Breado Admin</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-foreground">
              Manage your food delivery empire with confidence.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Real-time orders, fleet tracking, restaurant analytics and revenue insights — all in one
              modern dashboard.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Enterprise-grade security · 99.99% uptime
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <img src={ADMIN_LOGO_URL} alt="Mr. Breado" className="h-9 w-9 rounded-lg object-contain" />
            <span className="font-bold">Mr. Breado Admin</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue to your admin dashboard.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter admin email"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Password</label>
                <span className="text-xs text-muted-foreground">Contact platform owner for password reset</span>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-[--color-primary]" />
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div className="relative py-2 text-center">
              <span className="relative z-10 bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                Secure admin access
              </span>
              <div className="absolute left-0 top-1/2 h-px w-full bg-border" />
            </div>

            <div className="rounded-xl border border-border bg-card/70 p-3 text-xs leading-5 text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <span>{backendState === "online" ? "Backend connected" : backendState === "offline" ? "Backend unavailable" : "Checking backend…"}</span>
                <span className={backendState === "online" ? "text-emerald-500" : backendState === "offline" ? "text-red-500" : "text-amber-500"}>●</span>
              </div>
              <div className="mt-1 break-all opacity-75">{API_BASE_URL}</div>
              <div className="mt-2">Use only administrator credentials stored in the backend.</div>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Access is restricted to approved Mr. Breado administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
