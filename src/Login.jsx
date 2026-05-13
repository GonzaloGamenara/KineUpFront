import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png'

function Login() {
  const navigate = useNavigate();

  // Iniciamos en "paciente" para que siempre haya uno seleccionado (requisito mínimo 1)
  const [usertype, setUserType] = useState("paciente");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // --- EL IF DINÁMICO ---
    // Decidimos la URL según el estado actual
    const urlFinal = "http://192.168.1.101:5000/api/Auth/login" 

    try {
      const response = await fetch(urlFinal, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          //nombre: nombre,
          //email: email,
          usuario: usuario,
          password: password
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert(data);
        navigate("/home");
      } else {
        setError(data.message || "Error al registrar el usuario");
      }
    } catch (err) {
      console.error("Error en el fetch:", err);
      setError("No hay conexión con el servidor (revisa la IP y el Wi-Fi)");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center font-poppins bg-linear-to-br from-green-50 to-green-200">
      <div className="bg-white px-10 py-6 rounded-lg shadow-lg w-96">
        
        <div className="text-center mb-2">
          <img src={logo} alt="KineUp" className="h-30 mx-auto" />
        </div>
        
        {error && <p className="text-red-500 text-xs italic mb-4 bg-red-50 p-2 rounded">{error}</p>}

        <form onSubmit={handleRegister}>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Usuario</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#007a3f]"
              type="text"
              placeholder="Ingresá tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#007a3f]"
              type="password"
              placeholder="**********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* SECCIÓN DE CHECKBOXES MEJORADA */}
          {/* <div className="flex gap-6 items-center justify-center mb-6 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#007a3f]"
                checked={usertype === "paciente"} 
                onChange={() => setUserType("paciente")} 
              />
              <span className={`text-sm ${usertype === "paciente" ? "font-bold text-[#007a3f]" : "text-gray-500"}`}>
                Paciente
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 accent-[#007a3f]"
                checked={usertype === "profesional"} 
                onChange={() => setUserType("profesional")} 
              />
              <span className={`text-sm ${usertype === "profesional" ? "font-bold text-[#007a3f]" : "text-gray-500"}`}>
                Profesional
              </span>
            </label>
          </div> */}

          <div className="flex flex-col gap-3">
            <button
              className="bg-[#007a3f] hover:bg-[#005a2f] text-white font-bold py-2 px-4 rounded transition-colors"
              type="submit"
            >
              Iniciar sesión
            </button>
            <button
              className="text-sm text-gray-500 hover:underline"
              type="button"
              onClick={() => navigate("/login")}
            >
              ¿No tienes cuenta? Registrate aquí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;