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
import Tratamientos from "../views/profesional/Tratamientos.jsx";
import DetallePaciente from "../views/profesional/DetallePaciente.jsx";
import DetalleRutina from "../views/paciente/DetalleRutina.jsx";
import HomeProfesional from "../views/profesional/HomeProfesional.jsx";
import AsignarTratamiento from "../views/profesional/AsignarTratamiento.jsx";
import ModificarTratamiento from "../views/profesional/ModificarTratamiento.jsx";
import DetalleTratamientos from "../views/profesional/DetalleTratamientos.jsx";
import CrearPlantillaTratamiento from "../views/profesional/CrearPlantillaTratamiento.jsx";
import CrearEtapaPlantilla from "../views/profesional/CrearEtapaPlantilla.jsx";
import CrearRutinaPlantilla from "../views/profesional/CrearRutinaPlantilla.jsx";
import SeleccionarEjerciciosPlantilla from "../views/profesional/SeleccionarEjerciciosPlantilla.jsx";
import ConfirmarPlantillaTratamiento from "../views/profesional/ConfirmarPlantillaTratamiento.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registro" element={<Register />} />
      <Route path="/registrar-paciente" element={<Navigate to="/registro" replace />} />

      <Route element={<RequireRole roles={["Paciente", "Admin"]} />}>
        <Route path="/paciente" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<HomePaciente />} />
          <Route path="detalle-rutina/:id" element={<DetalleRutina />} />
          <Route path="rutinas" element={<EnConstruccion />} />
          <Route path="perfil" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RequireRole roles={["Profesional", "Admin"]} />}>
        <Route path="/profesional" element={<AppLayout />}>
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<HomeProfesional />} />
          <Route path="qr" element={<QRSection />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="tratamientos" element={<Tratamientos />} />
          <Route path="tratamientos/nueva" element={<CrearPlantillaTratamiento />} />
          <Route path="tratamientos/nueva/etapa" element={<CrearEtapaPlantilla />} />
          <Route path="tratamientos/nueva/rutina" element={<CrearRutinaPlantilla />} />
          <Route path="tratamientos/nueva/ejercicios" element={<SeleccionarEjerciciosPlantilla />} />
          <Route path="tratamientos/nueva/confirmar" element={<ConfirmarPlantillaTratamiento />} />
          <Route path="pacientes/:idPaciente" element={<DetallePaciente />} />
          <Route
            path="pacientes/:idPaciente/tratamientos"
            element={<DetalleTratamientos />}
          />
          <Route
            path="pacientes/:idPaciente/asignar-tratamiento"
            element={<AsignarTratamiento />}
          />
          <Route 
            path="pacientes/:idPaciente/modificar-tratamiento"
            element={<ModificarTratamiento />} 
          />
        </Route>
      </Route>

      <Route path="/sin-acceso" element={<AccesoDenegado />} />

      <Route path="/paciente/vincular/:token" element={<Vincular />} />

      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}
