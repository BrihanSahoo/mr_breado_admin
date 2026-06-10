import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { offersService, type OffersQuery } from "@/services/offers.service";
import type { OfferRequest } from "@/types";

export const offerKeys = {
  all: ["offers"] as const,
  list: (q: OffersQuery) => ["offers", "list", q] as const,
};

export function useOffers(query: OffersQuery) {
  return useQuery({
    queryKey: offerKeys.list(query),
    queryFn: () => offersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: OfferRequest) => offersService.create(body),
    onSuccess: () => { toast.success("Offer created"); qc.invalidateQueries({ queryKey: offerKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: OfferRequest }) => offersService.update(id, body),
    onSuccess: () => { toast.success("Offer updated"); qc.invalidateQueries({ queryKey: offerKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => offersService.remove(id),
    onSuccess: () => { toast.success("Offer deleted"); qc.invalidateQueries({ queryKey: offerKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
export function useToggleOfferStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => offersService.toggleStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: offerKeys.all }),
    onError: (e: Error) => toast.error(e.message),
  });
}
