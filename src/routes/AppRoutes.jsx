// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from "react-router";
import Login from "../components/common/Login";
import Register from "../components/common/Register";
import Profile from "../components/common/Profile";

import AppLayout from "../components/layout/AppLayout.jsx";
import EnConstruccion from "../components/layout/EnConstruccion.jsx";
import AccesoDenegado from "../components/layout/AccesoDenegado.jsx";
import NoEncontrado from "../components/layout/NoEncontrado.jsx";

import { RequireRole } from "../auth/RequireRole.jsx";

import HomePaciente from "../views/paciente/HomePaciente.jsx";
import Vincular from "../views/paciente/Vincular.jsx";
import DetalleRutina from "../views/paciente/DetalleRutina.jsx";
import RutinaActiva from "../views/paciente/RutinaActiva.jsx";

import HomeProfesional from "../views/profesional/HomeProfesional.jsx";
import QRSection from "../views/profesional/QRSection.jsx";
import Pacientes from "../views/profesional/Pacientes.jsx";
import Tratamientos from "../views/profesional/Tratamientos.jsx";
import DetallePaciente from "../views/profesional/DetallePaciente.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registrar-paciente" element={<Register />} />

      {/* PACIENTE */}
      <Route element={<RequireRole roles={["Paciente", "Admin"]} />}>
        <Route path="/paciente" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<HomePaciente />} />

          <Route
            path="detalle-rutina/:id"
            element={<DetalleRutina />}
          />

          <Route
            path="rutina-activa"
            element={<RutinaActiva />}
          />

          <Route path="rutinas" element={<EnConstruccion />} />

          <Route path="perfil" element={<Profile />} />

          <Route path="vincular/:token" element={<Vincular />} />
        </Route>
      </Route>

      {/* PROFESIONAL */}
      <Route element={<RequireRole roles={["Profesional", "Admin"]} />}>
        <Route path="/profesional" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<HomeProfesional />} />

          <Route path="qr" element={<QRSection />} />

          <Route path="pacientes" element={<Pacientes />} />

          <Route
            path="pacientes/:idPaciente"
            element={<DetallePaciente />}
          />

          <Route path="tratamientos" element={<Tratamientos />} />

          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/sin-acceso" element={<AccesoDenegado />} />

      <Route
        path="/paciente/vincular/:token"
        element={<Vincular />}
      />

      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}