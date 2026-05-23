// src/components/layout/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { Home, QrCode, Users, Calendar, User, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../auth/AuthContext";

const patientTabs = [
  { label: "Inicio", to: "/paciente/home", icon: Home },
  { label: "Rutinas", to: "/paciente/rutinas", icon: Calendar },
  { label: "Perfil", to: "/paciente/perfil", icon: User },
];

const professionalTabs = [
  { label: "QR", to: "/profesional/qr", icon: QrCode },
  { label: "Pacientes", to: "/profesional/pacientes", icon: Users },
  { label: "Perfil", to: "/profesional/perfil", icon: User },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const tabs = user?.roles?.includes("Profesional")
    ? professionalTabs
    : patientTabs;

  const handleLogout = () => {
    logout();

    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-64 flex-col bg-primary px-4 py-6 shadow-sm md:flex">
      <img src={logo} alt="KineUp" className="h-20 w-fit mx-auto" />
      <h1 className="text-xl text-center font-bold text-white">
        {user?.apellido} {user?.nombre[0]}.
      </h1>
      <hr className="my-6 border-slate-200" />
      <nav className="flex flex-1 flex-col gap-2">
        {tabs.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-primary-dark text-white "
                  : "text-white hover:bg-slate-50 hover:text-primary-dark"
              }`
            }
          >
            <Icon size={21} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center cursor-pointer gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white hover:bg-red-50 hover:text-red-500"
      >
        <LogOut size={21} />
        Cerrar sesión
      </button>
    </aside>
  );
}
