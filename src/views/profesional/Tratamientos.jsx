import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  FolderHeart,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
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

const getTituloTratamiento = (tratamiento) =>
  getValue(tratamiento, "titulo", "Titulo", "nombre", "Nombre") ??
  "Tratamiento sin titulo";

const getDescripcionTratamiento = (tratamiento) =>
  getValue(tratamiento, "descripcion", "Descripcion") ??
  "Sin descripcion asignada.";

const getIdTratamiento = (tratamiento) =>
  getValue(
    tratamiento,
    "idTratamientoPlantilla",
    "IdTratamientoPlantilla",
    "idTratamiento",
    "IdTratamiento",
    "id",
    "Id"
  );

const getEtapas = (tratamiento) =>
  getValue(tratamiento, "etapas", "Etapas") ?? [];

const getRutinas = (tratamiento) =>
  getEtapas(tratamiento).flatMap((etapa) =>
    getValue(etapa, "rutinas", "Rutinas") ?? []
  );

const getEjercicios = (tratamiento) =>
  getRutinas(tratamiento).flatMap((rutina) =>
    getValue(rutina, "ejercicios", "Ejercicios") ?? []
  );

const isActivo = (item) => getValue(item, "activo", "Activo") !== false;

const contieneTexto = (value, search) =>
  String(value ?? "")
    .toLowerCase()
    .includes(search.trim().toLowerCase());

export default function Tratamientos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tratamientos, setTratamientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadTratamientos();
  }, []);

  const loadTratamientos = async () => {
    setLoading(true);

    try {
      const response = await httpClient.get(
        "/api/profesional/tratamientos-plantilla"
      );
      const data = response?.data ?? response ?? [];
      setTratamientos(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar las plantillas de tratamiento:", err);
      setTratamientos([]);
      setError(
        err?.message || "No se pudieron cargar las plantillas de tratamiento."
      );
    } finally {
      setLoading(false);
    }
  };

  const tratamientosActivos = useMemo(
    () => tratamientos.filter(isActivo),
    [tratamientos]
  );

  const tratamientosFiltrados = useMemo(() => {
    return tratamientosActivos.filter(
      (tratamiento) =>
        contieneTexto(getTituloTratamiento(tratamiento), busqueda) ||
        contieneTexto(getDescripcionTratamiento(tratamiento), busqueda)
    );
  }, [busqueda, tratamientosActivos]);

  const desactivarPlantilla = async () => {
    if (!confirmTarget) return;

    const idTratamientoPlantilla = getIdTratamiento(confirmTarget);
    setDeletingId(idTratamientoPlantilla);

    try {
      await httpClient.patch(
        `/api/profesional/tratamientos-plantilla/${idTratamientoPlantilla}/desactivar`
      );

      setTratamientos((current) =>
        current.map((tratamiento) =>
          getIdTratamiento(tratamiento) === idTratamientoPlantilla
            ? { ...tratamiento, activo: false, Activo: false }
            : tratamiento
        )
      );
      setConfirmTarget(null);
      setError("");
    } catch (err) {
      console.error("Error al desactivar plantilla:", err);
      setError(err?.message || "No se pudo eliminar la plantilla.");
    } finally {
      setDeletingId(null);
    }
  };

  const hayBusqueda = busqueda.trim().length > 0;

  if (loading && tratamientos.length === 0) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando tratamientos...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Mis Tratamientos
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Plantillas cargadas para asignar y seguir la rehabilitacion de tus
            pacientes.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={loadTratamientos}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>

          <button
            type="button"
            onClick={() => navigate("/profesional/tratamientos/nueva")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98]"
          >
            <Plus size={18} />
            Nueva plantilla
          </button>
        </div>
      </header>

      {error && <ErrorState message={error} onRetry={loadTratamientos} />}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Buscar por nombre o descripcion"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-600">
          {tratamientosFiltrados.length} resultado
          {tratamientosFiltrados.length === 1 ? "" : "s"}
        </p>

        {hayBusqueda && (
          <button
            type="button"
            onClick={() => setBusqueda("")}
            className="text-sm font-bold text-emerald-700"
          >
            Limpiar busqueda
          </button>
        )}
      </div>

      {!error &&
        (tratamientosActivos.length < 1 ? (
          <EmptyState title="Todavia no tenes plantillas de tratamiento cargadas" />
        ) : tratamientosFiltrados.length < 1 ? (
          <EmptyState title="No encontramos tratamientos con esa busqueda" />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {tratamientosFiltrados.map((tratamiento) => (
              <TratamientoCard
                key={
                  getIdTratamiento(tratamiento) ??
                  getTituloTratamiento(tratamiento)
                }
                tratamiento={tratamiento}
                deleting={deletingId === getIdTratamiento(tratamiento)}
                onDelete={() => setConfirmTarget(tratamiento)}
              />
            ))}
          </div>
        ))}

      {confirmTarget && (
        <ConfirmDeleteDialog
          tratamiento={confirmTarget}
          deleting={deletingId === getIdTratamiento(confirmTarget)}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={desactivarPlantilla}
        />
      )}
    </section>
  );
}

function EmptyState({ title }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <FolderHeart size={26} />
      </div>
      <p className="font-semibold text-slate-700">{title}</p>
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

function TratamientoCard({ tratamiento, deleting, onDelete }) {
  const titulo = getTituloTratamiento(tratamiento);
  const descripcion = getDescripcionTratamiento(tratamiento);
  const etapas = getEtapas(tratamiento).filter(isActivo);
  const rutinas = getRutinas(tratamiento).filter(isActivo);
  const ejercicios = getEjercicios(tratamiento).filter(isActivo);

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Activity size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-bold leading-tight text-slate-900">
            {titulo}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {descripcion}
          </p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Eliminar plantilla ${titulo}`}
          title="Eliminar plantilla"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-sm">
        <CardMetric label="Etapas" value={etapas.length} />
        <CardMetric label="Rutinas" value={rutinas.length} />
        <CardMetric label="Ejercicios" value={ejercicios.length} />
      </div>
    </article>
  );
}

function CardMetric({ label, value }) {
  return (
    <div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}

function ConfirmDeleteDialog({ tratamiento, deleting, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Eliminar plantilla
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Vas a eliminar la plantilla "{getTituloTratamiento(tratamiento)}".
              Esta accion la quitara del listado de plantillas disponibles para
              asignar a pacientes.
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-2xl px-4 py-2 text-sm font-bold text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Eliminando..." : "Eliminar plantilla"}
          </button>
        </div>
      </div>
    </div>
  );
}
