import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";

export const Route = createFileRoute("/orders/active")({
  head: () => ({ meta: [{ title: "Active Orders | Go4Food Admin" }] }),
  component: () => <OrdersPage title="Active Orders" activeOnly />,
});
