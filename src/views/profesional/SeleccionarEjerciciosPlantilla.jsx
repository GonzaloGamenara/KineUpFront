import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Dumbbell, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getEjercicioId = (ejercicio) =>
  getValue(ejercicio, "idEjercicio", "IdEjercicio");

const getEjercicioTitulo = (ejercicio) =>
  getValue(ejercicio, "titulo", "Titulo") ?? "Ejercicio sin titulo";

const getEjercicioMusculo = (ejercicio) =>
  getValue(ejercicio, "musculo", "Musculo") ?? "Sin musculo";

const getEjercicioZona = (ejercicio) =>
  getValue(ejercicio, "zonaMusculo", "ZonaMusculo") ?? "";

const contieneTexto = (value, search) =>
  String(value ?? "")
    .toLowerCase()
    .includes(search.trim().toLowerCase());

export default function SeleccionarEjerciciosPlantilla() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const plantilla = state?.plantilla;
  const etapaIndex = state?.etapaIndex;
  const etapa = plantilla?.etapas?.[etapaIndex];
  const rutina = state?.rutina;
  const ejerciciosIniciales = state?.ejercicios ?? [];

  const [loading, setLoading] = useState(true);
  const [ejercicios, setEjercicios] = useState([]);
  const [seleccionados, setSeleccionados] = useState(ejerciciosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (
      !plantilla?.titulo ||
      !etapa?.titulo ||
      !rutina?.titulo ||
      etapaIndex === undefined
    ) {
      navigate("/profesional/tratamientos/nueva", { replace: true });
      return;
    }

    cargarEjercicios();
  }, [navigate, plantilla, etapa, rutina, etapaIndex]);

  const cargarEjercicios = async () => {
    setLoading(true);

    try {
      const response = await httpClient.get("/api/profesional/ejercicios");
      const data = response?.data ?? response ?? [];
      setEjercicios(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar ejercicios:", err);
      setError(err?.message || "No se pudieron cargar los ejercicios.");
    } finally {
      setLoading(false);
    }
  };

  const ejerciciosFiltrados = useMemo(() => {
    return ejercicios.filter(
      (ejercicio) =>
        contieneTexto(getEjercicioTitulo(ejercicio), busqueda) ||
        contieneTexto(getEjercicioMusculo(ejercicio), busqueda) ||
        contieneTexto(getEjercicioZona(ejercicio), busqueda)
    );
  }, [busqueda, ejercicios]);

  const selectedIds = useMemo(
    () => new Set(seleccionados.map((ejercicio) => ejercicio.idEjercicio)),
    [seleccionados]
  );

  const canContinue = useMemo(() => {
    return (
      seleccionados.length > 0 &&
      seleccionados.every(
        (ejercicio) =>
          Number.isInteger(Number(ejercicio.cantidadSeries)) &&
          Number(ejercicio.cantidadSeries) >= 1 &&
          Number.isInteger(Number(ejercicio.cantidadRepeticiones)) &&
          Number(ejercicio.cantidadRepeticiones) >= 1
      )
    );
  }, [seleccionados]);

  const toggleEjercicio = (ejercicio) => {
    const idEjercicio = getEjercicioId(ejercicio);

    setSeleccionados((current) => {
      if (current.some((item) => item.idEjercicio === idEjercicio)) {
        return current.filter((item) => item.idEjercicio !== idEjercicio);
      }

      return [
        ...current,
        {
          idEjercicio,
          titulo: getEjercicioTitulo(ejercicio),
          musculo: getEjercicioMusculo(ejercicio),
          cantidadSeries: 3,
          cantidadRepeticiones: 10,
          orden: current.length + 1,
        },
      ];
    });
  };

  const updateSeleccionado = (idEjercicio, field, value) => {
    setSeleccionados((current) =>
      current.map((ejercicio) =>
        ejercicio.idEjercicio === idEjercicio
          ? { ...ejercicio, [field]: value }
          : ejercicio
      )
    );
  };

  const volver = () => {
    navigate("/profesional/tratamientos/nueva/rutina", {
      state: { plantilla, etapaIndex, rutina, ejercicios: seleccionados },
    });
  };

  const cancelar = () => {
    navigate("/profesional/tratamientos");
  };

  const continuar = () => {
    setTouched(true);

    if (!canContinue || !plantilla?.titulo || !etapa?.titulo || !rutina?.titulo) {
      return;
    }

    const rutinaCompleta = {
      ...rutina,
      ejercicios: seleccionados.map((ejercicio, index) => ({
        idEjercicio: Number(ejercicio.idEjercicio),
        titulo: ejercicio.titulo,
        musculo: ejercicio.musculo,
        cantidadSeries: Number(ejercicio.cantidadSeries),
        cantidadRepeticiones: Number(ejercicio.cantidadRepeticiones),
        orden: index + 1,
      })),
    };

    navigate("/profesional/tratamientos/nueva", {
      state: {
        plantilla: {
          ...plantilla,
          etapas: plantilla.etapas.map((currentEtapa, index) =>
            index === etapaIndex
              ? {
                  ...currentEtapa,
                  rutinas: [...(currentEtapa.rutinas ?? []), rutinaCompleta],
                }
              : currentEtapa
          ),
        },
      },
    });
  };

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando ejercicios...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 pb-28 animate-fade-in lg:pb-0">
      <button
        type="button"
        onClick={volver}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <header className="rounded-2xl bg-white p-4 shadow-sm sm:rounded-3xl sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Dumbbell size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Nueva plantilla
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Ejercicios de la rutina
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Selecciona al menos un ejercicio para "{rutina?.titulo}" y defini
              series y repeticiones.
            </p>
          </div>
        </div>
      </header>

      {error && <ErrorState message={error} onRetry={cargarEjercicios} />}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por ejercicio, musculo o zona"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
            />
          </div>

          <div className="space-y-3">
            {ejerciciosFiltrados.length > 0 ? (
              ejerciciosFiltrados.map((ejercicio) => {
                const idEjercicio = getEjercicioId(ejercicio);
                const selected = selectedIds.has(idEjercicio);

                return (
                  <ExerciseCard
                    key={idEjercicio}
                    ejercicio={ejercicio}
                    selected={selected}
                    selectedExercise={seleccionados.find(
                      (item) => item.idEjercicio === idEjercicio
                    )}
                    onToggle={() => toggleEjercicio(ejercicio)}
                    onChange={updateSeleccionado}
                    onRemove={() =>
                      setSeleccionados((current) =>
                        current.filter((item) => item.idEjercicio !== idEjercicio)
                      )
                    }
                  />
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400">
                No hay ejercicios para esa busqueda.
              </div>
            )}
          </div>
        </div>

        <aside className="sticky top-24 hidden h-fit max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-3xl bg-white p-5 shadow-sm lg:block">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Seleccionados
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">
            {seleccionados.length} ejercicio
            {seleccionados.length === 1 ? "" : "s"}
          </h2>

          {touched && seleccionados.length < 1 && (
            <p className="mt-2 text-xs font-semibold text-red-600">
              Selecciona al menos un ejercicio.
            </p>
          )}

          <div className="mt-5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={continuar}
              disabled={!canContinue}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar rutina
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={cancelar}
              className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {seleccionados.length > 0 ? (
              seleccionados.map((ejercicio) => (
                <SelectedExercise
                  key={ejercicio.idEjercicio}
                  ejercicio={ejercicio}
                  onChange={updateSeleccionado}
                  onRemove={() =>
                    setSeleccionados((current) =>
                      current.filter(
                        (item) => item.idEjercicio !== ejercicio.idEjercicio
                      )
                    )
                  }
                />
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-400">
                Elegi ejercicios del listado para configurar la rutina.
              </p>
            )}
          </div>
        </aside>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white p-4 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] md:left-64 lg:hidden">
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Seleccionados
          </p>
          <p className="text-sm font-bold text-slate-900">
            {seleccionados.length} ejercicio
            {seleccionados.length === 1 ? "" : "s"}
          </p>
        </div>
        {touched && seleccionados.length < 1 && (
          <p className="mb-2 text-xs font-semibold text-red-600 lg:hidden">
            Selecciona al menos un ejercicio.
          </p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={cancelar}
            className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={continuar}
            disabled={!canContinue}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Guardar rutina
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function ExerciseCard({
  ejercicio,
  selected,
  selectedExercise,
  onToggle,
  onChange,
  onRemove,
}) {
  return (
    <article
      className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition sm:rounded-3xl ${
        selected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-100"
      }`}
    >
      <button type="button" onClick={onToggle} className="flex w-full items-center gap-3 text-left">
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
            selected
              ? "border-emerald-600 bg-emerald-600"
              : "border-slate-300 bg-white"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-sm bg-white" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-slate-900">
            {getEjercicioTitulo(ejercicio)}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {getEjercicioMusculo(ejercicio)}
            {getEjercicioZona(ejercicio) ? ` - ${getEjercicioZona(ejercicio)}` : ""}
          </p>
        </div>
      </button>

      {selected && selectedExercise && (
        <div className="mt-4 border-t border-slate-100 pt-4 lg:hidden">
          <SelectedExercise
            ejercicio={selectedExercise}
            onChange={onChange}
            onRemove={onRemove}
            compact
          />
        </div>
      )}
    </article>
  );
}

function SelectedExercise({ ejercicio, onChange, onRemove, compact = false }) {
  const series = Number(ejercicio.cantidadSeries);
  const repeticiones = Number(ejercicio.cantidadRepeticiones);
  const invalidSeries = !Number.isInteger(series) || series < 1;
  const invalidRepeticiones = !Number.isInteger(repeticiones) || repeticiones < 1;

  return (
    <div className={compact ? "" : "rounded-2xl border border-slate-100 p-3"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-900">{ejercicio.titulo}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-400">
            {ejercicio.musculo}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs font-bold text-red-600"
        >
          Quitar
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label>
          <span className="text-xs font-bold text-slate-500">Series</span>
          <input
            type="number"
            min="1"
            step="1"
            value={ejercicio.cantidadSeries}
            onChange={(event) =>
              onChange(ejercicio.idEjercicio, "cantidadSeries", event.target.value)
            }
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-emerald-500 ${
              invalidSeries ? "border-red-200" : "border-slate-200"
            }`}
          />
        </label>
        <label>
          <span className="text-xs font-bold text-slate-500">Repeticiones</span>
          <input
            type="number"
            min="1"
            step="1"
            value={ejercicio.cantidadRepeticiones}
            onChange={(event) =>
              onChange(
                ejercicio.idEjercicio,
                "cantidadRepeticiones",
                event.target.value
              )
            }
            className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:border-emerald-500 ${
              invalidRepeticiones ? "border-red-200" : "border-slate-200"
            }`}
          />
        </label>
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
