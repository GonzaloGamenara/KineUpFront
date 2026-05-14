import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import AnimatedBackground from "./components/AnimatedBackground.jsx";

function Login() {
  const navigate = useNavigate();

  // Iniciamos en "paciente" para que siempre haya uno seleccionado (requisito mínimo 1)
  const [usertype, setUserType] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const urlLogin = "http://192.168.1.101:5000/api/Auth/login";

    try {
      const response = await fetch(urlLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          //nombre: nombre,
          //email: email,
          usuario: usuario,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(data);
        navigate("/home");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en el fetch:", err);
      setError("No hay conexión con el servidor (revisa la IP y el Wi-Fi)");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const urlRegister = "";

    try {
      const response = await fetch(urlRegister, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          //nombre: nombre,
          //email: email,
          usuario: usuario,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(data);
        navigate("/home");
      } else {
        setError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en el fetch:", err);
      setError("No hay conexión con el servidor (revisa la IP y el Wi-Fi)");
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center font-poppins overflow-hidden">
      <AnimatedBackground
        bgColor="#f0fdf4"
        color1="#bbf7d0"
        color2="#86efac"
        color3="#4ade80"
        color4="#22c55e"
        speed={3}
      />
      <div className="bg-white/70 backdrop-blur-sm h-8/12 pl-10 rounded-3xl justify-between shadow-lg w-1/2 flex gap-10 animate-fade-in z-10">
        <div className="absolute animate-fade-in [animation-delay:250ms]">
          <img src={logo} alt="KineUp" className="h-35" />
        </div>
        <div className="w-4/10 flex flex-col justify-center items-center mx-auto gap-0 mt-15">
          {error && (
            <p className="text-red-500 text-xs italic mb-4 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
          <h1 className="select-none text-5xl font-bold text-center mb-10 text-green-900 animate-fade-in [animation-delay:500ms]">
            Iniciar Sesion
          </h1>

          <form className="w-full" onSubmit={handleLogin}>
            <div className="mb-8 animate-fade-in [animation-delay:600ms]">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                E-mail
              </label>
              <input
                className="shadow text-lg appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#007a3f]"
                type="text"
                placeholder="Ingresá tu e-mail"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>

            <div className="mb-8 animate-fade-in [animation-delay:700ms]">
              <label className="block text-gray-700 text-lg font-bold mb-2">
                Contraseña
              </label>
              <input
                className="shadow text-lg mb-2 appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#007a3f]"
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* <a ##AGREGAR SEGUNDO SPRINT##
                className="text-base text-center text-gray-500 hover:underline cursor-pointer"
                onClick={() => navigate("/login")} 
              >
                ¿Olvidaste tu contraseña? Recuperala aquí
              </a> */}
            </div>
            <div className="flex flex-col gap-3 animate-fade-in [animation-delay:800ms]">
              <button
                className="cursor-pointer bg-[#007a3f] mb-2 hover:bg-[#005a2f] text-white font-bold text-lg py-3 px-4 rounded-lg hover:text-xl transition-all"
                type="submit"
              >
                Iniciar sesión
              </button>
            </div>
          </form>
          <div className="select-none flex items-center my-6 w-full animate-fade-in [animation-delay:900ms]">
            {/* Línea izquierda */}
            <div className="grow border-t border-gray-300"></div>

            {/* Texto central */}
            <span className="shrink mx-4 text-gray-400 text-sm uppercase">
              o
            </span>

            {/* Línea derecha */}
            <div className="grow border-t border-gray-300"></div>
          </div>
          <div className="justify-center items-center flex flex-col gap-3 animate-fade-in [animation-delay:1000ms] ">
            <button className="cursor-pointer justify-center w-full items-center flex flex-1 bg-white border border-[#00000036] mb-2 hover:scale-105 text-black text-lg py-4 px-8 rounded-4xl transition-all">
              <img
                className="h-5 mr-2"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                alt="Google"
              ></img>
              Continuar con Google
            </button>
          </div>
        </div>
        <div className="w-1/2 bg-[#007a3fec]/95 rounded-r-3xl flex flex-col justify-center items-center gap-5">
          <h1 className="select-none text-6xl font-bold text-center mb-4 text-white animate-fade-in [animation-delay:1100ms]">
            Bienvenidx!
          </h1>
          <p className="select-none text-white text-lg px-30 text-center animate-fade-in [animation-delay:1200ms]">
            Introduce tu e-mail y contraseña para acceder a tu cuenta.
          </p>
          <div className="flex items-center my-2 w-3/4 animate-fade-in [animation-delay:1300ms]">
            {/* Línea izquierda */}
            <div className="grow border border-white opacity-60"></div>
          </div>
          <p className="select-none text-white text-lg animate-fade-in [animation-delay:1400ms]">
            ¿Todavia no tienes una cuenta?
          </p>
          <button className="cursor-pointer bg-white text-[#007a3f] font-bold text-3xl py-4 px-6 rounded-3xl transition-all hover:bg-[#005a2f] hover:text-white hover:scale-105 animate-fade-in [animation-delay:1500ms]">
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
