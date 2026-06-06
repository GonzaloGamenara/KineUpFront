import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import logocortado from "../../assets/logo-cortado.png";
import { httpClient } from "../../api/httpClient.js";
import AnimatedBackground from "../layout/AnimatedBackground.jsx";
import { useAuth } from "../../auth/AuthContext";
import GoogleLoginButton from "./GoogleLogin.jsx";

function Login() {
  const { user, login, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  // Estados del formulario
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Estado para controlar el flujo de vistas (Info -> Login)
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (loadingAuth) return;

    if (user) {
      if (returnUrl) navigate(returnUrl, { replace: true });
      else if (user.roles.includes("Admin")) navigate("/admin/home", { replace: true });
      else if (user.roles.includes("Profesional")) navigate("/profesional/home", { replace: true });
      else if (user.roles.includes("Paciente")) navigate("/paciente/home", { replace: true });
    }
  }, [user, loadingAuth, returnUrl, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await httpClient.post("/api/Auth/login", {
        usuario,
        password,
      });

      const roles = data?.userData?.roles ?? [];

      if (!data?.token || !roles.length) {
        setError("Credenciales inválidas.");
        return;
      }

      login(data);

      if (returnUrl) {
        navigate(returnUrl, { replace: true });
        return;
      }

      if (roles.includes("Admin")) navigate("/admin/home", { replace: true });
      else if (roles.includes("Profesional")) navigate("/profesional/home", { replace: true });
      else if (roles.includes("Paciente")) navigate("/paciente/home", { replace: true });
      else navigate("/sin-acceso", { replace: true });

    } catch (err) {
      console.error(err);
      setError("Sin conexión con el servidor.");
    }
  };

  const handleGoogleLogin = async (Token) => {
    setError("");
    console.log("Google Token:", Token);

    try {
      const data = await httpClient.post("/api/Auth/google/paciente", {
        Token: Token,
      });

      const roles = data?.userData?.roles ?? [];

      if (!data?.token || !roles.length) {
        setError("No se pudo iniciar sesión con Google.");
        return;
      }

      login(data);

      if (returnUrl) navigate(returnUrl, { replace: true });
      else if (roles.includes("Admin")) navigate("/admin/home", { replace: true });
      else if (roles.includes("Profesional")) navigate("/profesional/home", { replace: true });
      else if (roles.includes("Paciente")) navigate("/paciente/home", { replace: true });
      else navigate("/sin-acceso", { replace: true });

    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-poppins py-10 px-4 sm:px-6 lg:py-0">
      <AnimatedBackground
        bgColor="#f0fdf4"
        color1="#bbf7d0"
        color2="#86efac"
        color3="#4ade80"
        color4="#22c55e"
        speed={3}
      />

      <div className="relative z-10 w-full flex justify-center items-center">
        
        {/* ==========================================
            VISTA 1: TARJETA DE INFORMACIÓN 
        ========================================== */}
        {!showLogin && (
          <div
            className="
              bg-white/85
              backdrop-blur-xl
              rounded-[24px] lg:rounded-[32px]
              shadow-2xl
              border border-white/60
              w-full max-w-[650px]
              p-6 sm:p-10 lg:p-12
              transition-all duration-500 ease-in-out
              animate-fade-in
            "
          >
            {/* LOGO */}
            <div className="flex items-center justify-start mb-6">
              <img
                src={logocortado}
                alt="KineUp"
                className="h-16 sm:h-24 lg:h-28 w-auto object-contain shrink-0 mr-3"
              />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight whitespace-nowrap leading-none">
                <span className="text-[#007A3F] font-bold">Kine</span>
                <span className="text-[#3B82F6] font-bold">Up</span>
              </h1>
            </div>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#12352A] leading-tight">
              Tu recuperación <br /> merece acompañamiento.
            </h2>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed">
              KineUp conecta profesionales y pacientes en una misma plataforma. 
              Gestioná ejercicios, seguí la evolución clínica y mantené una 
              comunicación continua durante todo el proceso de rehabilitación.
            </p>

            {/* FLUJO */}
            <div className="mt-8 bg-white/50 rounded-2xl p-6 border border-white/40">
              <h3 className="uppercase tracking-[3px] text-[#007A3F] font-bold text-sm mb-5">
                ¿Cómo funciona?
              </h3>
              <div className="space-y-4">
                {[
                  "Creá tu cuenta como paciente o profesional.",
                  "Vinculá pacientes mediante QR de manera rápida.",
                  "Registrá ejercicios, avances y objetivos terapéuticos.",
                  "Monitoreá el progreso y acompañá cada etapa."
                ].map((texto, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="min-w-[36px] h-9 rounded-full bg-[#007A3F] text-white flex items-center justify-center font-bold text-sm shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-sm sm:text-base text-slate-700 font-medium">
                      {texto}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTÓN "SIGAMOS" */}
            <div className="mt-10 flex justify-end">
              <button
                onClick={() => setShowLogin(true)}
                className="
                  w-full sm:w-auto
                  px-8 py-4
                  rounded-2xl
                  bg-[#007A3F] hover:bg-[#006432]
                  text-white font-bold text-lg
                  transition-all duration-300
                  shadow-[0_8px_20px_rgba(0,122,63,0.3)] hover:shadow-[0_12px_25px_rgba(0,122,63,0.4)]
                  flex items-center justify-center gap-3
                  active:scale-[0.98]
                "
              >
                Sigamos
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VISTA 2: TARJETA DE LOGIN 
        ========================================== */}
        {showLogin && (
          <div
            className="
              bg-white/90
              backdrop-blur-xl
              rounded-[24px] lg:rounded-[32px]
              shadow-2xl
              border border-white/60
              w-full max-w-[450px]
              p-6 sm:p-10
              relative
              transition-all duration-500 ease-in-out
              animate-fade-in
            "
          >
            {/* BOTÓN VOLVER */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-6 left-6 p-2 rounded-full text-slate-400 hover:text-[#007A3F] hover:bg-green-50 transition-colors"
              title="Volver a la información"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <div className="mt-8">

              <h2 className="text-3xl sm:text-4xl font-bold text-[#12352A] leading-tight">
                Bienvenido a <br /> KineUp
              </h2>

              <p className="text-slate-500 mt-3 text-sm sm:text-base font-medium">
                Ingresá a tu cuenta y continuá tu seguimiento.
              </p>
            </div>

            {error && (
              <div className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5 mt-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Usuario
                </label>
                <input
                  type="text"
                  placeholder="Usuario o correo"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-slate-800 focus:outline-none focus:border-[#007A3F] focus:ring-4 focus:ring-green-100 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Ingresá tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl border border-slate-200 px-4 text-slate-800 focus:outline-none focus:border-[#007A3F] focus:ring-4 focus:ring-green-100 transition-all font-medium"
                />
              </div>

              <button
                type="submit"
                className="
                  mt-2
                  w-full h-12
                  rounded-2xl
                  bg-[#007A3F] hover:bg-[#006432]
                  text-white font-bold text-lg
                  transition-all duration-300
                  shadow-[0_8px_20px_rgba(0,122,63,0.25)] hover:shadow-[0_12px_25px_rgba(0,122,63,0.35)]
                  active:scale-[0.98]
                "
              >
                Iniciar sesión
              </button>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                o continuá con
              </span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <div className="w-full overflow-hidden flex justify-center">
              <GoogleLoginButton onSuccess={handleGoogleLogin} />
            </div>

            <div className="text-center mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-600 text-sm font-medium">
                ¿No tenés cuenta?
              </span>
              <button
                type="button"
                onClick={() => navigate("/registrar-paciente")}
                className="ml-2 text-[#007A3F] font-bold hover:underline transition-all"
              >
                Crear cuenta
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Login;