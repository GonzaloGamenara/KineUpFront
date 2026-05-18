import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireRole({ roles, children }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) return null;
  if (!user) return <Navigate to="/login" replace />;

  const userRoles = user.roles ?? [];
  const hasRole = roles.some(role => userRoles.includes(role));

  if (!hasRole) return <Navigate to="/sin-acceso" replace />;

  return children ?? <Outlet />;
}