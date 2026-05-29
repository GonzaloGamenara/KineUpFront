
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, CalendarDays, User, BadgeCheck } from "lucide-react";
import { httpClient } from "../../api/httpClient";
import RutinaActiva from "./components/RutinaActiva.jsx";

export default function DetallePaciente() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);

  useEffect(() => {
    const cargarPaciente = async () => {
      try {
        const data = await httpClient.get(`/api/Profesional/pacientes/${idPaciente}`);
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

  if (loading) return <p className="text-sm text-slate-500">Cargando paciente...</p>;
  if (!paciente) return <p className="text-sm text-slate-500">Paciente no encontrado.</p>;

  return (
    <section className="space-y-6">
      {/* Botón volver */}
      <button
        onClick={() => navigate("/profesional/pacientes")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      {/* Card principal */}
      <div className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <User size={32} />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">Paciente</p>
            <h1 className="text-2xl font-bold text-slate-900">
              {paciente.nombreCompleto}
            </h1>
          </div>
        </div>
      </div>

      {/* Info básica */}
      <div className="grid gap-3 md:grid-cols-2">
        <InfoCard icon={Mail} label="Email" value={paciente.email} />
        <InfoCard icon={CalendarDays} label="Fecha de nacimiento" value={formatDate(paciente.fechaNacimiento)} />
        <InfoCard icon={BadgeCheck} label="Fecha de vinculación" value={formatDate(paciente.fechaVinculacion)} />
        <InfoCard icon={User} label="Usuario" value={paciente.usuario ?? "-"} />
      </div>

      {/* Rutina activa */}
      {paciente.rutinaActiva ? (
        <RutinaActiva rutina={paciente.rutinaActiva} />
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
          <p className="text-sm font-medium text-slate-500">
            Este paciente aún no tiene una rutina asignada.
          </p>
        </div>
      )}
    </section>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon size={20} />
      </div>

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
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
