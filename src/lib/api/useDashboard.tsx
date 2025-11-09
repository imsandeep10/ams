import { useQuery } from "@tanstack/react-query"
import api from "../axiosInstance"

export const getDashboardData=()=>{
    return useQuery({
    queryKey:["dashboard"],
    queryFn:async()=>{
const res = await api.get("/dashboard/summary")
if(!res){
    throw new Error("Failed to fetch Data")

}
return res.data
    }
    })
}