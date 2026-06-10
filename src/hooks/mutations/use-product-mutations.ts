import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsService } from "@/services/products.service";
import { productKeys } from "@/hooks/queries/use-products";

type Source = "seller" | "admin";

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, source = "admin" }: { id: number | string; source?: Source }) => productsService.remove(id, source),
    onSuccess: () => { toast.success("Product deleted"); qc.invalidateQueries({ queryKey: productKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleProductAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; isAvailable: boolean; source?: Source }) => productsService.setAvailability(v.id, v.isAvailable, v.source ?? "admin"),
    onSuccess: () => { toast.success("Availability updated"); qc.invalidateQueries({ queryKey: productKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ payload, source = "admin" }: { payload: Record<string, unknown> | FormData; source?: Source }) => productsService.create(payload, source),
    onSuccess: () => { toast.success("Product created"); qc.invalidateQueries({ queryKey: productKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; payload: Record<string, unknown> | FormData; source?: Source }) => productsService.update(v.id, v.payload, v.source ?? "admin"),
    onSuccess: () => { toast.success("Product updated"); qc.invalidateQueries({ queryKey: productKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
