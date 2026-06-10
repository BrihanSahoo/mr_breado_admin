import { createFileRoute } from "@tanstack/react-router";
import { OrdersPage } from "./index";
export const Route = createFileRoute("/orders/preparing")({ component: () => <OrdersPage filterStatus="PREPARING" title="Preparing Orders" /> });