import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js"; // Importamos tu cliente HTTP real

function HomeProfesional() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Estados reales para controlar la base de datos y la interfaz
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  // LLAMADA A TU BASE DE DATOS REAL
  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setLoading(true);
    try {
      // Usamos el mismo endpoint que te funciona en la otra pantalla
      const response = await httpClient.get("/api/Profesional/pacientes");
      setPacientes(response.data || response);
    } catch (err) {
      console.error("Error al traer pacientes del Inicio:", err);
    } finally {
      setLoading(false);
    }
  };

  // Redirección a la pantalla en construcción usando el ID real del paciente
  const irAPantallaEnConstruccion = (idPaciente) => {
    navigate(`/profesional/paciente/${idPaciente}`);
  };

  // Métricas dinámicas calculadas desde tu base de datos real
  const totalPacientes = pacientes.length;
  
  // Contamos cuántos pacientes completaron el 100% de sus rutinas
  const pacientesCompletos = pacientes.filter((p) => {
    // Manejo seguro por si el backend no devuelve rutinas inmediatamente
    const listaRutinas = p.rutinas || []; 
    const totalRutinas = listaRutinas.length;
    const completadas = listaRutinas.filter((r) => r.completada).length;
    return totalRutinas > 0 && totalRutinas === completadas;
  }).length;

  // Filtrado lógico por nombre usando 'nombreCompleto' (como viene de tu API)
  const pacientesFiltrados = pacientes.filter((paciente) =>
    (paciente.nombreCompleto || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando resumen de actividad...
        </p>
      </section>
    );
  }

  return (
    // Conservamos la misma clase estructural exacta de MisPacientes
    <section className="space-y-5 animate-fade-in">
        
      {/* CABECERA CORREGIDA: Estructura suelta idéntica a Mis Pacientes para alineación perfecta */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            Profesional
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            ¡Hola de nuevo! 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Así marcha el rendimiento de tus pacientes asignados.
          </p>
        </div>

        {/* Las cards de métricas se alinean a la derecha en desktop de forma limpia */}
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-center flex-1 md:flex-none min-w-[95px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pacientes</p>
            <p className="text-lg font-bold text-slate-800">{totalPacientes}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-center flex-1 md:flex-none min-w-[95px]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Al día</p>
            <p className="text-lg font-bold text-emerald-600">{pacientesCompletos}</p>
          </div>
        </div>
      </header>
      
      {/* BUSCADOR CONTROLADO */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        <input 
          type="text" 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre..." 
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-600 transition-all"
        />
      </div>

      {/* LISTADO DE PACIENTES CON SEPARACIÓN INDEPENDIENTE */}
      {/* Cambiamos el contenedor general para que sea invisible y use space-y-3 para la mini separación */}
      <div className="space-y-3">
        {pacientesFiltrados.length > 0 ? (
          pacientesFiltrados.map((paciente) => {
            const listaRutinas = paciente.rutinas || [];
            const completadas = listaRutinas.filter((r) => r.completada).length;
            const porcentajeProgreso = listaRutinas.length > 0 
              ? Math.round((completadas / listaRutinas.length) * 100) 
              : 0;

            return (
              <div 
                key={paciente.idPaciente} 
                onClick={() => irAPantallaEnConstruccion(paciente.idPaciente)}
                // Cada fila ahora es una tarjeta independiente con sus propios bordes y sombras, tal como querías
                className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 active:bg-slate-50 active:scale-[0.995]"
              >
                {/* Info del Paciente */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-[#007a3f] font-bold text-base shrink-0">
                    {(paciente.nombreCompleto || "P").charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight truncate">
                      {paciente.nombreCompleto}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
                      {paciente.tratamiento || "Sin rutina asignada"}
                    </p>
                  </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full sm:max-w-xs space-y-1">
                  <div className="flex justify-between items-end text-[10px] font-bold">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider">Progreso diario</span>
                    <span className="text-[#007a3f]">
                      {completadas}/{listaRutinas.length} ({porcentajeProgreso}%)
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${porcentajeProgreso}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm text-center text-sm text-slate-400 font-medium">
            No se encontraron pacientes activos.
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeProfesional;