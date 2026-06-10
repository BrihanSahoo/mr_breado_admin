import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { restaurantsService, type RestaurantsQuery } from "@/services/restaurants.service";

export const restaurantKeys = {
  all: ["restaurants"] as const,
  list: (q: RestaurantsQuery) => ["restaurants", "list", q] as const,
};

export function useRestaurants(query: RestaurantsQuery) {
  return useQuery({
    queryKey: restaurantKeys.list(query),
    queryFn: () => restaurantsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
