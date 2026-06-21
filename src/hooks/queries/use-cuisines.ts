import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
export const cuisineKeys={all:["cuisines"] as const,list:(p:{page?:number;perPage?:number})=>["cuisines","list",p] as const};
export function useCuisines(){return useQuery({queryKey:cuisineKeys.list({page:1,perPage:200}),queryFn:async()=>{const res=await api.get("/admin/cuisines",{params:{_t:Date.now()}});const d=res.data?.data??res.data;const rows=Array.isArray(d)?d:(d?.items??[]);return rows.map((x:any)=>({ ...x,id:String(x.id??x._id),name:x.name??x.title,img:x.imageUrl??x.image??x.img??"",status:x.active===false||String(x.status)==="Inactive"?"Inactive":"Active"}));},staleTime:30000});}
