import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ChefHat, ArrowRight, Sparkles } from "lucide-react";
import authImg from "@/assets/auth-register.jpg";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account | Mr. Breado Admin" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/login" }), 700);
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Form side */}
      <div className="order-2 flex items-center justify-center p-6 sm:p-10 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
              <ChefHat className="h-4 w-4" />
            </div>
            <span className="font-bold">Mr. Breado Admin</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start managing restaurants, orders and delivery fleet in minutes.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Full name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  required
                  value={form.name}
                  onChange={onChange("name")}
                  className="h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                  className="h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={show ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={onChange("password")}
                  className="h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="At least 6 characters"
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

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-[--color-primary]" />
              <span>
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-70"
            >
              {loading ? "Creating account…" : "Create account"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative order-1 hidden overflow-hidden lg:order-2 lg:block">
        <img
          src={authImg}
          alt="Gourmet burger"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,115,0,0.3),transparent_60%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10">
          <div className="flex items-center justify-end gap-2 text-foreground">
            <span className="text-lg font-bold tracking-tight">Mr. Breado Admin</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
              <ChefHat className="h-5 w-5" />
            </div>
          </div>
          <div className="ml-auto max-w-md text-right">
            <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Trusted by 10,000+ restaurants
            </div>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground">
              Grow faster. Deliver smarter.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Everything you need to scale your food business — onboarding, payouts, promotions and
              live operations in a single command center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
