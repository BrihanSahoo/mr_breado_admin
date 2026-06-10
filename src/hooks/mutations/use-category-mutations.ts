import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { categoriesService, type CategoryResponse } from "@/services/categories.service";
import { categoryKeys } from "@/hooks/queries/use-categories";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CategoryResponse>) => categoriesService.create(payload),
    onSuccess: () => { toast.success("Category created"); qc.invalidateQueries({ queryKey: categoryKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: Partial<CategoryResponse> }) => categoriesService.update(id, payload),
    onSuccess: () => { toast.success("Category updated"); qc.invalidateQueries({ queryKey: categoryKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => categoriesService.remove(id),
    onSuccess: () => { toast.success("Category deleted"); qc.invalidateQueries({ queryKey: categoryKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useToggleCategoryStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: "ACTIVE" | "INACTIVE" }) => categoriesService.setStatus(id, status),
    onSuccess: () => { toast.success("Category status updated"); qc.invalidateQueries({ queryKey: categoryKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}
