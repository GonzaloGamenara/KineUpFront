import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, PencilLine, Plus, Trash2, FolderHeart, Activity } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
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

const getTratamientoId = (tratamiento) => getValue(tratamiento, "idTratamiento", "IdTratamiento");
const getTratamientoTitulo = (tratamiento) => getValue(tratamiento, "titulo", "Titulo") ?? "Tratamiento sin titulo";
const getTratamientoDescripcion = (tratamiento) => getValue(tratamiento, "descripcion", "Descripcion") ?? "Sin descripcion.";
const getTratamientoEstado = (tratamiento) => getValue(tratamiento, "estado", "Estado") ?? "";
const getTratamientoAvance = (tratamiento) => Math.max(0, Math.min(100, Math.round(Number(getValue(tratamiento, "avance", "Avance") ?? 0))));
const getPacienteNombre = (paciente) => getValue(paciente, "nombreCompleto", "NombreCompleto") ?? "Paciente";
const isVisibleTreatment = (tratamiento) => getTratamientoEstado(tratamiento).toLowerCase() !== "cancelado";

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function DetalleTratamientos() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [tratamientos, setTratamientos] = useState([]);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [idPaciente]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pacienteResponse, tratamientosResponse] = await Promise.all([
        httpClient.get(`/api/Profesional/pacientes/${idPaciente}`),
        httpClient.get(`/api/profesional/pacientes/${idPaciente}/tratamientos`),
      ]);

      const tratamientosData = tratamientosResponse?.data ?? tratamientosResponse ?? [];
      setPaciente(pacienteResponse?.data ?? pacienteResponse ?? null);
      setTratamientos(Array.isArray(tratamientosData) ? tratamientosData : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar tratamientos del paciente:", err);
      setError(err?.message || "No se pudieron cargar los tratamientos.");
    } finally {
      setLoading(false);
    }
  };

  const tratamientosVisibles = useMemo(
    () => tratamientos.filter(isVisibleTreatment),
    [tratamientos]
  );

  const resumen = useMemo(() => {
    const activos = tratamientosVisibles.filter(
      (t) => getTratamientoEstado(t).toLowerCase() === "activo"
    );
    const avancePromedio = activos.length > 0
      ? Math.round(activos.reduce((sum, t) => sum + getTratamientoAvance(t), 0) / activos.length)
      : 0;

    return {
      total: tratamientosVisibles.length,
      activos: activos.length,
      avancePromedio,
    };
  }, [tratamientosVisibles]);

  const eliminarTratamiento = async () => {
    if (!confirmTarget) return;

    const idTratamiento = getTratamientoId(confirmTarget);
    setDeletingId(idTratamiento);

    try {
      await httpClient.put(`/api/profesional/tratamientos/${idTratamiento}`, {
        estado: "Cancelado",
      });

      setTratamientos((current) =>
        current.map((t) =>
          getTratamientoId(t) === idTratamiento ? { ...t, estado: "Cancelado" } : t
        )
      );
      setConfirmTarget(null);
      setError("");
    } catch (err) {
      console.error("Error al eliminar tratamiento:", err);
      setError(err?.message || "No se pudo eliminar el tratamiento.");
    } finally {
      setDeletingId(null);
    }
  };

  // ESTADO DE CARGA (SKELETON)
  if (loading) {
    return (
      <section className="mx-auto w-full max-w-4xl space-y-6 animate-pulse px-4 sm:px-6">
        <div className="h-6 w-32 rounded-md bg-slate-200"></div>
        <div className="h-48 w-full rounded-[2rem] bg-slate-200"></div>
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-36 w-full rounded-[2rem] bg-slate-200"></div>)}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8 animate-fade-in pb-10 px-4 sm:px-6 mt-4 sm:mt-0">
      
      {/* BOTÓN VOLVER */}
      <button
        type="button"
        onClick={() => navigate("/profesional/home")}
        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#007A3F] transition-colors"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Volver al inicio
      </button>

      {/* HEADER PACIENTE Y RESUMEN */}
      <header className="rounded-[1.5rem] sm:rounded-[2rem] bg-white p-5 sm:p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#007A3F] mb-1">
              Tratamientos del paciente
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {getPacienteNombre(paciente)}
            </h1>
            <p className="mt-1.5 text-sm sm:text-base text-slate-500 font-medium">
              Gestioná los circuitos activos y su progreso.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/profesional/pacientes/${idPaciente}/asignar-tratamiento`)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#007A3F] hover:bg-[#006432] px-5 py-3.5 sm:py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98]"
          >
            <Plus size={18} />
            Asignar nuevo
          </button>
        </div>

        {/* MÉTRICAS */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 border-t border-slate-50 pt-6">
          <SummaryItem label="Asignados" value={resumen.total} />
          <SummaryItem label="Activos" value={resumen.activos} />
          <SummaryItem label="Avance general" value={`${resumen.avancePromedio}%`} colSpanMobile />
        </div>
      </header>

      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* LISTA DE TRATAMIENTOS */}
      <div className="space-y-4">
        {tratamientosVisibles.length > 0 ? (
          tratamientosVisibles.map((tratamiento) => (
            <TratamientoCard
              key={getTratamientoId(tratamiento)}
              tratamiento={tratamiento}
              deleting={deletingId === getTratamientoId(tratamiento)}
              onModify={() =>
                navigate(`/profesional/pacientes/${idPaciente}/modificar-tratamiento`, {
                  state: { idTratamiento: getTratamientoId(tratamiento) },
                })
              }
              onDelete={() => setConfirmTarget(tratamiento)}
            />
          ))
        ) : (
          <EmptyState title="Este paciente no tiene tratamientos cargados." />
        )}
      </div>

      {/* MODAL ELIMINAR */}
      {confirmTarget && (
        <ConfirmDeleteDialog
          tratamiento={confirmTarget}
          deleting={deletingId === getTratamientoId(confirmTarget)}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={eliminarTratamiento}
        />
      )}
    </section>
  );
}

// ==========================================
// SUB-COMPONENTES
// ==========================================

function SummaryItem({ label, value, colSpanMobile }) {
  return (
    <div className={`rounded-[1.25rem] bg-slate-50 px-4 py-3 sm:py-4 flex flex-col items-center sm:items-start text-center sm:text-left transition-colors hover:bg-slate-100 ${colSpanMobile ? "col-span-2 sm:col-span-1" : ""}`}>
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl sm:text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function TratamientoCard({ tratamiento, deleting, onModify, onDelete }) {
  const progreso = getTratamientoAvance(tratamiento);
  const estado = getTratamientoEstado(tratamiento);
  const esActivo = estado.toLowerCase() === "activo";

  return (
    <article className="group rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:shadow-md hover:border-[#007A3F]/30">
      
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        
        {/* Info del Tratamiento */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#007A3F]">
              <Activity size={20} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight group-hover:text-[#007A3F] transition-colors">
              {getTratamientoTitulo(tratamiento)}
            </h2>
            <span className={`inline-flex rounded-md px-2 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${esActivo ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
              {estado || "Sin estado"}
            </span>
          </div>
          <p className="mt-2.5 sm:mt-2 text-sm leading-relaxed text-slate-500 sm:ml-14">
            {getTratamientoDescripcion(tratamiento)}
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col gap-2 sm:flex-row sm:ml-14 lg:ml-0 lg:shrink-0 w-full sm:w-auto mt-2 lg:mt-0">
          <button
            type="button"
            onClick={onModify}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-3 sm:py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
          >
            <PencilLine size={18} />
            Modificar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 sm:py-2.5 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-100 hover:border-red-200 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95"
          >
            <Trash2 size={18} />
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

      </div>

      {/* Barra de Progreso */}
      <div className="mt-5 sm:mt-6 sm:ml-14 border-t border-slate-50 pt-5">
        <div className="mb-2 flex items-center justify-between text-[11px] sm:text-xs font-bold">
          <span className="uppercase tracking-wider text-slate-400">
            Avance del circuito
          </span>
          <span className="text-[#007A3F]">{progreso}%</span>
        </div>
        <div className="h-2.5 sm:h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#007A3F] transition-all duration-700 ease-out"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

    </article>
  );
}

function ConfirmDeleteDialog({ tratamiento, deleting, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 sm:p-8 shadow-2xl animate-fade-in sm:transform-none transform translate-y-0">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
          <div className="flex h-14 w-14 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full sm:rounded-2xl bg-red-50 text-red-600">
            <AlertTriangle size={28} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              ¿Eliminar tratamiento?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Vas a remover <span className="font-bold text-slate-700">"{getTratamientoTitulo(tratamiento)}"</span> del circuito activo del paciente. Todo el progreso registrado se perderá de su perfil.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="order-2 sm:order-1 w-full sm:w-auto rounded-xl bg-white border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="order-1 sm:order-2 w-full sm:w-auto rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
}

function EmptyState({ title }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-4 py-12 sm:py-16 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 text-slate-400">
        <FolderHeart size={28} />
      </div>
      <p className="font-semibold text-slate-600 text-sm sm:text-base">{title}</p>
    </div>
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