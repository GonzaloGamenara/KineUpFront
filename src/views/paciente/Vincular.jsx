import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { httpClient } from "../../api/httpClient";
import { useAuth } from "../../auth/AuthContext";
import { getUserRoles } from "../../auth/organizationStorage";

export default function Vincular() {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loadingAuth } = useAuth();
  const [estado, setEstado] = useState("preview-loading");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const esPaciente = getUserRoles(user).includes("Paciente");

  useEffect(() => {
    if (!loadingAuth && !user) {
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`, {
        replace: true,
      });
    }

    if (!loadingAuth && user && !esPaciente) {
      setError("Necesitas iniciar sesion con una cuenta de paciente.");
      setEstado("preview-error");
    }
  }, [esPaciente, location.pathname, navigate, user, loadingAuth]);

  useEffect(() => {
    if (loadingAuth || !user || !esPaciente || !token) return;

    let isActive = true;

    const obtenerPreview = async () => {
      setEstado("preview-loading");
      setError("");

      try {
        const data = await httpClient.get(`/api/Vinculation/preview/${token}`);

        if (!isActive) return;

        setPreview(normalizarPreview(data));
        setEstado("ready");
      } catch (err) {
        if (!isActive) return;

        setError(
          err?.message ||
            "No se pudo obtener la informacion del profesional."
        );
        setEstado("preview-error");
      }
    };

    obtenerPreview();

    return () => {
      isActive = false;
    };
  }, [esPaciente, loadingAuth, token, user]);

  const fechaExpiracion = useMemo(() => {
    if (!preview?.fechaExpiracion) return null;

    return new Intl.DateTimeFormat("es-AR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(preview.fechaExpiracion));
  }, [preview?.fechaExpiracion]);

  const confirmarVinculacion = async () => {
    setEstado("loading");
    setError("");

    try {
      await httpClient.post(`/api/Vinculation/confirmacion/${token}`);
      setEstado("success");

      setTimeout(() => {
        navigate("/paciente/home", { replace: true });
      }, 2500);
    } catch (err) {
      setError(err?.message || "No se pudo vincular tu cuenta.");
      setEstado("error");
    }
  };

  if (loadingAuth || estado === "preview-loading") {
    return (
      <VincularShell>
        <div className="text-center">
          <Loader2
            className="mx-auto mb-5 animate-spin text-emerald-600"
            size={48}
          />
          <h1 className="text-xl font-bold text-slate-900">
            Preparando vinculacion
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Estamos validando el codigo QR.
          </p>
        </div>
      </VincularShell>
    );
  }

  return (
    <VincularShell>
      {estado === "ready" && (
        <>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <UserRound size={34} />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-emerald-700">
              Vinculacion con profesional
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900">
              Confirmar vinculacion
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Revisa los datos antes de vincular tu cuenta de paciente.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700">
                <ShieldCheck size={21} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  {preview?.nombreCompleto || "Profesional"}
                </p>
                {preview?.email && (
                  <InfoLine icon={Mail} text={preview.email} />
                )}
                {preview?.organizacion && (
                  <InfoLine icon={Building2} text={preview.organizacion} />
                )}
                {fechaExpiracion && (
                  <InfoLine
                    icon={Clock}
                    text={`Codigo vigente hasta ${fechaExpiracion}`}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/paciente/home")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50 sm:flex-1"
            >
              <ArrowLeft size={17} />
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarVinculacion}
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] sm:flex-1"
            >
              Confirmar
            </button>
          </div>
        </>
      )}

      {estado === "loading" && (
        <div className="text-center">
          <Loader2
            className="mx-auto mb-5 animate-spin text-emerald-600"
            size={48}
          />
          <h1 className="text-xl font-bold text-slate-900">
            Confirmando vinculacion
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Estamos vinculando tu cuenta con el profesional.
          </p>
        </div>
      )}

      {estado === "success" && (
        <div className="text-center">
          <CheckCircle className="mx-auto mb-5 text-emerald-600" size={52} />
          <h1 className="text-xl font-bold text-slate-900">
            Vinculacion correcta
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Te estamos redirigiendo al inicio.
          </p>
        </div>
      )}

      {(estado === "error" || estado === "preview-error") && (
        <div className="text-center">
          <XCircle className="mx-auto mb-5 text-red-500" size={52} />
          <h1 className="text-xl font-bold text-slate-900">
            No se pudo vincular
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error ||
              "El QR puede estar vencido o tu cuenta ya puede estar vinculada con este profesional."}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/paciente/home")}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 sm:flex-1"
            >
              Volver
            </button>
            {estado === "error" && (
              <button
                type="button"
                onClick={() => setEstado("ready")}
                className="rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm sm:flex-1"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      )}
    </VincularShell>
  );
}

function VincularShell({ children }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-6">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </section>
  );
}

function InfoLine({ icon: Icon, text }) {
  return (
    <p className="mt-1 flex min-w-0 items-center gap-2 text-xs leading-5 text-slate-500">
      <Icon className="shrink-0 text-slate-400" size={14} />
      <span className="truncate">{text}</span>
    </p>
  );
}

function normalizarPreview(data) {
  return {
    idProfesional: data?.idProfesional ?? data?.IdProfesional,
    idOrganizacion: data?.idOrganizacion ?? data?.IdOrganizacion,
    organizacion: data?.organizacion ?? data?.Organizacion ?? "",
    nombreCompleto: data?.nombreCompleto ?? data?.NombreCompleto ?? "",
    email: data?.email ?? data?.Email ?? "",
    fechaExpiracion: data?.fechaExpiracion ?? data?.FechaExpiracion ?? null,
  };
}
