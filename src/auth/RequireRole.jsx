import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireRole({ roles, children }) {
  const { user } = useAuth();

  console.log("roles permitidos:", roles);
  console.log("user:", user);
  console.log("roles usuario:", user?.roles);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user.roles ?? [];

  const hasRole = roles.some(role =>
    userRoles.includes(role)
  );

  if (!hasRole) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return children;
}