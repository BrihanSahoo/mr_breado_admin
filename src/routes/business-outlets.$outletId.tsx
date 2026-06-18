import { createFileRoute } from "@tanstack/react-router";
import { OutletCommandCenterPage } from "@/components/business-outlets/OutletCommandCenter";

export const Route = createFileRoute("/business-outlets/$outletId")({
  component: OutletDashboardRoute,
});

function OutletDashboardRoute() {
  const { outletId } = Route.useParams();
  return <OutletCommandCenterPage outletId={String(outletId)} />;
}
