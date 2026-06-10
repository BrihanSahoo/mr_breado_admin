import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { driversService, type DriversQuery } from "@/services/drivers.service";
import type { AdminDriverCashDepositRequest } from "@/types";

export const driverKeys = {
  all: ["drivers"] as const,
  list: (q: DriversQuery) => ["drivers", "list", q] as const,
};

export function useDrivers(query: DriversQuery) {
  return useQuery({
    queryKey: driverKeys.list(query),
    queryFn: () => driversService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useVerifyDriverDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ driverId, body }: { driverId: number | string; body: AdminDriverCashDepositRequest }) =>
      driversService.verifyDeposit(driverId, body),
    onSuccess: () => {
      toast.success("Cash deposit verified");
      qc.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
