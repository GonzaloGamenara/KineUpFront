import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, ClipboardList, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getPacienteNombre = (paciente) => {
  const nombreCompleto = getValue(paciente, "nombreCompleto", "NombreCompleto");
  const nombre = `${getValue(paciente, "nombre", "Nombre") ?? ""} ${
    getValue(paciente, "apellido", "Apellido") ?? ""
  }`.trim();

  return nombreCompleto || nombre || "Paciente";
};

const getPlantillaId = (plantilla) =>
  getValue(plantilla, "idTratamientoPlantilla", "IdTratamientoPlantilla");

const getPlantillaTitulo = (plantilla) =>
  getValue(plantilla, "titulo", "Titulo") ?? "Plantilla sin título";

const getPlantillaDescripcion = (plantilla) =>
  getValue(plantilla, "descripcion", "Descripcion") ??
  "Sin descripción asignada.";

const getEtapas = (plantilla) => getValue(plantilla, "etapas", "Etapas") ?? [];

const getRutinas = (plantilla) =>
  getEtapas(plantilla).flatMap(
    (etapa) => getValue(etapa, "rutinas", "Rutinas") ?? []
  );

const getEjercicios = (plantilla) =>
  getRutinas(plantilla).flatMap(
    (rutina) => getValue(rutina, "ejercicios", "Ejercicios") ?? []
  );

const isActivo = (item) => getValue(item, "activo", "Activo") !== false;

const contieneTexto = (value, search) =>
  String(value ?? "")
    .toLowerCase()
    .includes(search.trim().toLowerCase());

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

      const plantillasData = plantillasResponse?.data ?? plantillasResponse ?? [];
      setPaciente(pacienteResponse?.data ?? pacienteResponse ?? null);
      setPlantillas(Array.isArray(plantillasData) ? plantillasData : []);
      setError("");
    } catch (err) {
      console.error("Error al cargar asignación de tratamiento:", err);
      setError(err?.message || "No se pudo cargar la asignación.");
    } finally {
      setLoading(false);
    }
  };

  const plantillasFiltradas = useMemo(() => {
    return plantillas.filter(
      (plantilla) =>
        contieneTexto(getPlantillaTitulo(plantilla), busqueda) ||
        contieneTexto(getPlantillaDescripcion(plantilla), busqueda)
    );
  }, [busqueda, plantillas]);

  const selectedTemplate = plantillas.find(
    (plantilla) => String(getPlantillaId(plantilla)) === String(selectedId)
  );

  const asignarTratamiento = async () => {
    if (!selectedId) return;

    setAssigning(true);

    try {
      await httpClient.post(
        `/api/profesional/tratamientos-plantilla/${selectedId}/asignar`,
        { idPaciente: Number(idPaciente) }
      );
      navigate("/profesional/home");
    } catch (err) {
      console.error("Error al asignar tratamiento:", err);
      setError(err?.message || "No se pudo asignar el tratamiento.");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando plantillas...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      <button
        type="button"
        onClick={() => navigate("/profesional/home")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver al inicio
      </button>

      <header className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">
          Asignar tratamiento
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {getPacienteNombre(paciente)}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Elegí una plantilla para crear el tratamiento del paciente.
        </p>
      </header>

      {error && <ErrorState message={error} onRetry={loadData} />}

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar plantilla..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-3">
          {plantillasFiltradas.length > 0 ? (
            plantillasFiltradas.map((plantilla) => (
              <PlantillaCard
                key={getPlantillaId(plantilla)}
                plantilla={plantilla}
                selected={
                  String(getPlantillaId(plantilla)) === String(selectedId)
                }
                onSelect={() => setSelectedId(String(getPlantillaId(plantilla)))}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400">
              No hay plantillas disponibles.
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Selección
          </p>
          <h2 className="mt-2 text-lg font-bold text-slate-900">
            {selectedTemplate
              ? getPlantillaTitulo(selectedTemplate)
              : "Sin plantilla elegida"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {selectedTemplate
              ? getPlantillaDescripcion(selectedTemplate)
              : "Seleccioná una plantilla para continuar."}
          </p>

          <button
            type="button"
            onClick={asignarTratamiento}
            disabled={!selectedId || assigning}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            {assigning ? "Asignando..." : "Confirmar asignación"}
          </button>
        </aside>
      </div>
    </section>
  );
}

function PlantillaCard({ plantilla, selected, onSelect }) {
  const etapas = getEtapas(plantilla).filter(isActivo);
  const rutinas = getRutinas(plantilla).filter(isActivo);
  const ejercicios = getEjercicios(plantilla).filter(isActivo);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-3xl border bg-white p-5 text-left shadow-sm transition hover:bg-slate-50 ${
        selected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-100"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <ClipboardList size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-slate-900">
            {getPlantillaTitulo(plantilla)}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
            {getPlantillaDescripcion(plantilla)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <CardMetric label="Etapas" value={etapas.length} />
        <CardMetric label="Rutinas" value={rutinas.length} />
        <CardMetric label="Ejercicios" value={ejercicios.length} />
      </div>
    </button>
  );
}

function CardMetric({ label, value }) {
  return (
    <div>
      <p className="text-lg font-bold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-400">{label}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">{message}</p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-100"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
