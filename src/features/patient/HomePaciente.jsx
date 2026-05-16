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
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white font-poppins text-gray-800 pb-24">
      {/* Header superior móvil */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-5 py-4 border-b border-gray-100 flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-xl text-green-900 tracking-tight">
            KineUp
          </span>
        </div>
        <button
          onClick={() => navigate("/login-paciente")}
          className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-xl hover:bg-red-500 hover:text-white transition-all"
        >
          Salir
        </button>
      </header>

      {/* Contenedor principal */}
      <main className="px-5 mt-6 max-w-md mx-auto space-y-6">
        {/* Texto de Bienvenida */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-green-900">
            ¡Hola de nuevo! 👋
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Acá tenés el seguimiento de tu rehabilitación para hoy.
          </p>
        </div>

        {/* Tarjeta de Progreso */}
        <div className="bg-gradient-to-br from-[#007a3f] to-[#005a2f] text-white p-5 rounded-3xl shadow-xl shadow-green-900/10">
          <div className="flex justify-between items-start mb-3">
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
        <div className="space-y-3">
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
              dolor agudo, frená la sesión y mandale un mensaje a tu kinesiólogo
              asignado.
            </p>
          </div>
        </div>
      </main>

      {/* Navbar inferior fijo (Mobile-Look) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 py-3 px-8 flex justify-around items-center z-40 max-w-md mx-auto rounded-t-3xl shadow-lg shadow-black/5">
        <button className="flex flex-col items-center gap-1 text-green-700">
          <span className="text-xl">🏋️‍♂️</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Rutinas
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-700 transition-colors">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Evolución
          </span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-700 transition-colors">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">
            Perfil
          </span>
        </button>
      </nav>
    </div>
  );
}

export default HomePaciente;
