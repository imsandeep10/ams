import { useAuthStore } from "@/lib/stores/AuthStore";

export type Role =
  | "superAdmin"
  | "pteAdmin"
  | "ieltsAdmin"
  | "duolingoAdmin"
  | "satAdmin"
  | string;

export default function useRole(): { role?: Role; loading: boolean } {
  const role = useAuthStore(state => state.role);
  
  return { 
    role: role as Role, 
    loading: false 
  };
}