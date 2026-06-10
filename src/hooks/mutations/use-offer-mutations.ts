import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { offersService } from "@/services/offers.service";
import { offerKeys } from "@/hooks/queries/use-offers";
import type { OfferRequest } from "@/types";

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: OfferRequest) => offersService.create(data),
    onSuccess: () => {
      toast.success("Offer created successfully");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to create offer"),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; data: OfferRequest }) =>
      offersService.update(v.id, v.data),
    onSuccess: () => {
      toast.success("Offer updated successfully");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update offer"),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => offersService.remove(id),
    onSuccess: () => {
      toast.success("Offer deleted successfully");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to delete offer"),
  });
}

export function useOfferStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; enabled: boolean }) =>
      offersService.setStatus(v.id, v.enabled),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: offerKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update status"),
  });
}
