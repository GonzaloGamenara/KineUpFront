import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import { httpClient } from "../../api/httpClient.js";
import AnimatedBackground from "../layout/AnimatedBackground.jsx";
import { useAuth } from "../../auth/AuthContext";
import GoogleLoginButton from "./GoogleLogin.jsx";
import {
  getProfessionalOrganizations,
  getStoredProfessionalOrganization,
  getUserRoles,
} from "../../auth/organizationStorage.js";

const needsProfessionalOrganizationSelection = (userData) =>
  getProfessionalOrganizations(userData).length > 1 &&
  !getStoredProfessionalOrganization(userData);

const getDefaultRoute = (
  roles,
  userData,
  needsOrganizationSelection = false
) => {
  if (roles.includes("Admin")) return "/admin/home";
  if (roles.includes("Profesional")) {
    return needsOrganizationSelection ||
      needsProfessionalOrganizationSelection(userData)
      ? "/profesional/organizacion"
      : "/profesional/home";
  }
  if (roles.includes("Paciente")) return "/paciente/home";

  return "/sin-acceso";
};

function Login() {
  const { user, login, loadingAuth, needsOrganizationSelection } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingAuth || !user) return;

    const roles = getUserRoles(user);

    if (returnUrl) {
      navigate(returnUrl, { replace: true });
      return;
    }

    navigate(getDefaultRoute(roles, user, needsOrganizationSelection), {
      replace: true,
    });
  }, [loadingAuth, navigate, needsOrganizationSelection, returnUrl, user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const data = await httpClient.post("/api/Auth/login", {
        usuario,
        password,
      });

      if (!(data?.token ?? data?.Token)) {
        setError("Credenciales invalidas.");
        return;
      }

      const userData = await login(data);
      const roles = getUserRoles(userData);

      if (!roles.length) {
        setError("Credenciales invalidas.");
        return;
      }

      if (returnUrl) {
        navigate(returnUrl, { replace: true });
        return;
      }

      navigate(getDefaultRoute(roles, userData), { replace: true });
    } catch (err) {
      console.error(err);
      setError("Sin conexion con el servidor.");
    }
  };

  const handleGoogleLogin = async (Token) => {
    setError("");

    try {
      const data = await httpClient.post("/api/Auth/google/paciente", {
        Token,
      });

      if (!(data?.token ?? data?.Token)) {
        setError("No se pudo iniciar sesion con Google.");
        return;
      }

      const userData = await login(data);
      const roles = getUserRoles(userData);

      if (!roles.length) {
        setError("No se pudo iniciar sesion con Google.");
        return;
      }

      if (returnUrl) navigate(returnUrl, { replace: true });
      else navigate(getDefaultRoute(roles, userData), { replace: true });
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesion con Google.");
    }
  };

  return (
    <div className="relative flex h-screen items-center justify-center overflow-hidden font-poppins">
      <AnimatedBackground
        bgColor="#f0fdf4"
        color1="#bbf7d0"
        color2="#86efac"
        color3="#4ade80"
        color4="#22c55e"
        speed={3}
      />

      <div className="z-10 flex w-96 flex-col items-center gap-4 rounded-3xl bg-white/70 px-16 py-10 shadow-lg backdrop-blur-sm">
        <img
          src={logo}
          alt="KineUp"
          className="h-16 transition-transform duration-300 hover:scale-105"
        />

        <div className="text-center">
          <h1 className="text-3xl font-bold leading-tight text-green-900">
            Que bueno verte!
          </h1>
        </div>

        {error && (
          <p className="w-full rounded border border-red-100 bg-red-50 p-2 text-xs italic text-red-500">
            {error}
          </p>
        )}

        <form className="flex w-full flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 ml-1 block text-sm font-bold text-gray-700">
              Usuario
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-700 shadow-sm transition-all focus:border-[#007a3f] focus:outline-none focus:ring-1 focus:ring-[#007a3f]"
              type="text"
              placeholder="Ingresa tu usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 ml-1 block text-sm font-bold text-gray-700">
              Contrasena
            </label>
            <input
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-gray-700 shadow-sm transition-all focus:border-[#007a3f] focus:outline-none focus:ring-1 focus:ring-[#007a3f]"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className="mt-2 flex cursor-pointer items-center justify-center rounded-lg bg-[#007a3f] py-3 font-bold text-white shadow-md transition-all hover:bg-[#005a2f] hover:shadow-lg active:scale-95"
            type="submit"
          >
            Iniciar sesion
          </button>
        </form>

        <div className="mt-2 flex w-full items-center">
          <div className="grow border-t border-gray-300" />
          <span className="mx-4 text-xs uppercase tracking-widest text-gray-400">
            o bien
          </span>
          <div className="grow border-t border-gray-300" />
        </div>

        <GoogleLoginButton onSuccess={handleGoogleLogin} />

        <button
          className="mt-2 text-sm text-gray-500 transition-colors hover:text-green-800"
          type="button"
          onClick={() => navigate("/registro")}
        >
          No tenes cuenta?{" "}
          <span className="font-bold underline">Registrate aca</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
