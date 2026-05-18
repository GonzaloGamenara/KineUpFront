// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router";
import Login from "../components/common/Login";
import HomePaciente from "../views/paciente/HomePaciente.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import { RequireRole } from "../auth/RequireRole.jsx";
import QRSection from "../views/profesional/QRSection.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route
        element={
          <RequireRole roles={["Paciente", "Profesional", "Admin"]}>
            <AppLayout />
          </RequireRole>
        }
      >
        <Route path="/paciente">
          <Route path="home" element={<HomePaciente />} />
        </Route>

        <Route path="/profesional">
          <Route path="qr" element={<QRSection />} />
        </Route>
      </Route>

      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}