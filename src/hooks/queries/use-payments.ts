import { useQuery } from "@tanstack/react-query";
import { paymentsService } from "@/services/payments.service";

export function usePaymentsSummary() {
  return useQuery({
    queryKey: ["payments", "summary"],
    queryFn: () => paymentsService.summary(),
    staleTime: 30_000,
  });
}

export function useMrBreadoPayments() {
  return useQuery({
    queryKey: ["payments", "mr-breado"],
    queryFn: () => paymentsService.mrBreado(),
    staleTime: 30_000,
  });
}
