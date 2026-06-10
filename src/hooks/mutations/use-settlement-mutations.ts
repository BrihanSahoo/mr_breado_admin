import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settlementsService } from "@/services/settlements.service";
import { settlementKeys } from "@/hooks/queries/use-settlements";
import type { AdminRestaurantPayoutPaidRequest } from "@/types";

export function useGenerateWeeklySettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (restaurantId: number | string) =>
      settlementsService.generateWeekly(restaurantId),
    onSuccess: () => {
      toast.success("Weekly settlement generated");
      qc.invalidateQueries({ queryKey: settlementKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to generate settlement"),
  });
}

export function useMarkSettlementPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; data: AdminRestaurantPayoutPaidRequest }) =>
      settlementsService.markPaid(v.id, v.data),
    onSuccess: () => {
      toast.success("Settlement marked as paid");
      qc.invalidateQueries({ queryKey: settlementKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to mark settlement as paid"),
  });
}
