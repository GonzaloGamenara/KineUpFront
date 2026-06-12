import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ClipboardList,
  Dumbbell,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { httpClient } from "../../api/httpClient.js";
import LoadingScreen from "../../components/common/LoadingScreen.jsx";

const getValue = (source, ...keys) => {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const getTratamientos = (home) => getValue(home, "tratamientos", "Tratamientos") ?? [];

const getTreatmentId = (tratamiento) =>
  getValue(tratamiento, "idTratamiento", "IdTratamiento");

const getTreatmentTitle = (tratamiento) =>
  getValue(tratamiento, "titulo", "Titulo") ?? "Tratamiento sin titulo";

const getTreatmentDescription = (tratamiento) =>
  getValue(tratamiento, "descripcion", "Descripcion") ?? "";

const getTreatmentState = (tratamiento) =>
  getValue(tratamiento, "estado", "Estado") ?? "";

const getTreatmentProgress = (tratamiento) =>
  Math.max(
    0,
    Math.min(
      100,
      Math.round(Number(getValue(tratamiento, "avanceTratamiento", "AvanceTratamiento") ?? 0))
    )
  );

const getProfessionalName = (tratamiento) => {
  const profesional = getValue(tratamiento, "profesional", "Profesional");
  return getValue(profesional, "nombreCompleto", "NombreCompleto") ?? "-";
};

const getCurrentStage = (tratamiento) =>
  getValue(tratamiento, "etapaActual", "EtapaActual");

const getStageTitle = (etapa) =>
  getValue(etapa, "titulo", "Titulo") ?? "Sin etapa actual";

const getRoutines = (tratamiento) =>
  getValue(tratamiento, "rutinas", "Rutinas") ?? [];

const getRoutineId = (rutina) => getValue(rutina, "idRutina", "IdRutina");

const getRoutineTitle = (rutina) =>
  getValue(rutina, "titulo", "Titulo") ?? "Rutina sin titulo";

const getRoutineExecutionsCount = (rutina) =>
  Number(
    getValue(
      rutina,
      "cantidadEjecucionesIndicadas",
      "CantidadEjecucionesIndicadas"
    ) ?? getExecutions(rutina).length
  );

const getExecutions = (rutina) =>
  getValue(rutina, "ejecuciones", "Ejecuciones") ?? [];

const getExecutionId = (execution) =>
  getValue(execution, "idEjecucion", "IdEjecucion");

const getExecutionNumber = (execution) =>
  getValue(execution, "numero", "Numero") ?? "-";

const getExecutionStatus = (execution) =>
  getValue(execution, "estado", "Estado") ?? "Pendiente";

const getExecutionExercises = (execution) =>
  getValue(execution, "ejercicios", "Ejercicios") ?? [];

const getExecutionExerciseId = (exercise) =>
  getValue(exercise, "idEjecucionEjercicio", "IdEjecucionEjercicio");

const getExerciseName = (exercise) =>
  getValue(exercise, "nombre", "Nombre") ?? "Ejercicio sin nombre";

const getExerciseSeries = (exercise) =>
  getValue(exercise, "series", "Series") ?? "-";

const getExerciseReps = (exercise) =>
  getValue(exercise, "repeticiones", "Repeticiones") ?? "-";

const isExerciseDone = (exercise) =>
  Boolean(getValue(exercise, "realizado", "Realizado"));

const isActiveTreatment = (tratamiento) =>
  getTreatmentState(tratamiento).toLowerCase() === "activo";

const getUpdateTreatmentId = (update) =>
  getValue(update, "idTratamiento", "IdTratamiento");

const getUpdateProgress = (update) =>
  getValue(update, "avanceTratamiento", "AvanceTratamiento");

const getUpdatedRoutine = (update) => getValue(update, "rutina", "Rutina");

const getUpdatedExecution = (update) => getValue(update, "ejecucion", "Ejecucion");

const getUpdatedRoutineId = (rutina) => getValue(rutina, "idRutina", "IdRutina");

const applyExecutionUpdate = (currentHome, update) => {
  if (!currentHome || !update) return currentHome;

  const idTratamiento = getUpdateTreatmentId(update);
  const avanceTratamiento = getUpdateProgress(update);
  const rutinaActualizada = getUpdatedRoutine(update);
  const ejecucionActualizada = getUpdatedExecution(update);
  const idRutina = getUpdatedRoutineId(rutinaActualizada);
  const idEjecucion = getExecutionId(ejecucionActualizada);

  if (!idTratamiento || !idRutina || !idEjecucion) return currentHome;

  return {
    ...currentHome,
    tratamientos: getTratamientos(currentHome).map((tratamiento) => {
      if (getTreatmentId(tratamiento) !== idTratamiento) {
        return tratamiento;
      }

      return {
        ...tratamiento,
        avanceTratamiento: avanceTratamiento ?? getTreatmentProgress(tratamiento),
        rutinas: getRoutines(tratamiento).map((rutina) => {
          if (getRoutineId(rutina) !== idRutina) {
            return rutina;
          }

          return {
            ...rutina,
            cantidadEjecucionesIndicadas: getRoutineExecutionsCount(rutinaActualizada),
            ejecuciones: getExecutions(rutina).map((execution) =>
              getExecutionId(execution) === idEjecucion ? ejecucionActualizada : execution
            ),
          };
        }),
      };
    }),
  };
};

export default function HomePaciente() {
  const [home, setHome] = useState(null);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState(null);
  const [openRoutineId, setOpenRoutineId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState(null);

  const loadHome = useCallback(async () => {
    setLoading(true);

    try {
      const response = await httpClient.get("/api/paciente/home");
      const data = response?.data ?? response ?? { tratamientos: [] };
      const tratamientosActivos = getTratamientos(data).filter(isActiveTreatment);

      setHome(data);
      setError("");
      setSelectedTreatmentId((current) => {
        if (tratamientosActivos.length === 1) {
          return getTreatmentId(tratamientosActivos[0]);
        }

        const selectedStillExists = tratamientosActivos.some(
          (tratamiento) => getTreatmentId(tratamiento) === current
        );

        return selectedStillExists ? current : null;
      });
    } catch (err) {
      console.error("Error al cargar el home del paciente:", err);
      setHome({ tratamientos: [] });
      setError(err?.message || "No se pudo cargar tu tratamiento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  const tratamientosActivos = useMemo(
    () => getTratamientos(home).filter(isActiveTreatment),
    [home]
  );

  const selectedTreatment = tratamientosActivos.find(
    (tratamiento) => getTreatmentId(tratamiento) === selectedTreatmentId
  );

  const executionSummary = useMemo(() => {
    if (!selectedTreatment) return { completas: 0, total: 0 };

    return getRoutines(selectedTreatment).reduce(
      (summary, rutina) => {
        const executions = getExecutions(rutina);
        const completas = executions.filter(
          (execution) => getExecutionStatus(execution) === "Completa"
        ).length;

        return {
          completas: summary.completas + completas,
          total: summary.total + executions.length,
        };
      },
      { completas: 0, total: 0 }
    );
  }, [selectedTreatment]);

  const completeExecution = async (idEjecucion) => {
    setActionId(`execution-${idEjecucion}`);

    try {
      const update = await httpClient.post(
        `/api/paciente/rutina-ejecuciones/${idEjecucion}/realizar`
      );
      setHome((current) => applyExecutionUpdate(current, update));
      setError("");
    } catch (err) {
      console.error("Error al marcar la ejecucion:", err);
      setError(err?.message || "No se pudo marcar la ejecucion.");
    } finally {
      setActionId(null);
    }
  };

  const toggleExercise = async (exercise) => {
    const idEjecucionEjercicio = getExecutionExerciseId(exercise);
    const realizado = !isExerciseDone(exercise);
    setActionId(`exercise-${idEjecucionEjercicio}`);

    try {
      const update = await httpClient.patch(
        `/api/paciente/rutina-ejecucion-ejercicios/${idEjecucionEjercicio}`,
        { realizado }
      );
      setHome((current) => applyExecutionUpdate(current, update));
      setError("");
    } catch (err) {
      console.error("Error al actualizar el ejercicio:", err);
      setError(err?.message || "No se pudo actualizar el ejercicio.");
    } finally {
      setActionId(null);
    }
  };

  if (loading && !home) {
    return <LoadingScreen message="Preparando tu tratamiento..." />;
  }

  if (tratamientosActivos.length < 1) {
    return (
      <section className="space-y-5">
        {error && <ErrorState message={error} onRetry={loadHome} />}

        <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ClipboardList size={26} />
          </div>
          <h1 className="text-lg font-bold text-slate-900">
            Todavia no tenes tratamientos activos
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Cuando tu profesional te asigne un tratamiento, vas a verlo aca.
          </p>
        </div>
      </section>
    );
  }

  if (!selectedTreatment) {
    return (
      <section className="space-y-5 animate-fade-in">
        {error && <ErrorState message={error} onRetry={loadHome} />}

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Elegi un tratamiento
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tenes mas de un tratamiento activo. Selecciona uno para continuar.
          </p>
        </div>

        <div className="space-y-3">
          {tratamientosActivos.map((tratamiento) => {
            const etapaActual = getCurrentStage(tratamiento);

            return (
              <button
                key={getTreatmentId(tratamiento)}
                type="button"
                onClick={() => setSelectedTreatmentId(getTreatmentId(tratamiento))}
                className="w-full rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:border-emerald-300 hover:bg-slate-50"
              >
                <p className="text-sm font-semibold text-emerald-700">
                  {getStageTitle(etapaActual)}
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {getTreatmentTitle(tratamiento)}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {getProfessionalName(tratamiento)}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  const etapaActual = getCurrentStage(selectedTreatment);
  const treatmentProgress = getTreatmentProgress(selectedTreatment);
  const routines = getRoutines(selectedTreatment);

  return (
    <section className="space-y-6 animate-fade-in">
      {tratamientosActivos.length > 1 && (
        <button
          type="button"
          onClick={() => {
            setSelectedTreatmentId(null);
            setOpenRoutineId(null);
          }}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"
        >
          <ArrowLeft size={18} />
          Volver a tratamientos
        </button>
      )}

      <header>
        <h1 className="text-2xl font-bold text-slate-900">Hola de nuevo</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Aca tenes el seguimiento de tu tratamiento y las rutinas indicadas.
        </p>
      </header>

      {error && <ErrorState message={error} onRetry={loadHome} />}

      <section className="rounded-3xl bg-gradient-to-br from-[#007a3f] to-[#005a2f] p-5 text-white shadow-xl shadow-green-900/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-green-200">
              Tratamiento activo
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {getTreatmentTitle(selectedTreatment)}
            </h2>
            <p className="mt-2 text-sm text-green-50">
              {getTreatmentDescription(selectedTreatment)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/15 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-green-100">
              Progreso total
            </p>
            <p className="mt-1 text-2xl font-bold">{treatmentProgress}%</p>
          </div>
        </div>

        <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-black/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${treatmentProgress}%` }}
          />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <TreatmentFact label="Etapa actual" value={getStageTitle(etapaActual)} />
          <TreatmentFact label="Profesional" value={getProfessionalName(selectedTreatment)} />
          <TreatmentFact
            label="Ejecuciones"
            value={`${executionSummary.completas} de ${executionSummary.total} ejecuciones`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold text-green-950">
            Rutinas indicadas
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Podes marcar una ejecucion completa o avanzar ejercicio por ejercicio.
          </p>
        </div>

        {routines.length > 0 ? (
          routines.map((rutina) => (
            <RoutineAccordion
              key={getRoutineId(rutina)}
              rutina={rutina}
              open={openRoutineId === getRoutineId(rutina)}
              actionId={actionId}
              onToggle={() =>
                setOpenRoutineId((current) =>
                  current === getRoutineId(rutina) ? null : getRoutineId(rutina)
                )
              }
              onCompleteExecution={completeExecution}
              onToggleExercise={toggleExercise}
            />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-400">
            No hay rutinas activas para la etapa actual.
          </div>
        )}
      </section>

      <section className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
          <Stethoscope size={19} />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Indicacion profesional
          </h3>
          <p className="mt-1 text-xs leading-normal text-gray-600">
            Realiza los movimientos de forma pausada. Ante dolor agudo, suspende
            la ejecucion y consulta con tu profesional.
          </p>
        </div>
      </section>
    </section>
  );
}

function TreatmentFact({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/10 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-green-100">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
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

function RoutineAccordion({
  rutina,
  open,
  actionId,
  onToggle,
  onCompleteExecution,
  onToggleExercise,
}) {
  const executions = getExecutions(rutina);
  const completedExecutions = executions.filter(
    (execution) => getExecutionStatus(execution) === "Completa"
  ).length;

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-4 text-left"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Dumbbell size={22} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900">
              {getRoutineTitle(rutina)}
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {completedExecutions} de {executions.length} ejecuciones completas
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            {getRoutineExecutionsCount(rutina)} ejecuciones
          </span>
          <ChevronDown
            size={20}
            className={`text-slate-400 transition ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="space-y-3 border-t border-slate-100 p-4">
          {executions.map((execution) => (
            <ExecutionCard
              key={getExecutionId(execution)}
              rutina={rutina}
              execution={execution}
              actionId={actionId}
              onComplete={() => onCompleteExecution(getExecutionId(execution))}
              onToggleExercise={onToggleExercise}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function ExecutionCard({ rutina, execution, actionId, onComplete, onToggleExercise }) {
  const status = getExecutionStatus(execution);
  const isComplete = status === "Completa";
  const idEjecucion = getExecutionId(execution);
  const exercises = getExecutionExercises(execution);
  const completing = actionId === `execution-${idEjecucion}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">
            Ejecucion {getExecutionNumber(execution)} de {getExecutions(rutina).length}
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            Estado: {status}
          </p>
        </div>

        <button
          type="button"
          onClick={onComplete}
          disabled={isComplete || completing}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {completing ? <Loader2 className="animate-spin" size={17} /> : <Check size={17} />}
          {isComplete ? "Ejecucion completa" : "Marcar ejecucion completa"}
        </button>
      </div>

      <div className="mt-4 space-y-2">
        {exercises.map((exercise) => {
          const checked = isExerciseDone(exercise);
          const idEjecucionEjercicio = getExecutionExerciseId(exercise);
          const updating = actionId === `exercise-${idEjecucionEjercicio}`;

          return (
            <button
              key={idEjecucionEjercicio}
              type="button"
              onClick={() => onToggleExercise(exercise)}
              disabled={updating}
              className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-3 text-left transition hover:border-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="min-w-0">
                <p
                  className={`text-sm font-bold ${checked ? "text-slate-400 line-through" : "text-slate-800"
                    }`}
                >
                  {getExerciseName(exercise)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {getExerciseSeries(exercise)} series - {getExerciseReps(exercise)} repeticiones
                </p>
              </div>

              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-bold ${checked
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 text-transparent"
                  }`}
              >
                {updating ? <Loader2 className="animate-spin text-slate-400" size={17} /> : <Check size={17} />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
