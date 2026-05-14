import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import AnimatedBackground from "./components/AnimatedBackground.jsx";

function Login() {
  const navigate = useNavigate();
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
          usuario: usuario,
          password: password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        navigate("/home");
      } else {
        setError(data.message || "Credenciales incorrectas. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error en el fetch:", err);
      setError("Sin conexión con el servidor. Verifica tu red.");
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
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-4xl flex animate-fade-in z-10 overflow-hidden mx-4">
        
        {/* Panel izquierdo - Formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-10 py-12 gap-6 bg-white/50">
          <img src={logo} alt="KineUp" className="h-14 hover:scale-105 transition-transform duration-300" />
          
          <div className="text-center animate-fade-in [animation-delay:500ms]">
            <h1 className="select-none text-3xl font-bold text-green-900">
              Gestión Profesional
            </h1>
            <p className="text-gray-500 text-sm mt-1">Ingresá a tu panel de control</p>
          </div>

          {error && (
            <div className="text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl w-full text-center border border-red-100 animate-shake">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col gap-5" onSubmit={handleLogin}>
            <div className="animate-fade-in [animation-delay:600ms]">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
                Usuario Profesional
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-200 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
                type="text"
                placeholder="Nombre de usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="animate-fade-in [animation-delay:700ms]">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-1">
                Contraseña
              </label>
              <input
                className="shadow-sm appearance-none border border-gray-200 rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
                type="password"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="cursor-pointer bg-[#007a3f] hover:bg-[#005a2f] active:scale-95 text-white font-bold text-lg py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-green-900/20 animate-fade-in [animation-delay:800ms]"
              type="submit"
            >
              Entrar al sistema
            </button>
          </form>
        </div>

        {/* Panel derecho - Bienvenida */}
        <div className="hidden md:flex w-1/2 bg-[#007a3f] flex-col justify-center items-center gap-6 px-12 py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 tracking-tighter"></div>
          
          <h1 className="select-none text-4xl font-bold text-center text-white animate-fade-in [animation-delay:900ms]">
            ¡Hola!
          </h1>
          <p className="select-none text-green-50 text-center leading-relaxed animate-fade-in [animation-delay:1000ms]">
            Todo listo para seguir impulsando la recuperación de tus pacientes.
          </p>
          
          <div className="w-1/2 border-t border-white/20 my-2"></div>
          
          <p className="select-none text-white/80 text-sm animate-fade-in [animation-delay:1100ms]">
            ¿Eres nuevo en la plataforma?
          </p>
          <button
            className="cursor-pointer bg-white text-[#007a3f] font-bold text-xl py-3 px-10 rounded-2xl transition-all hover:bg-green-50 active:scale-95 shadow-xl animate-fade-in [animation-delay:1200ms]"
            onClick={() => navigate("/register")}
          >
            Crear mi cuenta
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;