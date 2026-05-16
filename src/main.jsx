import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./features/professional/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./features/professional/Register.jsx";
import RegisterPaciente from "./features/patient/RegisterPaciente.jsx";
import HomePaciente from "./features/patient/HomePaciente.jsx";
import LoginPaciente from "./features/patient/LoginPaciente.jsx";
import QRSection from "./features/professional/QRSection.jsx";

const root = document.getElementById("root");

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<App />} />
      <Route path="/register-paciente/:token" element={<RegisterPaciente />} />
      <Route path="/login-paciente" element={<LoginPaciente />} />
      <Route path="/home-paciente" element={<HomePaciente />} />
    </Routes>
  </BrowserRouter>,
);
