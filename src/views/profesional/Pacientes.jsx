import React, { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Users, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

const calcularEdad = (fecha) => {
  if (!fecha) return "-";
  const nacimiento = new Date(fecha);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

  return `${edad} años`;
};

// Función auxiliar para centralizar la info de los estados
const obtenerInfoEstado = (estado) => {
  const est = String(estado);
  if (est === "1") {
    return { 
      label: "Vinculado", 
      dotColor: "bg-blue-500", 
      textColor: "text-blue-700",
      bgColor: "bg-blue-50"
    };
  }
  if (est === "2") {
    return { 
      label: "En tratamiento", 
      dotColor: "bg-emerald-500", 
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50"
    };
  }
  return { 
    label: "Desconocido", 
    dotColor: "bg-slate-400", 
    textColor: "text-slate-600",
    bgColor: "bg-slate-50"
  };
};

const EstadoBadge = ({ estado }) => {
  const info = obtenerInfoEstado(estado);

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full ${info.bgColor}`}>
      <span className={`h-2 w-2 rounded-full ${info.dotColor}`} />
      <span className={`text-xs font-semibold ${info.textColor}`}>
        {info.label}
      </span>
    </div>
  );
};

export default function Pacientes() {
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  // Nuevo estado para el filtro de estado: 'todos', '1' (Vinculados), o '2' (En tratamiento)
  const [filtroEstado, setFiltroEstado] = useState("todos"); 
  const navigate = useNavigate();

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setLoading(true);

    try {
      const response = await httpClient.get("/api/Profesional/pacientes");
      setPacientes(response.data || response);
    } catch (err) {
      console.error(err);
      alert("No se pudo recuperar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  // Modificamos el useMemo para que aplique ambos filtros simultáneamente
  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) => {
      const coincideBusqueda = `${p.nombreCompleto} ${p.email}`
        .toLowerCase()
        .includes(search.toLowerCase());
      
      const coincideEstado = filtroEstado === "todos" || String(p.estado) === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [pacientes, search, filtroEstado]);

  const irAFicha = (paciente) => {
    navigate(`/profesional/pacientes/${paciente.idPaciente}`);
  };

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600"></div>
          <p className="text-sm font-medium text-slate-500">
            Cargando pacientes...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 animate-fade-in pb-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Pacientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pacientes.length} {pacientes.length === 1 ? "paciente total" : "pacientes totales"}.
          </p>
        </div>

        <button
          onClick={() => navigate("/profesional/qr")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007A3F] hover:bg-[#006432] px-5 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] md:w-auto"
        >
          <UserPlus size={18} />
          Vincular paciente
        </button>
      </header>

      {/* CONTROLES DE BÚSQUEDA Y FILTROS */}
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full h-12 rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50"
          />
        </div>

        {/* Filtros por Estado (Chips) */}
        <div className="flex flex-wrap items-center gap-2">
          <Filter size={16} className="text-slate-400 mr-1 hidden sm:block" />
          
          <button
            onClick={() => setFiltroEstado("todos")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filtroEstado === "todos"
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Todos
          </button>
          
          <button
            onClick={() => setFiltroEstado("1")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filtroEstado === "1"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Vinculados
          </button>

          <button
            onClick={() => setFiltroEstado("2")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filtroEstado === "2"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            En Tratamiento
          </button>
        </div>
      </div>

      {/* RENDERIZADO DE RESULTADOS */}
      {pacientes.length < 1 ? (
        // Pantalla vacía absoluta (Cero pacientes en base de datos)
        <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm border border-slate-100">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <Users size={30} />
          </div>
          <p className="font-semibold text-slate-700 text-lg">
            Todavía no tenés pacientes vinculados
          </p>
          <p className="mt-2 text-slate-500 text-sm max-w-sm mx-auto">
            Utilizá el botón "Vincular paciente" de arriba para generar un código QR y empezar tu lista.
          </p>
        </div>
      ) : pacientesFiltrados.length < 1 ? (
        // Pantalla vacía relativa (La búsqueda o filtro no arrojó resultados)
        <div className="rounded-[2rem] bg-slate-50 p-10 text-center border border-slate-100 border-dashed">
          <p className="font-semibold text-slate-600">
            No se encontraron pacientes para este filtro.
          </p>
        </div>
      ) : (
        <>
          {/* VISTA MOBILE (Tarjetas) */}
          <div className="space-y-3 md:hidden">
            {pacientesFiltrados.map((paciente) => (
              <button
                key={paciente.idPaciente}
                onClick={() => irAFicha(paciente)}
                className="w-full rounded-[20px] border border-slate-100 bg-white p-5 text-left shadow-sm transition-all active:scale-[0.98]"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h2 className="font-bold text-slate-900 text-lg">
                      {paciente.nombreCompleto}
                    </h2>
                    <p className="mt-0.5 text-sm font-medium text-slate-500">
                      {paciente.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <p className="text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-lg">
                    {calcularEdad(paciente.fechaNacimiento)}
                  </p>
                  <EstadoBadge estado={paciente.estado} />
                </div>
              </button>
            ))}
          </div>

          {/* VISTA DESKTOP (Tabla) */}
          <div className="hidden overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 font-semibold">Paciente</th>
                  <th className="px-6 py-5 font-semibold">Email</th>
                  <th className="px-6 py-5 font-semibold">Edad</th>
                  <th className="px-6 py-5 font-semibold">Estado actual</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {pacientesFiltrados.map((paciente) => (
                  <tr
                    key={paciente.idPaciente}
                    onClick={() => irAFicha(paciente)}
                    className="cursor-pointer transition-colors hover:bg-slate-50/80 group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {paciente.nombreCompleto}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {paciente.email}
                    </td>

                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {calcularEdad(paciente.fechaNacimiento)}
                    </td>

                    <td className="px-6 py-4">
                      <EstadoBadge estado={paciente.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}