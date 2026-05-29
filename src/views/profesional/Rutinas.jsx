import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

// ===============================
// DATOS INICIALES
// ===============================

const ejerciciosIniciales = [
  {
    id: 1,
    nombre: "Sentadilla Minitrampolín",
    zona: "Miembros Inferiores",
    series: 3,
    repeticiones: 12,
    descripcion: "Controlar estabilidad de rodilla.",
  },
  {
    id: 2,
    nombre: "Rotación Externa con Banda",
    zona: "Hombro",
    series: 3,
    repeticiones: 15,
    descripcion: "Mantener codo pegado al cuerpo.",
  },
  {
    id: 3,
    nombre: "Puente de Glúteo Unipodal",
    zona: "Core / Cadera",
    series: 4,
    repeticiones: 10,
    descripcion: "Evitar rotación de pelvis al elevar.",
  },
  {
    id: 4,
    nombre: "Extensión de Cuádriceps (Cadena Abierta)",
    zona: "Miembros Inferiores",
    series: 3,
    repeticiones: 12,
    descripcion:
      "Mantener contracción isométrica 2s al final.",
  },
];

export default function Rutinas() {

  // ===============================
  // STATES
  // ===============================

  const [busqueda, setBusqueda] = useState("");
  const [zonaSeleccionada, setZonaSeleccionada] =
    useState("Todos");

  const [ejercicios, setEjercicios] =
    useState(ejerciciosIniciales);

  // ===============================
  // CATEGORÍAS
  // ===============================

  const categorias = [
    "Todos",
    "Hombro",
    "Miembros Inferiores",
    "Core / Cadera",
    "Cervical",
  ];

  // ===============================
  // CREAR EJERCICIO
  // ===============================

  const agregarEjercicio = () => {

    const nuevoEjercicio = {
      id: Date.now(),
      nombre: "Nuevo ejercicio",
      zona: "Hombro",
      series: 3,
      repeticiones: 10,
      descripcion: "Editar descripción...",
    };

    setEjercicios([
      nuevoEjercicio,
      ...ejercicios,
    ]);
  };

  // ===============================
  // ACTUALIZAR EJERCICIO
  // ===============================

  const actualizarEjercicio = (
    id,
    campo,
    valor
  ) => {

    setEjercicios(
      ejercicios.map((ej) =>
        ej.id === id
          ? { ...ej, [campo]: valor }
          : ej
      )
    );
  };

  // ===============================
  // ELIMINAR
  // ===============================

  const eliminarEjercicio = (id) => {

    setEjercicios(
      ejercicios.filter((ej) => ej.id !== id)
    );
  };

  // ===============================
  // DUPLICAR
  // ===============================

  const duplicarEjercicio = (ejercicio) => {

    const copia = {
      ...ejercicio,
      id: Date.now(),
      nombre: `${ejercicio.nombre} (Copia)`,
    };

    setEjercicios([
      copia,
      ...ejercicios,
    ]);
  };

  // ===============================
  // FILTROS
  // ===============================

  const ejerciciosFiltrados = ejercicios.filter((ej) => {

    const coincideBusqueda = ej.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideZona =
      zonaSeleccionada === "Todos" ||
      ej.zona === zonaSeleccionada;

    return coincideBusqueda && coincideZona;
  });

  // ===============================
  // RENDER
  // ===============================

  return (

    <div className="space-y-5 animate-fade-in px-1 sm:px-0">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <p className="text-sm font-medium text-emerald-700">
            Repositorio
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Mis Ejercicios
          </h1>

          <p className="text-slate-500 text-sm mt-1 leading-relaxed">
            Gestioná y asigná ejercicios para las rutinas de tus pacientes.
          </p>

        </div>

        <button
          onClick={agregarEjercicio}
          className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-3 font-semibold text-sm shadow-sm transition-all"
        >

          <Plus className="w-5 h-5" />

          Nuevo Ejercicio

        </button>

      </header>

      {/* ========================= */}
      {/* BUSCADOR + FILTROS */}
      {/* ========================= */}

      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm md:flex-row md:items-center">

        {/* INPUT */}
        <div className="relative flex-1">

          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />

          <Search
            size={18}
            className="absolute left-4 top-3.5 text-slate-400"
          />

        </div>

        {/* FILTROS */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">

          {categorias.map((cat) => (

            <button
              key={cat}
              onClick={() =>
                setZonaSeleccionada(cat)
              }
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

      {/* ========================= */}
      {/* CARDS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {ejerciciosFiltrados.map((ej) => (

          <div
            key={ej.id}
            className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >

            {/* ========================= */}
            {/* CONTENIDO */}
            {/* ========================= */}

            <div className="space-y-4">

              {/* ZONA */}
              <div className="flex items-center justify-between gap-3">

                <select
                  value={ej.zona}
                  onChange={(e) =>
                    actualizarEjercicio(
                      ej.id,
                      "zona",
                      e.target.value
                    )
                  }
                  className="max-w-[75%] text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-3 py-2 rounded-xl outline-none"
                >

                  {categorias
                    .filter((cat) => cat !== "Todos")
                    .map((cat) => (

                      <option
                        key={cat}
                        value={cat}
                      >
                        {cat}
                      </option>

                    ))}

                </select>

                <div className="min-w-10 w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-lg">
                  🏋️‍♂️
                </div>

              </div>

              {/* NOMBRE */}
              <input
                value={ej.nombre}
                onChange={(e) =>
                  actualizarEjercicio(
                    ej.id,
                    "nombre",
                    e.target.value
                  )
                }
                className="w-full font-bold text-lg text-slate-800 bg-transparent outline-none"
              />

              {/* DESCRIPCIÓN */}
              <textarea
                value={ej.descripcion}
                onChange={(e) =>
                  actualizarEjercicio(
                    ej.id,
                    "descripcion",
                    e.target.value
                  )
                }
                className="w-full min-h-[80px] text-sm text-slate-500 bg-transparent outline-none resize-none leading-relaxed"
              />

            </div>

            {/* ========================= */}
            {/* FOOTER */}
            {/* ========================= */}

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between sm:items-center">

              {/* SERIES */}
              <div className="text-center">

                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Series
                </p>

                <input
                  type="number"
                  value={ej.series}
                  onChange={(e) =>
                    actualizarEjercicio(
                      ej.id,
                      "series",
                      e.target.value
                    )
                  }
                  className="w-20 text-center text-lg font-bold text-slate-700 bg-transparent outline-none"
                />

              </div>

              {/* REPS */}
              <div className="text-center">

                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Reps
                </p>

                <input
                  type="number"
                  value={ej.repeticiones}
                  onChange={(e) =>
                    actualizarEjercicio(
                      ej.id,
                      "repeticiones",
                      e.target.value
                    )
                  }
                  className="w-20 text-center text-lg font-bold text-slate-700 bg-transparent outline-none"
                />

              </div>

              {/* BOTONES */}
              <div className="flex flex-row sm:flex-col gap-3 sm:gap-1 justify-center">

                <button
                  onClick={() =>
                    duplicarEjercicio(ej)
                  }
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Duplicar
                </button>

                <button
                  onClick={() =>
                    eliminarEjercicio(ej.id)
                  }
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Eliminar
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ========================= */}
      {/* EMPTY STATE */}
      {/* ========================= */}

      {ejerciciosFiltrados.length === 0 && (

        <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center">

          <div className="text-5xl mb-4">
            🔍
          </div>

          <h3 className="text-lg font-bold text-slate-700">
            No encontramos ejercicios
          </h3>

          <p className="text-sm text-slate-500 mt-2">
            Probá cambiar los filtros o crear uno nuevo.
          </p>

        </div>

      )}

    </div>
  );
}