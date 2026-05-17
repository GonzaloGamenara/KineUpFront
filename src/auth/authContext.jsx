import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (data) => {
    localStorage.setItem("token", data.token);

    setUser({
      id: data.userData.id,
      nombre: data.userData.nombre,
      apellido: data.userData.apellido,
      usuario: data.userData.usuario,
      email: data.userData.email,
      roles: data.userData.roles ?? [],
      nombreCompleto: data.userData.nombreCompleto,
    });
  };

  console.log(user);
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
