export function handleApiError(err, logout, navigate) {
  if (err.status === 401) {
    alert("Tu sesión expiró. Necesitás iniciar sesión nuevamente.");
    logout();
    navigate("/login", { replace: true });
    return true;
  }

  if (err.status === 403) {
    navigate("/sin-acceso", { replace: true });
    return true;
  }

  return false;
}