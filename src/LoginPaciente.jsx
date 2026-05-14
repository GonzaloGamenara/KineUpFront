import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import AnimatedBackground from "./components/AnimatedBackground.jsx";

function LoginPaciente() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  }; 

  return (
    <div className="relative h-screen flex items-center justify-center font-poppins overflow-hidden">
      <AnimatedBackground bgColor="#f0fdf4" color1="#bbf7d0" color2="#86efac" color3="#4ade80" color4="#22c55e" speed={3} />
      
      <div className="bg-white/70 backdrop-blur-sm px-16 py-10 rounded-3xl shadow-lg w-96 flex flex-col items-center gap-4 z-10">
        <img src={logo} alt="KineUp" className="h-16 hover:scale-105 transition-transform duration-300" />
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-900 leading-tight">¡Qué bueno verte!</h1>
          <p className="text-gray-600 text-sm mt-1">Inicia sesión para comenzar con tu rutina</p>
        </div>

        {error && <p className="text-red-500 text-xs italic bg-red-50 p-2 rounded w-full border border-red-100">{error}</p>}

        <form className="w-full flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Usuario</label>
            <input 
              className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all" 
              type="text" 
              placeholder="Ingresá tu usuario" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">Contraseña</label>
            <input 
              className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all" 
              type="password" 
              placeholder="**********" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <button 
            className="bg-[#007a3f] hover:bg-[#005a2f] active:scale-95 text-white font-bold py-3 rounded-lg transition-all mt-2 shadow-md hover:shadow-lg flex justify-center items-center" 
            type="submit"
          >
            Comenzar rutina
          </button>
        </form>

        <div className="flex items-center w-full mt-2">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 text-xs uppercase tracking-widest">o bien</span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        <button className="cursor-pointer justify-center w-full items-center flex bg-white border border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-700 text-base py-3 px-8 rounded-full transition-all shadow-sm">
          <img 
            className="h-5 mr-2" 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
          />
          Ingresar con Google
        </button>

        <button 
          className="text-sm text-gray-500 hover:text-green-800 transition-colors mt-2" 
          type="button" 
          onClick={() => navigate("/register-paciente")}
        >
          ¿No tenés cuenta? <span className="font-bold underline">Registrate acá</span>
        </button>
      </div>
    </div>
  );
}

export default LoginPaciente;