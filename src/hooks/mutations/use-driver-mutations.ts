import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { driversService } from "@/services/drivers.service";
import { driverKeys } from "@/hooks/queries/use-drivers";
import type { AdminDriverCashDepositRequest } from "@/types";

export function useVerifyDriverCashDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { driverId: number | string; data: AdminDriverCashDepositRequest }) =>
      driversService.verifyDeposit(v.driverId, v.data),
    onSuccess: () => {
      toast.success("Cash deposit verified");
      qc.invalidateQueries({ queryKey: driverKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to verify deposit"),
  });
}
