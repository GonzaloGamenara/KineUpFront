// src/views/profesional/DetallePaciente.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Mail, CalendarDays, User, BadgeCheck } from "lucide-react";
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

      alert(
        `${paciente.nombreCompleto} fue desvinculado correctamente.`
      );

      navigate("/profesional/pacientes");
    } catch (err) {
      console.error(err);
      alert("No se pudo desvincular el paciente.");
    }
  };

  if (loading)
    return (
      <p className="text-sm text-slate-500">
        Cargando paciente...
      </p>
    );

  if (!paciente)
    return (
      <p className="text-sm text-slate-500">
        Paciente no encontrado.
      </p>
    );

  return (
    <section className="space-y-5">

      <button
        onClick={() => navigate("/profesional/pacientes")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <div className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">

          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <User size={32} />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Paciente
            </p>

            <h1 className="text-2xl font-bold text-slate-900">
              {paciente.nombreCompleto}
            </h1>
          </div>

        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <InfoCard
          icon={Mail}
          label="Email"
          value={paciente.email}
        />

        <InfoCard
          icon={CalendarDays}
          label="Fecha de nacimiento"
          value={formatDate(paciente.fechaNacimiento)}
        />

        <InfoCard
          icon={BadgeCheck}
          label="Fecha de vinculación"
          value={formatDate(paciente.fechaVinculacion)}
        />

        <InfoCard
          icon={User}
          label="Usuario"
          value={paciente.usuario ?? "-"}
        />
      </div>

      {/* BOTÓN DESVINCULAR */}

      <div className="pt-4">

      <button
        onClick={() => setMostrarConfirmacion(true)}
        className="
          w-full
          bg-red-600
          hover:bg-red-700
          text-white
          font-bold
          text-lg
          py-4
          rounded-xl
          shadow-md
          transition-all
        "
      >
        Desvincular paciente
      </button>

    </div>

      {/* MODAL */}

      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">

            <h2 className="text-xl font-bold text-slate-900">
              Confirmar desvinculación
            </h2>

            <p className="mt-3 text-slate-600">
              ¿Estás seguro de que querés desvincular a{" "}
              <span className="font-semibold">
                {paciente.nombreCompleto}
              </span>
              ?
            </p>

            <p className="mt-2 text-sm text-slate-500">
              El paciente dejará de aparecer en tu listado.
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-slate-300
                  text-slate-700
                "
              >
                Cancelar
              </button>

              <button
                onClick={handleDesvincular}
                className="
                  px-4
                  py-2
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  font-semibold
                "
              >
                Desvincular
              </button>

            </div>

          </div>

        </div>
      )}

    </section>
  );}

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