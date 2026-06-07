import { Navigate, Outlet, useLocation} from "react-router-dom";
import { useAuth } from "./AuthContext";
import { getUserRoles } from "./organizationStorage";

export function RequireRole({ roles, children }) {
  const { user, loadingAuth, needsOrganizationSelection } = useAuth();
  const location = useLocation();

  if (loadingAuth) return null;

  if (!user) {
    const isQrPaciente = location.pathname.startsWith("/paciente/vincular/");

    const loginUrl = isQrPaciente
      ? `/login?returnUrl=${encodeURIComponent(location.pathname)}`
      : "/login";

      return <Navigate to={loginUrl} replace />;
  }

  const userRoles = getUserRoles(user);
  const hasRole = roles.some(role => userRoles.includes(role));

  if (!hasRole) return <Navigate to="/sin-acceso" replace />;

  if (
    userRoles.includes("Profesional") &&
    roles.includes("Profesional") &&
    needsOrganizationSelection &&
    location.pathname !== "/profesional/organizacion"
  ) {
    return <Navigate to="/profesional/organizacion" replace />;
  }

  return children ?? <Outlet />;
}
