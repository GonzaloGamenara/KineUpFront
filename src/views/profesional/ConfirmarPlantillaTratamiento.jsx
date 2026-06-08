import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  Layers3,
  Repeat2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

const isComplete = (plantilla) =>
  Boolean(plantilla?.titulo) &&
  Array.isArray(plantilla?.etapas) &&
  plantilla.etapas.length > 0 &&
  plantilla.etapas.every(
    (etapa) =>
      etapa.titulo &&
      etapa.rutinas?.length > 0 &&
      etapa.rutinas.every(
        (rutina) => rutina.titulo && rutina.ejercicios?.length > 0
      )
  );

const getStats = (plantilla) => {
  const etapas = plantilla?.etapas?.length ?? 0;
  const rutinas =
    plantilla?.etapas?.reduce(
      (total, etapa) => total + (etapa.rutinas?.length ?? 0),
      0
    ) ?? 0;
  const ejercicios =
    plantilla?.etapas?.reduce(
      (total, etapa) =>
        total +
        (etapa.rutinas ?? []).reduce(
          (rutinasTotal, rutina) =>
            rutinasTotal + (rutina.ejercicios?.length ?? 0),
          0
        ),
      0
    ) ?? 0;

  return { etapas, rutinas, ejercicios };
};

export default function ConfirmarPlantillaTratamiento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const plantilla = state?.plantilla;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const complete = useMemo(() => isComplete(plantilla), [plantilla]);
  const stats = useMemo(() => getStats(plantilla), [plantilla]);

  useEffect(() => {
    if (!complete) {
      navigate("/profesional/tratamientos/nueva", { replace: true });
    }
  }, [complete, navigate]);

  const volver = () => {
    navigate("/profesional/tratamientos/nueva", {
      state: { plantilla },
    });
  };

  const crearPlantilla = async () => {
    if (!complete) return;

    setSaving(true);
    setError("");

    try {
      await httpClient.post(
        "/api/profesional/tratamientos-plantilla/completa",
        {
          titulo: plantilla.titulo,
          descripcion: plantilla.descripcion,
          etapas: plantilla.etapas.map((etapa, etapaIndex) => ({
            titulo: etapa.titulo,
            descripcion: etapa.descripcion,
            orden: etapaIndex + 1,
            rutinas: etapa.rutinas.map((rutina, rutinaIndex) => ({
              titulo: rutina.titulo,
              cantidadEjecucionesIndicadas:
                rutina.cantidadEjecucionesIndicadas,
              orden: rutinaIndex + 1,
              ejercicios: rutina.ejercicios.map((ejercicio, ejercicioIndex) => ({
                idEjercicio: Number(ejercicio.idEjercicio),
                cantidadSeries: Number(ejercicio.cantidadSeries),
                cantidadRepeticiones: Number(ejercicio.cantidadRepeticiones),
                orden: ejercicioIndex + 1,
              })),
            })),
          })),
        }
      );

      navigate("/profesional/tratamientos", { replace: true });
    } catch (err) {
      console.error("Error al crear plantilla de tratamiento:", err);
      setError(err?.message || "No se pudo crear la plantilla.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-5 animate-fade-in">
      <button
        type="button"
        onClick={volver}
        disabled={saving}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ArrowLeft size={18} />
        Volver al editor
      </button>

      <header className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ClipboardCheck size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Nueva plantilla
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Confirmar creacion
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Revisa la estructura completa antes de guardar la plantilla.
            </p>
          </div>
        </div>
      </header>

      {error && <ErrorState message={error} />}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tratamiento
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {plantilla?.titulo}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {plantilla?.descripcion || "Sin descripcion."}
            </p>
          </section>

          {plantilla?.etapas?.map((etapa, etapaIndex) => (
            <EtapaSummary
              key={etapa.idLocal ?? etapaIndex}
              etapa={etapa}
              etapaIndex={etapaIndex}
            />
          ))}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm xl:sticky xl:top-24">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Resumen
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric label="Etapas" value={stats.etapas} />
            <Metric label="Rutinas" value={stats.rutinas} />
            <Metric label="Ejercicios" value={stats.ejercicios} />
          </div>

          <button
            type="button"
            onClick={crearPlantilla}
            disabled={saving || !complete}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            {saving ? "Guardando..." : "Crear plantilla"}
          </button>
        </aside>
      </div>
    </section>
  );
}

function EtapaSummary({ etapa, etapaIndex }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Layers3 size={20} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Etapa {etapaIndex + 1}
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {etapa.titulo}
          </h2>
          {etapa.descripcion && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {etapa.descripcion}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        {etapa.rutinas.map((rutina, rutinaIndex) => (
          <RutinaSummary
            key={rutina.idLocal ?? rutinaIndex}
            rutina={rutina}
            rutinaIndex={rutinaIndex}
          />
        ))}
      </div>
    </section>
  );
}

function RutinaSummary({ rutina, rutinaIndex }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
          <Repeat2 size={18} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Rutina {rutinaIndex + 1}
          </p>
          <h3 className="mt-1 font-bold text-slate-900">{rutina.titulo}</h3>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {rutina.cantidadEjecucionesIndicadas} ejecucion
            {rutina.cantidadEjecucionesIndicadas === 1 ? "" : "es"} indicada
            {rutina.cantidadEjecucionesIndicadas === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {rutina.ejercicios.map((ejercicio) => (
          <div
            key={`${ejercicio.idEjercicio}-${ejercicio.orden}`}
            className="flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2"
          >
            <Dumbbell size={16} className="mt-0.5 text-slate-400" />
            <div>
              <p className="text-sm font-bold text-slate-800">
                {ejercicio.titulo ?? `Ejercicio ${ejercicio.idEjercicio}`}
              </p>
              <p className="text-xs font-semibold text-slate-400">
                {ejercicio.cantidadSeries} series x{" "}
                {ejercicio.cantidadRepeticiones} repeticiones
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-3">
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
      {message}
    </div>
  );
}
