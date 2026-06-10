import { createFileRoute } from "@tanstack/react-router";
import { FoodsPage } from "./foods";
export const Route = createFileRoute("/admin-foods")({ component: () => <FoodsPage title="Mr Breado Store" source="admin" /> });
