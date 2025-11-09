import React from "react";
import { Navigate } from "react-router-dom";
import useRole from "@/hooks/useRole";

interface RoleProtectedProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

interface RoleIndexRedirectProps {
  adminRole: string;
}

// Component for protecting routes based on role
export function RoleProtected({ allowedRoles, children }: RoleProtectedProps) {
  const { role } = useRole();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Component for role-based index redirection
export function RoleIndexRedirect({ adminRole }: RoleIndexRedirectProps) {
  const { role } = useRole();

  // If current user is superAdmin, show the students listing for this role.
  if (role === "superAdmin") {
    return <Navigate to="students" replace />;
  }

  // If the user is the admin for this role, show the role dashboard.
  if (role === adminRole) {
    return <Navigate to="dashboard" replace />;
  }

  // Fallback: send to dashboard
  return <Navigate to="dashboard" replace />;
}

export default RoleProtected;