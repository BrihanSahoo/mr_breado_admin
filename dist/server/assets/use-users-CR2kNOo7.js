import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { u as usersService } from "./users.service-6ZwfLhPd.js";
const userKeys = {
  all: ["users"],
  list: (q) => ["users", "list", q]
};
function useUsers(query) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => usersService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 1e4
  });
}
export {
  userKeys as a,
  useUsers as u
};
