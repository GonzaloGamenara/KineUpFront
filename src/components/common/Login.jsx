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
        setError("Credenciales inválidas.");
        return;
      }

      const userData = await login(data);
      const roles = getUserRoles(userData);

      if (!roles.length) {
        setError("Credenciales inválidas.");
        return;
      }

      if (returnUrl) {
        navigate(returnUrl, { replace: true });
        return;
      }

      navigate(getDefaultRoute(roles, userData), { replace: true });
    } catch (err) {
      console.error(err);
      setError("Sin conexión con el servidor.");
    }
  };

  const handleGoogleLogin = async (Token) => {
    setError("");

    try {
      const data = await httpClient.post("/api/Auth/google/paciente", {
        Token,
      });

      if (!(data?.token ?? data?.Token)) {
        setError("No se pudo iniciar sesión con Google.");
        return;
      }

      const userData = await login(data);
      const roles = getUserRoles(userData);

      if (!roles.length) {
        setError("No se pudo iniciar sesión con Google.");
        return;
      }

      if (returnUrl) navigate(returnUrl, { replace: true });
      else navigate(getDefaultRoute(roles, userData), { replace: true });
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-6 font-poppins">
      <AnimatedBackground
        bgColor="#f0fdf4"
        color1="#bbf7d0"
        color2="#86efac"
        color3="#4ade80"
        color4="#22c55e"
        speed={3}
      />

      <div className="z-10 flex w-full max-w-md flex-col items-center gap-5 rounded-3xl border border-white/70 bg-white/85 px-6 py-8 shadow-xl shadow-emerald-900/10 backdrop-blur-sm sm:px-10">
        <img
          src={logo}
          alt="KineUp"
          width="116"
          height="80"
          loading="eager"
          decoding="async"
          className="h-20 w-auto"
        />

        <div className="text-center">
          <h1 className="text-3xl font-bold leading-tight text-green-900">
            Qué bueno verte
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Ingresá a tu cuenta para continuar.
          </p>
        </div>

        {error && (
          <p className="w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <form className="flex w-full flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1 ml-1 block text-sm font-bold text-gray-700">
              Usuario
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-600"
              type="text"
              placeholder="Ingresá tu usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 ml-1 block text-sm font-bold text-gray-700">
              Contraseña
            </label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition focus:border-emerald-600"
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 transition active:scale-[0.98]"
            type="submit"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            o bien
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleLoginButton onSuccess={handleGoogleLogin} />

        <button
          className="mt-2 text-sm text-gray-500 transition-colors hover:text-green-800"
          type="button"
          onClick={() => navigate("/registro")}
        >
          ¿No tenés cuenta?{" "}
          <span className="font-bold text-emerald-700 underline">
            Registrate acá
          </span>
        </button>
      </div>
    </div>
  );
}

export default Login;
