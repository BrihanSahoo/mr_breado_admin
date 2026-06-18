import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { r as restaurantsService } from "./restaurants.service-Dw86oKrx.js";
const restaurantKeys = {
  all: ["restaurants"],
  list: (q) => ["restaurants", "list", q]
};
function useRestaurants(query) {
  return useQuery({
    queryKey: restaurantKeys.list(query),
    queryFn: () => restaurantsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
export {
  restaurantKeys as r,
  useRestaurants as u
};
