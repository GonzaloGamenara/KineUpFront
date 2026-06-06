import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Search, UserRoundPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }
  return undefined;
};

const getPacienteId = (paciente) => getValue(paciente, "idPaciente", "IdPaciente");

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
  !["cancelado", "finalizado"].includes(getTratamientoEstado(tratamiento).toLowerCase());

const calcularProgreso = (tratamientos) => {
  const activos = tratamientos.filter(tieneTratamientoActivo);
  if (activos.length < 1) return 0;

  const total = activos.reduce((sum, tratamiento) => sum + getTratamientoAvance(tratamiento), 0);
  return Math.round(total / activos.length);
};

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
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

      const tieneActivo = getPacienteTratamientos(paciente).some(tieneTratamientoActivo);
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

  // ESTADO DE CARGA (SKELETON)
  if (loading && pacientes.length === 0) {
    return (
      <section className="mx-auto w-full max-w-5xl space-y-6 animate-pulse px-4 sm:px-6">
        <div className="h-10 w-48 rounded-md bg-slate-200"></div>
        <div className="h-4 w-72 rounded-md bg-slate-200 mb-8"></div>
        <div className="h-14 w-full rounded-2xl bg-slate-200"></div>
        <div className="flex gap-2"><div className="h-8 w-24 rounded-full bg-slate-200"></div><div className="h-8 w-32 rounded-full bg-slate-200"></div></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 w-full rounded-2xl bg-slate-200"></div>)}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8 animate-fade-in pb-10 px-4 sm:px-6 mt-4 sm:mt-0">
      
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Hola de nuevo
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Así marcha el rendimiento de tus pacientes asignados.
        </p>
      </header>

      {error && <ErrorState message={error} onRetry={loadDashboard} />}

      {/* CONTROLES (BÚSQUEDA Y FILTROS) */}
      <div className="space-y-4 sm:space-y-5">
        
        {/* Buscador */}
        <div className="relative group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#007A3F]" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full h-12 sm:h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#007A3F] focus:ring-4 focus:ring-green-50 shadow-sm"
          />
        </div>

        {/* Chips de Filtro */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <FilterChip 
            label={`Todos (${metricas.totalPacientes})`} 
            active={filtroEstado === "todos"} 
            onClick={() => setFiltroEstado("todos")} 
          />
          <FilterChip 
            label={`En tratamiento (${metricas.conTratamiento})`} 
            active={filtroEstado === "con"} 
            onClick={() => setFiltroEstado("con")} 
          />
          <FilterChip 
            label={`Pendientes (${metricas.sinTratamiento})`} 
            active={filtroEstado === "sin"} 
            onClick={() => setFiltroEstado("sin")} 
          />
        </div>
      </div>

      {/* LISTA DE PACIENTES */}
      <div className="space-y-3 sm:space-y-4">
        {pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((paciente) => (
            <PacienteCard
              key={getPacienteId(paciente)}
              paciente={paciente}
              onOpenTreatment={() =>
                navigate(`/profesional/pacientes/${getPacienteId(paciente)}/tratamientos`)
              }
              onAssign={() =>
                navigate(`/profesional/pacientes/${getPacienteId(paciente)}/asignar-tratamiento`)
              }
            />
          ))
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 text-slate-400">
              <Users size={28} />
            </div>
            <p className="font-semibold text-slate-600 text-sm sm:text-base">
              No se encontraron pacientes activos con los filtros aplicados.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all active:scale-95 ${
        active
          ? "bg-[#007A3F] text-white shadow-md border border-[#007A3F]"
          : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="font-semibold text-red-800 text-sm">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-700 shadow-sm border border-red-100 hover:bg-red-50"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

function PacienteCard({ paciente, onOpenTreatment, onAssign }) {
  const tratamientos = getPacienteTratamientos(paciente);
  const tratamientosActivos = tratamientos.filter(tieneTratamientoActivo);
  const tratamientoPrincipal = tratamientosActivos[0];
  const progreso = calcularProgreso(tratamientos);
  const sinTratamiento = tratamientosActivos.length === 0;
  const idPaciente = getPacienteId(paciente);
  const nombre = getPacienteNombre(paciente);
  
  const subtitulo = sinTratamiento
    ? "Sin tratamiento asignado"
    : tratamientosActivos.length === 1
      ? getTratamientoTitulo(tratamientoPrincipal)
      : `${tratamientosActivos.length} tratamientos activos`;

  return (
    <article
      onClick={onOpenTreatment}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenTreatment();
        }
      }}
      className="group cursor-pointer rounded-[1.25rem] sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-md active:scale-[0.99]"
      aria-label={`Ver tratamientos de ${nombre}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Info del Paciente */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-50 text-lg font-bold text-[#007A3F] group-hover:bg-green-100 transition-colors">
            {(nombre || "P").charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] sm:text-base font-bold leading-tight text-slate-900 group-hover:text-[#007A3F] transition-colors">
              {nombre}
            </h3>
            <p className="mt-0.5 truncate text-xs sm:text-sm font-medium text-slate-500">
              {subtitulo}
            </p>
          </div>
        </div>

        {/* Acciones o Progreso */}
        <div className="w-full sm:w-auto mt-2 sm:mt-0 flex items-center justify-end">
          {sinTratamiento ? (
            <AssignButton idPaciente={idPaciente} onAssign={onAssign} />
          ) : (
            <div className="flex w-full items-center gap-4 sm:w-auto bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none">
              <ProgressSummary
                progreso={progreso}
                completados={tratamientosActivos.filter((t) => getTratamientoAvance(t) >= 100).length}
                total={tratamientosActivos.length}
              />
              <div className="hidden shrink-0 h-8 w-8 sm:flex items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#007A3F] group-hover:text-white transition-colors">
                <ArrowRight size={18} />
              </div>
            </div>
          )}
        </div>

      </div>
    </article>
  );
}

function AssignButton({ idPaciente, onAssign }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onAssign();
      }}
      onKeyDown={(event) => event.stopPropagation()}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#007A3F] hover:bg-[#006432] px-4 py-3 sm:py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.98] sm:w-auto"
      aria-label={`Asignar tratamiento al paciente ${idPaciente}`}
    >
      <UserRoundPlus size={18} />
      Asignar tratamiento
    </button>
  );
}

function ProgressSummary({ progreso, completados, total }) {
  return (
    <div className="w-full space-y-1.5 sm:max-w-[200px] min-w-[150px]">
      <div className="flex items-end justify-between text-[10px] sm:text-xs font-bold">
        <span className="font-bold uppercase tracking-wider text-slate-500">
          Progreso
        </span>
        <span className="flex items-center gap-1 text-[#007A3F]">
          <CheckCircle2 size={14} className="sm:w-[16px] sm:h-[16px]" />
          {completados}/{total} ({progreso}%)
        </span>
      </div>

      <div className="h-2.5 sm:h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#007A3F] transition-all duration-700 ease-out"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  );
}