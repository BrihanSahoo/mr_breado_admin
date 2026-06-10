import { useQuery } from "@tanstack/react-query";
import { restaurantsService } from "@/services/restaurants.service";

export const cuisineKeys = {
  all: ["cuisines"] as const,
  list: (p: { page?: number; perPage?: number }) => ["cuisines", "list", p] as const,
};

export function useCuisines() {
  // Fetch a larger list of restaurants and extract unique cuisines
  return useQuery({
    queryKey: cuisineKeys.list({ page: 1, perPage: 100 }),
    queryFn: async () => {
      const res = await restaurantsService.list({ page: 1, perPage: 100 });
      const items = res.items ?? [];
      const set = new Set<string>();
      items.forEach((r: any) => {
        if (Array.isArray(r.cuisines)) r.cuisines.forEach((c: string) => set.add(c));
        else if (r.cuisines) set.add(String(r.cuisines));
      });
      return Array.from(set).map((name, i) => ({ id: i + 1, name, status: "Active", img: "🍽️" }));
    },
    staleTime: 60_000,
  });
}
