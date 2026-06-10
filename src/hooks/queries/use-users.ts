import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { usersService, type UsersQuery } from "@/services/users.service";

export const userKeys = {
  all: ["users"] as const,
  list: (q: UsersQuery) => ["users", "list", q] as const,
};

export function useUsers(query: UsersQuery) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => usersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}
