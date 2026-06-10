import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponsService, type CouponsQuery } from "@/services/coupons.service";
import type { AdminCouponRequest } from "@/types";

export const couponKeys = {
  all: ["coupons"] as const,
  list: (q: CouponsQuery) => ["coupons", "list", q] as const,
};

export function useCoupons(query: CouponsQuery) {
  return useQuery({
    queryKey: couponKeys.list(query),
    queryFn: () => couponsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminCouponRequest) => couponsService.create(body),
    onSuccess: () => { toast.success("Coupon created"); qc.invalidateQueries({ queryKey: couponKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: AdminCouponRequest }) => couponsService.update(id, body),
    onSuccess: () => { toast.success("Coupon updated"); qc.invalidateQueries({ queryKey: couponKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => couponsService.remove(id),
    onSuccess: () => { toast.success("Coupon deleted"); qc.invalidateQueries({ queryKey: couponKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useToggleCouponStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: number | string; enabled: boolean }) => couponsService.setStatus(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: couponKeys.all }),
    onError: (e: Error) => toast.error(e.message),
  });
}
