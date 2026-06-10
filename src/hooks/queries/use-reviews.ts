import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { reviewsService, type ReviewsQuery } from "@/services/reviews.service";

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (q: ReviewsQuery) => ["reviews", "list", q] as const,
};

export function useReviews(query: ReviewsQuery) {
  return useQuery({
    queryKey: reviewKeys.list(query),
    queryFn: () => reviewsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
