import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";
export const Route = createFileRoute("/orders/cancelled")({ component: () => <OrdersPage filterStatus="CANCELLED" title="Cancelled Orders" /> });