import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { messagingService, type MessagingQuery } from "@/services/messaging.service";

export const messagingKeys = {
  all: ["messages"] as const,
  list: (q: MessagingQuery) => ["messages", "list", q] as const,
};

export function useMessages(query: MessagingQuery) {
  return useQuery({
    queryKey: messagingKeys.list(query),
    queryFn: () => messagingService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
