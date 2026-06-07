import { createContext, useContext, useEffect, useState } from "react";
import { httpClient } from "../api/httpClient";
import {
  clearActiveOrganization,
  getProfessionalOrganizations,
  getStoredProfessionalOrganization,
  getUserRoles,
  normalizeOrganization,
  normalizeUserContext,
  persistActiveOrganization,
} from "./organizationStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeOrganization, setActiveOrganization] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const applyUserContext = (rawUserData) => {
    const userData = normalizeUserContext(rawUserData);
    const organizations = getProfessionalOrganizations(userData);
    let organization = null;

    if (organizations.length === 1) {
      organization = organizations[0];
      persistActiveOrganization(organization);
    } else if (organizations.length > 1) {
      organization = getStoredProfessionalOrganization(userData);

      if (organization) {
        persistActiveOrganization(organization);
      } else {
        clearActiveOrganization();
      }
    } else {
      clearActiveOrganization();
    }

    setUser(userData);
    setActiveOrganization(organization);
  };

  useEffect(() => {
    const cargarSesion = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const userData = await httpClient.get("/api/Auth/me");
        applyUserContext(userData);
      } catch {
        localStorage.removeItem("token");
        clearActiveOrganization();
        setUser(null);
        setActiveOrganization(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    cargarSesion();
  }, []);

  const login = async (data) => {
    const token = data?.token ?? data?.Token;

    if (!token) {
      throw new Error("No se recibio token de autenticacion.");
    }

    localStorage.setItem("token", token);

    const userData = await httpClient.get("/api/Auth/me");
    applyUserContext(userData);

    return userData;
  };

  const selectOrganization = (organization) => {
    const normalized = normalizeOrganization(organization);

    persistActiveOrganization(normalized);
    setActiveOrganization(normalized);
  };

  const logout = () => {
    localStorage.removeItem("token");
    clearActiveOrganization();
    setUser(null);
    setActiveOrganization(null);
  };

  const professionalOrganizations = getProfessionalOrganizations(user);
  const needsOrganizationSelection = Boolean(
    getUserRoles(user).includes("Profesional") &&
      professionalOrganizations.length > 1 &&
      !activeOrganization
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loadingAuth,
        activeOrganization,
        professionalOrganizations,
        needsOrganizationSelection,
        selectOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
