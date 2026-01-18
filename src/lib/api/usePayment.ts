import { useQuery } from "@tanstack/react-query";
import api from "../axiosInstance";
export const useGetPayment = (userId: string) => {
    return useQuery({
        queryKey: ["payment",userId],
        queryFn: async () => {
        try{
            const response = await api.get(`/api/payment/${userId}`);
            return response.data;
        }
        catch(err:any){
            console.log("Error fetching payment data:", err);
        }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    });
}

export const useGetAllPayments = () => {
    return useQuery({
        queryKey: ["allPayments"],
        queryFn: async () => {
        try{
            const response = await api.get(`/api/payment`);
            return response.data;
        }
        catch(err:any){
            console.log("Error fetching all payments data:", err);
        }
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
    });
}