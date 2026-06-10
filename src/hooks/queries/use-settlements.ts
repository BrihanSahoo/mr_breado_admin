import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { settlementsService, type SettlementsQuery } from "@/services/settlements.service";
import type { AdminRestaurantPayoutPaidRequest } from "@/types";

export const settlementKeys = {
  all: ["settlements"] as const,
  list: (q: SettlementsQuery) => ["settlements", "list", q] as const,
};

export function useSettlements(query: SettlementsQuery) {
  return useQuery({
    queryKey: settlementKeys.list(query),
    queryFn: () => settlementsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useGenerateWeeklySettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (restaurantId: number | string) => settlementsService.generateWeekly(restaurantId),
    onSuccess: () => { toast.success("Weekly settlement generated"); qc.invalidateQueries({ queryKey: settlementKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMarkSettlementPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: AdminRestaurantPayoutPaidRequest }) =>
      settlementsService.markPaid(id, body),
    onSuccess: () => { toast.success("Settlement marked as paid"); qc.invalidateQueries({ queryKey: settlementKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
