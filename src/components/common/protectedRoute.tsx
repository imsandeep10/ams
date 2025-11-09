import { type ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/AuthStore";
import { useNavigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const checkAuth = useAuthStore(state => state.checkAuth);
  const getRedirectPath = useAuthStore(state => state.getRedirectPath);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        const authenticated = await checkAuth();
        if (!authenticated) {
          navigate("/", { replace: true });
          return;
        }
        
        // If user is already authenticated and trying to access root, redirect to appropriate dashboard
        if (location.pathname === "/") {
          const redirectPath = getRedirectPath();
          navigate(redirectPath, { replace: true });
          return;
        }
      } catch (error) {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    verify();
  }, [checkAuth, navigate, location, getRedirectPath]);

  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;