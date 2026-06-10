import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bannersService } from "@/services/banners.service";
import { bannerKeys } from "@/hooks/queries/use-banners";
import type { BannerRequest } from "@/types";

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BannerRequest) => bannersService.create(data),
    onSuccess: () => {
      toast.success("Banner created successfully");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create banner"),
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; data: BannerRequest }) =>
      bannersService.update(v.id, v.data),
    onSuccess: () => {
      toast.success("Banner updated successfully");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update banner"),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => bannersService.remove(id),
    onSuccess: () => {
      toast.success("Banner deleted successfully");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete banner"),
  });
}

export function useBannerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; enabled: boolean }) =>
      bannersService.setStatus(v.id, v.enabled),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: bannerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update status"),
  });
}
