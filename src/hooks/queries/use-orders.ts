import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { ordersService, type OrdersQuery } from "@/services/orders.service";

export const orderKeys = {
  all: ["orders"] as const,
  list: (q: OrdersQuery) => ["orders", "list", q] as const,
  detail: (id: number | string) => ["orders", "detail", id] as const,
};

export function useOrders(query: OrdersQuery) {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: () => ordersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useOrder(id: number | string | null | undefined) {
  return useQuery({
    queryKey: orderKeys.detail(id ?? "none"),
    queryFn: () => ordersService.detail(id!),
    enabled: id != null,
  });
}
