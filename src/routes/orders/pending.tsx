import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";
export const Route = createFileRoute("/orders/pending")({ component: () => <OrdersPage filterStatus="PENDING" title="Pending Orders" /> });