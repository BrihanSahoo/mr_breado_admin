import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";

export const dashboardKeys = { all: ["dashboard"] as const };

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: dashboardService.get,
    staleTime: 10_000,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
