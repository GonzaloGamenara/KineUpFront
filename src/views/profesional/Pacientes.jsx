import React, { useEffect, useMemo, useState } from "react";
import { Search, UserPlus, Users } from "lucide-react";
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

const getPacienteVinculado = (paciente) => {
  const estadoVinculo =
    paciente?.vinculacionActiva ??
    paciente?.VinculacionActiva ??
    paciente?.vinculadoActualmente ??
    paciente?.VinculadoActualmente ??
    paciente?.vinculacionVigente ??
    paciente?.VinculacionVigente ??
    paciente?.estaVinculado ??
    paciente?.EstaVinculado ??
    paciente?.vinculado ??
    paciente?.Vinculado ??
    paciente?.activo ??
    paciente?.Activo;

  if (typeof estadoVinculo === "boolean") return estadoVinculo;
  if (typeof estadoVinculo === "string") {
    return estadoVinculo.toLowerCase() === "true";
  }

  return true;
};

const getEstadoPaciente = (paciente) =>
  getPacienteVinculado(paciente) ? "Vinculado" : "No vinculado";

const EstadoBadge = ({ vinculado = true }) => {
  return (
    <span
      className={`inline-flex h-2.5 w-2.5 rounded-full ${
        vinculado ? "bg-emerald-500" : "bg-slate-300"
      }`}
      title={vinculado ? "Vinculado" : "No vinculado"}
    />
  );
};

export default function Pacientes() {
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setLoading(true);

    try {
      const response = await httpClient.get("/api/profesional/pacientes");
      setPacientes(response.data || response);
    } catch (err) {
      console.error(err);
      alert("No se pudo recuperar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((p) =>
      `${p.nombreCompleto} ${p.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [pacientes, search]);

  const irAFicha = (paciente) => {
    navigate(`/profesional/pacientes/${paciente.idPaciente}`);
  };

  if (loading) {
    return (
      <section className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm font-medium text-slate-500">
          Cargando pacientes...
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-5 animate-fade-in">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Mis Pacientes
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {pacientes.length} pacientes en historial.
          </p>
        </div>

        <button
          onClick={() => navigate("/profesional/qr")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm active:scale-[0.98] md:w-auto"
        >
          <UserPlus size={18} />
          Vincular paciente
        </button>
      </header>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o email"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {pacientes.length < 1 ? (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
            <Users size={30} />
          </div>

          <p className="font-semibold text-slate-700">
            Todavía no tenés pacientes vinculados
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {pacientesFiltrados.map((paciente) => {
              const vinculado = getPacienteVinculado(paciente);

              return (
                <button
                  key={paciente.idPaciente}
                  onClick={() => irAFicha(paciente)}
                  className="w-full rounded-2xl bg-white p-4 text-left shadow-sm active:scale-[0.99]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        {paciente.nombreCompleto}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {paciente.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <EstadoBadge vinculado={vinculado} />
                      {getEstadoPaciente(paciente)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {calcularEdad(paciente.fechaNacimiento)}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="hidden overflow-hidden rounded-[2rem] bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Paciente</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Edad</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>

              <tbody>
                {pacientesFiltrados.map((paciente) => {
                  const vinculado = getPacienteVinculado(paciente);

                  return (
                    <tr
                      key={paciente.idPaciente}
                      onClick={() => irAFicha(paciente)}
                      className="cursor-pointer border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {paciente.nombreCompleto}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {paciente.email}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {calcularEdad(paciente.fechaNacimiento)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <EstadoBadge vinculado={vinculado} />
                          {getEstadoPaciente(paciente)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
