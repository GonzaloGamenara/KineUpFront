import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function DetalleRutina() {
  const navigate = useNavigate();
  const { id } = useParams(); // Para conectar con la base de datos en el futuro

  // Datos mockeados para los ejercicios
  const [ejercicios, setEjercicios] = useState([
    { id: 1, nombre: "Movilidad de dorsiflexion de tobillo", info: "3 series - 10 repeticiones", completado: false },
    { id: 2, nombre: "Isométrico de cuádriceps con banda", info: "3 series - 10 repeticiones", completado: false },
    { id: 3, nombre: "Pateo fitball a 90°", info: "3 series - 10 repeticiones", completado: false },
  ]);

  const toggleEjercicio = (id) => {
    setEjercicios(ejercicios.map(ej => 
      ej.id === id ? { ...ej, completado: !ej.completado } : ej
    ));
  };

  return (
    <div className="w-full min-h-screen pt-0 pl-0 pr-4 md:pr-8 pb-12 animate-fadeIn">

      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-emerald-700 font-semibold text-sm">
          Tratamiento
        </span>
        
        <button 
          onClick={() => navigate(-1)} 
          className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-emerald-700 transition-colors"
        >
          ← Volver a mis rutinas
        </button>
      </div>

      {/* Título Principal */}
      <div className="space-y-1 mb-5 mt-0">
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Mi Rutina
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Acá tenes la lista de ejercicios de tu rutina. 💪 
        </p>
      </div>

      {/* Tarjeta contenedora blanca principal */}
      <div className="w-full mx-0 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
        
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Rotura Ligamento Cruzado Anterior
          </h2>
          <span className="text-xl select-none">📋</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Ejercicios para Hoy
            </h3>
          </div>

          {/* Listado de Ejercicios */}
          <div className="space-y-3">
            {ejercicios.map((ej) => (
              <div 
                key={ej.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between bg-white ${
                  ej.completado 
                    ? "border-green-200 bg-green-50/30 opacity-75" 
                    : "border-gray-100 shadow-sm hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-1 pr-4">
                  <span className={`font-bold text-base leading-tight ${ej.completado ? "text-gray-400 line-through" : "text-gray-800"}`}>
                    {ej.nombre}
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {ej.info}
                  </span>
                </div>

                {/* Botón de tilde interactivo */}
                <button
                  type="button"
                  onClick={() => toggleEjercicio(ej.id)}
                  className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-xl transition-all shrink-0 ${
                    ej.completado 
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

        {/* Bloque de Indicación Profesional */}
        <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-start gap-3 mt-6">
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

      </div>
    </div>
  );
}

export default DetalleRutina;