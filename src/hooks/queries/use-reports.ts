import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { reportsService, type ReportsQuery } from "@/services/reports.service";

export const reportKeys = {
  all: ["reports"] as const,
  list: (q: ReportsQuery) => ["reports", "list", q] as const,
  detail: (id: number | string) => ["reports", "detail", id] as const,
};

export function useReports(query: ReportsQuery) {
  return useQuery({
    queryKey: reportKeys.list(query),
    queryFn: () => reportsService.list(query),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
}

export function useReport(id: number | string | null | undefined) {
  return useQuery({
    queryKey: reportKeys.detail(id ?? "none"),
    queryFn: () => reportsService.detail(id!),
    enabled: id != null,
  });
}
