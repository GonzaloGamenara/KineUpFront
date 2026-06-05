import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardList } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CrearPlantillaTratamiento() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const plantillaInicial = state?.plantilla;
  const [titulo, setTitulo] = useState(plantillaInicial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(
    plantillaInicial?.descripcion ?? ""
  );
  const [touched, setTouched] = useState(false);

  const tituloNormalizado = titulo.trim();
  const descripcionNormalizada = descripcion.trim();

  const canContinue = useMemo(
    () => tituloNormalizado.length > 0,
    [tituloNormalizado]
  );

  const continuar = (event) => {
    event.preventDefault();
    setTouched(true);

    if (!canContinue) return;

    navigate("/profesional/tratamientos/nueva/etapa", {
      state: {
        plantilla: {
          titulo: tituloNormalizado,
          descripcion: descripcionNormalizada || null,
        },
      },
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
        Volver a tratamientos
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
              Datos generales
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Defini el nombre y una descripcion breve. La plantilla se va a
              guardar recien cuando tenga al menos una etapa, una rutina y un
              ejercicio.
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={continuar} className="rounded-3xl bg-white p-5 shadow-sm">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-bold text-slate-700">
              Nombre de la plantilla
            </span>
            <input
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Ej: Rehabilitacion de rodilla"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
            />
            {touched && !canContinue && (
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
              value={descripcion}
              onChange={(event) => setDescripcion(event.target.value)}
              placeholder="Objetivo general, tipo de paciente o contexto del tratamiento."
              rows={5}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/profesional/tratamientos")}
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
