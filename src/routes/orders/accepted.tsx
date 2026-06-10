import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";
export const Route = createFileRoute("/orders/accepted")({ component: () => <OrdersPage filterStatus="ACCEPTED" title="Accepted Orders" /> });