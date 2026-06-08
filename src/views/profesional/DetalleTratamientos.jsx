import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, PencilLine, Plus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getTratamientoId = (tratamiento) =>
  getValue(tratamiento, "idTratamiento", "IdTratamiento");

const getTratamientoTitulo = (tratamiento) =>
  getValue(tratamiento, "titulo", "Titulo") ?? "Tratamiento sin titulo";

const getTratamientoDescripcion = (tratamiento) =>
  getValue(tratamiento, "descripcion", "Descripcion") ?? "Sin descripcion.";

const getTratamientoEstado = (tratamiento) =>
  getValue(tratamiento, "estado", "Estado") ?? "";

const getTratamientoAvance = (tratamiento) =>
  Math.max(
    0,
    Math.min(100, Math.round(Number(getValue(tratamiento, "avance", "Avance") ?? 0)))
  );

const getPacienteNombre = (paciente) =>
  getValue(paciente, "nombreCompleto", "NombreCompleto") ?? "Paciente";

const isVisibleTreatment = (tratamiento) =>
  getTratamientoEstado(tratamiento).toLowerCase() !== "cancelado";

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
        httpClient.get(`/api/profesional/pacientes/${idPaciente}`),
        httpClient.get(`/api/profesional/pacientes/${idPaciente}/tratamientos`),
      ]);

      const tratamientosData =
        tratamientosResponse?.data ?? tratamientosResponse ?? [];

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
      (tratamiento) => getTratamientoEstado(tratamiento).toLowerCase() === "activo"
    );
    const avancePromedio =
      activos.length > 0
        ? Math.round(
            activos.reduce(
              (sum, tratamiento) => sum + getTratamientoAvance(tratamiento),
              0
            ) / activos.length
          )
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
      const cancelado = await httpClient.patch(
        `/api/profesional/tratamientos/${idTratamiento}/cancelar`
      );

      setTratamientos((current) =>
        current.map((tratamiento) =>
          getTratamientoId(tratamiento) === idTratamiento
            ? { ...tratamiento, ...(cancelado ?? {}), estado: "Cancelado" }
            : tratamiento
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

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando tratamientos...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      <button
        type="button"
        onClick={() => navigate("/profesional/home")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <header className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Tratamientos del paciente
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              {getPacienteNombre(paciente)}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona los tratamientos activos del paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/profesional/pacientes/${idPaciente}/asignar-tratamiento`)
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
          >
            <Plus size={18} />
            Agregar tratamiento
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <SummaryItem label="Tratamientos" value={resumen.total} />
          <SummaryItem label="Activos" value={resumen.activos} />
          <SummaryItem label="Avance promedio" value={`${resumen.avancePromedio}%`} />
        </div>
      </header>

      {error && <ErrorState message={error} onRetry={loadData} />}

      <div className="space-y-3">
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
              onDelete={() => {
                setConfirmTarget(tratamiento);
              }}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400">
            Este paciente no tiene tratamientos cargados.
          </div>
        )}
      </div>

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

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function TratamientoCard({ tratamiento, deleting, onModify, onDelete }) {
  const progreso = getTratamientoAvance(tratamiento);

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {getTratamientoTitulo(tratamiento)}
            </h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {getTratamientoEstado(tratamiento) || "Sin estado"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {getTratamientoDescripcion(tratamiento)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <button
            type="button"
            onClick={onModify}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <PencilLine size={17} />
            Modificar
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={17} />
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs font-bold">
          <span className="uppercase tracking-wider text-slate-400">
            Avance del tratamiento
          </span>
          <span className="text-emerald-700">{progreso}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>
    </article>
  );
}

function ConfirmDeleteDialog({
  tratamiento,
  deleting,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Eliminar tratamiento
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Esta accion eliminara el tratamiento "{getTratamientoTitulo(
                tratamiento
              )}" del circuito activo del paciente. Tambien se eliminara el avance
              asociado a este tratamiento.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar definitivamente"}
          </button>
        </div>
      </div>
    </div>
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
