// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router";
import Login from "../components/common/Login";
import HomePaciente from "../features/paciente/HomePaciente.jsx";
import PacienteLayout from "../components/layout/PacienteLayout.jsx";
import {RequireRole} from "../auth/RequireRole.jsx";


export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
            path="/paciente"
            element={
                <RequireRole roles={["Paciente"]}>
                    <PacienteLayout />
                </RequireRole>
            }
        >
            <Route path="home" element={<HomePaciente />} />

        </Route>

        {/* <Route
            path="/profesional/*"
            element={
                <RequireRole roles={["Profesional"]}>
                    <ProfesionalLayout />
                </RequireRole>
            }
        /> */}


        <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}