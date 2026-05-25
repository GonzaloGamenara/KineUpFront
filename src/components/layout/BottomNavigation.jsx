import { NavLink } from "react-router-dom";
import { Home, QrCode, Users, Calendar, User } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";

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

export default function BottomNavigation() {
  const { user } = useAuth();

  const tabs = user?.roles?.includes("Profesional")
    ? professionalTabs
    : patientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white px-3 pb-4 pt-2 shadow-[0_-6px_20px_rgba(15,23,42,0.08)] md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-16 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-400"
              }`
            }
          >
            <Icon size={22} strokeWidth={2.2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}