import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponsService } from "@/services/coupons.service";
import { couponKeys } from "@/hooks/queries/use-coupons";
import type { AdminCouponRequest } from "@/types";

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminCouponRequest) => couponsService.create(data),
    onSuccess: () => {
      toast.success("Coupon created successfully");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create coupon"),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; data: AdminCouponRequest }) =>
      couponsService.update(v.id, v.data),
    onSuccess: () => {
      toast.success("Coupon updated successfully");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update coupon"),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => couponsService.remove(id),
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete coupon"),
  });
}

export function useCouponStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; enabled: boolean }) =>
      couponsService.setStatus(v.id, v.enabled),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: couponKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update status"),
  });
}
