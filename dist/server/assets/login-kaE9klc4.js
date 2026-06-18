import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, Mail, Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
import { b as authStore, f as authService, a as api, A as ADMIN_LOGO_URL, g as API_BASE_URL } from "./router-1xz68c6T.js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const authHero = "/assets/auth-hero-Cdbrj4ue.jpg";
function useLogin() {
  return useMutation({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: (data) => {
      if (data?.accessToken) {
        authStore.setToken(data.accessToken, data.tokenType ?? "ADMIN");
        toast.success("Welcome back!");
      } else {
        toast.error("Login failed: no token returned");
      }
    },
    onError: (e) => {
      const message = e.message || "Invalid admin email or password.";
      toast.error(message);
    }
  });
}
function LoginPage() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const loading = login.isPending;
  const [backendState, setBackendState] = useState("checking");
  useEffect(() => {
    let active = true;
    api.get("/health", {
      timeout: 8e3
    }).then(() => active && setBackendState("online")).catch(() => active && setBackendState("offline"));
    return () => {
      active = false;
    };
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
    login.mutate({
      email,
      password,
      deviceType: "ADMIN"
    }, {
      onSuccess: () => navigate({
        to: "/"
      })
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid min-h-screen bg-background lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative hidden overflow-hidden lg:block", children: [
      /* @__PURE__ */ jsx("img", { src: authHero, alt: "Delicious food spread", className: "absolute inset-0 h-full w-full object-cover" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-background via-background/70 to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,115,0,0.25),transparent_60%)]" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex h-full flex-col justify-between p-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsx("img", { src: ADMIN_LOGO_URL, alt: "Mr. Breado", className: "h-10 w-10 rounded-xl object-contain shadow-glow" }),
          /* @__PURE__ */ jsx("span", { className: "text-lg font-bold tracking-tight", children: "Mr. Breado Admin" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "max-w-md", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold leading-tight text-foreground", children: "Manage your food delivery empire with confidence." }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Real-time orders, fleet tracking, restaurant analytics and revenue insights — all in one modern dashboard." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4 text-primary" }),
            "Enterprise-grade security · 99.99% uptime"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-6 sm:p-10", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-2 lg:hidden", children: [
        /* @__PURE__ */ jsx("img", { src: ADMIN_LOGO_URL, alt: "Mr. Breado", className: "h-9 w-9 rounded-lg object-contain" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold", children: "Mr. Breado Admin" })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Welcome back 👋" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Sign in to continue to your admin dashboard." }),
      /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-8 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block text-xs font-medium text-muted-foreground", children: "Email address" }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Mail, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30", placeholder: "Enter admin email" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-1.5 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground", children: "Password" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Contact platform owner for password reset" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Lock, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsx("input", { type: show ? "text" : "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "h-11 w-full rounded-lg border border-border bg-card px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30", placeholder: "••••••••" }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShow(!show), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between text-xs", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", className: "h-3.5 w-3.5 rounded border-border accent-[--color-primary]" }),
          "Keep me signed in"
        ] }) }),
        /* @__PURE__ */ jsxs("button", { type: "submit", disabled: loading, className: "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-95 disabled:opacity-70", children: [
          loading ? "Signing in…" : "Sign in",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative py-2 text-center", children: [
          /* @__PURE__ */ jsx("span", { className: "relative z-10 bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground", children: "Secure admin access" }),
          /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-1/2 h-px w-full bg-border" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card/70 p-3 text-xs leading-5 text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsx("span", { children: backendState === "online" ? "Backend connected" : backendState === "offline" ? "Backend unavailable" : "Checking backend…" }),
            /* @__PURE__ */ jsx("span", { className: backendState === "online" ? "text-emerald-500" : backendState === "offline" ? "text-red-500" : "text-amber-500", children: "●" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 break-all opacity-75", children: API_BASE_URL }),
          /* @__PURE__ */ jsx("div", { className: "mt-2", children: "Use only administrator credentials stored in the backend." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mt-8 text-center text-sm text-muted-foreground", children: "Access is restricted to approved Mr. Breado administrators." })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
