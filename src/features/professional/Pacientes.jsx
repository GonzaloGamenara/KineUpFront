import React from "react";

const Pacientes = () => {

  const data = [
    {
      nombre: "Gonzalo Gamenara",
      dni: "42818367",
      prestacion: "OSDE",
      fecha: "18/04/2026",
      estado: "Alta",
      color: "text-green-500",
    },
    {
      nombre: "Pepe Perez",
      dni: "43080131",
      prestacion: "Particular",
      fecha: "18/04/2026",
      estado: "Tratamiento",
      color: "text-yellow-500",
    },
    {
      nombre: "Hector Garcia",
      dni: "17452345",
      prestacion: "Sancor",
      fecha: "18/04/2026",
      estado: "Abandonado",
      color: "text-red-500",
    },
    {
      nombre: "Gonzalo Gamenara",
      dni: "42818367",
      prestacion: "OSDE",
      fecha: "18/04/2026",
      estado: "Alta",
      color: "text-green-500",
    },
    {
      nombre: "Pepe Perez",
      dni: "43080131",
      prestacion: "Particular",
      fecha: "18/04/2026",
      estado: "Tratamiento",
      color: "text-yellow-500",
    },
    {
      nombre: "Hector Garcia",
      dni: "17452345",
      prestacion: "Sancor",
      fecha: "18/04/2026",
      estado: "Abandonado",
      color: "text-red-500",
    },
    {
      nombre: "Gonzalo Gamenara",
      dni: "42818367",
      prestacion: "OSDE",
      fecha: "18/04/2026",
      estado: "Alta",
      color: "text-green-500",
    },
    {
      nombre: "Pepe Perez",
      dni: "43080131",
      prestacion: "Particular",
      fecha: "18/04/2026",
      estado: "Tratamiento",
      color: "text-yellow-500",
    },
    {
      nombre: "Hector Garcia",
      dni: "17452345",
      prestacion: "Sancor",
      fecha: "18/04/2026",
      estado: "Abandonado",
      color: "text-red-500",
    },
    {
      nombre: "Gonzalo Gamenara",
      dni: "42818367",
      prestacion: "OSDE",
      fecha: "18/04/2026",
      estado: "Alta",
      color: "text-green-500",
    },
    {
      nombre: "Pepe Perez",
      dni: "43080131",
      prestacion: "Particular",
      fecha: "18/04/2026",
      estado: "Tratamiento",
      color: "text-yellow-500",
    },
    {
      nombre: "Hector Garcia",
      dni: "17452345",
      prestacion: "Sancor",
      fecha: "18/04/2026",
      estado: "Abandonado",
      color: "text-red-500",
    },
    {
      nombre: "Gonzalo Gamenara",
      dni: "42818367",
      prestacion: "OSDE",
      fecha: "18/04/2026",
      estado: "Alta",
      color: "text-green-500",
    },
    {
      nombre: "Pepe Perez",
      dni: "43080131",
      prestacion: "Particular",
      fecha: "18/04/2026",
      estado: "Tratamiento",
      color: "text-yellow-500",
    },
    {
      nombre: "Hector Garcia",
      dni: "17452345",
      prestacion: "Sancor",
      fecha: "18/04/2026",
      estado: "Abandonado",
      color: "text-red-500",
    },
    {
      nombre: "Gonzalo Gamenara",
      dni: "42818367",
      prestacion: "OSDE",
      fecha: "18/04/2026",
      estado: "Alta",
      color: "text-green-500",
    },
    {
      nombre: "Pepe Perez",
      dni: "43080131",
      prestacion: "Particular",
      fecha: "18/04/2026",
      estado: "Tratamiento",
      color: "text-yellow-500",
    },
    {
      nombre: "Hector Garcia",
      dni: "17452345",
      prestacion: "Sancor",
      fecha: "18/04/2026",
      estado: "Abandonado",
      color: "text-red-500",
    },
  ];

  return (
    <div className="w-full max-w-9/10 mx-auto p-4 animate-fade-in">
      <div className="flex justify-between mb-5 items-center pt-10 pb-4">
        <h1 className="text-7xl font-bold text-primary">Pacientes</h1>
        <div className="pr-80 pl-5 py-4 bg-primary/50 rounded-lg flex text-2xl">
          <h2 className="text-white font-bold">🔎 Buscar</h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/20 shadow-sm">
        <table className="w-full text-left border-collapse bg-white">

          <thead className="bg-[#e9f5ee] text-primary text-4xl">
            <tr>
              <th className="p-4 font-bold border-b border-primary/20">
                Nombre y Apellido ▾
              </th>
              <th className="p-4 font-bold border-b border-primary/20">DNI</th>
              <th className="p-4 font-bold border-b border-primary/20">
                Prestacion ▾
              </th>
              <th className="p-4 font-bold border-b border-primary/20">
                Fecha de registro
              </th>
              <th className="p-4 font-bold border-b border-primary/20">
                Estado ▾
              </th>
              <th className="p-4 font-bold border-b border-primary/20 text-center">
                Ficha Tecnica
              </th>
            </tr>
          </thead>


          <tbody className="text-primary-dark font-medium text-3xl">
            {data.map((paciente, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 hover:bg-slate-50 transition-colors"
              >
                <td className="p-4">{paciente.nombre}</td>
                <td className="p-4 text-slate-500">{paciente.dni}</td>
                <td className="p-4">{paciente.prestacion}</td>
                <td className="p-4 pl-20">{paciente.fecha}</td>
                <td className="p-4 flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full bg-current ${paciente.color}`}
                  ></span>
                  {paciente.estado}
                </td>
                <td className="p-4 text-center">
                  <button className="bg-primary text-white px-15 py-1 rounded-md text-3xl font-bold hover:bg-primary-dark cursor-pointer transition-transform active:scale-95">
                    Abrir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pacientes;
