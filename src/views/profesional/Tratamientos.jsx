import { useEffect, useMemo, useState } from "react";
import { 
  Activity, FolderHeart, RefreshCw, Search, X, 
  ClipboardList, ChevronDown, ChevronUp, CheckCircle2 
} from "lucide-react";
import { httpClient } from "../../api/httpClient.js";

// ==========================================
// FUNCIONES AUXILIARES DE ACCESO SEGURO
// ==========================================
const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }
  return undefined;
};

const getTitulo = (item) => getValue(item, "titulo", "Titulo", "nombre", "Nombre") ?? "Sin título";
const getDescripcion = (item) => getValue(item, "descripcion", "Descripcion") ?? "Sin descripción asignada.";
const getIdTratamiento = (t) => getValue(t, "idTratamientoPlantilla", "IdTratamientoPlantilla", "id");
const getEtapas = (t) => getValue(t, "etapas", "Etapas") ?? [];
const getRutinas = (t) => getEtapas(t).flatMap((e) => getValue(e, "rutinas", "Rutinas") ?? []);

const contieneTexto = (value, search) =>
  String(value ?? "").toLowerCase().includes(search.trim().toLowerCase());

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function Tratamientos() {
  const [loading, setLoading] = useState(false);
  const [tratamientos, setTratamientos] = useState([]);
  const [error, setError] = useState("");
  
  const [busqueda, setBusqueda] = useState("");
  const [tratamientoSeleccionado, setTratamientoSeleccionado] = useState(null);

  useEffect(() => {
    loadTratamientos();
  }, []);

  const loadTratamientos = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get("/api/profesional/tratamientos-plantilla");
      const data = response?.data ?? response ?? [];
      setTratamientos(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setTratamientos([]);
      setError(err?.message || "No se pudieron cargar las plantillas.");
    } finally {
      setLoading(false);
    }
  };

  const tratamientosFiltrados = useMemo(() => {
    return tratamientos.filter((t) => 
      contieneTexto(getTitulo(t), busqueda) || contieneTexto(getDescripcion(t), busqueda)
    );
  }, [busqueda, tratamientos]);

  const hayBusqueda = busqueda.trim().length > 0;

  if (loading && tratamientos.length === 0) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={32} className="animate-spin text-[#007A3F]" />
          <p className="text-sm font-medium text-slate-500">Cargando tratamientos...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 space-y-6 sm:space-y-8 animate-fade-in pb-24 sm:pb-10 pt-4 sm:pt-0">
      
      {/* HEADER */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Mis Tratamientos</h1>
          <p className="mt-1 sm:mt-2 max-w-2xl text-sm text-slate-500 font-medium">
            Gestioná las plantillas para la rehabilitación de tus pacientes.
          </p>
        </div>
        <button
          onClick={loadTratamientos}
          disabled={loading}
          className="group inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-[#007A3F] hover:bg-[#006432] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : "transition-transform group-hover:rotate-180"} />
          Actualizar
        </button>
      </header>

      {error && <ErrorState message={error} onRetry={loadTratamientos} />}

      {/* BUSCADOR */}
      <div className="relative group">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full h-12 sm:h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition-all focus:border-[#007A3F] focus:ring-4 focus:ring-green-50 shadow-sm"
        />
        {hayBusqueda && (
          <button onClick={() => setBusqueda("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* GRILLA DE RESULTADOS */}
      {!error && (
        tratamientos.length < 1 ? (
          <EmptyState title="Todavía no tenés plantillas de tratamiento cargadas" />
        ) : tratamientosFiltrados.length < 1 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 sm:py-14 text-center">
            <p className="font-semibold text-slate-600 text-sm sm:text-base">No encontramos tratamientos con esa búsqueda.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {tratamientosFiltrados.map((tratamiento) => (
              <TratamientoCard
                key={getIdTratamiento(tratamiento) ?? getTitulo(tratamiento)}
                tratamiento={tratamiento}
                onVerDetalle={() => setTratamientoSeleccionado(tratamiento)}
              />
            ))}
          </div>
        )
      )}

      {/* MODAL DE DETALLE COMPLETO */}
      {tratamientoSeleccionado && (
        <DetalleTratamientoModal 
          tratamiento={tratamientoSeleccionado} 
          onClose={() => setTratamientoSeleccionado(null)} 
        />
      )}
    </section>
  );
}

// ==========================================
// COMPONENTE: TARJETA DE TRATAMIENTO
// ==========================================
function TratamientoCard({ tratamiento, onVerDetalle }) {
  const etapas = getEtapas(tratamiento);
  const rutinasTotales = getRutinas(tratamiento).length;

  return (
    <article className="group flex flex-col justify-between rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#007A3F]/30">
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-[#007A3F] mb-4 transition-colors group-hover:bg-green-100">
          <Activity size={24} />
        </div>
        <h2 className="text-lg sm:text-xl font-bold leading-tight text-slate-900 group-hover:text-[#007A3F] transition-colors">
          {getTitulo(tratamiento)}
        </h2>
        <p className="mt-2 line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm leading-relaxed text-slate-500">
          {getDescripcion(tratamiento)}
        </p>
      </div>

      <div className="mt-5 sm:mt-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-4">
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-slate-600">
            {etapas.length} Etapas
          </span>
          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-bold text-slate-600">
            {rutinasTotales} Rutinas
          </span>
        </div>

        <button 
          onClick={onVerDetalle}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-[#007A3F] text-slate-700 hover:text-white font-bold py-3 text-sm transition-colors active:scale-95"
        >
          Ver composición
        </button>
      </div>
    </article>
  );
}

// ==========================================
// COMPONENTE: MODAL DE DETALLE (ACORDEÓN MOCKUP)
// ==========================================
function DetalleTratamientoModal({ tratamiento, onClose }) {
  const etapas = getEtapas(tratamiento);
  const [etapaExpandida, setEtapaExpandida] = useState(etapas[0]?.idEtapaPlantilla || 0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm transition-opacity">
      
      {/* max-h-[90vh] para que la modal tome todo el alto disponible bien centrada */}
      <div className="w-[95%] sm:w-full max-w-[420px] md:max-w-2xl max-h-[90vh] flex flex-col rounded-[2rem] bg-white shadow-2xl animate-fade-in overflow-hidden">
        
        {/* Header del Modal */}
        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6 bg-white z-10 shrink-0">
          <div className="pr-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#007A3F] mb-1.5 block">
              Composición del Tratamiento
            </span>
            <h2 className="text-[22px] sm:text-2xl font-extrabold text-slate-900 leading-tight">
              {getTitulo(tratamiento)}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="shrink-0 h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo del Modal (Acordeones de Etapas) */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-50/80 flex-1 space-y-3 sm:space-y-4 pb-6">
          {etapas.length === 0 ? (
            <p className="text-center text-slate-500 font-medium py-10 text-sm">Este tratamiento no tiene etapas configuradas.</p>
          ) : (
            etapas.map((etapa) => {
              const isExpanded = etapaExpandida === etapa.idEtapaPlantilla;
              const rutinas = getValue(etapa, "rutinas", "Rutinas") ?? [];

              return (
                <div key={etapa.idEtapaPlantilla || etapa.titulo} className={`rounded-[1.25rem] bg-white shadow-sm overflow-hidden transition-all border ${isExpanded ? 'border-emerald-100' : 'border-slate-200'}`}>
                  
                  {/* Header del Acordeón (Etapa) */}
                  <button 
                    onClick={() => setEtapaExpandida(isExpanded ? null : etapa.idEtapaPlantilla)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-white"
                  >
                    <div className="flex items-center gap-3 w-[85%]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007A3F] text-white font-bold text-base shadow-sm">
                        {etapa.orden || "-"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[15px] sm:text-lg font-bold text-slate-900 truncate leading-tight">
                          {getTitulo(etapa)}
                        </h3>
                        <p className="text-[11px] sm:text-sm text-slate-500 line-clamp-1 mt-0.5">
                          {getDescripcion(etapa)}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="text-[#007A3F] shrink-0 w-5 h-5" /> : <ChevronDown className="text-slate-400 shrink-0 w-5 h-5" />}
                  </button>

                  {/* Contenido Expandido (Rutinas y Ejercicios) */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-white space-y-3">
                      {rutinas.length === 0 ? (
                        <p className="text-sm text-slate-500 italic px-2">No hay rutinas en esta etapa.</p>
                      ) : (
                        rutinas.map((rutina) => {
                          const ejercicios = getValue(rutina, "ejercicios", "Ejercicios") ?? [];
                          return (
                            <div key={rutina.idRutinaPlantilla || rutina.titulo} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                              
                              {/* Título de la Rutina */}
                              <div className="border-b border-slate-100 px-3 py-2.5 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <ClipboardList size={16} className="text-blue-500 shrink-0" />
                                  <h4 className="font-bold text-[13px] sm:text-sm text-slate-900 truncate">
                                    {getTitulo(rutina)}
                                  </h4>
                                </div>
                                <div className="bg-slate-100 rounded-lg px-2 py-1 text-center shrink-0 min-w-[56px]">
                                  <div className="text-[11px] font-bold text-slate-700 leading-none">{ejercicios.length}</div>
                                  <div className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5">ejercicios</div>
                                </div>
                              </div>

                              {/* Lista de Ejercicios */}
                              <ul className="divide-y divide-slate-100">
                                {ejercicios.length === 0 ? (
                                  <li className="px-3 py-3 text-xs text-slate-500 italic">Sin ejercicios.</li>
                                ) : (
                                  ejercicios.map((ej) => (
                                    <li key={ej.idRutinaEjercicioPlantilla || ej.ejercicio} className="p-3 sm:p-4 flex items-start gap-2.5 bg-white">
                                      <CheckCircle2 size={16} className="text-[#007A3F] mt-0.5 shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[13px] sm:text-sm font-semibold text-slate-800 leading-snug">
                                          {ej.ejercicio}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          <span className="inline-flex items-center rounded border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#007A3F]">
                                            SERIES: {ej.cantidadSeries}
                                          </span>
                                          <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-blue-600">
                                            REPS: {ej.cantidadRepeticiones}
                                          </span>
                                        </div>
                                      </div>
                                    </li>
                                  ))
                                )}
                              </ul>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// COMPONENTES AUXILIARES (UI)
// ==========================================
function EmptyState({ title }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white px-4 py-12 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-[#007A3F]">
        <FolderHeart size={28} />
      </div>
      <p className="font-bold text-slate-700 text-base">{title}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="font-semibold text-red-800 text-sm">{message}</p>
        <button onClick={onRetry} className="w-full sm:w-auto rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-700 shadow-sm border border-red-100 hover:bg-red-50">
          Reintentar
        </button>
      </div>
    </div>
  );
}