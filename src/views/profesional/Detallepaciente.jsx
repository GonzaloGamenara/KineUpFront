// src/views/profesional/DetallePaciente.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Mail, CalendarDays, User, BadgeCheck, UserX } from "lucide-react";
import { httpClient } from "../../api/httpClient";

export default function DetallePaciente() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState(null);
  const [showConfirmDesvincular, setShowConfirmDesvincular] = useState(false);
  const [desvinculando, setDesvinculando] = useState(false);

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

  const desvincularPaciente = async () => {
    setDesvinculando(true);

    try {
      await httpClient.patch(`/api/Profesional/pacientes/${idPaciente}/desvincular`);
      navigate("/profesional/pacientes", { replace: true });
    } catch (err) {
      console.error("Error al desvincular paciente:", err);
      alert(err?.message || "No se pudo desvincular el paciente.");
    } finally {
      setDesvinculando(false);
      setShowConfirmDesvincular(false);
    }
  };

  if (loading) return <p className="text-sm text-slate-500">Cargando paciente...</p>;

  if (!paciente) return <p className="text-sm text-slate-500">Paciente no encontrado.</p>;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate("/profesional/pacientes")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <DesvincularPacienteButton
          onClick={() => setShowConfirmDesvincular(true)}
          disabled={desvinculando}
          className="hidden sm:inline-flex"
        />
      </div>

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

      <DesvincularPacienteButton
        onClick={() => setShowConfirmDesvincular(true)}
        disabled={desvinculando}
        className="inline-flex w-full sm:hidden"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <InfoCard icon={Mail} label="Email" value={paciente.email} />
        <InfoCard icon={CalendarDays} label="Fecha de nacimiento" value={formatDate(paciente.fechaNacimiento)} />
        <InfoCard icon={BadgeCheck} label="Fecha de vinculación" value={formatDate(paciente.fechaVinculacion)} />
        <InfoCard icon={User} label="Usuario" value={paciente.usuario ?? "-"} />
      </div>

      {showConfirmDesvincular && (
        <ConfirmDesvincularDialog
          paciente={paciente}
          loading={desvinculando}
          onCancel={() => setShowConfirmDesvincular(false)}
          onConfirm={desvincularPaciente}
        />
      )}
    </section>
  );
}

function DesvincularPacienteButton({ onClick, disabled = false, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <UserX size={21} />
      Desvincular paciente
    </button>
  );
}

function ConfirmDesvincularDialog({ paciente, loading, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Desvincular paciente
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Vas a desvincular a {paciente?.nombreCompleto ?? "este paciente"}.
              Esta decision no tiene retorno y el paciente dejara de aparecer en
              tu listado.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Desvinculando..." : "Desvincular definitivamente"}
          </button>
        </div>
      </div>
    </div>
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
