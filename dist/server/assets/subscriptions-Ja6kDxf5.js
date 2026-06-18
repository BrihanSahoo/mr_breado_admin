import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./router-1xz68c6T.js";
import { CreditCard, Check } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
const SplitComponent = () => {
  const plans = [{
    name: "Basic",
    price: 0,
    features: ["Up to 50 orders/mo", "Email support", "1 restaurant"],
    color: "border-border"
  }, {
    name: "Pro",
    price: 49,
    features: ["Unlimited orders", "Priority support", "5 restaurants", "Analytics"],
    color: "border-primary shadow-glow",
    popular: true
  }, {
    name: "Enterprise",
    price: 199,
    features: ["Unlimited everything", "24/7 support", "Unlimited restaurants", "Custom integrations", "Dedicated manager"],
    color: "border-border"
  }];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Subscription Plans", icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-5 w-5" }), breadcrumbs: [{
      label: "Dashboard",
      to: "/"
    }, {
      label: "Subscriptions"
    }] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-3", children: plans.map((p) => /* @__PURE__ */ jsxs("div", { className: `relative rounded-2xl border-2 bg-card p-6 ${p.color}`, children: [
      p.popular && /* @__PURE__ */ jsx("span", { className: "absolute -top-3 right-4 rounded-full gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground", children: "POPULAR" }),
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: p.name }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-baseline gap-1", children: [
        /* @__PURE__ */ jsxs("span", { className: "text-4xl font-bold", children: [
          "₹",
          p.price
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "/mo" })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "my-6 space-y-2", children: p.features.map((f) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-success" }),
        f
      ] }, f)) }),
      /* @__PURE__ */ jsx("button", { className: `w-full rounded-md py-2 text-sm font-medium ${p.popular ? "gradient-primary text-primary-foreground" : "border border-border hover:bg-accent"}`, children: "Choose Plan" })
    ] }, p.name)) })
  ] });
};
export {
  SplitComponent as component
};
