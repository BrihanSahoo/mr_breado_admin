import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { productsService, type ProductsQuery } from "@/services/products.service";

export const productKeys = {
  all: ["products"] as const,
  list: (q: ProductsQuery) => ["products", "list", q] as const,
};

export function useProducts(query: ProductsQuery) {
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: () => productsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
