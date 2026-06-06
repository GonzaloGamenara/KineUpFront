import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardList, Search, X, Layers, Dumbbell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================
const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key];
  }
  return undefined;
};

const getPacienteNombre = (paciente) => getValue(paciente, "nombreCompleto", "NombreCompleto") ?? "Paciente";
const getPlantillaId = (p) => getValue(p, "idTratamientoPlantilla", "IdTratamientoPlantilla");
const getPlantillaTitulo = (p) => getValue(p, "titulo", "Titulo") ?? "Sin título";
const getPlantillaDescripcion = (p) => getValue(p, "descripcion", "Descripcion") ?? "Sin descripción.";
const getEtapas = (p) => getValue(p, "etapas", "Etapas") ?? [];
const getRutinas = (p) => getEtapas(p).flatMap((e) => getValue(e, "rutinas", "Rutinas") ?? []);
const getEjercicios = (p) => getRutinas(p).flatMap((r) => getValue(r, "ejercicios", "Ejercicios") ?? []);
const isActivo = (item) => getValue(item, "activo", "Activo") !== false;
const contieneTexto = (value, search) => String(value ?? "").toLowerCase().includes(search.trim().toLowerCase());

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function AsignarTratamiento() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [plantillas, setPlantillas] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [idPaciente]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pacienteResponse, plantillasResponse] = await Promise.all([
        httpClient.get(`/api/Profesional/pacientes/${idPaciente}`),
        httpClient.get("/api/profesional/tratamientos-plantilla"),
      ]);
      setPaciente(pacienteResponse?.data ?? pacienteResponse ?? null);
      setPlantillas(Array.isArray(plantillasResponse) ? plantillasResponse : (plantillasResponse?.data ?? []));
    } catch (err) {
      setError(err?.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const plantillasFiltradas = useMemo(() => {
    return plantillas.filter((p) => contieneTexto(getPlantillaTitulo(p), busqueda) || contieneTexto(getPlantillaDescripcion(p), busqueda));
  }, [busqueda, plantillas]);

  const selectedTemplate = plantillas.find((p) => String(getPlantillaId(p)) === String(selectedId));

  const asignarTratamiento = async () => {
    if (!selectedId) return;
    setAssigning(true);
    try {
      await httpClient.post(`/api/profesional/tratamientos-plantilla/${selectedId}/asignar`, { idPaciente: Number(idPaciente) });
      navigate("/profesional/home");
    } catch (err) {
      setError(err?.message || "No se pudo asignar el tratamiento.");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <div className="flex h-[50vh] items-center justify-center animate-pulse text-slate-400 font-bold">Cargando datos...</div>;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 animate-fade-in pb-32">
      <button onClick={() => navigate("/profesional/home")} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#007A3F] transition mb-6">
        <ArrowLeft size={18} /> Volver al inicio
      </button>

      <header className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-sm border border-slate-100 mb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-[#007A3F] mb-1">Asignar tratamiento</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{getPacienteNombre(paciente)}</h1>
        <p className="mt-2 text-sm text-slate-500 font-medium">Elegí una plantilla para crear el tratamiento del paciente.</p>
      </header>

      {error && <ErrorState message={error} onRetry={loadData} />}

      {/* BUSCADOR */}
      <div className="relative mb-6">
        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar plantilla..." className="w-full h-14 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium focus:border-[#007A3F] focus:ring-4 focus:ring-green-50 shadow-sm outline-none" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {plantillasFiltradas.length > 0 ? (
            plantillasFiltradas.map((plantilla) => (
              <PlantillaCard
                key={getPlantillaId(plantilla)}
                plantilla={plantilla}
                selected={String(getPlantillaId(plantilla)) === String(selectedId)}
                onSelect={() => setSelectedId(String(getPlantillaId(plantilla)))}
              />
            ))
          ) : (
            <div className="p-10 text-center rounded-[2rem] border border-dashed text-slate-400 font-semibold">No hay plantillas disponibles.</div>
          )}
        </div>

        {/* SIDEBAR PC */}
        <aside className="hidden xl:block h-fit rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 sticky top-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Selección</p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">{selectedTemplate ? getPlantillaTitulo(selectedTemplate) : "Sin selección"}</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">{selectedTemplate ? getPlantillaDescripcion(selectedTemplate) : "Seleccioná una plantilla para continuar."}</p>
          <button onClick={asignarTratamiento} disabled={!selectedId || assigning} className="mt-6 w-full rounded-xl bg-[#007A3F] hover:bg-[#006432] py-3 font-bold text-white transition disabled:opacity-50">
            {assigning ? "Asignando..." : "Confirmar asignación"}
          </button>
        </aside>
      </div>

      {/* FLOATING BAR MOBILE */}
      {selectedTemplate && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 xl:hidden bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button onClick={asignarTratamiento} disabled={assigning} className="w-full rounded-2xl bg-[#007A3F] py-4 font-bold text-white shadow-lg active:scale-[0.98]">
            {assigning ? "Asignando..." : `Asignar: ${getPlantillaTitulo(selectedTemplate)}`}
          </button>
        </div>
      )}
    </section>
  );
}

// ==========================================
// COMPONENTES SUB-HIJOS
// ==========================================
function PlantillaCard({ plantilla, selected, onSelect }) {
  const etapas = getEtapas(plantilla).filter(isActivo);
  const rutinas = getRutinas(plantilla).filter(isActivo);
  const ejercicios = getEjercicios(plantilla).filter(isActivo);

  return (
    <button onClick={onSelect} className={`w-full rounded-[1.5rem] border p-5 text-left transition-all ${selected ? "border-[#007A3F] bg-green-50/30 ring-2 ring-green-100" : "border-slate-100 bg-white hover:border-emerald-200"}`}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-[#007A3F]"><ClipboardList size={22} /></div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-slate-900">{getPlantillaTitulo(plantilla)}</h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">{getPlantillaDescripcion(plantilla)}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <CardMetric label="Etapas" value={etapas.length} />
        <CardMetric label="Rutinas" value={rutinas.length} />
        <CardMetric label="Ejs" value={ejercicios.length} />
      </div>
    </button>
  );
}

function CardMetric({ label, value }) {
  return (
    <div className="text-center rounded-xl bg-slate-50 py-2">
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <p className="text-sm font-bold text-red-800">{message}</p>
      <button onClick={onRetry} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-red-700 shadow-sm border border-red-100">Reintentar</button>
    </div>
  );
}