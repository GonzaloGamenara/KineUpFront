import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

// Simulación de los datos que vienen de la base de datos
const mockupEjercicios = [
  { id: 1, nombre: "Sentadilla Minitrampolín", zona: "Miembros Inferiores", series: 3, repeticiones: 12, descripcion: "Controlar estabilidad de rodilla." },
  { id: 2, nombre: "Rotación Externa con Banda", zona: "Hombro", series: 3, repeticiones: 15, descripcion: "Mantener codo pegado al cuerpo." },
  { id: 3, nombre: "Puente de Glúteo Unipodal", zona: "Core / Cadera", series: 4, repeticiones: 10, descripcion: "Evitar rotación de pelvis al elevar." },
  { id: 4, nombre: "Extensión de Cuádriceps (Cadena Abierta)", zona: "Miembros Inferiores", series: 3, repeticiones: 12, descripcion: "Mantener contracción isométrica 2s al final." },
  { id: 5, nombre: "Estiramiento Trapecio Superior", zona: "Cervical", series: 2, repeticiones: 30, descripcion: "Sostener de forma pasiva sin dolor.", tipo: "Flexibilidad" },
];

export default function Rutinas() {
  const [busqueda, setBusqueda] = useState("");
  const [zonaSeleccionada, setZonaSeleccionada] = useState("Todos");

  // Filtros en tiempo real para el front
  const ejerciciosFiltrados = mockupEjercicios.filter((ej) => {
    const coincideBusqueda = ej.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideZona = zonaSeleccionada === "Todos" || ej.zona === zonaSeleccionada;
    return coincideBusqueda && coincideZona;
  });

  const categorias = ["Todos", "Hombro", "Miembros Inferiores", "Core / Cadera", "Cervical"];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Encabezado */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-emerald-700">Repositorio</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Mis Ejercicios</h1>
          <p className="text-slate-500 text-sm mt-1">Gestioná y asigná ejercicios para las rutinas de tus pacientes.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap">
          <Plus className="w-5 h-5" />
          Nuevo Ejercicio
        </button>
      </header>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar ejercicio por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          <span className="absolute left-4 top-3.5 text-slate-400">🔍</span>
        </div>

        {/* Selector de zonas */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setZonaSeleccionada(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                zonaSeleccionada === cat
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grilla de Tarjetas (Ejercicios de la BD) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map((ej) => (
            <div 
              key={ej.id} 
              className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Badge de Zona Corporal */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    {ej.zona}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    🏋️‍♂️
                  </div>
                </div>

                {/* Info Ejercicio */}
                <div>
                  <h3 className="font-bold text-lg text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
                    {ej.nombre}
                  </h3>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                    {ej.descripcion}
                  </p>
                </div>
              </div>

              {/* Parámetros Kinesiológicos */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between text-center items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Series</p>
                  <p className="text-lg font-bold text-slate-700">{ej.series}</p>
                </div>
                <div className="h-6 w-[1px] bg-slate-100"></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Reps / Tiempo</p>
                  <p className="text-lg font-bold text-slate-700">{ej.repeticiones}</p>
                </div>
                <div className="h-6 w-[1px] bg-slate-100"></div>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                  Editar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <span className="text-4xl">🔍</span>
            <p className="text-slate-600 font-medium mt-3">No encontramos ejercicios con esos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}