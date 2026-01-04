import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "@/lib/api/useUser";

interface RoleProtectedProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

interface RoleIndexRedirectProps {
  adminRole: string;
}

// Component for protecting routes based on role
export function RoleProtected({ allowedRoles, children }: RoleProtectedProps) {
  const { data: currentUser } = useCurrentUser();

  // console.log("Current User:", currentUser);

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Component for role-based index redirection
export function RoleIndexRedirect({ adminRole }: RoleIndexRedirectProps) {
  const { data: currentUser } = useCurrentUser();
  // If current currentUser is superAdmin, show the students listing for this role.
  if (currentUser?.role === "superAdmin") {
    return <Navigate to="students" replace />;
  }

  // If the currentUser is the admin for this role, show the role dashboard.
  if (currentUser?.role === adminRole) {
    return <Navigate to="dashboard" replace />;
  }

  // Fallback: send to dashboard
  return <Navigate to="dashboard" replace />;
}

export default RoleProtected;
