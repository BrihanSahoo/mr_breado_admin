import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { supportService } from "@/services/support.service";

export const supportKeys = {
  all: ["support"] as const,
  dashboard: () => ["support", "dashboard"] as const,
  list: (q: any) => ["support", "tickets", q] as const,
};

export function useSupportDashboard() {
  return useQuery({ queryKey: supportKeys.dashboard(), queryFn: supportService.dashboard, staleTime: 15_000 });
}

export function useSupportTickets(query: { page?: number; perPage?: number; status?: string; type?: string; search?: string } = {}) {
  return useQuery({ queryKey: supportKeys.list(query), queryFn: () => supportService.list(query), placeholderData: keepPreviousData, staleTime: 10_000 });
}
