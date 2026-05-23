import React, { useState, useEffect } from "react";
import { httpClient } from "../../api/httpClient.js";
import { NavLink, useNavigate } from "react-router-dom";
const Pacientes = () => {
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [popupState, setpopupState] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get(`/api/Profesional/pacientes`);
      setPacientes(response.data || response);
    } catch (err) {
      console.error(err);
      alert("No se pudo recuperar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-slate-500 font-medium">
        Cargando Pacientes...
      </div>
    );
  }

  const handleFicha = async () => {
    setpopupState(true);
  };

  return (
    <section className="p-6 max-w-6xl mx-auto font-sans text-slate-800">
      <div className="flex justify-between mr-5 items-center">
        <div className="mb-6">
          <span className="text-emerald-700 font-semibold text-sm">
            Profesional
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Mis pacientes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Visualizá y gestioná la información de tus pacientes vinculados.
          </p>
        </div>
        <button
          onClick={() => navigate("/profesional/qr")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm h-max"
        >
          Vincular Paciente
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 sm:p-6">
        {pacientes.length < 1 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-emerald-100 text-emerald-800 rounded-2xl w-16 h-16 flex items-center justify-center font-bold text-2xl mb-4">
              ?
            </div>
            <p className="text-slate-600 font-medium text-center">
              Todavía no tenés pacientes vinculados
            </p>
          </div>
        ) : (
          /* Tabla de pacientes */
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="font-semibold p-4">Nombre completo</th>
                  <th className="font-semibold p-4">Correo electrónico</th>
                  <th className="font-semibold p-4">Fecha nacimiento</th>
                  <th className="font-semibold p-4">Obra social</th>
                  <th className="font-semibold p-4">Estado</th>
                  <th className="font-semibold p-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {pacientes.map((paciente) => (
                  <tr
                    key={paciente.idPaciente}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-900">
                      {paciente?.nombreCompleto}
                    </td>
                    <td className="p-4">{paciente?.email}</td>
                    <td className="p-4">{paciente?.fechaNacimiento}</td>
                    <td className="p-4">OSDE</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        En tratamiento
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shadow-sm">
                        Ver ficha
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pacientes;
