import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";

export const Route = createFileRoute("/orders/active")({
  head: () => ({ meta: [{ title: "Active Orders | Mr. Breado Admin" }] }),
  component: () => <OrdersPage title="Active Orders" activeOnly />,
});
