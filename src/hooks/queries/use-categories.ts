import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories.service";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (p: { page?: number; perPage?: number }) => ["categories", "list", p] as const,
  summary: () => ["categories", "summary"] as const,
};

export function useCategories(page = 1, perPage = 50) {
  return useQuery({
    queryKey: categoryKeys.list({ page, perPage }),
    queryFn: () => categoriesService.list(page, perPage),
    staleTime: 30_000,
  });
}

export function useCategorySummary() {
  return useQuery({
    queryKey: categoryKeys.summary(),
    queryFn: categoriesService.summary,
    staleTime: 30_000,
  });
}

export function useSubCategories(page = 1, perPage = 50) {
  return useQuery({
    queryKey: categoryKeys.list({ page, perPage }),
    queryFn: () => categoriesService.subCategories(page, perPage),
    staleTime: 30_000,
  });
}

export function useFoodCategories(page = 1, perPage = 50) {
  return useQuery({
    queryKey: categoryKeys.list({ page, perPage }),
    queryFn: () => categoriesService.foodCategories(page, perPage),
    staleTime: 30_000,
  });
}
