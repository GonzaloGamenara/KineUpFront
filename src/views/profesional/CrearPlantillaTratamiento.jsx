import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Dumbbell,
  Layers3,
  Plus,
  Repeat2,
  Trash2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const normalizePlantilla = (plantilla) => ({
  titulo: plantilla?.titulo ?? "",
  descripcion: plantilla?.descripcion ?? "",
  etapas: Array.isArray(plantilla?.etapas) ? plantilla.etapas : [],
});

const getStats = (plantilla) => {
  const etapas = plantilla.etapas.length;
  const rutinas = plantilla.etapas.reduce(
    (total, etapa) => total + (etapa.rutinas?.length ?? 0),
    0
  );
  const ejercicios = plantilla.etapas.reduce(
    (total, etapa) =>
      total +
      (etapa.rutinas ?? []).reduce(
        (rutinasTotal, rutina) =>
          rutinasTotal + (rutina.ejercicios?.length ?? 0),
        0
      ),
    0
  );

  return { etapas, rutinas, ejercicios };
};

const isComplete = (plantilla) =>
  Boolean(plantilla.titulo?.trim()) &&
  plantilla.etapas.length > 0 &&
  plantilla.etapas.every(
    (etapa) =>
      etapa.titulo?.trim() &&
      etapa.rutinas?.length > 0 &&
      etapa.rutinas.every(
        (rutina) => rutina.titulo?.trim() && rutina.ejercicios?.length > 0
      )
  );

export default function CrearPlantillaTratamiento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [plantilla, setPlantilla] = useState(() =>
    normalizePlantilla(state?.plantilla)
  );
  const [touched, setTouched] = useState(false);

  const tituloNormalizado = plantilla.titulo.trim();
  const descripcionNormalizada = plantilla.descripcion?.trim() ?? "";
  const stats = useMemo(() => getStats(plantilla), [plantilla]);
  const complete = useMemo(() => isComplete(plantilla), [plantilla]);
  const canAddStructure = tituloNormalizado.length > 0;

  const plantillaActual = useMemo(
    () => ({
      ...plantilla,
      titulo: tituloNormalizado,
      descripcion: descripcionNormalizada || null,
      etapas: plantilla.etapas.map((etapa, etapaIndex) => ({
        ...etapa,
        orden: etapaIndex + 1,
        rutinas: (etapa.rutinas ?? []).map((rutina, rutinaIndex) => ({
          ...rutina,
          orden: rutinaIndex + 1,
          ejercicios: (rutina.ejercicios ?? []).map((ejercicio, index) => ({
            ...ejercicio,
            orden: index + 1,
          })),
        })),
      })),
    }),
    [descripcionNormalizada, plantilla, tituloNormalizado]
  );

  const updateField = (field, value) => {
    setPlantilla((current) => ({ ...current, [field]: value }));
  };

  const agregarEtapa = () => {
    setTouched(true);

    if (!canAddStructure) return;

    navigate("/profesional/tratamientos/nueva/etapa", {
      state: { plantilla: plantillaActual },
    });
  };

  const agregarRutina = (etapaIndex) => {
    navigate("/profesional/tratamientos/nueva/rutina", {
      state: { plantilla: plantillaActual, etapaIndex },
    });
  };

  const eliminarEtapa = (etapaIndex) => {
    setPlantilla((current) => ({
      ...current,
      etapas: current.etapas.filter((_, index) => index !== etapaIndex),
    }));
  };

  const eliminarRutina = (etapaIndex, rutinaIndex) => {
    setPlantilla((current) => ({
      ...current,
      etapas: current.etapas.map((etapa, index) =>
        index === etapaIndex
          ? {
              ...etapa,
              rutinas: (etapa.rutinas ?? []).filter(
                (_, currentRutinaIndex) => currentRutinaIndex !== rutinaIndex
              ),
            }
          : etapa
      ),
    }));
  };

  const confirmar = () => {
    setTouched(true);

    if (!complete) return;

    navigate("/profesional/tratamientos/nueva/confirmar", {
      state: { plantilla: plantillaActual },
    });
  };

  return (
    <section className="space-y-5 animate-fade-in">
      <button
        type="button"
        onClick={() => navigate("/profesional/tratamientos")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <header className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ClipboardList size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Nueva plantilla
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Editor de plantilla
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Arma el tratamiento con las etapas, rutinas y ejercicios que
              necesites. Se guarda recien al confirmar la estructura completa.
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  Nombre de la plantilla
                </span>
                <input
                  type="text"
                  value={plantilla.titulo}
                  onChange={(event) => updateField("titulo", event.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Ej: Rehabilitacion de rodilla"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                />
                {touched && !canAddStructure && (
                  <span className="mt-2 block text-xs font-semibold text-red-600">
                    El nombre de la plantilla es obligatorio.
                  </span>
                )}
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700">
                  Descripcion
                </span>
                <textarea
                  value={plantilla.descripcion ?? ""}
                  onChange={(event) =>
                    updateField("descripcion", event.target.value)
                  }
                  placeholder="Objetivo general o contexto del tratamiento."
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
                />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Estructura
                </h2>
                <p className="text-sm text-slate-500">
                  Cada etapa necesita al menos una rutina con ejercicios.
                </p>
              </div>
              <button
                type="button"
                onClick={agregarEtapa}
                disabled={!canAddStructure}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={18} />
                Agregar etapa
              </button>
            </div>

            {plantilla.etapas.length < 1 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Layers3 size={26} />
                </div>
                <p className="font-bold text-slate-800">
                  Todavia no agregaste etapas
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Empeza creando la primera etapa del tratamiento.
                </p>
              </div>
            ) : (
              plantilla.etapas.map((etapa, etapaIndex) => (
                <EtapaCard
                  key={etapa.idLocal ?? etapaIndex}
                  etapa={etapa}
                  etapaIndex={etapaIndex}
                  onAddRutina={() => agregarRutina(etapaIndex)}
                  onDeleteEtapa={() => eliminarEtapa(etapaIndex)}
                  onDeleteRutina={(rutinaIndex) =>
                    eliminarRutina(etapaIndex, rutinaIndex)
                  }
                />
              ))
            )}
          </section>
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

          {touched && !complete && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-700">
              Para guardar necesitas nombre, al menos una etapa, una rutina por
              etapa y un ejercicio por rutina.
            </p>
          )}

          <button
            type="button"
            onClick={confirmar}
            disabled={!complete}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            Revisar y guardar
          </button>
        </aside>
      </div>
    </section>
  );
}

function EtapaCard({
  etapa,
  etapaIndex,
  onAddRutina,
  onDeleteEtapa,
  onDeleteRutina,
}) {
  const rutinas = etapa.rutinas ?? [];

  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Layers3 size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Etapa {etapaIndex + 1}
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">
              {etapa.titulo}
            </h3>
            {etapa.descripcion && (
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {etapa.descripcion}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onDeleteEtapa}
          className="rounded-xl p-2 text-red-500 transition hover:bg-red-50"
          aria-label="Eliminar etapa"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-700">Rutinas</p>
          <button
            type="button"
            onClick={onAddRutina}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
          >
            <Plus size={16} />
            Agregar rutina
          </button>
        </div>

        {rutinas.length < 1 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-400">
            Esta etapa todavia no tiene rutinas.
          </p>
        ) : (
          rutinas.map((rutina, rutinaIndex) => (
            <RutinaRow
              key={rutina.idLocal ?? rutinaIndex}
              rutina={rutina}
              rutinaIndex={rutinaIndex}
              onDelete={() => onDeleteRutina(rutinaIndex)}
            />
          ))
        )}
      </div>
    </article>
  );
}

function RutinaRow({ rutina, rutinaIndex, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
            <Repeat2 size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Rutina {rutinaIndex + 1}
            </p>
            <h4 className="mt-1 font-bold text-slate-900">{rutina.titulo}</h4>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {rutina.cantidadEjecucionesIndicadas} ejecucion
              {rutina.cantidadEjecucionesIndicadas === 1 ? "" : "es"} indicada
              {rutina.cantidadEjecucionesIndicadas === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-xl p-2 text-red-500 transition hover:bg-red-50"
          aria-label="Eliminar rutina"
        >
          <Trash2 size={17} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <Dumbbell size={17} />
        {rutina.ejercicios?.length ?? 0} ejercicio
        {(rutina.ejercicios?.length ?? 0) === 1 ? "" : "s"}
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
