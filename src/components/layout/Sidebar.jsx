// src/components/layout/Sidebar.jsx

import { NavLink } from "react-router-dom";
import { Building2, Home, Users, Calendar, User } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getUserRoles } from "../../auth/organizationStorage";
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
  const { user, activeOrganization, professionalOrganizations } = useAuth();
  const isProfessional = getUserRoles(user).includes("Profesional");

  const tabs = isProfessional ? professionalTabs : patientTabs;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-64 flex-col border-r border-slate-100 bg-white shadow-sm md:flex">
      <div className="flex h-16 shrink-0 flex-col items-center justify-center border-b border-slate-100 px-4">
        <h1 className="text-center text-xl font-bold text-slate-500">
          {user?.apellido} {user?.nombre?.[0]}.
        </h1>
        {isProfessional && activeOrganization && (
          <p className="mt-1 max-w-full truncate text-center text-xs font-semibold text-emerald-700">
            {activeOrganization.nombre}
          </p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-6">
        {tabs.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive
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

      {isProfessional && professionalOrganizations.length > 1 && (
        <NavLink
          to="/profesional/organizacion"
          className="mx-4 mb-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
        >
          <Building2 size={21} />
          Cambiar organizacion
        </NavLink>
      )}

      <div className="px-4 pb-6">
        <LogoutButton />
      </div>
    </aside>
  );
}
