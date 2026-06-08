import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2 } from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../auth/AuthContext";

export default function SeleccionarOrganizacion() {
  const {
    activeOrganization,
    professionalOrganizations,
    selectOrganization,
  } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (professionalOrganizations.length <= 1) {
      navigate("/profesional/home", { replace: true });
    }
  }, [navigate, professionalOrganizations.length]);

  const seleccionar = (organization) => {
    selectOrganization(organization);
    navigate("/profesional/home", { replace: true });
  };

  return (
    <section className="flex min-h-dvh items-center justify-center bg-[#F5F8F6] px-4 py-8">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <img src={logo} alt="KineUp" className="mx-auto mb-6 h-10 w-auto" />

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <Building2 size={32} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Elegi una organizacion
          </h1>
        </div>

        <div className="mt-6 space-y-3">
          {professionalOrganizations.map((organization) => {
            const isActive =
              String(activeOrganization?.idOrganizacion) ===
              String(organization.idOrganizacion);

            return (
              <button
                key={organization.idOrganizacion}
                type="button"
                onClick={() => seleccionar(organization)}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                  isActive
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-100 bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {organization.nombre}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {isActive
                      ? "Organizacion activa"
                      : `ID ${organization.idOrganizacion}`}
                  </p>
                </div>

                {isActive && (
                  <CheckCircle2
                    className="shrink-0 text-emerald-600"
                    size={22}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
