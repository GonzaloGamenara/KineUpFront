export const ACTIVE_ORGANIZATION_STORAGE_KEY = "kineup.activeOrganizationId";

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getCollection = (source, ...keys) => {
  const value = getValue(source, ...keys);

  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.$values)) return value.$values;

  return [];
};

export const getOrganizationId = (organization) =>
  getValue(organization, "idOrganizacion", "IdOrganizacion", "id", "Id");

export const getUserRoles = (user) =>
  getCollection(user, "roles", "Roles").filter(Boolean);

export const normalizeUserContext = (user) => ({
  ...user,
  idUsuario: getValue(user, "idUsuario", "IdUsuario"),
  usuario: getValue(user, "usuario", "Usuario"),
  email: getValue(user, "email", "Email"),
  nombre: getValue(user, "nombre", "Nombre"),
  apellido: getValue(user, "apellido", "Apellido"),
  fechaNacimiento: getValue(user, "fechaNacimiento", "FechaNacimiento"),
  roles: getUserRoles(user),
  admin: getValue(user, "admin", "Admin") ?? null,
  profesional: getValue(user, "profesional", "Profesional") ?? null,
  paciente: getValue(user, "paciente", "Paciente") ?? null,
});

export const normalizeOrganization = (organization) => ({
  idOrganizacion: getOrganizationId(organization),
  nombre:
    getValue(organization, "nombre", "Nombre", "organizacion", "Organizacion") ??
    "Organizacion sin nombre",
});

export const getProfessionalOrganizations = (user) => {
  const profesional = getValue(user, "profesional", "Profesional");
  const organizaciones = getCollection(
    profesional,
    "organizaciones",
    "Organizaciones"
  );

  if (organizaciones.length > 0) {
    return organizaciones.map(normalizeOrganization).filter(getOrganizationId);
  }

  const fallbackId = getValue(profesional, "idOrganizacion", "IdOrganizacion");

  if (fallbackId) {
    return [
      normalizeOrganization({
        idOrganizacion: fallbackId,
        nombre: getValue(profesional, "organizacion", "Organizacion"),
      }),
    ];
  }

  return [];
};

export const getAdminOrganizations = (user) => {
  const admin = getValue(user, "admin", "Admin");
  const organizaciones = getCollection(admin, "organizaciones", "Organizaciones");

  return organizaciones.map(normalizeOrganization).filter(getOrganizationId);
};

export const getStoredOrganizationId = () =>
  localStorage.getItem(ACTIVE_ORGANIZATION_STORAGE_KEY);

export const persistActiveOrganization = (organization) => {
  const id = getOrganizationId(organization);

  if (!id) return;

  localStorage.setItem(ACTIVE_ORGANIZATION_STORAGE_KEY, String(id));
};

export const clearActiveOrganization = () => {
  localStorage.removeItem(ACTIVE_ORGANIZATION_STORAGE_KEY);
};

export const getStoredProfessionalOrganization = (user) => {
  const storedId = getStoredOrganizationId();

  if (!storedId) return null;

  return (
    getProfessionalOrganizations(user).find(
      (organization) => String(getOrganizationId(organization)) === storedId
    ) ?? null
  );
};
