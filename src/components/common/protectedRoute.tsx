import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/lib/api/useUser";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data: currentUser } = useCurrentUser();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
