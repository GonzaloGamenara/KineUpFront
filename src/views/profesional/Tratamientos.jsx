import { useEffect, useMemo, useState } from "react";
import { Activity, FolderHeart, RefreshCw, Search } from "lucide-react";
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
  "Tratamiento sin título";

const getDescripcionTratamiento = (tratamiento) =>
  getValue(tratamiento, "descripcion", "Descripcion") ??
  "Sin descripción asignada.";

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
  const [loading, setLoading] = useState(false);
  const [tratamientos, setTratamientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

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

  const tratamientosFiltrados = useMemo(() => {
    return tratamientos.filter(
      (tratamiento) =>
        contieneTexto(getTituloTratamiento(tratamiento), busqueda) ||
        contieneTexto(getDescripcionTratamiento(tratamiento), busqueda)
    );
  }, [busqueda, tratamientos]);

  const metricas = useMemo(() => {
    return tratamientos.reduce(
      (totales, tratamiento) => ({
        etapas: totales.etapas + getEtapas(tratamiento).filter(isActivo).length,
        rutinas:
          totales.rutinas + getRutinas(tratamiento).filter(isActivo).length,
        ejercicios:
          totales.ejercicios +
          getEjercicios(tratamiento).filter(isActivo).length,
      }),
      { etapas: 0, rutinas: 0, ejercicios: 0 }
    );
  }, [tratamientos]);

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
            Plantillas cargadas para asignar y seguir la rehabilitación de tus
            pacientes.
          </p>
        </div>

        <button
          type="button"
          onClick={loadTratamientos}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {error && <ErrorState message={error} onRetry={loadTratamientos} />}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Buscar por nombre o descripción"
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
            Limpiar búsqueda
          </button>
        )}
      </div>

      {!error &&
        (tratamientos.length < 1 ? (
          <EmptyState title="Todavía no tenés plantillas de tratamiento cargadas" />
        ) : tratamientosFiltrados.length < 1 ? (
          <EmptyState title="No encontramos tratamientos con esa búsqueda" />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {tratamientosFiltrados.map((tratamiento) => (
              <TratamientoCard
                key={
                  getIdTratamiento(tratamiento) ??
                  getTituloTratamiento(tratamiento)
                }
                tratamiento={tratamiento}
              />
            ))}
          </div>
        ))}
    </section>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value || "-"}</p>
    </div>
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

function TratamientoCard({ tratamiento }) {
  const titulo = getTituloTratamiento(tratamiento);
  const descripcion = getDescripcionTratamiento(tratamiento);
  const etapas = getEtapas(tratamiento).filter(isActivo);
  const rutinas = getRutinas(tratamiento).filter(isActivo);
  const ejercicios = getEjercicios(tratamiento).filter(isActivo);
  const activo = isActivo(tratamiento);

  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Activity size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-bold leading-tight text-slate-900">
              {titulo}
            </h2>
            {!activo && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                Inactiva
              </span>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
            {descripcion}
          </p>
        </div>
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
