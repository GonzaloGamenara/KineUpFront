import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePaciente() {
  const navigate = useNavigate();

  // Datos de prueba para simular las rutinas kinesiológicas
  const [rutinas, setRutinas] = useState([
    {
      id: 1,
      nombre: "Movilidad de Hombro",
      ejercicios: 4,
      duracion: "15 min",
      completada: true,
    },
    {
      id: 2,
      nombre: "Fortalecimiento Lumbar",
      ejercicios: 5,
      duracion: "20 min",
      completada: false,
    },
    {
      id: 3,
      nombre: "Estiramiento de Cadena Posterior",
      ejercicios: 3,
      duracion: "10 min",
      completada: false,
    },
        {
      id: 4,
      nombre: "Estiramiento de Cadena Posterior",
      ejercicios: 3,
      duracion: "10 min",
      completada: false,
    },
    {
      id: 5,
      nombre: "Fortalecimiento Lumbar",
      ejercicios: 5,
      duracion: "20 min",
      completada: false,
    },
    {
      id: 6,
      nombre: "Fortalecimiento Lumbar",
      ejercicios: 5,
      duracion: "20 min",
      completada: false,
    },    
  ]);

  // Manejador interactivo para completar rutinas
  const toggleRutina = (id) => {
    setRutinas(
      rutinas.map((r) =>
        r.id === id ? { ...r, completada: !r.completada } : r,
      ),
    );
  };

  // Cálculo matemático del progreso diario
  const completadas = rutinas.filter((r) => r.completada).length;
  const porcentajeProgreso = Math.round((completadas / rutinas.length) * 100);

  return (
    <div>
      {/* Contenedor principal */}
      <main>
        {/* Texto de Bienvenida */}
        <div className="space-y-1 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            ¡Hola! 👋
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Acá tenés el seguimiento de tu rehabilitación para hoy.
          </p>
        </div>

        {/* Tarjeta de Progreso */}
        <div className="bg-gradient-to-br from-[#007a3f] to-[#005a2f] text-white p-5 rounded-3xl shadow-xl shadow-green-900/10 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-green-200 uppercase tracking-widest font-bold">
                Progreso Diario
              </p>
              <h3 className="text-lg font-bold mt-0.5">Tu recuperación</h3>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              {completadas}/{rutinas.length} Hechas
            </span>
          </div>

          {/* Barra de carga dinámica */}
          <div className="w-full bg-black/20 h-2.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
          <p className="text-xs text-green-100 mt-2 text-right font-medium">
            {porcentajeProgreso}% completado
          </p>
        </div>

        {/* Listado de Rutinas */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-green-950">
              Tus Rutinas Asignadas
            </h2>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Hoy
            </span>
          </div>

          <div className="space-y-3">
            {rutinas.map((rutina) => (
              <div
                key={rutina.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between bg-white ${
                  rutina.completada
                    ? "border-green-200 bg-green-50/30 opacity-75"
                    : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-1 pr-4">
                  <span
                    className={`font-bold text-base leading-tight ${rutina.completada ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {rutina.nombre}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                    <span>📋 {rutina.ejercicios} ejercicios</span>
                    <span>⏱️ {rutina.duracion}</span>
                  </div>
                </div>

                {/* Checkbox interactivo */}
                <button
                  type="button"
                  onClick={() => toggleRutina(rutina.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all border-2 shrink-0 ${
                    rutina.completada
                      ? "bg-green-600 border-green-600 text-white shadow-md"
                      : "border-gray-200 text-transparent hover:border-green-600"
                  }`}
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjeta de indicación del Kinesiólogo */}
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-start gap-3">
          <span className="text-xl">👨‍⚕️</span>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Indicación Profesional
            </h4>
            <p className="text-xs text-gray-600 leading-normal">
              Recordá realizar los movimientos de forma pausada. Ante cualquier
              dolor agudo, suspendé el ejercicio y consultá con tu profesional a cargo.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePaciente;
