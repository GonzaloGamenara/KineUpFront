// src/components/layout/Sidebar.jsx

import { NavLink } from "react-router-dom";
import { Home, QrCode, Users, Calendar, User } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../auth/AuthContext";
import LogoutButton from "../common/LogoutButton";

const patientTabs = [
  { label: "Inicio", to: "/paciente/home", icon: Home },
  // { label: "Rutinas", to: "/paciente/rutinas", icon: Calendar },
  { label: "Perfil", to: "/paciente/perfil", icon: User },
];

const professionalTabs = [
  { label: "Inicio", to: "/profesional/home", icon: Home },
  { label: "Pacientes", to: "/profesional/pacientes", icon: Users },
  { label: "Tratamientos", to: "/profesional/tratamientos", icon: Calendar },
  { label: "Perfil", to: "/profesional/perfil", icon: User },
];

export default function Sidebar() {
  const { user } = useAuth();

  const tabs = user?.roles?.includes("Profesional")
    ? professionalTabs
    : patientTabs;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-64 flex-col border-r border-slate-100 bg-white px-4 py-6 shadow-sm md:flex">
      <div className="h-16"> 
      <h1 className="text-xl text-center font-bold text-slate-500">
        {user?.apellido} {user?.nombre[0]}.
      </h1>
      <hr className="my-6 border-slate-200" />
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {tabs.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`
            }
          >
            <Icon size={21} />
            {label}
          </NavLink>
        ))}
      </nav>

      <LogoutButton />
    </aside>
  );
}
