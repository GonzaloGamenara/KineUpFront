import { useNavigate } from "react-router-dom";
import { PlayCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function HomePaciente() {
  const navigate = useNavigate();

  const [tratamiento] = useState({
    nombre: "Rehabilitación de Rodilla",
    progreso: 55,
    activa: true,
    etapas: [
      {
        id: 1,
        nombre: "Fase inicial",
        progreso: 100,
      },
      {
        id: 2,
        nombre: "Fortalecimiento",
        progreso: 60,
      },
      {
        id: 3,
        nombre: "Retorno deportivo",
        progreso: 10,
      },
    ],
  });

  const rutinasEnProgreso = [
    {
      id: 1,
      nombre: "Movilidad articular",
      estado: "en_progreso",
    },
  ];

  /*SIN TRATAMIENTO */
  if (!tratamiento) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 space-y-3">
        <AlertCircle size={60} className="text-slate-300" />

        <h1 className="text-xl font-bold text-slate-800">
          Aún no tenés un tratamiento asignado
        </h1>

        <p className="text-sm text-slate-500">
          Tu profesional aún no cargó tu plan de rehabilitación.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hola 👋
        </h1>
        <p className="text-sm text-slate-500">
          Seguimiento de tu recuperación
        </p>
      </div>

      {/* TRATAMIENTO */}
      <div className="bg-white p-5 rounded-3xl shadow-sm space-y-4">

        {/* TITULO + PROGRESO */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-slate-900">
            {tratamiento.nombre}
          </h2>

          <span className="text-[#007a3f] font-bold">
            {tratamiento.progreso}%
          </span>
        </div>

        {/* BARRA GLOBAL */}
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#007a3f]"
            style={{ width: `${tratamiento.progreso}%` }}
          />
        </div>

        {/* ETAPAS */}
        <div className="space-y-2">
          {tratamiento.etapas.map((e) => (
            <div
              key={e.id}
              className="flex justify-between text-sm bg-slate-50 p-3 rounded-xl"
            >
              <span className="font-medium">{e.nombre}</span>

              <span className="text-slate-500">
                {e.progreso}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* RUTINA EN PROGRESO */}
      {rutinasEnProgreso.length > 0 && (
        <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3">

          <h3 className="font-bold text-slate-900">
            Continuar rutina
          </h3>

          {rutinasEnProgreso.map((r) => (
            <div
              key={r.id}
              onClick={() => navigate("/paciente/rutina-activa")}
              className="flex justify-between items-center bg-green-50 p-3 rounded-xl cursor-pointer"
            >
              <span className="font-medium text-green-800">
                {r.nombre}
              </span>

              <PlayCircle className="text-[#007a3f]" />
            </div>
          ))}
        </div>
      )}

      {/* ACCESO A RUTINAS / ETAPAS */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <button
          onClick={() => navigate("/paciente/rutina-activa")}
          className="w-full bg-[#007a3f] text-white py-3 rounded-2xl font-semibold"
        >
          Ver ejercicios de la etapa actual
        </button>
      </div>

    </div>
  );
}