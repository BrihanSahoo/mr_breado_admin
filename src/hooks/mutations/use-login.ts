import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { authStore } from "@/store/auth";
import type { LoginRequest } from "@/types";

export function useLogin() {
 
  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      if (data?.accessToken) {
        authStore.setToken(data.accessToken, data.tokenType ?? "ADMIN");
        toast.success("Welcome back!");
      } else {
        toast.error("Login failed: no token returned");
      }
    },
    onError: (e: Error) => {
      const message = e.message || "Invalid admin email or password.";
      toast.error(message);
    },
  });
}
