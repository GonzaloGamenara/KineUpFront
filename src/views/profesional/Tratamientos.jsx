import React, { useEffect, useState } from "react";
import { Search, Plus, Activity, FolderHeart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js"; 

// Datos de prueba idénticos a tu base de datos hasta que hagas la vinculación completa
const mockupTratamientos = [
  { idTratamiento: 1, titulo: "Rehabilitación rodilla", descripcion: "Tratamiento inicial post lesión de rodilla." },
  { idTratamiento: 2, titulo: "Rotura de Ligamento Cruzado Anterior (LCA)", descripcion: "Rehabilitación de LCA enfocada en estabilidad y fuerza." },
  { idTratamiento: 3, titulo: "Esguince de tobillo", descripcion: "Rehabilitación de esguince de tobillo, propiocepción y movilidad." },
  { idTratamiento: 4, titulo: "Esguince de rodilla", descripcion: "Rehabilitación de esguince de rodilla." },
  { idTratamiento: 5, titulo: "Síndrome del Manguito Rotador", descripcion: "Rehabilitación de manguito rotador, control motor y fortalecimiento." },
  { idTratamiento: 6, titulo: "Desgarro de Gemelo", descripcion: "Rehabilitación de desgarro de gemelo." }
];

export default function Tratamientos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rutinas, setRutinas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [zonaSeleccionada, setZonaSeleccionada] = useState("Todos");

  useEffect(() => {
    loadRutinas();
  }, []);

  const loadRutinas = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get("/api/Profesional/tratamientos");
      const datosBD = response.data || response;
      
    setRutinas(response.data || response || []);
    } catch (err) {
      console.error("Error al cargar las rutinas de la BD, usando mockup:", err);
      // Fallback seguro por si el backend está caído o da error de conexión
      setRutinas(mockupTratamientos);
    } finally {
      setLoading(false);
    }
  };

  // Filtros en tiempo real
  const rutinasFiltradas = rutinas.filter((rutina) => {
    const coincideBusqueda = (rutina.titulo || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    
    const coincideZona =
      zonaSeleccionada === "Todos" || 
      (rutina.titulo || "").toLowerCase().includes(zonaSeleccionada.toLowerCase()) ||
      (rutina.descripcion || "").toLowerCase().includes(zonaSeleccionada.toLowerCase());

    return coincideBusqueda && coincideZona;
  });

  // Mapeamos las categorías con tus ejemplos de la BD (Rodilla, Tobillo, Hombro)
  const categorias = ["Todos", "Hombro", "Rodilla", "Tobillo", "Gemelo"];

  const irARutinaDetalle = (idTratamiento) => {
    navigate(`/profesional/tratamientos/${idTratamiento}`);
  };

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando tratamientos...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      
      {/* Encabezado */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-emerald-700">Profesional</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Mis Tratamientos</h1>
          <p className="text-slate-500 text-sm mt-1">
            {rutinas.length} rutinas de rehabilitación generales en el sistema.
          </p>
        </div>
        
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 font-semibold text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap">
          <Plus className="w-5 h-5" />
          Nuevo Tratamiento
        </button>
      </header>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar tratamiento por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
        </div>

        {/* Selector de zonas corporales */}
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

      {/* LISTADO DE RUTINAS CON MINI SEPARACIÓN */}
      <div className="space-y-3">
        {rutinasFiltradas.length > 0 ? (
          rutinasFiltradas.map((rutina) => (
            <div
              key={rutina.idTratamiento}
              onClick={() => irARutinaDetalle(rutina.idTratamiento)}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer transition-all flex items-center justify-between gap-4 hover:bg-slate-50/60 active:bg-slate-50 active:scale-[0.995]"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#007a3f] shrink-0">
                  <Activity size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-base leading-tight truncate">
                    {rutina.titulo}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-1">
                    {rutina.descripcion || "Sin descripción asignada."}
                  </p>
                </div>
              </div>

              <div className="text-slate-300 font-bold pr-2 select-none">
                ➔
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <FolderHeart size={26} />
            </div>
            <p className="text-slate-600 font-medium">No encontramos rutinas con esos filtros.</p>
          </div>
        )}
      </div>
    </section>
  );
}