import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChefHat, User, Mail, Lock, EyeOff, Eye, ArrowRight, Sparkles } from "lucide-react";
const authImg = "/assets/auth-register-Cp8B20Ey.jpg";
function RegisterPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const onChange = (k) => (e) => setForm({
    ...form,
    [k]: e.target.value
  });
  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({
      to: "/login"
    }), 700);
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen bg-background lg:grid-cols-2", children: [
    /* @__PURE__ */ jsx("div", { className: "order-2 flex items-center justify-center p-6 sm:p-10 lg:order-1", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-2 lg:hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground", children: /* @__PURE__ */ jsx(ChefHat, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Go4Food Admin" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Create your account" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Start managing restaurants, orders and delivery fleet in minutes." }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-xs font-medium text-muted-foreground", children: "Full name" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(User, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { required: true, value: form.name, onChange: onChange("name"), className: "h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30", placeholder: "Jane Doe" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-xs font-medium text-muted-foreground", children: "Email address" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: "email", required: true, value: form.email, onChange: onChange("email"), className: "h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30", placeholder: "you@company.com" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-xs font-medium text-muted-foreground", children: "Password" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: show ? "text" : "password", required: true, minLength: 6, value: form.password, onChange: onChange("password"), className: "h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30", placeholder: "At least 6 characters" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShow(!show), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", required: true, className: "mt-0.5 h-3.5 w-3.5 rounded border-border accent-[--color-primary]" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "I agree to the",
            " ",
            /* @__PURE__ */ jsx("a", { href: "#", className: "text-primary hover:underline", children: "Terms of Service" }),
            " and",
            " ",
            /* @__PURE__ */ jsx("a", { href: "#", className: "text-primary hover:underline", children: "Privacy Policy" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-70", children: [
          loading ? "Creating account…" : "Create account",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-8 text-center text-sm text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-medium text-primary hover:underline", children: "Sign in" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative order-1 hidden overflow-hidden lg:order-2 lg:block", children: [
      /* @__PURE__ */ jsx("img", { src: authImg, alt: "Gourmet burger", className: "absolute inset-0 h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-bl from-background via-background/60 to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,115,0,0.3),transparent_60%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex h-full flex-col justify-between p-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 text-foreground", children: [
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold tracking-tight", children: "Go4Food Admin" }),
          /* @__PURE__ */ jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-glow", children: /* @__PURE__ */ jsx(ChefHat, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ml-auto max-w-md text-right", children: [
          /* @__PURE__ */ jsxs("div", { className: "ml-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary", children: [
            /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5" }),
            " Trusted by 10,000+ restaurants"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "mt-4 text-3xl font-bold leading-tight text-foreground", children: "Grow faster. Deliver smarter." }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Everything you need to scale your food business — onboarding, payouts, promotions and live operations in a single command center." })
        ] })
      ] })
    ] })
  ] });
}
export {
  RegisterPage as component
};
