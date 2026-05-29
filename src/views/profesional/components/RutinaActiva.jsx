import { useState } from "react";
import { Play, Pause, CheckCircle } from "lucide-react";

export default function RutinaActiva() {
  const [iniciada, setIniciada] = useState(false);
  const [pausada, setPausada] = useState(false);

  const ejercicio = {
    nombre: "Elevación frontal",
    descripcion:
      "Subí ambos brazos lentamente hasta la altura de los hombros y descendé de forma controlada.",
    series: 3,
    repeticiones: 12,
    imagen: "/ejercicios/elevacion-frontal.gif",
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold">
          {ejercicio.nombre}
        </h2>

        <img
          src={ejercicio.imagen}
          alt={ejercicio.nombre}
          className="mb-4 h-64 w-full rounded-2xl object-cover"
        />

        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="font-semibold text-emerald-800">
            Indicaciones del profesional
          </p>

          <p className="mt-2 text-sm text-slate-700">
            {ejercicio.descripcion}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          {!iniciada ? (
            <button
              onClick={() => setIniciada(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-white"
            >
              <Play size={18} />
              Iniciar
            </button>
          ) : (
            <button
              onClick={() => setPausada(!pausada)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-white"
            >
              <Pause size={18} />
              {pausada ? "Reanudar" : "Pausar"}
            </button>
          )}

          <button className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-white">
            <CheckCircle size={18} />
            Completar
          </button>
        </div>
      </div>
    </div>
  );
}