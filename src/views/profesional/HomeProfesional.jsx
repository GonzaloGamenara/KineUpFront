import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getPacienteId = (paciente) =>
  getValue(paciente, "idPaciente", "IdPaciente");

const getPacienteNombre = (paciente) => {
  const nombreCompleto = getValue(paciente, "nombreCompleto", "NombreCompleto");
  const nombre = `${getValue(paciente, "nombre", "Nombre") ?? ""} ${
    getValue(paciente, "apellido", "Apellido") ?? ""
  }`.trim();

  return nombreCompleto || nombre || "Paciente";
};

const getTratamientoTitulo = (tratamiento) =>
  getValue(tratamiento, "titulo", "Titulo") ?? "Tratamiento sin título";

const getTratamientoEstado = (tratamiento) =>
  getValue(tratamiento, "estado", "Estado") ?? "";

const getTratamientoAvance = (tratamiento) =>
  Number(getValue(tratamiento, "avance", "Avance") ?? 0);

const getPacienteTratamientos = (paciente) =>
  getValue(paciente, "tratamientos", "Tratamientos") ?? [];

const tieneTratamientoActivo = (tratamiento) =>
  !["cancelado", "finalizado"].includes(
    getTratamientoEstado(tratamiento).toLowerCase()
  );

const calcularProgreso = (tratamientos) => {
  const activos = tratamientos.filter(tieneTratamientoActivo);
  if (activos.length < 1) return 0;

  const total = activos.reduce(
    (sum, tratamiento) => sum + getTratamientoAvance(tratamiento),
    0
  );

  return Math.round(total / activos.length);
};

export default function HomeProfesional() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const response = await httpClient.get("/api/profesional/home");
      const data = response?.data ?? response ?? [];

      setPacientes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar el inicio profesional:", err);
      setPacientes([]);
      setError(err?.message || "No se pudo cargar el inicio profesional.");
    } finally {
      setLoading(false);
    }
  };

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((paciente) => {
      const cumpleNombre = getPacienteNombre(paciente)
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const tieneActivo =
        getPacienteTratamientos(paciente).some(tieneTratamientoActivo);
      let cumpleEstado = true;
      if (filtroEstado === "con") cumpleEstado = tieneActivo;
      if (filtroEstado === "sin") cumpleEstado = !tieneActivo;

      return cumpleNombre && cumpleEstado;
    });
  }, [busqueda, filtroEstado, pacientes]);

  const metricas = useMemo(() => {
    const conTratamiento = pacientes.filter((paciente) =>
      getPacienteTratamientos(paciente).some(tieneTratamientoActivo)
    );

    const alDia = conTratamiento.filter(
      (paciente) => calcularProgreso(getPacienteTratamientos(paciente)) >= 100
    );

    return {
      totalPacientes: pacientes.length,
      conTratamiento: conTratamiento.length,
      sinTratamiento: pacientes.length - conTratamiento.length,
      alDia: alDia.length,
    };
  }, [pacientes]);

  if (loading && pacientes.length === 0) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando resumen de actividad...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Hola de nuevo
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Así marcha el rendimiento de tus pacientes asignados.
          </p>
        </div>
      </header>

      {error && <ErrorState message={error} onRetry={loadDashboard} />}

      <div className="space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFiltroEstado("todos")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              filtroEstado === "todos"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos ({metricas.totalPacientes})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("con")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              filtroEstado === "con"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            En tratamiento ({metricas.conTratamiento})
          </button>
          <button
            type="button"
            onClick={() => setFiltroEstado("sin")}
            className={`rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              filtroEstado === "sin"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Pendientes ({metricas.sinTratamiento})
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((paciente) => (
            <PacienteCard
              key={getPacienteId(paciente)}
              paciente={paciente}
              onAssign={() =>
                navigate(
                  `/profesional/pacientes/${getPacienteId(
                    paciente
                  )}/asignar-tratamiento`
                )
              }
            />
          ))
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-sm font-medium text-slate-400 shadow-sm">
            No se encontraron pacientes activos con los filtros aplicados.
          </div>
        )}
      </div>
    </section>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-100"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

function PacienteCard({
  paciente,
  onAssign,
}) {
  const tratamientos = getPacienteTratamientos(paciente);
  const tratamientosActivos = tratamientos.filter(tieneTratamientoActivo);
  const tratamientoPrincipal = tratamientosActivos[0];
  const progreso = calcularProgreso(tratamientos);
  const sinTratamiento = tratamientosActivos.length === 0;
  const idPaciente = getPacienteId(paciente);
  const nombre = getPacienteNombre(paciente);

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:bg-slate-50/60">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-base font-bold text-[#007a3f]">
            {(nombre || "P").charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-bold leading-tight text-slate-800">
              {nombre}
            </h3>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
              {sinTratamiento
                ? "Sin tratamiento asignado"
                : getTratamientoTitulo(tratamientoPrincipal)}
            </p>
          </div>
        </div>

        {sinTratamiento ? (
          <AssignButton idPaciente={idPaciente} onAssign={onAssign} />
        ) : (
          <ProgressSummary
            progreso={progreso}
            completados={tratamientosActivos.filter((t) => getTratamientoAvance(t) >= 100).length}
            total={tratamientosActivos.length}
          />
        )}
      </div>
    </article>
  );
}

function AssignButton({ idPaciente, onAssign }) {
  return (
    <button
      type="button"
      onClick={onAssign}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] sm:w-auto"
      aria-label={`Asignar tratamiento al paciente ${idPaciente}`}
    >
      <UserRoundPlus size={17} />
      Asignar tratamiento
    </button>
  );
}

function ProgressSummary({ progreso, completados, total }) {
  return (
    <div className="w-full space-y-1 lg:max-w-xs">
      <div className="flex items-end justify-between text-[10px] font-bold">
        <span className="font-semibold uppercase tracking-wider text-slate-400">
          Progreso de tratamientos
        </span>
        <span className="flex items-center gap-1 text-[#007a3f]">
          <CheckCircle2 size={13} />
          {completados}/{total} ({progreso}%)
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-green-500 transition-all duration-500"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  );
}
