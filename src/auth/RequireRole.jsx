import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RequireRole({ roles, children }) {
  const { user, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) return null;

  if (!user) {
    const isQrPaciente = location.pathname.startsWith("/paciente/vincular/");

    const loginUrl = isQrPaciente
      ? `/login?returnUrl=${encodeURIComponent(location.pathname)}`
      : "/login";

      return <Navigate to={loginUrl} replace />;
  }

  const userRoles = user.roles ?? [];
  const hasRole = roles.some(role => userRoles.includes(role));

  if (!hasRole) return <Navigate to="/sin-acceso" replace />;

  return children ?? <Outlet />;
}