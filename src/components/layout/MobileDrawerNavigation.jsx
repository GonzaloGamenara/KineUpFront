import { NavLink } from "react-router-dom";
import { Calendar, Home, User, Users, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import LogoutButton from "../common/LogoutButton";

const patientTabs = [
  { label: "Inicio", to: "/paciente/home", icon: Home },
  { label: "Perfil", to: "/paciente/perfil", icon: User },
];

const professionalTabs = [
  { label: "Inicio", to: "/profesional/home", icon: Home },
  { label: "Pacientes", to: "/profesional/pacientes", icon: Users },
  { label: "Tratamientos", to: "/profesional/tratamientos", icon: Calendar },
  { label: "Perfil", to: "/profesional/perfil", icon: User },
];

export default function MobileDrawerNavigation({ open, onClose }) {
  const { user } = useAuth();

  const tabs = user?.roles?.includes("Profesional")
    ? professionalTabs
    : patientTabs;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-slate-100 bg-white px-4 py-5 shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              KineUp
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {user?.apellido} {user?.nombre?.[0]}.
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-500"
            aria-label="Cerrar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-6 flex flex-1 flex-col gap-2">
          {tabs.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-500"
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
    </>
  );
}
