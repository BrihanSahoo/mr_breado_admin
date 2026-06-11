import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supportService } from "@/services/support.service";
import { supportKeys } from "@/hooks/queries/use-support";

export function useAcceptSupportTicket() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number | string) => supportService.accept(id), onSuccess: () => { toast.success("Ticket accepted"); qc.invalidateQueries({ queryKey: supportKeys.all }); }, onError: (e: Error) => toast.error(e.message) });
}

export function useReplySupportTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, message }: { id: number | string; message: string }) => supportService.reply(id, message),
    onSuccess: () => { toast.success("Reply sent to user"); qc.invalidateQueries({ queryKey: supportKeys.all }); },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateSupportTicketStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: number | string; status: string }) => supportService.setStatus(id, status), onSuccess: () => { toast.success("Ticket updated"); qc.invalidateQueries({ queryKey: supportKeys.all }); }, onError: (e: Error) => toast.error(e.message) });
}
export function useDeleteSupportTicket() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: number | string) => supportService.remove(id), onSuccess: () => { toast.success("Ticket deleted"); qc.invalidateQueries({ queryKey: supportKeys.all }); }, onError: (e: Error) => toast.error(e.message) });
}
