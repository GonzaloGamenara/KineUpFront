import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import logocortado from "../../assets/logo-cortado.png";
import { httpClient } from "../../api/httpClient.js";
import AnimatedBackground from "../layout/AnimatedBackground.jsx";
import { useAuth } from "../../auth/AuthContext";
import { useSearchParams } from "react-router-dom";
import GoogleLoginButton from "./GoogleLogin.jsx";

function Login() {
  const { user, login, loadingAuth } = useAuth();

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

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
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden font-poppins py-6 lg:py-0">
    <AnimatedBackground
      bgColor="#f0fdf4"
      color1="#bbf7d0"
      color2="#86efac"
      color3="#4ade80"
      color4="#22c55e"
      speed={3}
    />

    <div className="relative z-10 w-full max-w-[1120px] px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.95fr] gap-6 lg:gap-8 items-center">

        {/* TARJETA IZQUIERDA */}

        <div
        className="
          bg-white/75
          backdrop-blur-md
          rounded-[24px]
          lg:rounded-[32px]
          shadow-xl
          border border-white/40
          px-2
          sm:px-6
          lg:px-8
          py-5
        "
        >

          {/* LOGO */}

         <div className="flex items-center justify-start mb-6 overflow-hidden">

        <img
          src={logocortado}
          alt="KineUp"
          className="
            h-20
            sm:h-28
            lg:h-40
            w-auto
            object-contain
            shrink-0
            mr-1
          "
        />

        <h1
          className="
            text-3xl
            sm:text-5xl
            lg:text-6xl
            font-medium
            tracking-tight
            whitespace-nowrap
            leading-none
          "
        >
          <span className="text-[#007A3F]">
            Kine
          </span>

          <span className="text-[#3B82F6]">
            Up
          </span>
        </h1>

      </div>

          <span className="uppercase tracking-[3px] sm:tracking-[6px] text-[#007A3F] font-semibold text-[12px] sm:text-xs">
            PROFESIONALES Y PACIENTES
          </span>

          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-[#12352A] leading-tight">
            Tu recuperación
            <br />
            merece acompañamiento.
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            KineUp conecta profesionales y pacientes en una misma plataforma. 
            Gestioná ejercicios, seguí la evolución clínica y mantené una
            comunicación continua durante todo el proceso de rehabilitación.
          </p>

          {/* BENEFICIOS */}

          <div className="mt-6 flex flex-wrap gap-2">

            <div className="bg-[#E7F7EF] text-[#007A3F] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#B7E4CB]">
              Seguimiento personalizado
            </div>

            <div className="bg-[#E7F7EF] text-[#007A3F] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#B7E4CB]">
              Vinculación mediante QR
            </div>

          <div className="bg-[#E7F7EF] text-[#007A3F] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#B7E4CB]">
              autonomía y confianza
            </div>

            <div className="bg-[#E7F7EF] text-[#007A3F] px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#B7E4CB]">
              Recuperaciones más efectivas
            </div>

          </div>

          {/* FLUJO */}

          <div className="mt-8">

            <h3 className="uppercase tracking-[3px] text-[#007A3F] font-semibold text-sm mb-5">
              ¿Cómo funciona?
            </h3>

            <div className="space-y-4">

              {[
                "Creá tu cuenta como paciente o profesional.",
                "Vinculá pacientes mediante QR de manera rápida.",
                "Registrá ejercicios, avances y objetivos terapéuticos.",
                "Monitoreá el progreso y acompañá cada etapa de recuperación."
              ].map((texto, index) => (
                <div key={index} className="flex items-start gap-3">

                  <div className="min-w-[32px] h-8 rounded-full bg-[#007A3F] text-white flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>

                  <p className="text-sm sm:text-base text-slate-700">
                    {texto}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* TARJETA LOGIN */}

        <div className="flex justify-center lg:justify-end">

          <div
            className="
              bg-white/80
              backdrop-blur-md
              rounded-[24px]
              lg:rounded-[32px]
              shadow-xl
              border border-white/40
              w-full
              max-w-[400px]
              px-5
              sm:px-8
              py-6
            "
          >

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-[#007A3F] font-semibold text-xs sm:text-sm mb-5">
              Profesionales y pacientes
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#12352A] leading-tight">
              Bienvenido a
              <br />
              KineUp
            </h2>

            <p className="text-slate-500 mt-3 text-sm sm:text-base">
              Ingresá a tu cuenta y continuá tu seguimiento.
            </p>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form
              className="flex flex-col gap-4 mt-6"
              onSubmit={handleLogin}
            >

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Usuario
                </label>

                <input
                  type="text"
                  placeholder="Usuario o correo"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl border border-slate-200 px-4 focus:outline-none focus:border-[#007A3F] focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Contraseña
                </label>

                <input
                  type="password"
                  placeholder="Ingresá tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 rounded-2xl border border-slate-200 px-4 focus:outline-none focus:border-[#007A3F] focus:ring-2 focus:ring-green-100"
                />
              </div>

              <button
                type="submit"
                className="
                  w-full
                  h-12
                  rounded-2xl
                  bg-[#007A3F]
                  hover:bg-[#006432]
                  text-white
                  font-semibold
                  transition-all
                "
              >
                Iniciar sesión
              </button>

            </form>

            <div className="flex items-center my-6">

              <div className="flex-1 border-t border-slate-200"></div>

              <span className="px-3 text-xs uppercase tracking-wider text-slate-400">
                o continuá con
              </span>

              <div className="flex-1 border-t border-slate-200"></div>

            </div>

            <div className="w-full overflow-hidden">
              <GoogleLoginButton onSuccess={handleGoogleLogin} />
            </div>

            <div className="text-center mt-6">

              <span className="text-slate-500 text-sm">
                ¿No tenés cuenta?
              </span>

              <button
                type="button"
                onClick={() => navigate("/registrar-paciente")}
                className="ml-2 text-[#007A3F] font-semibold hover:underline"
              >
                Crear cuenta
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
);
};

export default Login;
