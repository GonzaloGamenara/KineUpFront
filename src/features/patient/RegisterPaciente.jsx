import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import AnimatedBackground from "../../components/layout/AnimatedBackground.jsx";

function RegisterPaciente() {
  const navigate = useNavigate();
  const { tokenqr } = useParams();

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usuario, setUsuario] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  // Estados de control
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const urlRegister = "http://192.168.1.101:5000/api/User/registrar/paciente";
    const urlVinculacion =
      "http://192.168.1.101:5000/api/Vinculation/confirmar";

    try {
      // 1. Primer paso: Registrar el usuario
      const response = await fetch(urlRegister, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          usuario,
          fechaNacimiento,
          algunOtroDato: "",
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || "Error al registrar los datos del usuario.",
        );
      }

      console.log("Registro exitoso", data);

      // 2. Segundo paso: Si hay token QR, confirmar la vinculación
      if (tokenqr) {
        const asociar = await fetch(urlVinculacion, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenqr}`, // Corregido: 'headers' con 's'
          },
        });

        const dataAsociar = await asociar.json().catch(() => ({}));

        if (!asociar.ok) {
          throw new Error(
            dataAsociar.message ||
              "Usuario creado, pero falló la vinculación médica.",
          );
        }
        console.log("Vinculación exitosa", dataAsociar);
      }

      // Redirección si todo el flujo fue correcto
      navigate("/login");
    } catch (err) {
      console.error("Error en el flujo de registro:", err);
      setError(err.message || "Error inesperado. Intenta de nuevo.");
    } finally {
      setLoading(false);
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

      <div className="bg-white/70 backdrop-blur-sm px-16 py-8 rounded-3xl shadow-lg w-[440px] flex flex-col items-center gap-3 z-10 max-h-[95vh] overflow-y-auto">
        <img
          src={logo}
          alt="KineUp"
          className="h-14 hover:scale-105 transition-transform duration-300"
        />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-900 leading-tight">
            ¡Bienvenidx!
          </h1>
          <p className="text-gray-600 text-sm">
            Completá tus datos para empezar
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-xs italic bg-red-50 p-2 rounded w-full border border-red-100 break-words">
            {error}
          </p>
        )}

        <form className="w-full flex flex-col gap-3" onSubmit={handleRegister}>
          <div className="flex gap-3">
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">
                Nombre
              </label>
              <input
                className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
                type="text"
                placeholder="Juan"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">
                Apellido
              </label>
              <input
                className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
                type="text"
                placeholder="Perez"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">
              Usuario
            </label>
            <input
              className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
              type="text"
              placeholder="juanperez123"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">
              E-mail
            </label>
            <input
              className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">
              Contraseña
            </label>
            <input
              className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
              type="password"
              placeholder="Tu contraseña segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-1 ml-1">
              Fecha de nacimiento
            </label>
            <input
              className="shadow-sm border border-gray-200 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-[#007a3f] focus:ring-1 focus:ring-[#007a3f] transition-all"
              type="date"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            className="bg-[#007a3f] hover:bg-[#005a2f] active:scale-95 text-white font-bold py-3 rounded-lg transition-all mt-1 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>
        </form>

        <div className="flex items-center w-full mt-1">
          <div className="grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400 text-xs uppercase tracking-widest">
            o bien
          </span>
          <div className="grow border-t border-gray-300"></div>
        </div>

        <button
          disabled={loading}
          className="cursor-pointer justify-center w-full items-center flex bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-700 text-base py-3 px-8 rounded-full transition-all shadow-sm disabled:opacity-50"
        >
          <img
            className="h-5 mr-2"
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Registrarme con Google
        </button>

        <button
          className="text-sm text-gray-500 hover:text-green-800 transition-colors mt-1"
          type="button"
          onClick={() => navigate("/login-paciente")}
          disabled={loading}
        >
          ¿Ya tenés cuenta?{" "}
          <span className="font-bold underline">Iniciá sesión</span>
        </button>
      </div>
    </div>
  );
}

export default RegisterPaciente;
