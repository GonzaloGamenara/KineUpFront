import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardCheck, Dumbbell } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

export default function ConfirmarPlantillaTratamiento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const plantilla = state?.plantilla;
  const etapa = state?.etapa;
  const rutina = state?.rutina;
  const ejercicios = state?.ejercicios ?? [];

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isComplete = useMemo(
    () =>
      Boolean(plantilla?.titulo) &&
      Boolean(etapa?.titulo) &&
      Boolean(rutina?.titulo) &&
      ejercicios.length > 0,
    [plantilla, etapa, rutina, ejercicios]
  );

  useEffect(() => {
    if (!isComplete) {
      navigate("/profesional/tratamientos/nueva", { replace: true });
    }
  }, [isComplete, navigate]);

  const volver = () => {
    navigate("/profesional/tratamientos/nueva/ejercicios", {
      state: { plantilla, etapa, rutina, ejercicios },
    });
  };

  const crearPlantilla = async () => {
    if (!isComplete) return;

    setSaving(true);
    setError("");

    try {
      await httpClient.post(
        "/api/profesional/tratamientos-plantilla/completa",
        {
          titulo: plantilla.titulo,
          descripcion: plantilla.descripcion,
          etapas: [
            {
              titulo: etapa.titulo,
              descripcion: etapa.descripcion,
              orden: etapa.orden,
              rutinas: [
                {
                  titulo: rutina.titulo,
                  cantidadEjecucionesIndicadas:
                    rutina.cantidadEjecucionesIndicadas,
                  orden: rutina.orden,
                  ejercicios: ejercicios.map((ejercicio, index) => ({
                    idEjercicio: Number(ejercicio.idEjercicio),
                    cantidadSeries: Number(ejercicio.cantidadSeries),
                    cantidadRepeticiones: Number(
                      ejercicio.cantidadRepeticiones
                    ),
                    orden: ejercicio.orden ?? index + 1,
                  })),
                },
              ],
            },
          ],
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
        Volver a ejercicios
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
              Revisa la estructura antes de guardar. La plantilla se va a crear
              con una etapa, una rutina y los ejercicios seleccionados.
            </p>
          </div>
        </div>
      </header>

      {error && <ErrorState message={error} />}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <SummaryCard title="Tratamiento" label={plantilla?.titulo}>
            <p className="text-sm leading-6 text-slate-500">
              {plantilla?.descripcion || "Sin descripcion."}
            </p>
          </SummaryCard>

          <SummaryCard title="Etapa" label={etapa?.titulo}>
            <p className="text-sm leading-6 text-slate-500">
              {etapa?.descripcion || "Sin descripcion."}
            </p>
          </SummaryCard>

          <SummaryCard title="Rutina" label={rutina?.titulo}>
            <p className="text-sm leading-6 text-slate-500">
              {rutina?.cantidadEjecucionesIndicadas} ejecucion
              {rutina?.cantidadEjecucionesIndicadas === 1 ? "" : "es"} indicada
              {rutina?.cantidadEjecucionesIndicadas === 1 ? "" : "s"}.
            </p>
          </SummaryCard>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Dumbbell size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Ejercicios
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  {ejercicios.length} seleccionado
                  {ejercicios.length === 1 ? "" : "s"}
                </h2>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {ejercicios.map((ejercicio) => (
                <div
                  key={`${ejercicio.idEjercicio}-${ejercicio.orden}`}
                  className="rounded-2xl border border-slate-100 px-4 py-3"
                >
                  <p className="text-sm font-bold text-slate-900">
                    {ejercicio.titulo}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {ejercicio.cantidadSeries} series x{" "}
                    {ejercicio.cantidadRepeticiones} repeticiones
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Resumen
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Metric label="Etapas" value={1} />
            <Metric label="Rutinas" value={1} />
            <Metric label="Ejercicios" value={ejercicios.length} />
          </div>

          <button
            type="button"
            onClick={crearPlantilla}
            disabled={saving || !isComplete}
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

function SummaryCard({ title, label, children }) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <h2 className="mt-1 text-lg font-bold text-slate-900">{label}</h2>
      <div className="mt-2">{children}</div>
    </section>
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
