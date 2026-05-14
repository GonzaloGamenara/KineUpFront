import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./Register.jsx";
import RegisterPaciente from "./RegisterPaciente.jsx";
import LoginPaciente from "./LoginPaciente.jsx";
import QRSection from "./components/QRSection";

const root = document.getElementById("root");

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<App />} />
      <Route path="/register-paciente" element={<RegisterPaciente />} />
      <Route path="/login-paciente" element={<LoginPaciente />} />
      <Route path="/qr-section" element={<QRSection />} />
    </Routes>
  </BrowserRouter>,
);
