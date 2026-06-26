import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/client";
import { cuisineKeys } from "@/hooks/queries/use-cuisines";
import { apiErrorMessage } from "@/lib/api-error";
import { haptic } from "@/lib/haptics";

const refresh = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: cuisineKeys.all });

function mutationError(error: unknown, fallback: string) {
  haptic([35, 35, 35]);
  toast.error(apiErrorMessage(error, fallback));
}

export function useCreateCuisine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: FormData) => api.post("/admin/cuisines", payload, { timeout: 60_000 }),
    onSuccess: () => {
      haptic([20, 30, 20]);
      toast.success("Cuisine created successfully");
      refresh(queryClient);
    },
    onError: (error) => mutationError(error, "Cuisine could not be created."),
  });
}

export function useUpdateCuisine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: { id: string | number; payload: FormData }) =>
      api.put(`/admin/cuisines/${value.id}`, value.payload, { timeout: 60_000 }),
    onSuccess: () => {
      haptic([20, 30, 20]);
      toast.success("Cuisine updated successfully");
      refresh(queryClient);
    },
    onError: (error) => mutationError(error, "Cuisine could not be updated."),
  });
}

export function useDeleteCuisine() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => api.delete(`/admin/cuisines/${id}`),
    onSuccess: () => {
      haptic([20, 30, 20]);
      toast.success("Cuisine deleted");
      refresh(queryClient);
    },
    onError: (error) => mutationError(error, "Cuisine could not be deleted."),
  });
}

export function useToggleCuisineStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: { id: string | number; status: string }) =>
      api.patch(`/admin/cuisines/${value.id}/status`, {
        status: value.status,
        active: value.status === "Active",
      }),
    onSuccess: () => {
      haptic(18);
      toast.success("Cuisine status updated");
      refresh(queryClient);
    },
    onError: (error) => mutationError(error, "Cuisine status could not be updated."),
  });
}
