// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router";
import Login from "../components/common/Login";
import HomePaciente from "../views/paciente/HomePaciente.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import { RequireRole } from "../auth/RequireRole.jsx";
import QRSection from "../views/profesional/QRSection.jsx";
import EnConstruccion from "../components/layout/EnConstruccion.jsx";
import AccesoDenegado from "../components/layout/AccesoDenegado.jsx";
import NoEncontrado from "../components/layout/NoEncontrado.jsx";
import Vincular from "../views/paciente/Vincular.jsx";
import Register from "../components/common/Register.jsx";
import Pacientes from "../views/profesional/Pacientes.jsx";
import Profile from "../components/common/Profile.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registrar-paciente" element={<Register />} />

      <Route element={<RequireRole roles={["Paciente", "Admin"]} />}>
        <Route path="/paciente" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<HomePaciente />} />
          <Route path="rutinas" element={<EnConstruccion />} />
          <Route path="perfil" element={<EnConstruccion />} />
          <Route path="vincular/:token" element={<Vincular />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={["Profesional", "Admin"]} />}>
        <Route path="/profesional" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<EnConstruccion />} />
          <Route path="qr" element={<QRSection />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/sin-acceso" element={<AccesoDenegado />} />

      <Route path="/paciente/vincular/:token" element={<Vincular />} />

      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}
