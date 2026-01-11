import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/lib/api/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: currentUser, isPending, isLoading } = useCurrentUser();
  // console.log("currentUser", currentUser);
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({ queryKey: ["currentUser"] });
  if (isLoading || isPending) {
    return <div>Loading...</div>;
  }
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
