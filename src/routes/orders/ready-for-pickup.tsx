import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";

export const Route = createFileRoute("/orders/ready-for-pickup")({
  component: () => <OrdersPage filterStatus="READY_FOR_PICKUP" title="Ready for Pickup Orders" />,
});
