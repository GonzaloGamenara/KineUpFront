import React, { useEffect, useState } from "react";

import {
  Users,
  ClipboardList,
  CalendarDays,
  BarChart3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { httpClient } from "../../api/httpClient.js";

export default function EnConstruccion() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState([]);

  // ===============================
  // NOMBRE PROFESIONAL
  // ===============================

  const nombreProfesional =
    localStorage.getItem("usuarioProfesional") ||
    "Profesional";

  // ===============================
  // LOAD PACIENTES
  // ===============================

  useEffect(() => {
    loadPacientes();
  }, []);

  const loadPacientes = async () => {

    setLoading(true);

    try {

      const response = await httpClient.get(
        "/api/Profesional/pacientes"
      );

      setPacientes(response.data || response);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  // ===============================
  // MÉTRICAS
  // ===============================

  const totalPacientes = pacientes.length;

  const pacientesActivos = pacientes.filter(
    (p) =>
      !p.estado ||
      !p.estado.toLowerCase().includes("abandono")
  ).length;

  // ===============================
  // LOADING
  // ===============================

  if (loading) {

    return (

      <section className="flex min-h-[60vh] items-center justify-center">

        <p className="text-sm font-medium text-slate-500">
          Cargando dashboard...
        </p>

      </section>

    );
  }

  // ===============================
  // RENDER
  // ===============================

  return (

    <section className="min-h-screen bg-[#F5F8F7] p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
            ¡Bienvenida/o,
            <span className="text-emerald-600">
              {" "} {nombreProfesional}
            </span>
            ! 👋
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">
            Resumen general de tus pacientes y actividad.
          </p>

        </div>

        <button
          onClick={() => navigate("/profesional/rutinas")}
          className="w-full lg:w-auto rounded-2xl bg-emerald-500 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
        >
          + Nueva rutina
        </button>

      </div>

      {/* ========================= */}
      {/* MÉTRICAS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">

        {/* PACIENTES */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">

            <Users className="text-emerald-500" />

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            {totalPacientes}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Pacientes vinculados
          </p>

        </div>

        {/* ACTIVOS */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

            <ClipboardList className="text-blue-500" />

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            {pacientesActivos}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            En tratamiento
          </p>

        </div>

        {/* SEGUIMIENTOS */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100">

            <CalendarDays className="text-yellow-500" />

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            {Math.max(totalPacientes - 1, 0)}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Seguimientos activos
          </p>

        </div>

        {/* ADHERENCIA */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">

            <BarChart3 className="text-violet-500" />

          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">

            {totalPacientes > 0
              ? Math.round(
                  (pacientesActivos / totalPacientes) * 100
                )
              : 0}
            %

          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Adherencia estimada
          </p>

        </div>

      </div>

      {/* ========================= */}
      {/* GRID PRINCIPAL */}
      {/* ========================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ========================= */}
        {/* PACIENTES */}
        {/* ========================= */}

        <div className="xl:col-span-2 rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

          {/* HEADER */}
          <div className="mb-6 flex items-center justify-between gap-4">

            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Pacientes recientes
            </h3>

            <button
              onClick={() => navigate("/profesional/pacientes")}
              className="text-sm sm:text-base font-medium text-emerald-500 hover:underline whitespace-nowrap"
            >
              Ver todos
            </button>

          </div>

          {/* LISTA */}
          <div className="space-y-4">

            {pacientes.slice(0, 5).map((paciente) => (

              <div
                key={paciente.idPaciente}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4"
              >

                {/* INFO */}
                <div className="min-w-0">

                  <p className="font-semibold text-slate-700 truncate">
                    {paciente.nombreCompleto}
                  </p>

                  <p className="text-sm text-slate-400 truncate">
                    {paciente.email}
                  </p>

                </div>

                {/* BOTÓN */}
                <button
                  onClick={() =>
                    navigate(
                      `/profesional/pacientes/${paciente.idPaciente}`
                    )
                  }
                  className="w-full sm:w-auto rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-100"
                >
                  Ver ficha
                </button>

              </div>

            ))}

          </div>

        </div>

        {/* ========================= */}
        {/* PANEL DERECHO */}
        {/* ========================= */}

        <div className="space-y-6">

          {/* RESUMEN */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

            <h3 className="mb-5 text-xl font-semibold text-slate-800">
              Resumen rápido
            </h3>

            <div className="space-y-4">

              {/* TOTAL */}
              <div className="rounded-2xl bg-emerald-50 p-4">

                <p className="text-sm text-slate-500">
                  Total pacientes
                </p>

                <h4 className="text-2xl font-bold text-emerald-600">
                  {totalPacientes}
                </h4>

              </div>

              {/* ACTIVOS */}
              <div className="rounded-2xl bg-violet-50 p-4">

                <p className="text-sm text-slate-500">
                  Pacientes activos
                </p>

                <h4 className="text-2xl font-bold text-violet-600">
                  {pacientesActivos}
                </h4>

              </div>

            </div>

          </div>

          {/* ADHERENCIA */}
          <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-sm border border-slate-100">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Adherencia
                </p>

                <h3 className="text-2xl font-bold text-slate-800 mt-1">

                  {totalPacientes > 0
                    ? Math.round(
                        (pacientesActivos / totalPacientes) * 100
                      )
                    : 0}
                  %

                </h3>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

                <BarChart3 className="text-emerald-600" />

              </div>

            </div>

            {/* BARRA */}
            <div className="mt-5 h-3 w-full rounded-full bg-slate-100 overflow-hidden">

              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${
                    totalPacientes > 0
                      ? Math.round(
                          (pacientesActivos / totalPacientes) * 100
                        )
                      : 0
                  }%`,
                }}
              ></div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}