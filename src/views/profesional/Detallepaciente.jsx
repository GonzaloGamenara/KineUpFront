// src/views/profesional/DetallePaciente.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, CalendarDays, User, BadgeCheck, AlertTriangle } from "lucide-react";
import { httpClient } from "../../api/httpClient";

export default function DetallePaciente() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const data = await httpClient.get(
          `/api/Profesional/pacientes/${idPaciente}`
        );
        setPaciente(data);
      } catch (err) {
        console.error(err);
        alert("No se pudo recuperar el paciente");
      } finally {
        setLoading(false);
      }
    };

    cargarPaciente();
  }, [idPaciente]);

  const handleDesvincular = async () => {
    try {
      await httpClient.delete(
        `/api/Profesional/pacientes/${idPaciente}/desvincular`
      );

      alert(`${paciente.nombreCompleto} fue desvinculado correctamente.`);
      navigate("/profesional/pacientes");
    } catch (err) {
      console.error(err);
      alert("No se pudo desvincular el paciente.");
    }
  };

  // ==========================================
  // ESTADO DE CARGA (SKELETON)
  // ==========================================
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 w-24 rounded-md bg-slate-200"></div>
        <div className="h-32 w-full rounded-[2rem] bg-slate-200"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 w-full rounded-2xl bg-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  // ==========================================
  // ESTADO DE ERROR / NO ENCONTRADO
  // ==========================================
  if (!paciente) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
        <AlertTriangle size={48} className="mb-4 text-slate-300" />
        <h2 className="text-xl font-bold text-slate-700">Paciente no encontrado</h2>
        <p className="mt-2 text-sm text-slate-500 mb-6">El paciente que buscás no existe o fue desvinculado.</p>
        <button
          onClick={() => navigate("/profesional/pacientes")}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          Volver a mi lista
        </button>
      </div>
    );
  }

  // ==========================================
  // VISTA PRINCIPAL
  // ==========================================
  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 pb-10 animate-fade-in">
      
      {/* HEADER Y BOTÓN VOLVER */}
      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/profesional/pacientes")}
          className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Volver a pacientes
        </button>

        {/* TARJETA DE PERFIL */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8 flex flex-col sm:flex-row items-center text-center sm:text-left gap-5 transition-all hover:shadow-md">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-[4px] border-white shadow-sm">
            <User size={36} />
          </div>

          <div className="flex-1">
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
              Ficha del paciente
            </span>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {paciente.nombreCompleto}
            </h1>
          </div>
        </div>
      </div>

      {/* GRILLA DE INFORMACIÓN */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          icon={Mail}
          label="Email"
          value={paciente.email}
        />
        <InfoCard
          icon={CalendarDays}
          label="Nacimiento"
          value={formatDate(paciente.fechaNacimiento)}
        />
        <InfoCard
          icon={BadgeCheck}
          label="Vinculación"
          value={formatDate(paciente.fechaVinculacion)}
        />
        <InfoCard
          icon={User}
          label="Usuario"
          value={paciente.usuario ?? "-"}
        />
      </div>

      {/* ZONA DE PELIGRO (DESVINCULAR) */}
      <div className="mt-10 rounded-[2rem] border border-red-100 bg-red-50/50 p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-red-900">Zona de peligro</h3>
          <p className="mt-1 text-sm text-red-700/80 max-w-md">
            Al desvincular al paciente, dejarás de tener acceso a su historial clínico y seguimiento desde tu cuenta.
          </p>
        </div>
        
        <button
          onClick={() => setMostrarConfirmacion(true)}
          className="w-full sm:w-auto whitespace-nowrap rounded-2xl border-2 border-red-200 bg-white px-6 py-3.5 font-bold text-red-600 shadow-sm transition-all hover:border-red-600 hover:bg-red-600 hover:text-white active:scale-[0.98]"
        >
          Desvincular paciente
        </button>
      </div>

      {/* ==========================================
          MODAL DE CONFIRMACIÓN
      ========================================== */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md scale-100 rounded-3xl bg-white p-6 shadow-2xl transition-transform animate-fade-in sm:p-8">
            
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-center text-xl font-bold text-slate-900">
              Confirmar desvinculación
            </h2>

            <p className="mt-3 text-center text-slate-600">
              ¿Estás seguro de que querés desvincular a <br/>
              <span className="font-bold text-slate-900">
                {paciente.nombreCompleto}
              </span>?
            </p>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="w-full sm:w-1/2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleDesvincular}
                className="w-full sm:w-1/2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-red-700"
              >
                Sí, desvincular
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="group rounded-[1.5rem] border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-emerald-100">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100 group-hover:text-emerald-700">
        <Icon size={24} />
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 break-words">
        {value ?? "-"}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}