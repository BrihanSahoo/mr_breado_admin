import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { bannersService, type BannersQuery } from "@/services/banners.service";
import type { BannerRequest } from "@/types";

export const bannerKeys = {
  all: ["banners"] as const,
  list: (q: BannersQuery) => ["banners", "list", q] as const,
};

export function useBanners(query: BannersQuery) {
  return useQuery({
    queryKey: bannerKeys.list(query),
    queryFn: () => bannersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: BannerRequest) => bannersService.create(body),
    onSuccess: () => { toast.success("Banner created"); qc.invalidateQueries({ queryKey: bannerKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: BannerRequest }) => bannersService.update(id, body),
    onSuccess: () => { toast.success("Banner updated"); qc.invalidateQueries({ queryKey: bannerKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => bannersService.remove(id),
    onSuccess: () => { toast.success("Banner deleted"); qc.invalidateQueries({ queryKey: bannerKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useToggleBannerStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: number | string; enabled: boolean }) => bannersService.setStatus(id, enabled),
    onSuccess: () => qc.invalidateQueries({ queryKey: bannerKeys.all }),
    onError: (e: Error) => toast.error(e.message),
  });
}
