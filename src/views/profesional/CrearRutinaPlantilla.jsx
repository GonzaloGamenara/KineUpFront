import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Repeat2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const createLocalId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export default function CrearRutinaPlantilla() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const plantilla = state?.plantilla;
  const etapaIndex = state?.etapaIndex;
  const etapa = plantilla?.etapas?.[etapaIndex];
  const rutinaInicial = state?.rutina;
  const ejercicios = state?.ejercicios ?? [];

  const [titulo, setTitulo] = useState(rutinaInicial?.titulo ?? "");
  const [cantidadEjecuciones, setCantidadEjecuciones] = useState(
    String(rutinaInicial?.cantidadEjecucionesIndicadas ?? 1)
  );
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!plantilla?.titulo || !etapa?.titulo || etapaIndex === undefined) {
      navigate("/profesional/tratamientos/nueva", { replace: true });
    }
  }, [navigate, plantilla, etapa, etapaIndex]);

  const tituloNormalizado = titulo.trim();
  const cantidadNormalizada = Number(cantidadEjecuciones);

  const canContinue = useMemo(
    () =>
      tituloNormalizado.length > 0 &&
      Number.isInteger(cantidadNormalizada) &&
      cantidadNormalizada >= 1,
    [tituloNormalizado, cantidadNormalizada]
  );

  const volver = () => {
    navigate("/profesional/tratamientos/nueva", {
      state: { plantilla },
    });
  };

  const cancelar = () => {
    navigate("/profesional/tratamientos");
  };

  const continuar = (event) => {
    event.preventDefault();
    setTouched(true);

    if (!canContinue || !plantilla?.titulo || !etapa?.titulo) return;

    navigate("/profesional/tratamientos/nueva/ejercicios", {
      state: {
        plantilla,
        etapaIndex,
        rutina: {
          idLocal: createLocalId(),
          titulo: tituloNormalizado,
          cantidadEjecucionesIndicadas: cantidadNormalizada,
          orden: (etapa.rutinas?.length ?? 0) + 1,
        },
        ejercicios,
      },
    });
  };

  return (
    <section className="space-y-5 animate-fade-in">
      <button
        type="button"
        onClick={volver}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <header className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Repeat2 size={24} />
          </div>

          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Nueva plantilla
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">
              Nueva rutina
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Crea una rutina para la etapa "{etapa?.titulo ?? "seleccionada"}".
              Indica cuantas veces debe completarse dentro del circuito indicado
              por el profesional.
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={continuar} className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Nombre de la rutina
            </span>
            <input
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Ej: Activacion y movilidad"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
            />
            {touched && tituloNormalizado.length < 1 && (
              <span className="mt-2 block text-xs font-semibold text-red-600">
                El nombre de la rutina es obligatorio.
              </span>
            )}
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Cantidad de ejecuciones indicadas
            </span>
            <input
              type="number"
              min="1"
              step="1"
              value={cantidadEjecuciones}
              onChange={(event) => setCantidadEjecuciones(event.target.value)}
              onBlur={() => setTouched(true)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
            />
            {touched &&
              (!Number.isInteger(cantidadNormalizada) ||
                cantidadNormalizada < 1) && (
                <span className="mt-2 block text-xs font-semibold text-red-600">
                  La cantidad debe ser un numero entero mayor o igual a 1.
                </span>
              )}
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={cancelar}
            className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!canContinue}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continuar
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}
