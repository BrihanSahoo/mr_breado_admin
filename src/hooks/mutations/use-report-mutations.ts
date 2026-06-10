import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reportsService } from "@/services/reports.service";
import { reportKeys } from "@/hooks/queries/use-reports";
import type { AdminReportStatusRequest } from "@/types";

export function useUpdateReportStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; data: AdminReportStatusRequest }) =>
      reportsService.updateStatus(v.id, v.data),
    onSuccess: () => {
      toast.success("Report status updated");
      qc.invalidateQueries({ queryKey: reportKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to update report"),
  });
}

export function useApproveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; reason?: string }) =>
      reportsService.approve(v.id, v.reason),
    onSuccess: () => {
      toast.success("Report approved");
      qc.invalidateQueries({ queryKey: reportKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to approve report"),
  });
}

export function useRejectReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; reason?: string }) =>
      reportsService.reject(v.id, v.reason),
    onSuccess: () => {
      toast.success("Report rejected");
      qc.invalidateQueries({ queryKey: reportKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to reject report"),
  });
}

export function useResolveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: number | string; reason?: string }) =>
      reportsService.resolve(v.id, v.reason),
    onSuccess: () => {
      toast.success("Report resolved");
      qc.invalidateQueries({ queryKey: reportKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to resolve report"),
  });
}
