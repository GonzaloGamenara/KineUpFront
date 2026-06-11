import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, ClipboardList, Search } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  getValue(plantilla, "descripcion", "Descripcion") ?? "Sin descripción asignada.";

const getEtapas = (plantilla) => getValue(plantilla, "etapas", "Etapas") ?? [];

const getRutinas = (plantilla) =>
  getEtapas(plantilla).flatMap(
    (etapa) => getValue(etapa, "rutinas", "Rutinas") ?? []
  );

const getEjercicios = (plantilla) =>
  getRutinas(plantilla).flatMap(
    (rutina) => getValue(rutina, "ejercicios", "Ejercicios") ?? []
  );

const getCantidadEtapas = (plantilla) =>
  getValue(plantilla, "cantidadEtapas", "CantidadEtapas") ??
  getEtapas(plantilla).filter(isActivo).length;

const getCantidadRutinas = (plantilla) =>
  getValue(plantilla, "cantidadRutinas", "CantidadRutinas") ??
  getRutinas(plantilla).filter(isActivo).length;

const getCantidadEjercicios = (plantilla) =>
  getValue(plantilla, "cantidadEjercicios", "CantidadEjercicios") ??
  getEjercicios(plantilla).filter(isActivo).length;

const isActivo = (item) => getValue(item, "activo", "Activo") !== false;

const getTratamientoId = (tratamiento) =>
  getValue(tratamiento, "idTratamiento", "IdTratamiento");

const getTratamientoTitulo = (tratamiento) =>
  getValue(tratamiento, "titulo", "Titulo") ?? "Tratamiento sin titulo";

const getTratamientoEstado = (tratamiento) =>
  getValue(tratamiento, "estado", "Estado") ?? "";

const isTratamientoActivo = (tratamiento) =>
  !["cancelado", "finalizado"].includes(
    getTratamientoEstado(tratamiento).toLowerCase()
  );

const contieneTexto = (value, search) =>
  String(value ?? "")
    .toLowerCase()
    .includes(search.trim().toLowerCase());

export default function ModificarTratamiento() {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [plantillas, setPlantillas] = useState([]);
  const [tratamientoOrigen, setTratamientoOrigen] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const idTratamientoOrigen = location.state?.idTratamiento;

  useEffect(() => {
    loadData();
  }, [idPaciente]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (idTratamientoOrigen) {
        const opcionesResponse = await httpClient.get(
          `/api/profesional/pacientes/${idPaciente}/tratamientos/${idTratamientoOrigen}/reemplazo-opciones`
        );
        const opciones = opcionesResponse?.data ?? opcionesResponse ?? {};

        const plantillasData =
          getValue(opciones, "plantillas", "Plantillas") ?? [];

        setPaciente(getValue(opciones, "paciente", "Paciente") ?? null);
        setTratamientoOrigen(
          getValue(opciones, "tratamientoOrigen", "TratamientoOrigen") ?? null
        );
        setPlantillas(Array.isArray(plantillasData) ? plantillasData : []);
      } else {
        const [resumenResponse, plantillasResponse] = await Promise.all([
          httpClient.get(`/api/profesional/pacientes/${idPaciente}/tratamientos/resumen`),
          httpClient.get("/api/profesional/tratamientos-plantilla/resumen"),
        ]);

        const resumen = resumenResponse?.data ?? resumenResponse ?? {};
        const plantillasData = plantillasResponse?.data ?? plantillasResponse ?? [];
        const tratamientosData =
          getValue(resumen, "tratamientos", "Tratamientos") ?? [];
        const activos = Array.isArray(tratamientosData)
          ? tratamientosData.filter(isTratamientoActivo)
          : [];

        setPaciente(getValue(resumen, "paciente", "Paciente") ?? null);
        setPlantillas(Array.isArray(plantillasData) ? plantillasData : []);
        setTratamientoOrigen(activos.length === 1 ? activos[0] : null);
      }
      setError("");
    } catch (err) {
      console.error("Error al cargar modificación de tratamiento:", err);
      setError(err?.message || "No se pudo cargar la modificación.");
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

  const modificarTratamiento = async () => {
    if (!selectedId || !tratamientoOrigen) return;
    setAssigning(true);
    try {
      await httpClient.post(
        `/api/profesional/tratamientos/${getTratamientoId(
          tratamientoOrigen
        )}/reemplazar`,
        { idTratamientoPlantilla: Number(selectedId) }
      );
      navigate(`/profesional/pacientes/${idPaciente}/tratamientos`);
    } catch (err) {
      console.error("Error al modificar tratamiento:", err);
      setError(err?.message || "No se pudo modificar el tratamiento.");
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
    <section className={`space-y-5 animate-fade-in ${selectedTemplate ? "pb-24 xl:pb-0" : ""}`}>
      <button
        type="button"
        onClick={() => navigate("/profesional/home")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={18} />
        Volver
      </button>

      <header className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-emerald-700">
          Modificar tratamiento
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {getPacienteNombre(paciente)}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Elegí una nueva plantilla para reemplazar el tratamiento activo del paciente.
        </p>
      </header>

      <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-amber-900 flex gap-3">
        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
        <p className="text-xs font-medium text-amber-700/90 leading-relaxed">
          Al confirmar, el tratamiento activo actual será reemplazado por el nuevo. El paciente verá el cambio reflejado inmediatamente en su app.
        </p>
      </div>

      <section className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Tratamiento a reemplazar
        </p>
        <h2 className="mt-2 text-lg font-bold text-slate-900">
          {tratamientoOrigen
            ? getTratamientoTitulo(tratamientoOrigen)
            : "No hay un tratamiento seleccionado"}
        </h2>
        {!tratamientoOrigen && (
          <p className="mt-2 text-sm leading-6 text-red-600">
            Volve al listado de tratamientos y elegi cual queres modificar.
          </p>
        )}
      </section>

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
                selected={String(getPlantillaId(plantilla)) === String(selectedId)}
                onSelect={() => setSelectedId(String(getPlantillaId(plantilla)))}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400">
              No hay plantillas disponibles.
            </div>
          )}
        </div>

        <aside className="hidden xl:block h-fit rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Nueva plantilla
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
            onClick={modificarTratamiento}
            disabled={!selectedId || !tratamientoOrigen || assigning}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            {assigning ? "Modificando..." : "Confirmar modificación"}
          </button>
        </aside>
      </div>

      {/* Bottom bar mobile */}
        {selectedTemplate && (
        <div className="fixed bottom-25 left-0 right-0 z-50 px-4 md:left-64 xl:hidden">
            <div className="bg-emerald-600 rounded-2xl shadow-xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Nueva plantilla</p>
                <p className="text-sm font-bold text-white truncate">{getPlantillaTitulo(selectedTemplate)}</p>
            </div>
            <button
                type="button"
                onClick={modificarTratamiento}
                disabled={!selectedId || !tratamientoOrigen || assigning}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-700 shadow-sm transition active:scale-[0.98] disabled:opacity-50"
            >
                <CheckCircle2 size={16} />
                {assigning ? "Modificando..." : "Confirmar"}
            </button>
            </div>
        </div>
        )}
    </section>
  );
}

function PlantillaCard({ plantilla, selected, onSelect }) {
  const etapas = getCantidadEtapas(plantilla);
  const rutinas = getCantidadRutinas(plantilla);
  const ejercicios = getCantidadEjercicios(plantilla);

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
        <CardMetric label="Etapas" value={etapas} />
        <CardMetric label="Rutinas" value={rutinas} />
        <CardMetric label="Ejercicios" value={ejercicios} />
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
