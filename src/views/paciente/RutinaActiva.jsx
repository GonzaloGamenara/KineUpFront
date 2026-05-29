import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  CheckCircle,
  ChevronRight,
  Save,
  Trophy,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RutinaActiva() {
  const navigate = useNavigate();

  const usuario = {
    nombre: usuario,
  };

  const ejercicios = [
    {
      id: 1,
      nombre: "Elevación frontal",
      descripcion:
        "Elevá los brazos hasta la altura de los hombros de forma controlada.",
      series: 3,
      repeticiones: 12,
      imagen: "/ejercicios/elevacion-frontal.gif",
    },
    {
      id: 2,
      nombre: "Rotación externa",
      descripcion:
        "Mantené el codo pegado al cuerpo y rotá lentamente hacia afuera.",
      series: 3,
      repeticiones: 10,
      imagen: "/ejercicios/rotacion-externa.gif",
    },
  ];

  const STORAGE_KEY = "kineup_rutina_estado";

  const [i, setI] = useState(0);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState([]);

  /* CARGA ESTADO GUARDADO */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setI(data.i ?? 0);
      setCompleted(data.completed ?? []);
    }
  }, []);

  const e = ejercicios[i];
  const progreso = (completed.length / ejercicios.length) * 100;

  /* AUTO GUARDADO */
  useEffect(() => {
    const data = {
      i,
      completed,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [i, completed]);

  const toggleCompletar = () => {
    setCompleted((prev) =>
      prev.includes(e.id)
        ? prev.filter((id) => id !== e.id)
        : [...prev, e.id]
    );
  };

  const siguiente = () => {
    if (i < ejercicios.length - 1) {
      setI(i + 1);
      setStarted(false);
      setPaused(false);
    }
  };

  const guardar = () => {
    alert("Progreso guardado en sesión");
  };

  const finalizar = () => {
    localStorage.removeItem(STORAGE_KEY);
    navigate("/paciente/home");
  };

  /* RUTINA COMPLETADA */
  if (progreso === 100) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-20">
        <Trophy size={70} className="text-yellow-500 mx-auto" />

        <h1 className="text-2xl font-bold">
          ¡Rutina completada!
        </h1>

        <p className="text-slate-500">
          Excelente {usuario.nombre}, completaste todos los ejercicios.
        </p>

        <button
          onClick={finalizar}
          className="bg-[#007a3f] text-white px-6 py-3 rounded-2xl"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto space-y-6 px-2">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#007a3f] to-[#0a5a33] text-white p-5 rounded-2xl">
        <h1 className="text-xl font-bold">
          Hola, {usuario.nombre} 👋
        </h1>
        <p className="text-sm text-green-100">
          Seguimos con tu recuperación
        </p>
      </div>

      {/* PROGRESO */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#007a3f]"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* EJERCICIO */}
      <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">

        <img
          src={e.imagen}
          className="rounded-2xl w-full h-72 object-cover"
        />

        <h2 className="text-2xl font-bold">{e.nombre}</h2>

        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex gap-3">
          <Info className="text-[#007a3f]" />
          <p className="text-sm text-green-800">
            {e.descripcion}
          </p>
        </div>

        <div className="flex gap-6 text-sm text-slate-500">
          <span>Series: {e.series}</span>
          <span>Reps: {e.repeticiones}</span>
        </div>
      </div>

      {/* CONTROLES */}
      <div className="space-y-3">

        {!started ? (
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-[#007a3f] text-white py-3 rounded-2xl font-semibold"
          >
            <Play className="inline mr-2" />
            Iniciar
          </button>
        ) : (
          <button
            onClick={() => setPaused(!paused)}
            className="w-full bg-amber-500 text-white py-3 rounded-2xl font-semibold"
          >
            <Pause className="inline mr-2" />
            {paused ? "Reanudar" : "Pausar"}
          </button>
        )}

        <div className="grid grid-cols-2 gap-3">

          <button
            onClick={toggleCompletar}
            className={`py-3 rounded-2xl font-semibold ${
              completed.includes(e.id)
                ? "bg-green-600 text-white"
                : "bg-slate-800 text-white"
            }`}
          >
            <CheckCircle className="inline mr-2" />
            {completed.includes(e.id)
              ? "Completado"
              : "Completar"}
          </button>

          <button
            onClick={siguiente}
            className="border py-3 rounded-2xl font-semibold"
          >
            Siguiente <ChevronRight className="inline" />
          </button>
        </div>

        <button
          onClick={guardar}
          className="w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold"
        >
          <Save className="inline mr-2" />
          Guardar progreso
        </button>

      </div>

    </section>
  );
}