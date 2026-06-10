import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { messagingService } from "@/services/messaging.service";
import { messagingKeys } from "@/hooks/queries/use-messaging";
import type { AdminSellerMessageRequest } from "@/types";

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminSellerMessageRequest) => messagingService.send(data),
    onSuccess: () => {
      toast.success("Message sent successfully");
      qc.invalidateQueries({ queryKey: messagingKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to send message"),
  });
}

export function useMarkMessageAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => messagingService.markAsRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: messagingKeys.all });
    },
    onError: (e: Error) => toast.error(e.message || "Failed to mark as read"),
  });
}
