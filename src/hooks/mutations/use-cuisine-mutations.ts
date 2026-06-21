import { useMutation,useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api/client";
import { cuisineKeys } from "@/hooks/queries/use-cuisines";
const refresh=(qc:any)=>qc.invalidateQueries({queryKey:cuisineKeys.all});
export function useCreateCuisine(){const qc=useQueryClient();return useMutation({mutationFn:(payload:FormData)=>api.post("/admin/cuisines",payload),onSuccess:()=>{toast.success("Cuisine created");refresh(qc)},onError:(e:any)=>toast.error(e?.response?.data?.message??e?.message??"Failed to create cuisine")});}
export function useUpdateCuisine(){const qc=useQueryClient();return useMutation({mutationFn:(v:{id:string|number,payload:FormData})=>api.put(`/admin/cuisines/${v.id}`,v.payload),onSuccess:()=>{toast.success("Cuisine updated");refresh(qc)},onError:(e:any)=>toast.error(e?.response?.data?.message??e?.message??"Failed to update cuisine")});}
export function useDeleteCuisine(){const qc=useQueryClient();return useMutation({mutationFn:(id:string|number)=>api.delete(`/admin/cuisines/${id}`),onSuccess:()=>{toast.success("Cuisine deleted");refresh(qc)},onError:(e:any)=>toast.error(e?.response?.data?.message??e?.message??"Failed to delete cuisine")});}
export function useToggleCuisineStatus(){const qc=useQueryClient();return useMutation({mutationFn:(v:{id:string|number,status:string})=>api.patch(`/admin/cuisines/${v.id}/status`,{status:v.status,active:v.status==="Active"}),onSuccess:()=>{toast.success("Status updated");refresh(qc)},onError:(e:any)=>toast.error(e?.response?.data?.message??e?.message??"Failed to update status")});}
