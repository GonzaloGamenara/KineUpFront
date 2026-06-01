import { createContext, useContext, useEffect, useState } from "react";
import { httpClient } from "../api/httpClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const cargarSesion = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const userData = await httpClient.get("/api/Auth/me");
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    cargarSesion();
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setUser(data.userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);