import { jsx } from "react/jsx-runtime";
import { R as Route, O as OutletCommandCenterPage } from "./router-1xz68c6T.js";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-dialog";
import "class-variance-authority";
import "axios";
import "sonner";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
function OutletDashboardRoute() {
  const {
    outletId
  } = Route.useParams();
  return /* @__PURE__ */ jsx(OutletCommandCenterPage, { outletId: String(outletId) });
}
export {
  OutletDashboardRoute as component
};
