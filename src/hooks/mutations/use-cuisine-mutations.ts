import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cuisineKeys } from "@/hooks/queries/use-cuisines";

type Cuisine = { id?: number | string; name: string; img?: string; status?: string };

export function useCreateCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Cuisine) => payload,
    onSuccess: (newItem: Cuisine) => {
      toast.success("Cuisine created");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old: any) => {
        if (!old) return old;
        return [newItem, ...(old ?? [])];
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to create cuisine"),
  });
}

export function useUpdateCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; payload: Partial<Cuisine> }) => v,
    onSuccess: (v) => {
      toast.success("Cuisine updated");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old: any) => {
        if (!old) return old;
        return (old ?? []).map((it: any) => (it.id === v.id ? { ...it, ...v.payload } : it));
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update cuisine"),
  });
}

export function useDeleteCuisine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => id,
    onSuccess: (id: number | string) => {
      toast.success("Cuisine deleted");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old: any) => {
        if (!old) return old;
        return (old ?? []).filter((it: any) => it.id !== id);
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to delete cuisine"),
  });
}

export function useToggleCuisineStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; status: string }) => v,
    onSuccess: (v) => {
      toast.success("Status updated");
      qc.setQueriesData(cuisineKeys.list({ page: 1, perPage: 100 }), (old: any) => {
        if (!old) return old;
        return (old ?? []).map((it: any) => (it.id === v.id ? { ...it, status: v.status } : it));
      });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to update status"),
  });
}
